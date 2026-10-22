import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { teamRecipients } from '@/lib/notify'

// ---------------------------------------------------------------------------
// Input validation schema — matches the /smartoffice early-access form.
// ---------------------------------------------------------------------------
const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(120, 'Name must be 120 characters or fewer'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter a valid email address.')
    .email('Please enter a valid email address.'),
  organization: z
    .string()
    .trim()
    .max(160, 'Organization must be 160 characters or fewer')
    .optional()
    .or(z.literal('')),
  role: z
    .string()
    .trim()
    .max(80, 'Role must be 80 characters or fewer')
    .optional()
    .or(z.literal('')),
})

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter — max 5 submissions per minute per IP.
// Module-level Map survives across requests in a single server instance.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5

type RateBucket = { count: number; firstRequestAt: number }
const rateLimitMap = new Map<string, RateBucket>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const bucket = rateLimitMap.get(ip)

  if (!bucket || now - bucket.firstRequestAt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequestAt: now })
    return false
  }

  bucket.count += 1
  if (bucket.count > RATE_LIMIT_MAX) {
    return true
  }
  return false
}

function maybeCleanup(ip: string) {
  const bucket = rateLimitMap.get(ip)
  if (bucket && Date.now() - bucket.firstRequestAt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.delete(ip)
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown'
  }
  return 'unknown'
}

// ---------------------------------------------------------------------------
// Each request is also emailed to the Smart Office team (Brevo HTTPS API,
// the same service the app uses). Needs BREVO_API_KEY and BREVO_FROM_EMAIL
// (a sender verified in Brevo); recipients come from src/lib/notify.ts.
// A failed email never fails the request: the lead is already saved.
// ---------------------------------------------------------------------------
type Lead = { fullName: string; email: string; organization?: string; role?: string }

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

async function notifyTeam(lead: Lead, repeat: boolean) {
  const apiKey = process.env.BREVO_API_KEY?.trim()
  const from = process.env.BREVO_FROM_EMAIL?.trim()
  if (!apiKey || !from) {
    console.warn('[api/smartoffice-leads] BREVO_API_KEY or BREVO_FROM_EMAIL not set — team not emailed')
    return
  }
  const rows: Array<[string, string]> = [
    ['Name', lead.fullName],
    ['Email', lead.email],
    ['Organisation', lead.organization || '—'],
    ['Role', lead.role || '—'],
  ]
  const org = lead.organization || lead.fullName
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Smart Office website', email: from },
        to: teamRecipients(),
        replyTo: { email: lead.email, name: lead.fullName },
        subject: `${repeat ? 'Repeat request' : 'New request'}: ${org} — Smart Office`,
        htmlContent:
          `<p>${repeat ? 'Someone already on the list asked again' : 'A new institution asked to get started'} on hiported.com/smartoffice.</p>` +
          `<table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join('')}</table>` +
          '<p>Reply to this email to answer them directly.</p>',
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) console.error('[api/smartoffice-leads] Brevo refused the email:', res.status, await res.text())
  } catch (error) {
    console.error('[api/smartoffice-leads] could not email the team:', error)
  }
}

// ---------------------------------------------------------------------------
// GET — health/admin check. Exposes only the total lead count.
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const count = await db.smartOfficeLead.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('[api/smartoffice-leads GET] failed to count leads:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again in a moment.' },
      { status: 500 },
    )
  }
}

// ---------------------------------------------------------------------------
// POST — create a new Smart Office early-access lead.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  maybeCleanup(ip)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    return NextResponse.json(
      { error: firstIssue?.message ?? 'Validation failed.' },
      { status: 400 },
    )
  }

  try {
    const { fullName, email, organization, role } = parsed.data
    const lead = await db.smartOfficeLead.create({
      data: {
        fullName,
        email,
        organization: organization || null,
        role: role || null,
      },
      select: { id: true },
    })
    await notifyTeam(parsed.data, false)

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    // Unique constraint on email -> this address is already on the list.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      await notifyTeam(parsed.data, true)
      return NextResponse.json(
        { error: 'This email is already on the list.' },
        { status: 409 },
      )
    }

    console.error('[api/smartoffice-leads POST] failed to create lead:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again in a moment.' },
      { status: 500 },
    )
  }
}