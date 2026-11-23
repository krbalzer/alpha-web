import 'server-only'
import { cache } from 'react'
import { db } from './data'

/**
 * Alpha University (/training). Source: Liz's training master list (Alpha_Training_Master_List, Layer column).
 * Only rows marked Public-worthy "Yes" feed this page. Update the arrays below when the log changes;
 * every count on the page is derived from them.
 */

// AIM: [date, speaker, topic, cover]. Held sessions only (Batniji 12/2/25 was cancelled).
const AIM: Record<number, [string, string, string, string, string][]> = {
  1: [
    ['2024-11-05', 'Julie Horne', 'Advanced lip techniques', '/university/aim-horne.jpg', 'Julie Horne'],
    ['2025-01-07', 'Dr. Tom van Eijk', 'The fern pattern technique', '/university/aim-vaneijk.jpg', 'Tom van Eijk'],
    ['2025-03-12', 'Julie Horne', 'Lips, with in-person sessions at HTB', '', 'Julie Horne'],
    ['2025-04-01', 'Leslie Fletcher', 'Advanced injectables', '/university/aim-fletcher.jpg', 'Leslie Fletcher'],
    ['2025-05-13', 'Dr. Steve Weiner', 'Live Q&A', '/university/aim-weiner.jpg', 'Steve Weiner'],
    ['2025-06-24', 'Lori Robertson', 'Live Q&A, part one', '/university/aim-robertson.jpg', 'Lori Robertson'],
  ],
  2: [
    ['2025-08-05', 'Dr. Steve Yoelin', 'Advanced injectables, moderated by Sarah Safa', '/university/aim-yoelin.jpg', 'Steve Yoelin'],
    ['2025-09-24', 'Dr. Kian Karimi', 'Live Q&A', '/university/aim-karimi.jpg', 'Kian Karimi'],
    ['2026-01-27', 'Lori Robertson', 'Live Q&A, part two', '', 'Lori Robertson'],
  ],
  3: [
    ['2026-08-25', 'Prof. Sebastian Cotofana, MD', 'Live session, not recorded', '', 'Sebastian Cotofana'],
  ],
}
const RANGE: Record<number, string> = { 1: ' / Nov 24 to Jun 25', 2: ' / Aug 25 to Jan 26', 3: ' / Aug 26 on' }

// Alpha Labs held in person: [date, title, host, city]
const LABS_LOG: [string, string, string, string][] = [
  ['2024-10-10', 'Filler training, new temple indication', 'The Laser Center of Marin', 'Corte Madera, CA'],
  ['2025-01-20', 'First East Coast regional Lab', 'The Williams Center', 'Albany, NY'],
  ['2025-03-14', 'Julie Horne lip training', 'Holden Timeless Beauty', 'San Diego, CA'],
  ['2025-03-31', 'Alpha Labs training day', 'The Laser Center of Marin', 'Corte Madera, CA'],
  ['2025-06-04', 'Esthetician training', 'The Laser Center of Marin', 'Corte Madera, CA'],
  ['2025-09-10', 'Injectables and BBL', 'Cami Aesthetics', 'Greensboro, NC'],
  ['2025-10-18', 'First Alpha Cadaver Lab, powered by AMI', 'Allergan Medical Institute', 'Irvine, CA'],
  ['2026-06-10', 'Plated training', 'Rejuva Center', ''],
  ['2026-08-05', 'Radiesse, two days', 'Esthetics Center', 'Sacramento, CA'],
  ['2026-08-07', 'Cutter training for the OR launch', 'The Williams Center', 'Albany, NY'],
  ['2026-08-08', 'Second annual AMI Cadaver Lab', 'Allergan Medical Institute', 'Irvine, CA'],
  ['2026-10-03', 'Filler and neurotoxin training', 'Mint + Needle', 'Lewes, DE'],
]

// Map position (% of the USA artwork) per Lab city
const XY: Record<string, [number, number]> = {
  'Corte Madera, CA': [2.8, 42.1], 'Sacramento, CA': [4.0, 40.6], 'San Diego, CA': [9.6, 65.1], 'Irvine, CA': [8.4, 61.2],
  'Albany, NY': [89.3, 27.2], 'Lewes, DE': [88.9, 43.0], 'Greensboro, NC': [78.6, 53.0],
}

