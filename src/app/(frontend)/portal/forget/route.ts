import { clearCookies, withCookies } from '@/lib/portal-cookie'

/** Forget this device: the nav and menu stop showing the portal. The private link itself still works. */
export async function GET(req: Request) {
  return new Response(null, { status: 302, headers: withCookies(clearCookies(), { location: new URL('/', req.url).toString() }) })
}
