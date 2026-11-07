import { db } from '@/lib/data'

const s = (v: unknown, n = 500) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

/** Let's talk form → Leads collection. Plain POST from the Talk page; no third-party form service. */
export async function POST(req: Request) {
  let body: { kind?: string; answers?: Record<string, string>; fields?: Record<string, string>; page?: string }
  try { body = await req.json() } catch { return Response.json({ ok: false }, { status: 400 }) }
  const f = body.fields || {}
  const email = s(f['f-email'] || f['o-e'], 200)
  if (!/.+@.+\..+/.test(email)) return Response.json({ ok: false, error: 'email' }, { status: 400 })
  const kind = body.kind === 'other' ? 'other' : 'partner'
  const answers = Object.fromEntries(Object.entries(body.answers || {}).slice(0, 10).map(([k, v]) => [s(k, 40), s(v, 80)]))
  const p = await db()
  await p.create({
    collection: 'leads',
    overrideAccess: true,
    data: {
      kind, email,
      name: s(f['f-name'] || f['o-n'], 120), practice: s(f['f-practice'], 160), phone: s(f['f-phone'], 40),
      topic: s(f['o-r'], 80), message: s(f['o-m'], 4000), answers, page: s(body.page, 200),
    },
  })
  return Response.json({ ok: true })
}
