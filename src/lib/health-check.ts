// ---------------------------------------------------------------------------
// Payment Control Health Check — questions, scoring and exposure estimate.
//
// Shared by the page (src/app/smartoffice/health-check) and the API
// (src/app/api/smartoffice-health-check), so the score a visitor sees and the
// score the team receives are always computed by the same rules. The API
// recomputes everything from the raw answers; it never trusts a client score.
//
// Every "fix" line below describes a control Smart Office actually has today.
// Do not add claims here for features that are not built.
// ---------------------------------------------------------------------------

export type Answer = 0 | 1 | 2 // 0 = No, 1 = Sometimes / partly, 2 = Yes, always

export const ANSWER_LABELS: Record<Answer, string> = {
  2: 'Yes, always',
  1: 'Sometimes',
  0: 'No',
}

export type AreaId = 'sod' | 'workflow' | 'audit' | 'budget' | 'records'

export const AREAS: Record<AreaId, string> = {
  sod: 'Segregation of duties',
  workflow: 'Approval discipline',
  audit: 'Audit & fraud detection',
  budget: 'Budget control',
  records: 'Records & audit trail',
}

export type Question = {
  id: string
  area: AreaId
  text: string
  // 1.5 for the controls whose failure most often lets money leave wrongly.
  weight: number
  risk: string // what goes wrong when the answer is not "Yes, always"
  fix: string // how Smart Office closes the gap
}

export const QUESTIONS: Question[] = [
  {
    id: 'sod1',
    area: 'sod',
    weight: 1.5,
    text: 'A payment request is never approved by the same person who raised it.',
    risk: 'One person can create and approve their own payment, the most common route for fraudulent payments.',
    fix: 'Smart Office blocks anyone from acting twice on the same memo, enforced in the database, not just on screen.',
  },
  {
    id: 'sod2',
    area: 'sod',
    weight: 1.5,
    text: 'The person who releases payment (treasury or bank) cannot also approve it.',
    risk: 'Approval and payment sit with one person, so no one independent sees the money leave.',
    fix: 'Treasury is a separate final stage with its own role. Approvers cannot pay, and Treasury cannot approve.',
  },
  {
    id: 'sod3',
    area: 'sod',
    weight: 1,
    text: 'When an approver is away, a stand-in is formally assigned and recorded, not someone signing on their behalf.',
    risk: 'Approvals are given "on behalf of" someone, with no record of who really decided.',
    fix: 'Reassignment is a logged administrator action with a reason, so every stand-in is on the record.',
  },
  {
    id: 'wf1',
    area: 'workflow',
    weight: 1,
    text: 'Every payment follows the same documented approval sequence, and nothing skips a stage.',
    risk: 'Urgent or well-connected requests jump the queue and skip reviewers.',
    fix: 'Every payment memo passes the same fixed sequence (department, finance, internal audit, executive, treasury), and no stage can be skipped.',
  },
  {
    id: 'wf2',
    area: 'workflow',
    weight: 1.5,
    text: 'Approvals are given in a system or on a signed memo, never by WhatsApp, phone call or verbal instruction.',
    risk: 'Instructions on WhatsApp or by phone leave no reliable evidence of who authorised a payment.',
    fix: 'Approvals happen only inside Smart Office, each one tied to a named user, a time and a reason.',
  },
  {
    id: 'wf3',
    area: 'workflow',
    weight: 1,
    text: 'Payments above a set amount always need top-management approval.',
    risk: 'Large payments are approved at too low a level.',
    fix: 'Every payment memo needs executive approval before Treasury, and higher amounts are flagged as higher risk.',
  },
  {
    id: 'au1',
    area: 'audit',
    weight: 1.5,
    text: 'Internal audit reviews payments before the money leaves, not only afterwards.',
    risk: 'Audit only finds problems after the money is gone, when recovery is hard.',
    fix: 'Internal audit is a stage inside the workflow. Nothing reaches Treasury until audit has cleared it.',
  },
  {
    id: 'au2',
    area: 'audit',
    weight: 1.5,
    text: 'You can reliably catch a duplicate invoice or a second payment for the same thing.',
    risk: 'The same invoice is paid twice, often weeks apart, and nobody notices.',
    fix: 'Audit reviews each memo with its documents before payment, and can search every past payment in the records register.',
  },
  {
    id: 'au3',
    area: 'audit',
    weight: 1,
    text: 'Every payment request carries its invoice, quote or receipt, and those documents cannot be swapped later.',
    risk: 'Supporting documents go missing or are replaced after approval.',
    fix: 'Documents are attached to the memo and locked once it is submitted. They can be read but never deleted.',
  },
  {
    id: 'bu1',
    area: 'budget',
    weight: 1,
    text: 'Each payment request is tied to an approved budget line.',
    risk: 'Spending happens outside the approved budget and is only discovered at year-end.',
    fix: 'Each memo is raised against a budget code chosen from your own budget register.',
  },
  {
    id: 'bu2',
    area: 'budget',
    weight: 1,
    text: 'Approvers see the remaining budget balance before they approve.',
    risk: 'Approvers sign without knowing whether the money is still in the budget.',
    fix: 'Finance sees the budget line’s remaining balance on the memo before approving.',
  },
  {
    id: 'bu3',
    area: 'budget',
    weight: 1,
    text: 'Overspending is flagged when it happens, not discovered at month-end.',
    risk: 'Budget overruns pile up silently until the accounts are closed.',
    fix: 'Overspends are flagged to Finance at approval, and alert emails go out as each budget line passes its thresholds.',
  },
  {
    id: 're1',
    area: 'records',
    weight: 1,
    text: 'You can show who approved any payment, and when, within five minutes.',
    risk: 'Answering an auditor’s or regulator’s question means days searching through files.',
    fix: 'Every completed memo sits in a searchable register with its full approval trail, and exports in one click.',
  },
  {
    id: 're2',
    area: 'records',
    weight: 1.5,
    text: 'Approval records cannot be edited or deleted after the fact.',
    risk: 'Records can be quietly changed, so the trail cannot be trusted as evidence.',
    fix: 'Every action is written to a permanent audit log. A memo that needs changing is re-presented as a new memo, and the original is never altered.',
  },
  {
    id: 're3',
    area: 'records',
    weight: 1,
    text: 'Rejected, returned or held requests keep their reasons on record.',
    risk: 'Decisions to stop a payment leave no explanation, so the same request returns unchallenged.',
    fix: 'Return, reject and keep-in-view all require a written reason that stays on the memo.',
  },
]

