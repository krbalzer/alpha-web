/**
 * Google place IDs for each location (src/seed/google-places.json, matched by brand + address and confirmed Nov 2026).
 * Runs in prebuild. Fills `googlePlaceId` only when empty, so an ID changed in the CMS stays.
 */
import type { Payload } from 'payload'
import ids from './google-places.json'

export async function importPlaces(p: Payload) {
  const M = ids as Record<string, string>
  const locs = (await p.find({ collection: 'locations', limit: 500, depth: 0, pagination: false, select: { slug: true, googlePlaceId: true } as never })).docs as { id: number; slug: string; googlePlaceId?: string | null }[]
  let n = 0
  for (const l of locs) {
    if (l.googlePlaceId || !M[l.slug]) continue
    await p.update({ collection: 'locations', id: l.id, data: { googlePlaceId: M[l.slug] } as never })
    n++
  }
  p.logger.info(`places: ${n} locations linked to Google`)
  // key check: one cheap Place Details call, so the build log says whether live reviews can load
  const key = process.env.GOOGLE_PLACES_KEY, probe = Object.values(M)[0]
  if (!key) { p.logger.warn('places: GOOGLE_PLACES_KEY is not set, ratings fall back to the snapshot'); return }
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${probe}`, { headers: { 'X-Goog-Api-Key': key.trim(), 'X-Goog-FieldMask': 'id' } })
    if (r.ok) p.logger.info(`places: Google key ok (length ${key.trim().length})`)
    else p.logger.warn(`places: Google key rejected (${r.status} ${((await r.json().catch(() => ({}))) as { error?: { message?: string } }).error?.message || ''}) length ${key.trim().length}`)
  } catch (e) { p.logger.warn(`places: Google check failed (${(e as Error).message})`) }
}
