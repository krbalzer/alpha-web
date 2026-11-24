import 'server-only'
import { cache } from 'react'
import { db, url } from './data'

/**
 * Alpha University (/training). Everything comes from the CMS:
 *   Training events  AIM sessions and Labs (Katie logs them; Lauren sets AIM covers)
 *   University       Loop member counts, the Slack support standard, vendor sessions, the Clinical Director switch
 * Counts, seasons, map pins and "next / latest" are derived here. Only public, non-cancelled events count.
 */

/** lat/lng -> % of the USA artwork (Albers conic, fitted to the outline's extreme points; within ~1%). */
const project = (lat: number, lng: number): [number, number] => {
  const r = Math.PI / 180, p1 = 29.5 * r, p2 = 45.5 * r, n = (Math.sin(p1) + Math.sin(p2)) / 2, C = Math.cos(p1) ** 2 + 2 * n * Math.sin(p1)
  const rho = (la: number) => Math.sqrt(C - 2 * n * Math.sin(la * r)) / n
  const th = n * (lng + 96.5) * r, x = rho(lat) * Math.sin(th), y = rho(37.5) - rho(lat) * Math.cos(th)
  return [(2756.17 * x + 1009.14) / 20, (-2743.22 * y + 678.29) / 12.29]
}
const r1 = (n: number) => Math.round(n * 10) / 10
const fmt = (d: string, o: Intl.DateTimeFormatOptions) => new Date(d).toLocaleDateString('en-US', { ...o, timeZone: 'UTC' })
const mon = (d: string) => fmt(d, { month: 'short', year: 'numeric' })
const md = (d: string) => fmt(d, { month: 'short', day: 'numeric' })
const my = (d: string) => fmt(d, { month: 'short', year: '2-digit' })
/** "Dr. Steve Yoelin" and "Steve Yoelin" are the same master */
const person = (s: string) => s.replace(/^(dr|prof)\.?\s+/i, '').replace(/,\s*(md|phd|np|rn|pa-c)\.?$/i, '').trim().toLowerCase()

type Loc = { name?: string | null; city?: string | null; state?: string | null; lat?: number | string | null; lng?: number | string | null; brand?: { name?: string } | number | null }
type Ev = {
  id: number; kind: 'aim' | 'lab'; date: string; status: 'upcoming' | 'held' | 'cancelled'; speaker?: string | null; season?: number | null; topic?: string | null
  track?: string | null; location?: Loc | number | null; venue?: string | null; city?: string | null; lat?: number | null; lng?: number | null; cover?: unknown; photos?: unknown[] | null
}
const TRACK: Record<string, string> = { injector: 'Injector Lab', skincare: 'Skincare Lab', cadaver: 'Cadaver Lab', regional: 'Regional Lab', surgical: 'Surgical Lab' }
const LAYOUTS = [['big', '', '', 'wide'], ['big', '', '', '', ''], ['wide', '', '', 'wide'], ['big', 'wide', '', '']]
const TILES: Record<string, string[]> = {
  injector: ['Live model', 'Mapping', 'Hands on', 'Q and A', 'Team'], skincare: ['Treatment', 'Protocol', 'Detail', 'Host clinic', 'Team'],
  cadaver: ['Anatomy', 'Table leads', 'Group', 'Cases', 'Team'], regional: ['Injectors', 'Estheticians', 'Hands on', 'Group', 'Team'], surgical: ['The OR', 'Hands on', 'Team', 'Detail', 'Group'],
}