export const SECTORS = [
  'University / polytechnic / college',
  'Government agency or parastatal',
  'Private company',
  'Small or medium business',
  'NGO / development organisation',
  'Bank or financial institution',
  'Other',
] as const

export const STAFF_BANDS = ['1–20', '21–100', '101–500', '501–2,000', 'Over 2,000'] as const

// Outgoing payments per year. The midpoint is what the exposure estimate uses.
export const PAYMENT_BANDS = [
  { label: 'Under ₦50 million', mid: 25e6 },
  { label: '₦50m – ₦250m', mid: 150e6 },
  { label: '₦250m – ₦1 billion', mid: 600e6 },
  { label: '₦1bn – ₦5bn', mid: 3e9 },
  { label: '₦5bn – ₦20bn', mid: 12e9 },
  { label: 'Over ₦20 billion', mid: 30e9 },
] as const

export type Grade = 'Strong' | 'Moderate' | 'Weak' | 'Critical'

export type AreaScore = { id: AreaId; name: string; score: number }

export type Gap = { id: string; area: string; text: string; answer: Answer; risk: string; fix: string }

export type Result = {
  score: number // 0–100
  grade: Grade
  areas: AreaScore[]
  gaps: Gap[] // weakest first
  exposure: { low: number; high: number } | null
}

export function gradeFor(score: number): Grade {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Moderate'
  if (score >= 40) return 'Weak'
  return 'Critical'
}

// Indicative exposure: between 0.5% (every control in place) and 5% (none) of
// annual outgoing payments. 5% is the share of revenue the ACFE's global
// fraud surveys estimate organisations lose to fraud each year; the range is
// shown as low = half the top figure, to keep it an estimate, not a verdict.
export function exposureFor(score: number, paymentsBand: number): { low: number; high: number } | null {
  const band = PAYMENT_BANDS[paymentsBand]
  if (!band) return null
  const pct = 0.005 + ((100 - score) / 100) * 0.045
  return { low: band.mid * pct * 0.5, high: band.mid * pct }
}

export function scoreAnswers(answers: Record<string, Answer>, paymentsBand?: number): Result {
  let got = 0
  let max = 0
  const areaTotals = new Map<AreaId, { got: number; max: number }>()
  const gaps: Array<Gap & { loss: number }> = []

  for (const q of QUESTIONS) {
    const a = answers[q.id] ?? 0
    got += a * q.weight
    max += 2 * q.weight
    const t = areaTotals.get(q.area) ?? { got: 0, max: 0 }
    t.got += a * q.weight
    t.max += 2 * q.weight
    areaTotals.set(q.area, t)
    if (a < 2) {
      gaps.push({ id: q.id, area: AREAS[q.area], text: q.text, answer: a, risk: q.risk, fix: q.fix, loss: (2 - a) * q.weight })
    }
  }

  const score = Math.round((got / max) * 100)
  const areas = (Object.keys(AREAS) as AreaId[]).map((id) => {
    const t = areaTotals.get(id)!
    return { id, name: AREAS[id], score: Math.round((t.got / t.max) * 100) }
  })
  gaps.sort((a, b) => b.loss - a.loss)

  return {
    score,
    grade: gradeFor(score),
    areas,
    gaps: gaps.map(({ loss: _loss, ...g }) => g),
    exposure: paymentsBand === undefined ? null : exposureFor(score, paymentsBand),
  }
}

export function formatNaira(n: number): string {
  if (n >= 1e9) return `₦${(n / 1e9).toFixed(n >= 1e10 ? 0 : 1)}bn`
  if (n >= 1e6) return `₦${Math.round(n / 1e6).toLocaleString('en-NG')}m`
  return `₦${Math.round(n).toLocaleString('en-NG')}`
}
