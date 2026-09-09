import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

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

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    // Unique constraint on email -> this address is already on the list.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
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