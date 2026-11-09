/**
 * Episode chapters drafted from the transcripts in Drive (ALPHA - Queue Bank > Finalized > Transcripts),
 * src/seed/podcast-chapters.json. Runs in prebuild. Fills `chapters` only when an episode has none (hand edits win).
 * Episodes are matched by show + number (the "NNN:" title prefix when `number` is empty), then by title.
 */
import type { Payload } from 'payload'
import data from './podcast-chapters.json'

type Ep = { show: string; n: string; title: string; chapters: { at: string; title: string }[] }
const D = data as { episodes: Ep[] }
const SHOW: Record<string, string> = { MSM: 'med-spa-marketing-group-chat', OMS: 'operation-med-spa', GF: 'the-great-friends-podcast' }

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim()
const idOf = (x: unknown) => (x && typeof x === 'object' ? (x as { id: number }).id : (x as number))
const numOf = (e: { number?: number | null; title: string }) => { const m = /^(\d{1,3})\s*[:|.-]/.exec(e.title); return e.number ?? (m ? Number(m[1]) : null) }

export async function importChapters(p: Payload) {
  const shows = new Map(((await p.find({ collection: 'shows', limit: 100, depth: 0 })).docs as { id: number; slug: string }[]).map((s) => [s.slug, s.id]))
  const eps = (await p.find({ collection: 'episodes', limit: 10000, depth: 0, pagination: false, select: { show: true, number: true, title: true, chapters: true } as never })).docs as
    { id: number; show: number; number?: number | null; title: string; chapters?: unknown[] | null }[]
  let n = 0
  for (const x of D.episodes) {
    const sid = shows.get(SHOW[x.show]); if (!sid || !x.chapters.length) continue
    const mine = eps.filter((e) => idOf(e.show) === sid)
    const t = norm(x.title)
    const e = mine.find((m) => numOf(m) === Number(x.n)) || mine.find((m) => norm(m.title).replace(/^\d+ /, '') === t)
    if (!e || (e.chapters || []).length) continue
    await p.update({ collection: 'episodes', id: e.id, data: { chapters: x.chapters } as never })
    n++
  }
  p.logger.info(`chapters: ${n} episodes filled`)
}
