/**
 * Episode topics, audience and YouTube links from the Webflow site (src/seed/webflow/podcast-topics.json, built from
 * the "Podcast Episodes" category, tags and audience fields). Runs in prebuild; needs no Blob uploads.
 *   - Topics become Tags (one per name). An episode's topics, audience or video are filled only when empty (hand edits win).
 *   - Episodes are matched by show + number, then by title, same as the speakers import.
 */
import type { Payload } from 'payload'
import data from './webflow/podcast-topics.json'

type Ep = { show: string; n: string; title: string; topics: string[]; aud: string[]; yt: string }
const D = data as { episodes: Ep[] }
const AUD: Record<string, string> = { 'Practice owners': 'owners', Directors: 'directors', Providers: 'providers', 'Front desk': 'front-desk', Marketers: 'marketers', Patients: 'patients' }

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim()
const idOf = (x: unknown) => (x && typeof x === 'object' ? (x as { id: number }).id : (x as number))

export async function importTopics(p: Payload) {
  const tagBy = new Map(((await p.find({ collection: 'tags', limit: 500, depth: 0, pagination: false })).docs as { id: number; name: string }[]).map((t) => [norm(t.name), t.id]))
  const tagId = async (name: string) => {
    const k = norm(name)
    if (!tagBy.has(k)) tagBy.set(k, (await p.create({ collection: 'tags', data: { name, slug: k.replace(/ /g, '-') } as never })).id as number)
    return tagBy.get(k)!
  }
  const shows = new Map(((await p.find({ collection: 'shows', limit: 100, depth: 0 })).docs as { id: number; slug: string }[]).map((s) => [s.slug, s.id]))
  const eps = (await p.find({ collection: 'episodes', limit: 10000, depth: 0, pagination: false, select: { show: true, number: true, title: true, tags: true, audience: true, video: true } as never })).docs as
    { id: number; show: number; number?: number | null; title: string; tags?: unknown[] | null; audience?: string[] | null; video?: string | null }[]
  let n = 0
  for (const x of D.episodes) {
    const sid = shows.get(x.show); if (!sid) continue
    const num = Number(x.n) || null
    const mine = eps.filter((e) => idOf(e.show) === sid)
    const e = (num && mine.find((m) => m.number === num)) || mine.find((m) => norm(m.title) === norm(x.title)) || mine.find((m) => norm(m.title).includes(norm(x.title)) || norm(x.title).includes(norm(m.title)))
    if (!e) continue
    const data: Record<string, unknown> = {}
    if (!(e.tags || []).length && x.topics.length) data.tags = await Promise.all(x.topics.map(tagId))
    if (!(e.audience || []).length && x.aud.length) data.audience = x.aud.map((a) => AUD[a]).filter(Boolean)
    if (!e.video && x.yt) data.video = x.yt
    if (Object.keys(data).length) { await p.update({ collection: 'episodes', id: e.id, data: data as never }); n++ }
  }
  p.logger.info(`topics: ${n} episodes tagged, ${tagBy.size} topics`)
}
