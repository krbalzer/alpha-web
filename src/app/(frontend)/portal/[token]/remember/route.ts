import { leadFor, setCookies, TOKEN_RE, withCookies } from '@/lib/portal-cookie'

/** Called by the portal on load: remember this device so the site nav and menu can link back. */
export async function POST(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!TOKEN_RE.test(token) || !(await leadFor(token))) return Response.json({ ok: false }, { status: 404 })
  return Response.json({ ok: true }, { headers: withCookies(setCookies(token), { 'cache-control': 'no-store' }) })
}
