import { db } from '@/lib/data'
import { STAGES } from '@/lib/portal'

/** Remembers a partner's portal on this device so the site menu can link back to it. httpOnly, so pages never see the token. */
export const PORTAL_COOKIE = 'alpha_portal'
export const TOKEN_RE = /^[A-Za-z0-9_-]{24,64}$/
const MAX_AGE = 60 * 60 * 24 * 120

/** Readable flag (no token) so the site only asks /portal/me on devices that have a portal. */
export const HINT_COOKIE = 'alpha_portal_hint'
export const setCookies = (token: string) => [
  `${PORTAL_COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
  `${HINT_COOKIE}=1; Path=/; Max-Age=${MAX_AGE}; Secure; SameSite=Lax`,
]
export const clearCookies = () => [
  `${PORTAL_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  `${HINT_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=Lax`,
]
/** Response headers carrying several Set-Cookie lines. */
export const withCookies = (cookies: string[], init: Record<string, string> = {}) => {
  const h = new Headers(init)
  for (const c of cookies) h.append('set-cookie', c)
  return h
}
export const readToken = (req: Request) => {
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${PORTAL_COOKIE}=([^;]+)`))
  return m && TOKEN_RE.test(m[1]) ? m[1] : null
}

export async function leadFor(token: string | null) {
  if (!token) return null
  const p = await db()
  const lead = (await p.find({ collection: 'leads', where: { portalToken: { equals: token } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  return lead && lead.kind === 'partner' ? lead : null
}

export const stageOf = (key?: string | null) => {
  const i = Math.max(0, STAGES.findIndex((s) => s.key === key))
  return { num: i + 1, t: STAGES[i].t }
}
