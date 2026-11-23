/**
 * Open roles from Alpha's public Paylocity careers board. People Ops posts and removes jobs in Paylocity; this mirrors it.
 * Runs in prebuild and every 6 hours via /api/cron/sync. Upserts by Paylocity job id; anything no longer on the board is marked filled.
 * Location match: ZIP, then unique city + state, then a location's "Paylocity location" name. Brand: the location's brand,
 * else the posting's hiring organization (remote roles). Unmatched jobs are kept but never shown.
 *
 *   PAYLOCITY_BOARD  board URL (defaults to Alpha's)
 */
import type { Payload } from 'payload'

const BOARD = process.env.PAYLOCITY_BOARD || 'https://recruiting.paylocity.com/recruiting/jobs/All/538284ea-35d0-4acf-9fff-67e01eb9cce1/Alpha-Aesthetics-Partners'
const BASE = 'https://recruiting.paylocity.com/Recruiting/Jobs'
const UA = { 'user-agent': 'Mozilla/5.0 (alpha-web job sync)' }

type Loc = { Name: string; City: string | null; State: string | null; Zip: string | null }
type Job = { JobId: number; JobTitle: string; PublishedDate: string; IsRemote: boolean; JobLocation: Loc }
type Detail = { description: string; org: string }

const norm = (s: unknown) => String(s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '')
const zip5 = (z: unknown) => String(z || '').slice(0, 5)

export function parseBoard(html: string): Job[] {
  const m = html.match(/window\.pageData\s*=\s*(\{[\s\S]*?\});\s*\n/)
  if (!m) throw new Error('pageData not found (board markup changed?)')
  return (JSON.parse(m[1]) as { Jobs?: Job[] }).Jobs || []
}

/** The body under the "Description" header, by div depth (remote roles carry no JSON-LD). */
function bodyDescription(html: string) {
  const at = html.search(/<div class="job-listing-header">Description<\/div>\s*<div>/)
  if (at < 0) return ''
  const start = html.indexOf('<div>', at + 10) + 5
  let depth = 1, i = start
  const re = /<\/?div\b/g
  re.lastIndex = start
  for (let m; (m = re.exec(html)); ) { depth += m[0] === '<div' ? 1 : -1; if (!depth) { i = m.index; break } }
  return html.slice(start, i).trim()
}

async function detail(id: number): Promise<Detail> {
  const html = await (await fetch(`${BASE}/Details/${id}`, { headers: UA, signal: AbortSignal.timeout(15000) })).text()
  const ld = html.match(/<script type="application\/ld\+json">\s*(\{[\s\S]*?\})\s*<\/script>/)
  if (!ld) return { description: bodyDescription(html), org: '' }
  const d = JSON.parse(ld[1]) as { description?: string; hiringOrganization?: { name?: string } }
  return { description: d.description || bodyDescription(html), org: d.hiringOrganization?.name || '' }
}

export async function syncJobs(p: Payload) {
  const html = await (await fetch(BOARD, { headers: UA, signal: AbortSignal.timeout(15000) })).text()
  const jobs = parseBoard(html)
  if (!jobs.length && !/"Jobs":\[\]/.test(html)) throw new Error('board returned no jobs and no empty list; not touching existing jobs')

  type L = { id: number; brand: number | { id: number }; city: string; state: string; zip?: string | null; paylocityName?: string | null }
  type B = { id: number; name: string; short?: string | null }
  const locs = (await p.find({ collection: 'locations', limit: 500, depth: 0, pagination: false })).docs as unknown as L[]
  const brands = (await p.find({ collection: 'brands', limit: 200, depth: 0, pagination: false })).docs as unknown as B[]
  const brandOf = (l: L) => (typeof l.brand === 'object' ? l.brand.id : l.brand)

  const matchLoc = (j: Loc) => {
    const z = zip5(j.Zip)
    const byZip = z ? locs.filter((l) => zip5(l.zip) === z) : []
    if (byZip.length === 1) return byZip[0]
    const byCity = locs.filter((l) => norm(l.city) === norm(j.City) && norm(l.state) === norm(j.State))
    if (byCity.length === 1) return byCity[0]
    return locs.find((l) => l.paylocityName && norm(l.paylocityName) === norm(j.Name)) || null
  }
  const matchBrand = (org: string) => {
    const o = norm(org)
    if (!o) return null
    return brands.find((b) => norm(b.name) === o || norm(b.short) === o) || brands.find((b) => o.includes(norm(b.short || b.name)) || norm(b.name).includes(o)) || null
  }

  /** Remote roles: the brand the posting names first, e.g. "Esthetics Center is seeking..." */
  const namedIn = (text: string) => {
    const t = text.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').toLowerCase()
    let best: B | null = null, at = Infinity
    for (const b of brands) for (const n of [b.name, b.short]) {
      const i = n && n.length > 3 ? t.indexOf(n.toLowerCase()) : -1
      if (i >= 0 && i < at) { at = i; best = b }
    }
    return best
  }

  const have = new Map(((await p.find({ collection: 'jobs', limit: 1000, depth: 0, pagination: false })).docs as unknown as { id: number; paylocityId: string; status: string; title: string }[]).map((d) => [d.paylocityId, d]))
  const live = new Set<string>()
  let added = 0, updated = 0, closed = 0, unmatched = 0

  for (const j of jobs) {
    const pid = String(j.JobId)
    live.add(pid)
    const loc = matchLoc(j.JobLocation)
    const prev = have.get(pid)
    const base = {
      title: j.JobTitle.trim(), posted: j.PublishedDate, remote: !!j.IsRemote, status: 'open',
      paylocityLocation: j.JobLocation.Name, applyUrl: `${BASE}/Apply/${j.JobId}`, location: loc?.id ?? null,
    }
    if (prev) {
      await p.update({ collection: 'jobs', id: prev.id, data: { ...base, ...(loc ? { brand: brandOf(loc) } : {}) } as never })
      updated++
      continue
    }
    const d = await detail(j.JobId).catch(() => ({ description: '', org: '' }))
    const brand = loc ? brandOf(loc) : (matchBrand(d.org) || namedIn(d.description))?.id ?? null
    if (!loc && !brand) unmatched++
    await p.create({ collection: 'jobs', data: { ...base, brand, description: d.description, paylocityId: pid } as never })
    added++
  }
  for (const [pid, d] of have) {
    if (!live.has(pid) && d.status !== 'filled') { await p.update({ collection: 'jobs', id: d.id, data: { status: 'filled' } as never }); closed++ }
  }
  p.logger.info(`jobs: ${jobs.length} on Paylocity, ${added} added, ${updated} refreshed, ${closed} closed${unmatched ? `, ${unmatched} unmatched (set a location's Paylocity name)` : ''}`)
}
