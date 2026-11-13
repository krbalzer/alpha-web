/**
 * Daily Google sync, run in prebuild: rating, review count, reviews and opening hours for every location with a place ID.
 * Writes a snapshot to `locations.google`; pages read the snapshot, never Google, so builds and page renders cost no
 * Places calls. A location refreshes at most once every 20 hours (about 35 calls a day, well under the 500/day quota).
 * Opening hours fill the CMS `hours` field only when it is empty, so hours typed in the admin stand.
 * Stops at the first 429 so a spent quota does not cost the rest of the build anything.
 */
import type { Payload } from 'payload'

const D = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const time = (s: string, p = '') => {
  const m = s.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i)
  return m ? m[1] + (m[2] && m[2] !== '00' ? ':' + m[2] : '') + (m[3] || p).toLowerCase() : s.trim()
}
const span = (s: string) => { const [a, b] = s.split(/\s*[–-]\s*/); return b ? time(a, (b.match(/AM|PM/i) || [''])[0]) + ' to ' + time(b) : s }
const day = (d: string) => {
  const v = d.replace(/^[A-Za-z]+:\s*/, '').replace(/[  ]/g, ' ')
  return /closed/i.test(v) ? 'Closed' : /open 24/i.test(v) ? 'Open 24 hours' : v.split(/,\s*/).map(span).join(', ')
}
/** "Monday: 9:00 AM – 5:00 PM" x7 → [{ days: 'Mon to Fri', time: '9am to 5pm' }, { days: 'Sat, Sun', time: 'Closed' }] */
export const groupHours = (week: string[]) => {
  const w = week.map(day), out: { days: string; time: string }[] = []
  for (let i = 0; i < 7; ) {
    let j = i
    while (j + 1 < 7 && w[j + 1] === w[i]) j++
    const n = j - i + 1
    out.push({ days: n === 1 ? D[i] : n === 2 ? `${D[i]}, ${D[j]}` : `${D[i]} to ${D[j]}`, time: w[i] })
    i = j + 1
  }
  return out
}

type Raw = {
  rating?: number; userRatingCount?: number; googleMapsUri?: string; regularOpeningHours?: { weekdayDescriptions?: string[] }
  reviews?: { rating?: number; text?: { text?: string }; originalText?: { text?: string }; authorAttribution?: { displayName?: string; uri?: string }; relativePublishTimeDescription?: string; publishTime?: string }[]
}

export async function syncPlaces(p: Payload) {
  const key = process.env.GOOGLE_PLACES_KEY?.trim()
  if (!key) { p.logger.warn('places sync: GOOGLE_PLACES_KEY is not set, keeping the last snapshot'); return }
  const locs = (await p.find({ collection: 'locations', limit: 500, depth: 0, pagination: false })).docs
  const due = Date.now() - 20 * 3600e3
  let n = 0
  for (const l of locs) {
    if (!l.googlePlaceId || (l.google?.syncedAt && new Date(l.google.syncedAt).getTime() > due)) continue
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(l.googlePlaceId)}`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews,regularOpeningHours' },
    }).catch(() => null)
    if (!r) continue
    if (r.status === 429) { p.logger.warn(`places sync: Google quota spent after ${n} locations, the rest keep their last snapshot`); break }
    if (!r.ok) { p.logger.warn(`places sync: ${r.status} for ${l.slug}`); continue }
    const j = (await r.json()) as Raw
    const reviews = (j.reviews || []).map((x) => ({
      rating: x.rating || 0, text: (x.text?.text || x.originalText?.text || '').trim(),
      who: x.authorAttribution?.displayName || 'Google user', whoUri: x.authorAttribution?.uri || '',
      when: x.relativePublishTimeDescription || '', time: x.publishTime || '',
    }))
    const week = j.regularOpeningHours?.weekdayDescriptions
    await p.update({ collection: 'locations', id: l.id, data: {
      google: { rating: j.rating || 0, count: j.userRatingCount || 0, uri: j.googleMapsUri || '', reviews, syncedAt: new Date().toISOString() },
      ...(!(l.hours || []).length && week?.length === 7 ? { hours: groupHours(week) } : {}),
    } as never })
    n++
  }
  p.logger.info(`places sync: ${n} locations refreshed from Google`)
}
