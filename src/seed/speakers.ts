/**
 * Podcast people from the Webflow site (src/seed/webflow/podcast-people.json, exported from its "Podcast people"
 * and "Podcast Episodes" collections). Runs in prebuild; a no-op once everyone is in.
 *   - Speakers upsert by slug; a photo is uploaded only when the speaker has none (hand edits win).
 *   - Alpha team members who appear on episodes become speakers linked to their Team record (their Team headshot shows).
 *   - Episodes are matched by show + number, then by title; people are added, never removed.
 *   - A show with no hosts set gets the people on 40% or more of its episodes.
 * Records removed from the network (src/seed/removed.ts) are never imported.
 *
 *   pnpm import:speakers     # standalone
 */
import type { Payload } from 'payload'
import data from './webflow/podcast-people.json'
import { isRemoved } from './removed'

type Person = { slug: string; name: string; role: string; bio: string; host: boolean; img: string; team: string }
type Ep = { show: string; n: string; title: string; people: string[]; team: string[] }
const D = data as { people: Person[]; episodes: Ep[] }

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim()
const slugify = (s: string) => norm(s).replace(/ /g, '-')
const idOf = (x: unknown) => (x && typeof x === 'object' ? (x as { id: number }).id : (x as number))

async function upload(p: Payload, src: string, alt: string) {
  const r = await fetch(src, { signal: AbortSignal.timeout(20000) })
  if (!r.ok) throw new Error(`${r.status} ${src}`)
  const buf = Buffer.from(await r.arrayBuffer())
  const type = r.headers.get('content-type') || 'image/jpeg'
  const name = decodeURIComponent(src.split('/').pop() || 'speaker').replace(/^[0-9a-f]{24}_/, '').replace(/[^\w.-]+/g, '-')
  const m = await p.create({ collection: 'media', data: { alt }, file: { data: buf, mimetype: type, name: `speaker-${name}`, size: buf.length } })
  return m.id
}

export async function importSpeakers(p: Payload) {
  const team = (await p.find({ collection: 'team', limit: 1000, depth: 0, pagination: false })).docs as { id: number; name: string; title?: string | null }[]
  const teamBy = new Map(team.map((t) => [norm(t.name), t]))
  const existing = new Map(((await p.find({ collection: 'speakers', limit: 5000, depth: 0, pagination: false })).docs as { id: number; slug: string; headshot?: unknown; teamMember?: unknown }[]).map((s) => [s.slug, s]))
  const bySlug = new Map<string, number>(), byTeam = new Map<number, number>()
  for (const s of existing.values()) { bySlug.set(s.slug, s.id); if (s.teamMember) byTeam.set(idOf(s.teamMember), s.id) }
  let added = 0, photos = 0

  for (const x of D.people) {
    if (isRemoved('founders', x.slug)) continue
    const tm = x.team ? teamBy.get(norm(x.team)) : undefined
    const cur = existing.get(x.slug)
    try {
      if (!cur) {
        const headshot = x.img ? await upload(p, x.img, x.name) : undefined
        const doc = await p.create({ collection: 'speakers', data: { name: x.name, slug: x.slug, role: x.role || undefined, bio: x.bio || undefined, headshot, teamMember: tm?.id } })
        bySlug.set(x.slug, doc.id); if (tm) byTeam.set(tm.id, doc.id); added++; if (headshot) photos++
      } else if (!cur.headshot && x.img) {
        await p.update({ collection: 'speakers', id: cur.id, data: { headshot: await upload(p, x.img, x.name) } }); photos++
      }
    } catch (e) { p.logger.warn(`speakers: ${x.slug}: ${(e as Error).message}`) }
  }

  // Alpha team on the mic: one speaker per team member, pointing at their Team record
  const byName = new Map(((await p.find({ collection: 'speakers', limit: 5000, depth: 0, pagination: false })).docs as { id: number; name: string; teamMember?: unknown }[]).map((s) => [norm(s.name), s]))
  for (const name of new Set(D.episodes.flatMap((e) => e.team))) {
    const t = teamBy.get(norm(name))
    if (!t || byTeam.has(t.id)) continue
    const same = byName.get(norm(t.name))
    if (same) { // already a speaker under the same name: link them to the team instead of making a twin
      if (!same.teamMember) await p.update({ collection: 'speakers', id: same.id, data: { teamMember: t.id } })
      byTeam.set(t.id, same.id); continue
    }
    const slug = bySlug.has(slugify(name)) ? `${slugify(name)}-alpha` : slugify(name)
    const doc = await p.create({ collection: 'speakers', data: { name: t.name, slug, role: t.title || undefined, teamMember: t.id } })
    byTeam.set(t.id, doc.id); bySlug.set(slug, doc.id); added++
  }

  // link episodes
  const shows = new Map(((await p.find({ collection: 'shows', limit: 100, depth: 0 })).docs as { id: number; slug: string; hosts?: unknown[] | null }[]).map((s) => [s.slug, s]))
  const eps = (await p.find({ collection: 'episodes', limit: 10000, depth: 0, pagination: false, select: { show: true, number: true, title: true, speakers: true } as never })).docs as { id: number; show: number; number?: number | null; title: string; speakers?: unknown[] | null }[]
  let linked = 0
  const onShow = new Map<string, { eps: number; who: Map<number, number> }>()
  for (const x of D.episodes) {
    const s = shows.get(x.show); if (!s) continue
    const n = Number(x.n) || null
    const mine = eps.filter((e) => idOf(e.show) === s.id)
    const e = (n && mine.find((m) => m.number === n)) || mine.find((m) => norm(m.title) === norm(x.title)) || mine.find((m) => norm(m.title).includes(norm(x.title)) || norm(x.title).includes(norm(m.title)))
    const ids = [...x.people.map((k) => bySlug.get(k)), ...x.team.map((k) => { const t = teamBy.get(norm(k)); return t ? byTeam.get(t.id) : undefined })].filter((v): v is number => !!v)
    const tally = onShow.get(x.show) || { eps: 0, who: new Map() }; tally.eps++
    ids.forEach((i) => tally.who.set(i, (tally.who.get(i) || 0) + 1)); onShow.set(x.show, tally)
    if (!e || !ids.length) continue
    const have = (e.speakers || []).map(idOf), next = [...new Set([...have, ...ids])]
    if (next.length !== have.length) { await p.update({ collection: 'episodes', id: e.id, data: { speakers: next } }); linked++ }
  }

  // hosts: whoever is on 40%+ of a show's episodes, only where none are set by hand
  for (const [slug, t] of onShow) {
    const s = shows.get(slug)!
    if ((s.hosts || []).length) continue
    const hosts = [...t.who].filter(([, c]) => c / t.eps >= 0.4).sort((a, b) => b[1] - a[1]).map(([id]) => id)
    if (hosts.length) await p.update({ collection: 'shows', id: s.id, data: { hosts } })
  }
  p.logger.info(`speakers: ${added} added, ${photos} photos, ${linked} episodes linked`)
}
