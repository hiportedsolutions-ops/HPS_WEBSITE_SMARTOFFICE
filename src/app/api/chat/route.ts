/**
 * HPS Assistant — chat API route (Next.js 16 App Router, server-only).
 *
 * POST /api/chat
 *   Request body:
 *     {
 *       message: string,                                   // 1–1500 chars, required
 *       history?: Array<{ role: 'user' | 'assistant'; content: string }>
 *     }
 *   Responses:
 *     200 { reply: string }                                // success
 *     400 { error: string }                                // invalid input
 *     429 { error: string }                                // rate limited (>20 req/min/IP)
 *     500 { error: string }                                // LLM / server failure
 *
 * GET /api/chat
 *   Always returns 200 { ok: true, service: 'HPS Assistant' } for health checks.
 *
 * z-ai-web-dev-sdk MUST only be imported in this server-side route file.
 * Never import it from client components.
 */

import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// ---------------------------------------------------------------------------
// System prompt — the HPS Assistant persona & HPS knowledge base.
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are the HPS Assistant — the virtual concierge for Hi'ported Professional Services (HPS), a business growth and enterprise solutions company in Garki, Abuja, Nigeria (BN:3301544).

Your job: help visitors understand HPS's services, pick the right package, and guide them toward booking a free consultation or messaging HPS on WhatsApp.

ABOUT HPS:
- Tagline: "Building Businesses. Creating Opportunities. Sustaining Success."
- Location: Halima Plaza, Behind Old Sahad Store, Balanga Street, Area 11, Garki, Abuja
- Phone: 0811 611 2447 / 0703 768 2721
- Email: hiported@gmail.com
- WhatsApp: https://wa.me/2348116112447
- Hours: Mon–Fri, 9:00–17:00 WAT
- Registration: BN:3301544

SERVICES (8 groups, 12 service lines):
1. Business Registration & Corporate Compliance — CAC Business Name, Company Incorporation (LTD), NGO/Incorporated Trustees, Annual Returns Filing, Company Secretarial Support, Regulatory Compliance Advisory, UK Company Registration, US LLC Registration, Foreign Business Documentation.
2. Accounting & Bookkeeping — Bookkeeping, Financial Statements Preparation, Accounting System Setup, Monthly Financial Reporting, Payroll Management, Cash Flow Management, Budget Preparation, Cloud Accounting, Financial Data Analytics.
3. Tax Advisory & Compliance — Tax Registration, Tax Clearance Certificate Processing, VAT Administration, PAYE Management, Company Income Tax Advisory, Tax Planning.
4. Internal Audit & Risk Management — Internal Audit Services, Risk Assessment, Internal Control Review, Fraud Prevention Framework, Compliance & Operational Audit, Process Improvement.
5. Business Advisory & SME Development — Business Strategy, Business Plan Development, Feasibility Studies, Corporate Governance Advisory, Business Health Check, Investment Readiness, Organizational Restructuring, Growth Strategy, Business Mentorship.
6. Automation, AI & Digital Business Solutions — Business Automation, Smart Office Solutions, Accounting System Implementation, AI for Business Productivity, Digital Record Keeping, Process Digitization.
7. Research & Professional Writing — Research Proposal Development, Thesis & Dissertation Guidance, Data Analysis, Academic Editing, Business & Technical Reports, Company Profiles & SOPs.
8. Corporate Training & Entrepreneurship Development — Accounting & Financial Management, Internal Audit Training, Entrepreneurship & Bootcamps, AI for Business, Data Analytics, Microsoft Excel for Business, Leadership & Governance, Youth Enterprise Development, Women Entrepreneurship Programmes. Powered by Hi'ported Business School.

CAC REGISTRATION PACKAGES (no published pricing — all "Request a Quote"):
- Business Name: for sole traders, freelancers & small enterprises. Includes name search, registration, certificate, certified status report, TIN guidance.
- Limited Company (LTD) — MOST POPULAR: for startups, growing SMEs & contract-ready businesses. Includes name search, incorporation, certificate, Memart, status report with directors & shareholding, TIN & corporate account guidance.
- NGO / Incorporated Trustees: for NGOs, churches, foundations & associations. Includes name search & reservation, trustees documentation, constitution drafting support, newspaper publication guidance, certificate.

CAC PROCESS (6 steps): Free consultation → Name search & reservation → Documentation → Filing & payment → Follow-up & queries → Certificate delivery.

5D BUSINESS GROWTH FRAMEWORK: Discover → Design → Deploy → Develop → Dominate.

JURISDICTIONS: Nigeria (CAC), United Kingdom, United States.