export const getTraining = cache(async () => {
  const p = await db()
  const [shows, eps, locs, evr, u] = await Promise.all([
    p.count({ collection: 'shows', where: { live: { equals: true } } }),
    p.count({ collection: 'episodes', where: { live: { equals: true } } }),
    p.find({ collection: 'locations', where: { live: { equals: true } }, limit: 1000, depth: 0, select: { city: true, state: true, lat: true, lng: true } }),
    p.find({ collection: 'training-events', where: { and: [{ public: { equals: true } }, { status: { not_equals: 'cancelled' } }] }, sort: 'date', limit: 500, depth: 2 }),
    p.findGlobal({ slug: 'university', depth: 0 }),
  ])
  const ev = evr.docs as unknown as Ev[]
  const U = u as unknown as { members?: Record<string, number | null>; support?: { reply?: string; solved?: string }; vendorSessions?: number; practiceFaculty?: number; showClinicalDirector?: boolean }
  const held = ev.filter((e) => e.status === 'held'), soon = ev.filter((e) => e.status === 'upcoming')

  // AIM
  const aimHeld = held.filter((e) => e.kind === 'aim'), aimAll = ev.filter((e) => e.kind === 'aim')
  const seasons = [...new Set(aimAll.map((e) => e.season || 1))].sort((a, b) => a - b)
  const latestSeason = seasons[seasons.length - 1] || 1
  const aim: Record<number, [string, string, string, string][]> = { 1: [] }, range: Record<number, string> = { 1: '' }
  for (const n of seasons) {
    const s = aimAll.filter((e) => (e.season || 1) === n)
    aim[n] = s.map((e) => [md(e.date), e.speaker || '', e.topic || 'Live Q&A', url(e.cover, 'card') || ''])
    range[n] = ' / ' + my(s[0].date) + (n === latestSeason ? ' on' : ' to ' + my(s[s.length - 1].date))
  }
  const masters = new Set(aimHeld.map((e) => person(e.speaker || ''))).size
  const nextAim = soon.find((e) => e.kind === 'aim'), lastAim = aimHeld[aimHeld.length - 1]
  const showAim = nextAim || lastAim

  // Labs
  const loc = (e: Ev) => (e.location && typeof e.location === 'object' ? e.location : null)
  const where = (e: Ev) => {
    const l = loc(e)
    const brand = l?.brand && typeof l.brand === 'object' ? l.brand.name : ''
    return {
      host: e.venue || brand || l?.name || '',
      city: e.city || (l?.city ? `${l.city}, ${l.state}` : ''),
      ll: e.lat != null && e.lng != null ? [Number(e.lat), Number(e.lng)] : l?.lat != null && l?.lng != null ? [Number(l.lat), Number(l.lng)] : null,
    }
  }
  const labsHeld = held.filter((e) => e.kind === 'lab')
  const nextLab = soon.find((e) => e.kind === 'lab'), lastLab = labsHeld[labsHeld.length - 1]
  const showLab = nextLab || lastLab
  const year = new Date().getUTCFullYear()
  const thisYear = labsHeld.filter((e) => new Date(e.date).getUTCFullYear() === year).length
  const hosts = new Set(labsHeld.map((e) => where(e).host).filter(Boolean)).size
  const tracks = new Set(labsHeld.map((e) => e.track || 'injector'))

  // map: partner clinics as quiet dots; Labs as rippling pins sized by how many each city has hosted
  const clinics = locs.docs.filter((l) => l.lat != null && l.lng != null).map((l) => ({ name: `${l.city}, ${l.state}`, xy: project(Number(l.lat), Number(l.lng)) }))
  const net = clinics.map((l) => ({ c: l.name, x: r1(l.xy[0]) + '%', y: r1(l.xy[1]) + '%', s: '5px', d: '0s', cls: 'pin net' }))
  const perCity = new Map<string, { n: number; xy: [number, number] }>()
  for (const e of labsHeld) {
    const w = where(e)
    if (!w.ll) continue
    const k = w.city || w.host
    const cur = perCity.get(k)
    perCity.set(k, { n: (cur?.n || 0) + 1, xy: cur?.xy || project(w.ll[0], w.ll[1]) })
  }
  const labPins = [...perCity].map(([c, v], i) => ({ c, x: r1(v.xy[0]) + '%', y: r1(v.xy[1]) + '%', s: 6 + v.n * 3 + 'px', d: (i * 0.37).toFixed(2) + 's', cls: 'pin' + (v.xy[0] > 50 ? ' r' : '') }))
  // Loop arcs between partner cities, mixing long and regional hops (svg viewBox is 100 x 61.45, same ratio as the artwork)
  const city = (n: string) => clinics.find((c) => c.name.startsWith(n + ','))
  const ROUTES = [['Charlestown', 'San Diego'], ['Gahanna', 'Sacramento'], ['Cape Coral', 'Saratoga Springs'], ['Denver', 'Lexington'], ['West Albuquerque', 'Leesburg'], ['Greensboro', 'Corte Madera']]
  const legs = ROUTES.map(([a, b]) => [city(a), city(b)]).filter((x): x is [typeof clinics[0], typeof clinics[0]] => !!x[0] && !!x[1])
  const arcs = legs.map(([a, b], k) => {
    const Y = 0.6145
    const [x1, y1, x2, y2] = [a.xy[0], a.xy[1] * Y, b.xy[0], b.xy[1] * Y]
    const lift = Math.hypot(x2 - x1, y2 - y1) * 0.28
    return { cls: 'arc a' + (k + 1), d: `M${r1(x1)} ${r1(y1)} Q${r1((x1 + x2) / 2)} ${r1(Math.min(y1, y2) - lift)} ${r1(x2)} ${r1(y2)}`, from: a.name, to: b.name }
  })
  const LOOPS = ['Injector Loop', 'Manager Loop', 'Esthie Loop']
  const ticks = arcs.slice(0, 3).map((a, i) => ({ loop: LOOPS[i], route: `${a.from.split(',')[0]} to ${a.to.split(',')[0]}` }))

  // Labs photo sets: the four most recent held Labs, one per track where possible; real photos when uploaded
  const pick: Ev[] = []
  for (const e of [...labsHeld].reverse()) if (pick.length < 4 && !pick.some((x) => x.track === e.track)) pick.push(e)
  for (const e of [...labsHeld].reverse()) if (pick.length < 4 && !pick.includes(e)) pick.push(e)
  const labs = pick.map((e, i) => {
    const w = where(e), photos = (e.photos || []).map((x) => url(x, 'wide')).filter(Boolean) as string[]
    const layout = LAYOUTS[i % LAYOUTS.length], names = TILES[e.track || 'injector'] || TILES.injector
    return { track: TRACK[e.track || 'injector'] || 'Lab', city: w.city || w.host, date: mon(e.date), layout, tiles: layout.map((_, k) => ({ l: photos[k] ? names[k] : '[Photo] ' + names[k], src: photos[k] || '' })) }
  })

  // University settings
  const members = Object.fromEntries(Object.entries(U.members || {}).filter(([, v]) => v != null && v !== 0).map(([k, v]) => [k, String(v)]))
  const support = { reply: U.support?.reply || '< 1 min', solved: U.support?.solved || '3 days' }
  const prev = aim[latestSeason - 1] || []
  const now = aimAll.filter((e) => (e.season || 1) === latestSeason)

  return {
    aim, range,
    season: latestSeason,
    seasonN: seasons.length,
    aimN: aimHeld.length,
    masters,
    labsN: labsHeld.length,
    eps: eps.totalDocs,
    vendorN: U.vendorSessions ?? 0,
    practiceFaculty: U.practiceFaculty ? String(U.practiceFaculty) : '',
    showCD: !!U.showClinicalDirector,
    members, support,
    loopStats: [
      { n: '6', l: 'Loops, by role' },
      ...(members.injector ? [{ n: members.injector, l: 'In the Injector Loop' }] : []),
      { n: support.reply, l: 'First reply, Slack-wide' },
      { n: '≤ ' + support.solved, l: 'Every ticket solved' },
    ],
    learnNow: now.length ? `Season ${latestSeason}: ${[...new Set(now.map((e) => e.speaker))].join(', ')}` : '',
    learnPrev: prev.length ? `Season ${latestSeason - 1}: ${[...new Set(prev.map((r) => r[1]))].join(', ')}` : '',
    labLabel: nextLab ? 'Next Lab' : 'Latest Lab',
    aimLabel: nextAim ? 'Next AIM' : 'Latest AIM',
    lastLab: showLab ? { t: showLab.topic || 'Alpha Lab', s: `${where(showLab).host} / ${mon(showLab.date)}` } : { t: '', s: '' },
    lastAim: showAim ? { t: showAim.speaker || '', s: `${mon(showAim.date)} / Season ${showAim.season || latestSeason} / Closed door`, d: mon(showAim.date) } : { t: '', s: '', d: '' },
    pins: [...net, ...labPins],
    arcs, ticks,
    labStats: [
      { n: String(labsHeld.length), l: 'Labs held' },
      { n: String(thisYear), l: `Labs in ${year}` },
      { n: String(hosts), l: 'Host sites' },
      { n: String(tracks.size), l: 'Tracks' },
    ],
    learnStats: [
      { n: String(seasons.length), l: 'AIM seasons' },
      { n: String(masters), l: 'Masters so far' },
      { n: String(shows.totalDocs), l: 'Podcast shows' },
      { n: String(eps.totalDocs), l: 'Episodes' },
    ],
    labs,
  }
})
