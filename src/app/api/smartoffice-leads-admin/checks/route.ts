import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ANSWER_LABELS, QUESTIONS, type Answer } from '@/lib/health-check'
import { ensureHealthCheckTable } from '@/lib/health-check-db'
import { isSignedIn } from '@/lib/leads-admin-auth'

// ---------------------------------------------------------------------------
// Every Health Check, newest first, for the leads page. Signed-in only.
// ?format=csv downloads the same list, one column per question.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  if (!isSignedIn(request)) {
    return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
  }

  try {
    await ensureHealthCheckTable()
    const rows = await db.healthCheck.findMany({ orderBy: { createdAt: 'desc' } })

    if (request.nextUrl.searchParams.get('format') !== 'csv') {
      return NextResponse.json(
        { checks: rows.map((r) => ({ ...r, answers: JSON.parse(r.answers) as Record<string, Answer> })) },
        { headers: { 'Cache-Control': 'no-store' } },
      )
    }

    const header = [
      'Date', 'Organisation', 'Name', 'Email', 'Phone', 'Role', 'Sector', 'Staff', 'Payments a year',
      'Score', 'Grade', 'At risk (low)', 'At risk (high)', 'Wants walkthrough', 'Status', 'Notes',
      ...QUESTIONS.map((q) => q.text),
    ]
    const lines = rows.map((r) => {
      const answers = JSON.parse(r.answers) as Record<string, Answer>
      return [
        r.createdAt.toISOString().slice(0, 16).replace('T', ' '),
        r.organization, r.fullName, r.email, r.phone ?? '', r.role ?? '', r.sector, r.staffBand, r.paymentsBand,
        String(r.score), r.grade,
        r.exposureLow == null ? '' : String(Math.round(r.exposureLow)),
        r.exposureHigh == null ? '' : String(Math.round(r.exposureHigh)),
        r.wantsWalkthrough ? 'Yes' : 'No', r.status, r.notes ?? '',
        ...QUESTIONS.map((q) => ANSWER_LABELS[answers[q.id] ?? 0]),
      ]
    })
    const csv = [header, ...lines].map((cells) => cells.map(csvCell).join(',')).join('\r\n')
    const date = new Date().toISOString().slice(0, 10)
    // BOM so Excel opens the naira sign and en dashes correctly.
    return new NextResponse('﻿' + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="smart-office-health-checks-${date}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[api/smartoffice-leads-admin/checks GET] failed:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again in a moment.' }, { status: 500 })
  }
}

// Quote every cell, and neutralise a leading =, +, - or @ so a spreadsheet
// never runs a submitted value as a formula.
function csvCell(v: string): string {
  const safe = /^[=+\-@]/.test(v) ? `'${v}` : v
  return `"${safe.replace(/"/g, '""')}"`
}