RULES:
- Be concise (2–4 sentences typically). Use short paragraphs or bullet points when helpful.
- Be warm but professional. No hype words. Nigerian + international audience.
- Never invent prices. If asked about cost, say HPS uses "Request a Quote" by design and invite them to book a free consultation or WhatsApp.
- Always steer interested visitors toward booking a free consultation (the contact form on the page) or WhatsApp (https://wa.me/2348116112447).
- If a question is completely outside HPS's scope, politely say so and offer to connect them with the team via the contact form.
- Do not share personal data of staff or clients.
- Keep BN:3301544 visible when discussing company legitimacy.`

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_MESSAGE_LENGTH = 1500
const MAX_HISTORY_ENTRIES = 8
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 20

type ChatRole = 'user' | 'assistant'
type ChatMessage = { role: ChatRole; content: string }

// ---------------------------------------------------------------------------
// Memoized ZAI instance — initialize once per server process, reuse across
// requests. The SDK reads credentials from env at create() time.
// ---------------------------------------------------------------------------
let zaiPromise: ReturnType<typeof ZAI.create> | null = null
function getZai(): ReturnType<typeof ZAI.create> {
  if (!zaiPromise) {
    zaiPromise = ZAI.create()
  }
  return zaiPromise
}

// ---------------------------------------------------------------------------
// In-memory rate limiter — max 20 requests / minute / IP.
// Module-level Map survives across requests in a single server instance.
// ---------------------------------------------------------------------------
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
  return bucket.count > RATE_LIMIT_MAX
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
    // x-forwarded-for can be a comma-separated list; the first entry is the client.
    return forwarded.split(',')[0]?.trim() ?? 'unknown'
  }
  return 'unknown'
}

// ---------------------------------------------------------------------------
// History sanitization.
//
// Accepts an optional array of { role, content } objects with role in
// ['user','assistant'] and content a non-empty string ≤ MAX_MESSAGE_LENGTH.
// Per spec: if the history is structurally invalid, ignore it entirely
// (don't 400) and just proceed without context. Truncate to the last
// MAX_HISTORY_ENTRIES entries to bound token usage.
// ---------------------------------------------------------------------------
function sanitizeHistory(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return []

  const cleaned: ChatMessage[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') return []
    const { role, content } = entry as Record<string, unknown>
    if (role !== 'user' && role !== 'assistant') return []
    if (
      typeof content !== 'string' ||
      content.length === 0 ||
      content.length > MAX_MESSAGE_LENGTH
    ) {
      return []
    }
    cleaned.push({ role, content })
  }

  return cleaned.slice(-MAX_HISTORY_ENTRIES)
}

// ---------------------------------------------------------------------------
// GET — health check.
// ---------------------------------------------------------------------------
export async function GET() {
  return NextResponse.json({ ok: true, service: 'HPS Assistant' })
}

// ---------------------------------------------------------------------------
// POST — main chat endpoint.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  // --- Rate limiting -------------------------------------------------------
  const ip = getClientIp(request)
  maybeCleanup(ip)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down and try again shortly.' },
      { status: 429 },
    )
  }

  // --- Parse JSON body -----------------------------------------------------
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    )
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Message must be 1–1500 characters.' },
      { status: 400 },
    )
  }

  const { message, history } = body as Record<string, unknown>

  // --- Validate message ----------------------------------------------------
  if (
    typeof message !== 'string' ||
    message.trim().length === 0 ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json(
      { error: 'Message must be 1–1500 characters.' },
      { status: 400 },
    )
  }

  // --- Sanitize history (ignore if invalid) -------------------------------
  const safeHistory = sanitizeHistory(history)

  // --- Build messages array ------------------------------------------------
  // Per z-ai-web-dev-sdk convention, the system prompt is sent as the first
  // message with role 'assistant', followed by up to 8 history messages,
  // then the new user message.
  const messages: ChatMessage[] = [
    { role: 'assistant', content: SYSTEM_PROMPT },
    ...safeHistory,
    { role: 'user', content: message },
  ]

  // --- Call LLM ------------------------------------------------------------
  try {
    const zai = await getZai()
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    })

    const reply = completion.choices[0]?.message?.content?.trim()
    if (!reply) {
      throw new Error('Empty completion from LLM')
    }

    return NextResponse.json({ reply })
  } catch (error) {
    // Never leak SDK error details to the client.
    console.error('[chat API]', error)
    return NextResponse.json(
      {
        error:
          'The assistant is unavailable right now. Please try again or message us on WhatsApp.',
      },
      { status: 500 },
    )
  }
}
