import { db } from '@/lib/db'

// ---------------------------------------------------------------------------
// The HealthCheck table is created, and later columns added, on first use, so
// a deploy works against Turso without a manual migration. Every route that
// touches the table awaits this before its first query. The same DDL is in
// prisma/turso-init.sql.
// ---------------------------------------------------------------------------

export const LEAD_STATUSES = ['new', 'contacted', 'demo booked', 'won', 'lost'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

// Columns added after the table first shipped (22 Oct 2026), with their DDL.
const ADDED_COLUMNS: Array<[string, string]> = [
  ['status', `"status" TEXT NOT NULL DEFAULT 'new'`],
  ['notes', `"notes" TEXT`],
  ['statusUpdatedAt', `"statusUpdatedAt" DATETIME`],
]

let ready: Promise<void> | null = null

export function ensureHealthCheckTable(): Promise<void> {
  ready ??= (async () => {
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

    const cols = await db.$queryRawUnsafe<Array<{ name: string }>>(`PRAGMA table_info("HealthCheck")`)
    const have = new Set(cols.map((c) => c.name))
    for (const [name, ddl] of ADDED_COLUMNS) {
      if (!have.has(name)) await db.$executeRawUnsafe(`ALTER TABLE "HealthCheck" ADD COLUMN ${ddl}`)
    }
  })().catch((error) => {
    ready = null
    throw error
  })
  return ready
}
