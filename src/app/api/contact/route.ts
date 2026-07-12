import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

// ---------------------------------------------------------------------------
// Allowed service categories — must stay in sync with the contact form UI.
// ---------------------------------------------------------------------------
const ALLOWED_SERVICES = [
  'CAC Registration (Business Name)',
  'CAC Registration (Limited Company)',
  'NGO / Incorporated Trustees',
  'UK / US Company Registration',
  'Accounting & Bookkeeping',
  'Tax Advisory & Compliance',
  'Internal Audit & Risk',
  'Business Advisory / Business Plan',
  'Automation, AI & Smart Office',
  'Research & Professional Writing',
  'Corporate Training / Business School',
  'Other',
] as const

// ---------------------------------------------------------------------------
// Input validation schema.
// ---------------------------------------------------------------------------
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be 120 characters or fewer'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(25, 'Phone number must be 25 characters or fewer'),
  service: z.enum(ALLOWED_SERVICES, {
    message: 'Please select a valid service',
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be 2000 characters or fewer'),
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

// Opportunistic cleanup so the Map doesn't grow without bound.
// Runs on each request but only acts when the bucket is stale.
function maybeCleanup(ip: string) {
  const bucket = rateLimitMap.get(ip)
  if (bucket && Date.now() - bucket.firstRequestAt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.delete(ip)
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; the first entry is the client.
    return forwarded.split(',')[0]?.trim() ?? 'unknown'
  }
  return 'unknown'
}

// ---------------------------------------------------------------------------
// GET — health/admin check. Exposes only the total inquiry count, never
// the inquiry contents.
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const count = await db.contactInquiry.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('[api/contact GET] failed to count inquiries:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly via WhatsApp.' },
      { status: 500 },
    )
  }
}

// ---------------------------------------------------------------------------
// POST — create a new contact inquiry.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  // --- Rate limiting ------------------------------------------------------
  const ip = getClientIp(request)
  maybeCleanup(ip)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 },
    )
  }

  // --- Parse & validate body ---------------------------------------------
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    )
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    const field = firstIssue?.path[0]?.toString()
    return NextResponse.json(
      {
        error: firstIssue?.message ?? 'Validation failed.',
        ...(field ? { field } : {}),
      },
      { status: 400 },
    )
  }

  // --- Persist to database -----------------------------------------------
  try {
    const { name, email, phone, service, message } = parsed.data
    const inquiry = await db.contactInquiry.create({
      data: {
        name,
        email,
        phone,
        service,
        message,
        status: 'new',
      },
      select: { id: true },
    })

    return NextResponse.json(
      { success: true, id: inquiry.id },
      { status: 201 },
    )
  } catch (error) {
    console.error('[api/contact POST] failed to create inquiry:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly via WhatsApp.' },
      { status: 500 },
    )
  }
}
