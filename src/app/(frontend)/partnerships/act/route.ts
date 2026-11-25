import { has } from '@/access'
import { db } from '@/lib/data'
import { REPORTS, STAGES } from '@/lib/portal'

type Body = { op: 'file'; id: number; status: 'ok' | 'fix'; feedback?: string } | { op: 'approveAll'; lead: number } | { op: 'stage'; lead: number; stage: string }

/** Admin actions from /partnerships. Same rule as the CMS: partnerships role (or admin). */
export async function POST(req: Request) {
  const p = await db()
  const { user } = await p.auth({ headers: req.headers })
  if (!has(user, 'partnerships')) return Response.json({ ok: false }, { status: 403 })
  let b: Body
  try { b = await req.json() } catch { return Response.json({ ok: false }, { status: 400 }) }

  if (b.op === 'file') {
    if (!['ok', 'fix'].includes(b.status)) return Response.json({ ok: false }, { status: 400 })
    if (b.status === 'fix' && !b.feedback?.trim()) return Response.json({ ok: false, error: 'Say what needs to change.' }, { status: 400 })
    await p.update({ collection: 'lead-files', id: b.id, user, overrideAccess: false, data: { status: b.status, feedback: b.status === 'fix' ? b.feedback!.trim().slice(0, 2000) : '' } })
  } else if (b.op === 'approveAll') {
    const files = (await p.find({ collection: 'lead-files', where: { lead: { equals: b.lead } }, sort: '-createdAt', limit: 200, depth: 0, user, overrideAccess: false })).docs
    for (const r of REPORTS) {
      const last = files.find((f) => f.report === r.key)
      if (last?.status === 'review') await p.update({ collection: 'lead-files', id: last.id, user, overrideAccess: false, data: { status: 'ok', feedback: '' } })
    }
  } else if (b.op === 'stage') {
    const s = STAGES.find((x) => x.key === b.stage)
    if (!s) return Response.json({ ok: false }, { status: 400 })
    await p.update({ collection: 'leads', id: b.lead, user, overrideAccess: false, data: { stage: s.key } })
  } else return Response.json({ ok: false }, { status: 400 })
  // Smartsheet sync and the lead's email hook in here once connected; test leads will skip them.
  return Response.json({ ok: true })
}
