import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { LEAD_STATUSES, ensureHealthCheckTable } from '@/lib/health-check-db'
import { isSignedIn } from '@/lib/leads-admin-auth'

// ---------------------------------------------------------------------------
// Update one Health Check's follow-up status and notes. Signed-in only.
// ---------------------------------------------------------------------------
const updateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
  notes: z.string().max(2000, 'Notes must be 2,000 characters or fewer'),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSignedIn(request)) {
    return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
  }
  const { id } = await params

  const parsed = updateSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Validation failed.' }, { status: 400 })
  }

  try {
    await ensureHealthCheckTable()
    const current = await db.healthCheck.findUnique({ where: { id }, select: { status: true } })
    if (!current) return NextResponse.json({ error: 'That Health Check no longer exists.' }, { status: 404 })

    const updated = await db.healthCheck.update({
      where: { id },
      data: {
        status: parsed.data.status,
        notes: parsed.data.notes.trim() || null,
        // Only a change of status moves the date; editing notes does not.
        ...(current.status !== parsed.data.status ? { statusUpdatedAt: new Date() } : {}),
      },
      select: { id: true, status: true, notes: true, statusUpdatedAt: true },
    })
    return NextResponse.json({ check: updated })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'That Health Check no longer exists.' }, { status: 404 })
    }
    console.error('[api/smartoffice-leads-admin/checks PATCH] failed:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again in a moment.' }, { status: 500 })
  }
}
