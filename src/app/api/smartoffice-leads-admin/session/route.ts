import { NextRequest, NextResponse } from 'next/server'
import { clearSession, isConfigured, isSignedIn, passwordMatches, setSession } from '@/lib/leads-admin-auth'

// ---------------------------------------------------------------------------
// Sign in / out of the leads page. GET reports whether this browser is signed
// in; POST { password } signs in; DELETE signs out.
// ---------------------------------------------------------------------------

// Max 5 sign-in attempts per 5 minutes per IP.
const WINDOW_MS = 5 * 60_000
const MAX_ATTEMPTS = 5
const attempts = new Map<string, { count: number; firstAt: number }>()

function tooManyAttempts(ip: string): boolean {
  const now = Date.now()
  const a = attempts.get(ip)
  if (!a || now - a.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now })
    return false
  }
  a.count += 1
  return a.count > MAX_ATTEMPTS
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ configured: isConfigured(), signedIn: isSignedIn(request) })
}

export async function POST(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: 'The leads page has no password yet. Set LEADS_ADMIN_PASSWORD in Vercel, then redeploy.' },
      { status: 503 },
    )
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (tooManyAttempts(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait five minutes.' }, { status: 429 })
  }

  const body = (await request.json().catch(() => ({}))) as { password?: unknown }
  if (typeof body.password !== 'string' || !passwordMatches(body.password)) {
    return NextResponse.json({ error: 'That password is not correct.' }, { status: 401 })
  }

  attempts.delete(ip)
  const res = NextResponse.json({ signedIn: true })
  setSession(res)
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ signedIn: false })
  clearSession(res)
  return res
}
