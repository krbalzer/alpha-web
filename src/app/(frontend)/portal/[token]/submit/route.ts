import { db } from '@/lib/data'
import { REPORTS } from '@/lib/portal'

/** Send financials to the guide: allowed once every report has a file and none is sent back. */
export async function POST(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[A-Za-z0-9_-]{24,64}$/.test(token)) return Response.json({ ok: false }, { status: 404 })
  const p = await db()
  const lead = (await p.find({ collection: 'leads', where: { portalToken: { equals: token } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!lead || lead.kind !== 'partner') return Response.json({ ok: false }, { status: 404 })
  const files = (await p.find({ collection: 'lead-files', where: { lead: { equals: lead.id } }, sort: '-createdAt', limit: 200, depth: 0, overrideAccess: true })).docs
  const ready = REPORTS.every((r) => { const last = files.find((f) => f.report === r.key); return last && last.status !== 'fix' })
  if (!ready) return Response.json({ ok: false, error: 'Upload all six first.' }, { status: 400 })
  await p.update({ collection: 'leads', id: lead.id, overrideAccess: true, data: { finSentAt: new Date().toISOString() } })
  // Notifications to the guide hook in here once connected; test leads will skip them.
  return Response.json({ ok: true })
}
