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
  // the key and the daily refresh live in places-sync.ts (no probe call here: the Places quota is 500 a day)
}
