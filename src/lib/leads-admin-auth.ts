import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { NextRequest, NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// Sign-in for the leads page (/smartoffice/leads).
//
// One shared password, LEADS_ADMIN_PASSWORD, set in Vercel and never in the
// repo. Signing in sets an HTTP-only cookie holding an expiry time and an HMAC
// of it, keyed from the password, so changing the password signs everyone out.
// Without the variable (or with one under 12 characters) the page stays
// locked for everyone.
// ---------------------------------------------------------------------------

export const SESSION_COOKIE = 'so_leads_session'
const SESSION_HOURS = 12

function key(): Buffer | null {
  const password = process.env.LEADS_ADMIN_PASSWORD
  if (!password || password.length < 12) return null
  return createHash('sha256').update(`smartoffice-leads:${password}`).digest()
}

export function isConfigured(): boolean {
  return key() !== null
}

function sign(payload: string, k: Buffer): string {
  return createHmac('sha256', k).update(payload).digest('hex')
}

function sameText(a: string, b: string): boolean {
  // Hash first so the comparison is constant-time whatever the lengths.
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function passwordMatches(input: string): boolean {
  const password = process.env.LEADS_ADMIN_PASSWORD
  return !!key() && !!password && sameText(input, password)
}

export function setSession(res: NextResponse): void {
  const k = key()
  if (!k) return
  const expires = Date.now() + SESSION_HOURS * 3600_000
  res.cookies.set(SESSION_COOKIE, `${expires}.${sign(String(expires), k)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  })
}

export function clearSession(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}

export function isSignedIn(request: NextRequest): boolean {
  const k = key()
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!k || !token) return false
  const [expires, sig] = token.split('.')
  if (!expires || !sig || Number(expires) < Date.now()) return false
  return sameText(sig, sign(expires, k))
}