// Vendor education built or negotiated for Alpha (Layer = Vendor: Alpha-exclusive, Public-worthy = Yes)
const VENDOR_EXCLUSIVE = 18

/** Hold the Clinical Director section until the agreement is signed. */
const SHOW_CD = false

const mon = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
const md = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

export const getTraining = cache(async () => {
  const p = await db()
  const [shows, eps] = await Promise.all([
    p.count({ collection: 'shows', where: { live: { equals: true } } }),
    p.count({ collection: 'episodes', where: { live: { equals: true } } }),
  ])
  const seasons = Object.keys(AIM).map(Number)
  const all = seasons.flatMap((n) => AIM[n])
  const masters = new Set(all.map((r) => r[4])).size
  const last = all[all.length - 1]
  const season = Math.max(...seasons.filter((n) => AIM[n].length))
  const lastLab = LABS_LOG[LABS_LOG.length - 1]
  const year = new Date().getUTCFullYear()
  const thisYear = LABS_LOG.filter((l) => l[0].startsWith(String(year))).length
  const hosts = new Set(LABS_LOG.map((l) => l[2])).size
  const perCity = new Map<string, number>()
  LABS_LOG.forEach((l) => l[3] && perCity.set(l[3], (perCity.get(l[3]) || 0) + 1))
  const pins = [...perCity].filter(([c]) => XY[c]).map(([c, n]) => [c, XY[c][0], XY[c][1], n, XY[c][0] > 50 ? 1 : 0])
  const prev = AIM[season - 1] || []
  const lab = (i: number, track: string, layout: string[], tiles: string[]) => {
    const l = LABS_LOG[i]
    return { track, city: l[3] || l[2], date: mon(l[0]), layout, tiles }
  }
  return {
    aim: Object.fromEntries(seasons.map((n) => [n, AIM[n].map((r) => [md(r[0]), r[1], r[2], r[3]])])),
    range: RANGE,
    season,
    seasonN: seasons.length,
    aimN: all.length,
    masters,
    labsN: LABS_LOG.length,
    eps: eps.totalDocs,
    vendorN: VENDOR_EXCLUSIVE,
    showCD: SHOW_CD,
    learnNow: `Season ${season}: ${AIM[season].map((r) => r[1]).join(', ')}`,
    learnPrev: prev.length ? `Season ${season - 1}: ${[...new Set(prev.map((r) => r[1]))].join(', ')}` : '',
    lastLab: { t: lastLab[1], s: `${lastLab[2]} / ${mon(lastLab[0])}` },
    lastAim: { t: last[1], s: `${mon(last[0])} / Season ${season} / Closed door`, d: mon(last[0]) },
    pins,
    labStats: [
      { n: String(LABS_LOG.length), l: 'Labs since 2024' },
      { n: String(thisYear), l: `Labs in ${year}` },
      { n: String(hosts), l: 'Host sites' },
      { n: '2', l: 'Tracks: Skincare and Injector' },
    ],
    learnStats: [
      { n: String(seasons.length), l: 'AIM seasons' },
      { n: String(masters), l: 'Masters so far' },
      { n: String(shows.totalDocs), l: 'Podcast shows' },
      { n: String(eps.totalDocs), l: 'Episodes' },
    ],
    labs: [
      lab(10, 'Cadaver Lab', ['big', '', '', 'wide'], ['Anatomy', 'Table leads', 'Group', 'Cases']),
      lab(11, 'Injector Lab', ['big', '', '', '', ''], ['Live model', 'Mapping', 'Hands on', 'Q and A', 'Team']),
      lab(1, 'Regional Lab', ['wide', '', '', 'wide'], ['Injectors', 'Estheticians', 'Hands on', 'Group']),
      lab(4, 'Skincare Lab', ['big', 'wide', '', ''], ['Treatment', 'Protocol', 'Detail', 'Host clinic']),
    ],
  }
})
