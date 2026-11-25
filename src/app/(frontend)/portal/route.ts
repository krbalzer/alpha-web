import { readToken } from '@/lib/portal-cookie'

/** /portal: back to this device's remembered portal, or to Let's talk. */
export async function GET(req: Request) {
  const token = readToken(req)
  return Response.redirect(new URL(token ? `/portal/${token}` : '/talk', req.url), 302)
}
