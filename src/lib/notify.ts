// ---------------------------------------------------------------------------
// Who the Smart Office team alerts go to (Get started requests and Health
// Check results). These two inboxes always receive them; LEADS_NOTIFY_EMAIL
// can add more, comma-separated.
// ---------------------------------------------------------------------------
const TEAM_INBOXES = ['smartoffice@hiported.com', 'hiported@gmail.com']

export function teamRecipients(): Array<{ email: string }> {
  const extra = (process.env.LEADS_NOTIFY_EMAIL ?? '').split(',')
  const all = [...TEAM_INBOXES, ...extra].map((e) => e.trim().toLowerCase()).filter(Boolean)
  return [...new Set(all)].map((email) => ({ email }))
}
