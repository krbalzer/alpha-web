import 'server-only'

/**
 * Live Google rating, review count and reviews for a location, from Places API (New) Place Details.
 * Cached 6 hours per place (about 4 calls a day per location). Places terms: review text is shown as Google returns it,
 * with the author's name linked to their profile and the relative date; nothing is stored in the CMS.
 */
export type Review = { rating: number; text: string; who: string; whoUri: string; when: string; time: string }
export type Place = { rating: number; count: number; uri: string; reviews: Review[] }

type Raw = {
  rating?: number; userRatingCount?: number; googleMapsUri?: string
  reviews?: { rating?: number; text?: { text?: string }; originalText?: { text?: string }; authorAttribution?: { displayName?: string; uri?: string }; relativePublishTimeDescription?: string; publishTime?: string }[]
}

export async function getPlace(id?: string | null): Promise<Place | null> {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!id || !key) return null
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`, {
      headers: { 'X-Goog-Api-Key': key.trim(), 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews' },
      next: { revalidate: 21600, tags: ['google-places'] },
    })
    if (!r.ok) { console.warn(`google places: ${r.status} for ${id}`); return null }
    const j = (await r.json()) as Raw
    return {
      rating: j.rating || 0, count: j.userRatingCount || 0, uri: j.googleMapsUri || '',
      reviews: (j.reviews || []).map((x) => ({
        rating: x.rating || 0, text: (x.text?.text || x.originalText?.text || '').trim(),
        who: x.authorAttribution?.displayName || 'Google user', whoUri: x.authorAttribution?.uri || '',
        when: x.relativePublishTimeDescription || '', time: x.publishTime || '',
      })),
    }
  } catch { return null }
}

/** The snapshot the daily sync stores on the location (`locations.google`), in the shape pages already read. */
export function placeFromDoc(g?: { rating?: number | null; count?: number | null; uri?: string | null; reviews?: unknown } | null): Place | null {
  if (!g || !g.count) return null
  return { rating: Number(g.rating) || 0, count: Number(g.count) || 0, uri: g.uri || '', reviews: (Array.isArray(g.reviews) ? g.reviews : []) as Review[] }
}

/** Treatment named in a review, for the small tag on the card. No match, no tag. */
const TAGS: [RegExp, string][] = [
  [/\bmoxi\b/i, 'Moxi'], [/\bsculptra\b/i, 'Sculptra'], [/\bmorpheus/i, 'Morpheus8'], [/\bhydra ?facial/i, 'HydraFacial'], [/\bbbl\b|broadband light/i, 'BBL'],
  [/\b(semaglutide|tirzepatide|glp-?1|weight loss)\b/i, 'Weight loss'], [/\bmicroneedl/i, 'Microneedling'], [/\blaser/i, 'Laser'],
  [/\blip(s)?\b/i, 'Lips'], [/\bfiller/i, 'Filler'], [/\b(botox|dysport|daxxify|xeomin|tox)\b/i, 'Tox'], [/\bfacial/i, 'Facial'],
  [/\bmembership|member\b/i, 'Membership'], [/\b(consult|consultation)\b/i, 'Consultation'],
]
export const reviewTag = (t: string) => (TAGS.find(([re]) => re.test(t)) || [, ''])[1]

/** Up to 6 reviews for "In their words": 4 stars and up with real text, longest first. Section hides under 3. */
export function pickReviews(p: Place | null) {
  if (!p) return null
  const items = p.reviews.filter((r) => r.rating >= 4 && r.text.length >= 40).sort((a, z) => z.text.length - a.text.length).slice(0, 6)
  return {
    rating: p.rating ? p.rating.toFixed(1) : '', pct: String(Math.round((p.rating / 5) * 1000) / 10), count: p.count.toLocaleString('en-US'), uri: p.uri,
    items: items.map((r, i) => ({ t: r.text, tag: reviewTag(r.text), who: r.who, whoUri: r.whoUri || p.uri, when: r.when, long: r.text.length > 260, cls: 'rv_i' + (i === 0 ? ' rv_top' : '') })),
  }
}
