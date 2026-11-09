/**
 * Episode chapters and key quotes drafted from the transcripts in Drive (ALPHA - Queue Bank > Finalized > Transcripts),
 * src/seed/podcast-chapters.json. Runs in prebuild. Fills `chapters` and `pullQuotes` only when empty (hand edits win).
 * Quotes are verbatim from the transcript (first letter capitalized), with the timestamp of the block they sit in.
 * Episodes are matched by show + title first (some transcript files are misnumbered, e.g. MSM 084/085),
 * then by number (the "NNN:" title prefix when `number` is empty).
 */
import type { Payload } from 'payload'
import data from './podcast-chapters.json'

type Ep = { show: string; n: string; title: string; chapters: { at: string; title: string }[]; quote?: { text: string; at: string } }
const D = data as { episodes: Ep[] }
const SHOW: Record<string, string> = { MSM: 'med-spa-marketing-group-chat', OMS: 'operation-med-spa', GF: 'the-great-friends-podcast', DT: 'dear-tiffany' }

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim()
const idOf = (x: unknown) => (x && typeof x === 'object' ? (x as { id: number }).id : (x as number))
const numOf = (e: { number?: number | null; title: string }) => { const m = /^(\d{1,3})\s*[:|.-]/.exec(e.title); return e.number ?? (m ? Number(m[1]) : null) }

export async function importChapters(p: Payload) {
  const shows = new Map(((await p.find({ collection: 'shows', limit: 100, depth: 0 })).docs as { id: number; slug: string }[]).map((s) => [s.slug, s.id]))
  const eps = (await p.find({ collection: 'episodes', limit: 10000, depth: 0, pagination: false, select: { show: true, number: true, title: true, chapters: true, pullQuotes: true } as never })).docs as
    { id: number; show: number; number?: number | null; title: string; chapters?: unknown[] | null; pullQuotes?: unknown[] | null }[]
  let nc = 0, nq = 0
  for (const x of D.episodes) {
    const sid = shows.get(SHOW[x.show]); if (!sid) continue
    const mine = eps.filter((e) => idOf(e.show) === sid)
    const t = norm(x.title)
    const bare = (m: { title: string }) => norm(m.title).replace(/^\d+ /, '')
    // titles in the feed may carry a " | Guest" suffix the transcript file name does not
    const e = mine.find((m) => bare(m) === t) || mine.find((m) => t.length > 11 && bare(m).startsWith(t + ' ')) || mine.find((m) => numOf(m) === Number(x.n))
    if (!e) continue
    const data: Record<string, unknown> = {}
    if (x.chapters.length && !(e.chapters || []).length) { data.chapters = x.chapters; nc++ }
    if (x.quote?.text && !(e.pullQuotes || []).length) { data.pullQuotes = [{ text: x.quote.text, at: x.quote.at }]; nq++ }
    if (Object.keys(data).length) await p.update({ collection: 'episodes', id: e.id, data: data as never })
  }
  p.logger.info(`chapters: ${nc} episodes filled, ${nq} key quotes`)
}
