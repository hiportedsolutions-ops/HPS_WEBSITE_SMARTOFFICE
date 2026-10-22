import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import {
  ANSWER_LABELS,
  PAYMENT_BANDS,
  QUESTIONS,
  SECTORS,
  STAFF_BANDS,
  formatNaira,
  scoreAnswers,
  type Answer,
  type Result,
} from '@/lib/health-check'

// ---------------------------------------------------------------------------
// Payment Control Health Check — saves a completed check as a lead, emails the
// Smart Office team, and emails the respondent their summary.
// The score is recomputed here from the raw answers; the client's is ignored.
// ---------------------------------------------------------------------------
const answerSchema = z.union([z.literal(0), z.literal(1), z.literal(2)])

const checkSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(120, 'Name must be 120 characters or fewer'),
  email: z.string().trim().min(1, 'Please enter a valid email address.').email('Please enter a valid email address.'),
  organization: z
    .string()
    .trim()
    .min(2, 'Please enter your organisation.')
    .max(160, 'Organisation must be 160 characters or fewer'),
  role: z.string().trim().max(80).optional().or(z.literal('')),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  sector: z.enum(SECTORS),
  staffBand: z.enum(STAFF_BANDS),
  paymentsBand: z.number().int().min(0).max(PAYMENT_BANDS.length - 1),
  wantsWalkthrough: z.boolean(),
  answers: z.record(z.string(), answerSchema).refine(
    (a) => QUESTIONS.every((q) => q.id in a),
    'Please answer every question.',
  ),
})

// ---------------------------------------------------------------------------
// Rate limit — max 5 submissions per minute per IP (same as the leads route).
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const rateLimitMap = new Map<string, { count: number; firstRequestAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const bucket = rateLimitMap.get(ip)
  if (!bucket || now - bucket.firstRequestAt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequestAt: now })
    return false
  }
  bucket.count += 1
  return bucket.count > RATE_LIMIT_MAX
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

// ---------------------------------------------------------------------------
// The table is created on first use, so a new deploy works against Turso
// without a manual migration (the same DDL is in prisma/turso-init.sql).
// ---------------------------------------------------------------------------
let tableReady: Promise<void> | null = null

function ensureTable(): Promise<void> {
  tableReady ??= (async () => {
    await db.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "HealthCheck" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "fullName" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "organization" TEXT NOT NULL,
      "role" TEXT,
      "phone" TEXT,
      "sector" TEXT NOT NULL,
      "staffBand" TEXT NOT NULL,
      "paymentsBand" TEXT NOT NULL,
      "answers" TEXT NOT NULL,
      "score" INTEGER NOT NULL,
      "grade" TEXT NOT NULL,
      "exposureLow" REAL,
      "exposureHigh" REAL,
      "wantsWalkthrough" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "HealthCheck_createdAt_idx" ON "HealthCheck"("createdAt")`)
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "HealthCheck_email_idx" ON "HealthCheck"("email")`)
  })().catch((error) => {
    tableReady = null
    throw error
  })
  return tableReady
}

// ---------------------------------------------------------------------------
// Email (Brevo HTTPS API). Needs BREVO_API_KEY and BREVO_FROM_EMAIL; a failed
// email never fails the request, because the result is already saved.
// ---------------------------------------------------------------------------
const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

async function sendEmail(msg: { to: string; toName?: string; replyTo?: { email: string; name: string }; subject: string; html: string }) {
  const apiKey = process.env.BREVO_API_KEY?.trim()
  const from = process.env.BREVO_FROM_EMAIL?.trim()
  if (!apiKey || !from) {
    console.warn('[api/smartoffice-health-check] BREVO_API_KEY or BREVO_FROM_EMAIL not set — email not sent')
    return
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Smart Office', email: from },
        to: [{ email: msg.to, name: msg.toName }],
        replyTo: msg.replyTo,
        subject: msg.subject,
        htmlContent: msg.html,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) console.error('[api/smartoffice-health-check] Brevo refused the email:', res.status, await res.text())
  } catch (error) {
    console.error('[api/smartoffice-health-check] could not send email:', error)
  }
}

type Check = z.infer<typeof checkSchema>

const table = (rows: Array<[string, string]>) =>
  `<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#5b6e63"><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
    .join('')}</table>`

function exposureText(r: Result) {
  return r.exposure ? `${formatNaira(r.exposure.low)} – ${formatNaira(r.exposure.high)} a year` : '—'
}

