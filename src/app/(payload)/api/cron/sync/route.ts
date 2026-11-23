import config from '@payload-config'
import { getPayload } from 'payload'
import { importEpisodes } from '@/seed/episodes'
import { syncJobs } from '@/seed/jobs'

/**
 * Hourly mirror of the systems other teams already use: Libsyn (episodes) and Paylocity (open roles).
 * Called by .github/workflows/sync.yml with `Authorization: Bearer $CRON_SECRET`. Pages revalidate every 5 minutes.
 */
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return new Response('Unauthorized', { status: 401 })
  const p = await getPayload({ config })
  const out: Record<string, string> = {}
  for (const [name, run] of [['episodes', importEpisodes], ['jobs', syncJobs]] as const) {
    try { await run(p); out[name] = 'ok' } catch (e) { out[name] = (e as Error).message; p.logger.warn(`sync ${name}: ${(e as Error).message}`) }
  }
  return Response.json({ ...out, at: new Date().toISOString() })
}
