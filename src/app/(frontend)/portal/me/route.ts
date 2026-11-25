import { clearCookies, leadFor, readToken, stageOf, withCookies } from '@/lib/portal-cookie'

/** For the site nav and menu: who is remembered on this device. Never returns the token. */
export async function GET(req: Request) {
  const token = readToken(req)
  if (!token) return Response.json({ me: null }, { headers: withCookies(clearCookies(), { 'cache-control': 'no-store' }) })
  const lead = await leadFor(token)
  if (!lead) return Response.json({ me: null }, { headers: withCookies(clearCookies(), { 'cache-control': 'no-store' }) })
  const practice = lead.practice || 'Your practice'
  const ini = practice.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'A'
  const st = stageOf(lead.stage)
  return Response.json({ me: { practice, ini, stage: `Stage ${st.num} / ${st.t}` } }, { headers: { 'cache-control': 'no-store' } })
}