function teamEmail(c: Check, r: Result) {
  const answers = QUESTIONS.map(
    (q) => `<tr><td>${escapeHtml(q.text)}</td><td><b>${ANSWER_LABELS[c.answers[q.id] as Answer]}</b></td></tr>`,
  ).join('')
  return (
    `<p>${c.wantsWalkthrough ? '<b>Wants a walkthrough.</b> ' : ''}A Payment Control Health Check was completed on hiported.com/smartoffice/health-check.</p>` +
    table([
      ['Score', `${r.score}/100 (${r.grade})`],
      ['Indicative exposure', exposureText(r)],
      ['Name', c.fullName],
      ['Email', c.email],
      ['Phone', c.phone || '—'],
      ['Organisation', c.organization],
      ['Role', c.role || '—'],
      ['Sector', c.sector],
      ['Staff', c.staffBand],
      ['Payments a year', PAYMENT_BANDS[c.paymentsBand].label],
    ]) +
    `<p><b>By area:</b> ${r.areas.map((a) => `${escapeHtml(a.name)} ${a.score}%`).join(' · ')}</p>` +
    `<table cellpadding="5" style="border-collapse:collapse;font-size:13px">${answers}</table>` +
    '<p>Reply to this email to answer them directly.</p>'
  )
}

function respondentEmail(c: Check, r: Result) {
  const gaps = r.gaps
    .slice(0, 5)
    .map(
      (g) =>
        `<li style="margin-bottom:10px"><b>${escapeHtml(g.text)}</b><br>` +
        `<span style="color:#b3402f">Risk:</span> ${escapeHtml(g.risk)}<br>` +
        `<span style="color:#1e7a4f">Fix:</span> ${escapeHtml(g.fix)}</li>`,
    )
    .join('')
  return (
    `<div style="font-family:Arial,sans-serif;color:#152820;max-width:600px">` +
    `<p>Dear ${escapeHtml(c.fullName.split(' ')[0])},</p>` +
    `<p>Thank you for completing the Payment Control Health Check for <b>${escapeHtml(c.organization)}</b>.</p>` +
    `<p style="font-size:22px;margin:18px 0"><b>${r.score}/100 — ${r.grade}</b></p>` +
    (r.exposure
      ? `<p>Indicative payments at risk from control gaps: <b>${exposureText(r)}</b>. ` +
        'This is an estimate from your answers and payment volume, not an audit finding.</p>'
      : '') +
    `<p><b>By area:</b><br>${r.areas.map((a) => `${escapeHtml(a.name)}: ${a.score}%`).join('<br>')}</p>` +
    (gaps ? `<p><b>Your most important gaps</b></p><ol>${gaps}</ol>` : '<p>Every control we asked about is in place. Well done.</p>') +
    `<p>${
      c.wantsWalkthrough
        ? 'A member of the Smart Office team will contact you shortly to arrange a walkthrough on your own approval process.'
        : 'If you would like to see how Smart Office closes these gaps, reply to this email and we will arrange a walkthrough.'
    }</p>` +
    '<p>Smart Office team<br>Hi’ported Professional Services<br>+234 811 611 2447 · smartoffice@hiported.com</p>' +
    '</div>'
  )
}

// ---------------------------------------------------------------------------
// POST — save a completed check and return the computed result.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = checkSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Validation failed.' }, { status: 400 })
  }

  const c = parsed.data
  const answers = Object.fromEntries(QUESTIONS.map((q) => [q.id, c.answers[q.id] as Answer]))
  const result = scoreAnswers(answers, c.paymentsBand)

  try {
    await ensureTable()
    const row = await db.healthCheck.create({
      data: {
        fullName: c.fullName,
        email: c.email,
        organization: c.organization,
        role: c.role || null,
        phone: c.phone || null,
        sector: c.sector,
        staffBand: c.staffBand,
        paymentsBand: PAYMENT_BANDS[c.paymentsBand].label,
        answers: JSON.stringify(answers),
        score: result.score,
        grade: result.grade,
        exposureLow: result.exposure?.low ?? null,
        exposureHigh: result.exposure?.high ?? null,
        wantsWalkthrough: c.wantsWalkthrough,
      },
      select: { id: true },
    })

    await Promise.all([
      sendEmail({
        to: process.env.LEADS_NOTIFY_EMAIL?.trim() || 'smartoffice@hiported.com',
        replyTo: { email: c.email, name: c.fullName },
        subject: `Health Check ${result.score}/100${c.wantsWalkthrough ? ' · wants walkthrough' : ''}: ${c.organization}`,
        html: teamEmail(c, result),
      }),
      sendEmail({
        to: c.email,
        toName: c.fullName,
        replyTo: { email: 'smartoffice@hiported.com', name: 'Smart Office' },
        subject: `Your Payment Control Health Check: ${result.score}/100 (${result.grade})`,
        html: respondentEmail(c, result),
      }),
    ])

    return NextResponse.json({ success: true, id: row.id, result }, { status: 201 })
  } catch (error) {
    console.error('[api/smartoffice-health-check POST] failed to save:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again in a moment.' }, { status: 500 })
  }
}
