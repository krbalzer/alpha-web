import 'server-only'
import { cache } from 'react'
import { db, html } from './data'

/** Server-side shapes for the ported board templates. Each mirrors the board's data() so the board logic runs unchanged. */

export const getLegal = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'legal', where: { live: { equals: true } }, sort: 'order', limit: 10, depth: 0 })
  return r.docs.map((d) => ({
    slug: d.slug, title: d.title,
    updated: new Date(d.updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    sections: (d.sections || []).map((s) => ({ t: s.heading, html: html(s.body) })),
  }))
})

/* ---------------- Team ---------------- */
import type { Department, Team as TeamDoc, Media } from '@/payload-types'
import { DEPT_EXTRA } from './content/departments'
import { url } from './data'

const LIVE = { live: { equals: true } }
const initialsOf = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
const MARKS = [{ t: 'Start', x: 0 }, { t: 'Signed LOI', x: 33.3 }, { t: 'Closed', x: 43.75 }, { t: 'Integrated', x: 76.1 }, { t: 'Ongoing', x: 89 }]

const getTeamAll = cache(async () => {
  const p = await db()
  const [d, t] = await Promise.all([
    p.find({ collection: 'departments', where: LIVE, sort: 'order', limit: 50, depth: 0 }),
    p.find({ collection: 'team', where: LIVE, sort: 'order', limit: 500, depth: 1 }),
  ])
  const depts = d.docs as Department[]
  const deptOf = (m: TeamDoc) => depts.find((x) => x.id === (typeof m.department === 'object' ? m.department?.id : m.department))
  const people = (t.docs as TeamDoc[]).map((m) => {
    const dept = deptOf(m)
    return {
      id: m.id, slug: m.slug, name: m.name, title: m.title, dept: dept?.slug || '', leader: !!m.leader,
      href: dept ? `/team/${dept.slug}/${m.slug}` : '/team', img: url(m.headshot as Media, 'card') || '', init: initialsOf(m.name),
      ask: (m as { askAbout?: string | null }).askAbout || '', raw: m,
    }
  })
  // leaders first inside each department, then CMS order
  people.sort((a, b) => Number(b.leader) - Number(a.leader))
  return { depts, people }
})

/** Timeline bars: every department but Leadership. */
const bars = (depts: Department[]) => depts.filter((x) => x.slug !== 'leadership').map((x) => ({
  slug: x.slug, name: x.name, l: x.timeline?.start ?? 0, r: x.timeline?.end ?? 101, line: x.line || '',
  ph: (x.timeline?.phases || []).map((p) => p.line || 'Not involved yet.').concat(['', '', '', '']).slice(0, 4),
}))

export const getTeamIndex = cache(async () => {
  const { depts, people } = await getTeamAll()
  const lead = depts.find((d) => d.slug === 'leadership')
  const D = depts.map((d) => ({ k: d.slug, t: d.name, line: d.line || '', link: d.slug !== 'leadership', href: `/team/${d.slug}` }))
  const row = (k: string, m: (typeof people)[number]) => [k, m.name, m.title, m.ask, m.href, m.img]
  const T = [
    ...people.filter((m) => m.dept === 'leadership' || m.leader).map((m) => row(lead?.slug || 'leadership', m)),
    ...depts.filter((d) => d.slug !== 'leadership').flatMap((d) => people.filter((m) => m.dept === d.slug).map((m) => row(d.slug, m))),
  ]
  return { D, T }
})

export const getDept = cache(async (slug: string) => {
  const { depts, people } = await getTeamAll()
  const dep = depts.find((d) => d.slug === slug)
  if (!dep || slug === 'leadership') return null
  const x = DEPT_EXTRA[slug] || {}
  const team = people.filter((m) => m.dept === slug).map((m) => ({ name: m.name, role: m.title, init: m.init, ask: m.ask, img: m.img, href: m.href }))
  return {
    marks: MARKS, depts: bars(depts),
    d: { slug, name: dep.name, h1a: dep.name, h1b: x.h1b || '', h1c: x.h1c || '', line: dep.line || '', intro: html(dep.intro),
      stats: x.stats || [], plate: x.plate || [], scope: x.scope || [], ninety: x.ninety || [],
      owns: (dep.owns || []).map((o) => o.item || '').filter(Boolean) },
    partners: x.partners || [], team, faq: x.faq || [],
    Q: QUALIFIER,
  }
})

export const QUALIFIER = [
  { title: 'How many locations do you run?', hint: 'Count every location operating under your brand today.', key: 'locs', opts: ['1', '2 to 3', '4 or more'] },
  { title: 'How long have you been open?', hint: 'From your first patient at your first location.', key: 'years', opts: ['Under [2] years', '[2] to [5] years', '[5]+ years'] },
  { title: 'Roughly, what is your annual revenue?', hint: 'A range is fine. This stays between us.', key: 'rev', opts: ['Under $[X]M', '$[X]M to $[Y]M', '$[Y]M+'] },
  { title: 'What is your role?', hint: 'We want to talk with the person who makes the call.', key: 'role', opts: ['Owner / founder', 'Medical director', 'Partner / investor'] },
]

export const getProfile = cache(async (deptSlug: string, person: string) => {
  const { depts, people } = await getTeamAll()
  const dep = depts.find((d) => d.slug === deptSlug)
  if (!dep) return null
  const members = people.filter((m) => m.dept === deptSlug)
  const i = members.findIndex((m) => m.slug === person)
  if (i < 0) return null
  const team = members.map((m) => {
    const r = m.raw
    const [first, ...rest] = m.name.split(' ')
    const owns = (r.ownsForYou || []).map((o) => o.item || '').filter(Boolean)
    const before = (r.background || []).map((b) => ({ y: b.years || '', role: b.role || '', org: b.org || '' }))
    const quotes = r.quote?.text ? [{ q: r.quote.text, who: r.quote.source || '', role: '', init: '' }] : []
    return {
      slug: m.slug, href: m.href, dept: deptSlug, first, last: rest.join(' '), init: m.init, title: m.title, tone: '#BDB6AA',
      img: url(r.headshot as Media, 'wide') || '', line: '', owns: owns.join(' · '), bioHtml: html(r.bio),
      stats: (r.metrics || []).map((s) => ({ n: s.value || '', l: s.label || '' })),
      before, work: [], partnerCount: '', attrs: [], quotes, pods: [], yb: null,
    }
  })
  const everyone = people.map((m) => ({ first: m.name.split(' ')[0], last: m.name.split(' ').slice(1).join(' '), init: m.init, title: m.title, dept: m.dept || 'lead', img: m.img, href: m.href, slug: m.slug }))
  return { marks: MARKS, depts: bars(depts).concat(deptSlug === 'leadership' ? [{ slug: 'leadership', name: 'Leadership', l: 0, r: 101, line: dep.line || '', ph: ['', '', '', ''] }] : []), team, everyone, start: i, deptHref: `/team/${deptSlug}` }
})

export const getTeamParams = async () => {
  const { depts, people } = await getTeamAll()
  return { depts: depts.filter((d) => d.slug !== 'leadership').map((d) => d.slug), people: people.map((m) => ({ dept: m.dept, person: m.slug })) }
}

/** About page leadership row: department leads plus Leadership, in CMS order. */
export const getExecs = cache(async () => {
  const { people } = await getTeamAll()
  return people.filter((m) => m.leader || m.dept === 'leadership').map((m) => ({ n: m.name, t: m.title, i: m.init, iOnly: m.img ? '' : m.init, img: m.img, href: m.href }))
})

/* ---------------- Newswire ---------------- */
import { RELEASE_TAGS } from './content/newswire'
import type { Article, Brand } from '@/payload-types'

const iso = (d?: string | null) => (d ? new Date(d).toISOString().slice(0, 10) : '')
const fmtLong = (d?: string | null) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '')
/** One-line summary: the dek without its dateline, cut at a sentence. */
const summary = (dek?: string | null) => {
  const t = (dek || '').replace(/^[^—]{0,90}—\s*/, '').trim()
  const m = t.match(/^(.{40,220}?[.!?])(\s|$)/)
  return m ? m[1] : t.slice(0, 200)
}

const getArticles = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'articles', where: LIVE, sort: '-published', limit: 500, depth: 1 })
  return (r.docs as Article[]).map((a) => {
    const date = iso(a.published)
    const [tag, ptrN] = RELEASE_TAGS[date] || [a.category || 'Network', '']
    const brand = ((a.brands || []) as (Brand | number)[]).find((b): b is Brand => typeof b === 'object')
    const n = brand ? String(brand.ptr).padStart(3, '0') : ptrN
    return { slug: a.slug, href: `/newswire/${a.slug}`, date, t: a.title, tag, ptr: n, sum: summary(a.dek), img: url(a.cover as Media, 'wide') || '', raw: a }
  })
})

export const getNewswire = cache(async () => (await getArticles()).map(({ raw: _r, ...x }) => x))

export const getArticle = cache(async (slug: string) => {
  const all = await getArticles()
  const i = all.findIndex((a) => a.slug === slug)
  if (i < 0) return null
  const a = all[i]
  const p = await db()
  const brand = a.ptr ? (await p.find({ collection: 'brands', where: { and: [{ ptr: { equals: Number(a.ptr) } }, LIVE] }, limit: 1, depth: 1 })).docs[0] : null
  const loc = brand ? (await p.find({ collection: 'locations', where: { and: [{ brand: { equals: brand.id } }, LIVE] }, sort: 'createdAt', limit: 1, depth: 0 })).docs[0] : null
  const more = all.filter((x) => x.slug !== slug).slice(0, 3).map((x) => ({ d: fmtLong(x.date), t: x.t, href: x.href }))
  const u = encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://partnerwithalpha.com'}${a.href}`)
  return {
    share: { li: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, x: `https://x.com/intent/post?url=${u}&text=${encodeURIComponent(a.t)}`, fb: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    a: { slug, t: a.t, date: fmtLong(a.date), tag: a.tag, ptr: a.ptr ? 'PTR ' + a.ptr : '', img: url(a.raw.cover as Media, 'full') || '', html: html(a.raw.body), sum: a.sum },
    brand: brand ? { name: brand.name, href: `/brands/${brand.slug}`, n: String(brand.ptr).padStart(3, '0'), where: loc ? `${loc.city}, ${loc.state}` : '', img: url(brand.heroPoster as Media, 'card') || url(brand.film?.poster as Media, 'card') || '' } : null,
    more,
  }
})

/* ---------------- Network: locations, founders ---------------- */
import type { Founder, Location } from '@/payload-types'
import { NO_MEDIA, RATINGS } from './content/ratings'
import { getPlace, pickReviews } from './reviews'

const pad3 = (n?: number | null) => String(n ?? 0).padStart(3, '0')
const monthYear = (d?: string | null) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : '')
const ORIGIN: Record<string, string> = { 'de-novo': 'De novo', 'tuck-in': 'Joined' }

export const getNetworkAll = cache(async () => {
  const p = await db()
  const [b, l, f] = await Promise.all([
    p.find({ collection: 'brands', where: LIVE, sort: 'ptr', limit: 200, depth: 1 }),
    p.find({ collection: 'locations', where: LIVE, limit: 1000, depth: 1 }),
    p.find({ collection: 'founders', where: LIVE, limit: 500, depth: 1 }),
  ])
  return { brands: b.docs as Brand[], locations: l.docs as Location[], founders: f.docs as Founder[] }
})

const brandFounders = (b: Brand) => ((b.founders || []) as (Founder | number)[]).filter((x): x is Founder => typeof x === 'object')
const founderLine = (b: Brand) => brandFounders(b).filter((f) => f.status !== 'former').map((f) => [f.name, f.credentials].filter(Boolean).join(', ')).join(' and ')

export const getLocationsDir = cache(async () => {
  const { brands, locations, founders } = await getNetworkAll()
  const B: Record<string, { name: string; founder: string; est: string; since: string; tone: string; href: string }> = {}
  for (const b of brands) B[pad3(b.ptr)] = { name: b.name, founder: founderLine(b), est: b.established ? String(b.established) : '', since: monthYear(b.since), tone: b.tone || '#4D463C', href: `/brands/${b.slug}` }
  const rows = locations
    .map((l) => ({ l, b: typeof l.brand === 'object' ? (l.brand as Brand) : brands.find((x) => x.id === l.brand) }))
    .filter((x): x is { l: Location; b: Brand } => !!x.b && !!B[pad3(x.b.ptr)])
    .sort((a, z) => (a.b.ptr ?? 0) - (z.b.ptr ?? 0) || a.l.city.localeCompare(z.l.city))
  const live = await Promise.all(rows.map(({ l }) => getPlace(l.googlePlaceId)))
  const L = rows.map(({ l, b }, i) => {
    const n = pad3(b.ptr), key = `${b.ptr}|${l.city}`, g = live[i], [rating, reviews] = g && g.count ? [Math.round(g.rating * 10) / 10, g.count] : RATINGS[key] || [0, 0]
    const a1 = l.address1 || '', a2 = l.address2 || `${l.city}, ${l.state} ${l.zip || ''}`.trim()
    return {
      i, n, brand: B[n].name, founder: B[n].founder, tone: B[n].tone, city: l.city, st: l.state, lat: l.lat, lng: l.lng, est: B[n].est, since: B[n].since,
      a1, a2, rating, reviews, noMedia: NO_MEDIA.has(key), origin: ORIGIN[l.origin || ''] || '',
      ang: (i * 0.37) % 1 - 0.5, hmax: 14 + (i * 7) % 20, seed: 7 + i * 13, streets: [a1.replace(/^[0-9-]+\s+/, '').replace(/,.*$/, '')].filter(Boolean),
      href: `/locations/${l.slug}`, brandHref: B[n].href, img: NO_MEDIA.has(key) ? '' : url(l.photo as Media, 'card') || '',
    }
  })
  const F = founders
    .filter((f) => f.status !== 'former')
    .map((f) => {
      const b = brands.find((x) => brandFounders(x).some((y) => y.id === f.id))
      return b ? [f.name, f.credentials || (f.kind === 'business' ? 'Founder' : ''), pad3(b.ptr), url(f.headshot as Media, 'card') || '', `/founders/${f.slug}`] : null
    })
    .filter((x): x is string[] => !!x && L.some((l) => l.n === x[2]))
    .sort((a, z) => z[2].localeCompare(a[2]))
  return { B, L, F }
})

const firstLoc = (b: Brand, locations: Location[]) => locations.filter((l) => (typeof l.brand === 'object' ? l.brand?.id : l.brand) === b.id)

export const getFounder = cache(async (slug: string) => {
  const { brands, locations, founders } = await getNetworkAll()
  const fd = founders.find((f) => f.slug === slug)
  if (!fd) return null
  const b = brands.find((x) => brandFounders(x).some((y) => y.id === fd.id))
  if (!b) return null
  const n = pad3(b.ptr)
  const locs = firstLoc(b, locations).sort((a, z) => a.city.localeCompare(z.city))
  const [first, ...rest] = fd.name.split(' ')
  const cities = [...new Set(locs.map((l) => l.city))]
  const sinceYear = b.since ? new Date(b.since).getUTCFullYear() : null
  const path = (fd.milestones || []).filter((m) => m.line).sort((a, z) => (a.year || 0) - (z.year || 0)).map((m) => ({ y: m.year ? String(m.year) : '', t: m.line || '', d: '' }))
  if (sinceYear && !path.some((m) => /alpha/i.test(m.t))) path.push({ y: String(sinceYear), t: `Partner ${n}`, d: 'Joins Alpha Aesthetics Partners.', alpha: true } as never)
  const others = founders.filter((x) => x.id !== fd.id && x.status !== 'former').map((x) => {
    const xb = brands.find((y) => brandFounders(y).some((z) => z.id === x.id))
    const xl = xb ? firstLoc(xb, locations)[0] : null
    return xb ? { name: x.name, cred: x.credentials || '', brand: xb.name, city: xl?.city || '', img: url(x.headshot as Media, 'card') || '', href: `/founders/${x.slug}` } : null
  }).filter(Boolean)
  return {
    b: { n, ptr: `PTR ${n}`, name: b.name, short: b.short || b.name, since: monthYear(b.since), est: b.established ? String(b.established) : '', book: fd.status === 'former' ? '' : b.website || locs.find((l) => l.bookingUrl)?.bookingUrl || '',
      states: [...new Set(locs.map((l) => l.state))], href: `/brands/${b.slug}`,
      locations: locs.map((l) => { const img = NO_MEDIA.has(`${b.ptr}|${l.city}`) ? '' : url(l.photo as Media, 'card') || ''; return { city: l.city, st: l.state, img, noImg: !img, a1: l.address1 || '', tone: 'linear-gradient(160deg,#8C7F6B,#4D463C)', href: `/locations/${l.slug}` } }) },
    f: { name: fd.name, first: first.replace(/^Dr\.$/, rest[0] || first), last: first === 'Dr.' ? rest.slice(1).join(' ') : rest.join(' '), cred: fd.credentials || '',
      role: fd.kind === 'business' && brandFounders(b).length > 1 ? 'Co-founder' : 'Founder',
      portrait: url(fd.portrait as Media, 'full') || url(fd.headshot as Media, 'full') || '', markets: cities.length > 2 ? `${cities.length} locations` : cities.join(' & '),
      headline: fd.headline || '', bioHtml: html(fd.bio) },
    path, rules: (fd.traits || []).filter((t) => t.label).map((t) => ({ t: t.label || '', d: t.line || '' })),
    quotes: (fd.quotes || []).map((q) => ({ text: q.text, source: q.source })), peers: others,
  }
})
export const getFounderSlugs = async () => (await getNetworkAll()).founders.map((f) => f.slug)

import { posterUrl, video } from './data'

export const getLocation = cache(async (slug: string) => {
  const { brands, locations, founders } = await getNetworkAll()
  const cur = locations.find((l) => l.slug === slug)
  if (!cur) return null
  const b = typeof cur.brand === 'object' ? (cur.brand as Brand) : brands.find((x) => x.id === cur.brand)
  if (!b || !brands.some((x) => x.id === b.id)) return null
  const full = brands.find((x) => x.id === b.id) as Brand
  const locs = firstLoc(full, locations).sort((a, z) => (a.id === cur.id ? -1 : z.id === cur.id ? 1 : a.city.localeCompare(z.city)))
  const f = brandFounders(full).filter((x) => x.status !== 'former').map((x) => founders.find((y) => y.id === x.id) || x)
  const tones = ['linear-gradient(160deg,#8C7F6B,#4D463C)', 'linear-gradient(160deg,#6F7276,#393B3E)', 'linear-gradient(160deg,#7A6E62,#3E3832)']
  const est = full.established ? String(full.established) : ''
  const rv = pickReviews(await getPlace(cur.googlePlaceId))
  return {
    li: 0,
    b: {
      n: pad3(full.ptr), ptr: `PTR ${pad3(full.ptr)}`, book: full.website || cur.bookingUrl || '', name: full.name, short: full.short || full.name, since: monthYear(full.since), est,
      founder: f.map((x) => x.name).join(' and '), cred: f.length === 1 ? f[0].credentials || '' : '', founderImg: f[0] ? url(f[0].headshot as Media, 'card') || '' : '',
      founderHref: f[0] ? `/founders/${f[0].slug}` : '', services: (full.services || []) as string[], href: `/brands/${full.slug}`,
      states: [...new Set(locs.map((l) => l.state))],
      locations: locs.map((l, i) => {
        const key = `${full.ptr}|${l.city}`, noMedia = NO_MEDIA.has(key), v = noMedia ? { src: '', av1: '', small: '' } : video(l.heroVideo)
        const a1 = l.address1 || '', a2 = l.address2 || `${l.city}, ${l.state} ${l.zip || ''}`.trim()
        const lead = l.lead?.name ? { name: l.lead.name, role: l.lead.title || `Lead provider, ${l.city}`, cred: l.lead.credentials || '', img: url(l.lead.photo as Media, 'card') || '',
          href: typeof l.lead.profile === 'object' && l.lead.profile ? `/founders/${l.lead.profile.slug}` : '#' } : null
        return {
          city: l.city, st: l.state, href: `/locations/${l.slug}`,
          img: noMedia ? '' : url(l.photo as Media, 'wide') || '', heroVideo: v.src, heroAv1: v.av1, heroSmall: v.small, heroPoster: v.src ? posterUrl(l.heroPoster) : '',
          est, facts: '', providers: 0, mix: (l.roleMix || []).map((r) => [r.role, r.count]), lead, storyHtml: html(l.story),
          hours: (l.hours || []).map((h) => [h.days, h.time]), phone: l.phone || '', arrive: l.arrivalNote || '',
          rv: l.id === cur.id ? rv : null,
          ms: (l.milestones || []).map((m) => [m.when, m.line]), quote: l.quote?.text ? { t: l.quote.text, s: l.quote.source || '' } : { t: '', s: '' },
          a1, a2, lng: l.lng, lat: l.lat, ang: ((l.mapBearing || 0) * Math.PI) / 180, hmax: 16 + ((i * 7) % 20), seed: 11 + i * 18, tone: tones[i % 3],
          streets: [a1.replace(/^[0-9-]+\s+/, '').replace(/,.*$/, '')].filter(Boolean),
        }
      }),
    },
  }
})
export const getLocationSlugs = async () => (await getNetworkAll()).locations.map((l) => l.slug)

/* ---------------- Home ---------------- */
import type { Episode, Show } from '@/payload-types'
import { getNetwork, toEp } from './data'

/** Market names and roster stills from the Home board, by partner number. */
const AREA: Record<string, string> = { '001': 'Sacramento', '002': 'North County San Diego', '003': 'Northern Virginia', '005': 'Marin County', '006': 'Capital Region', '007': 'Ohio and Southwest Florida', '008': 'North Shore', '009': 'Fairfax', '010': 'Charlotte area', '011': 'Southern New Hampshire', '012': 'Albuquerque', '013': 'Delaware', '014': 'Lexington', '015': 'Boston and Nantucket', '016': 'Denver and Encinitas' }
const STILL: Record<string, string> = { '011': '/img/p-inbloom.webp', '012': '/img/p-flawless.webp', '013': '/img/p-mint.webp', '014': '/img/p-prive.webp', '015': '/img/p-lexrx.webp', '016': '/img/p-preva.webp' }

export const getShows = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'shows', where: LIVE, sort: 'order', limit: 50, depth: 1 })
  return (r.docs as Show[]).map((s) => ({ name: s.name, slug: s.slug, href: `/podcasts/${s.slug}`, bg: s.bg || '#1D1B1A', fg: s.fg || '#fff', art: url(s.artwork as Media, 'card') || '', raw: s }))
})

/** Home reel: Alpha 2025 film, desktop 16:9 (from the 4K master) and mobile 9:16 cut. AV1 first, H.264 fallback. Files in Blob under home/. */
const HOME_REEL = {
  d: { av1: 'https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/home/alpha-2025-d-av1.mp4', h264: 'https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/home/alpha-2025-d-h264.mp4', poster: 'https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/home/alpha-2025-d-poster.jpg' },
  m: { av1: 'https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/home/alpha-2025-m-av1.mp4', h264: 'https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/home/alpha-2025-m-h264.mp4', poster: 'https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/home/alpha-2025-m-poster.jpg' },
}

export const getHome = cache(async () => {
  const [{ brands, locations, founders }, net, depAll, shows] = await Promise.all([getNetworkAll(), getNetwork(), getTeamAll(), getShows()])
  const P = brands.map((b) => {
    const n = pad3(b.ptr), ls = firstLoc(b, locations)
    const flag = ls.slice().sort((a, z) => a.id - z.id)[0]
    const f = brandFounders(b).filter((x) => x.status !== 'former').map((x) => founders.find((y) => y.id === x.id) || x)
    return {
      n, name: b.short && b.short.length > 14 ? b.name : b.name, city: flag ? `${flag.city}, ${flag.state}` : '', locs: ls.length, area: AREA[n] || '',
      founder: f[0] ? [f[0].name, f[0].credentials].filter(Boolean).join(', ') : '', role: f[0]?.kind === 'business' && f.length > 1 ? 'Co-founder' : 'Founder',
      tone: b.tone || '#4D463C', img: STILL[n] || posterUrl(b.heroPoster) || url(b.practice?.image as Media, 'wide') || '', head: f[0] ? url(f[0].headshot as Media, 'card') || '' : '',
      href: `/brands/${b.slug}`, founderHref: f[0] ? `/founders/${f[0].slug}` : '', yr: b.since ? String(new Date(b.since).getUTCFullYear()) : '', since: monthYear(b.since).replace(/^(\w{3})\w*/, '$1'),
      poster: posterUrl(b.heroPoster) || '',
      film: video(b.film?.video), filmPoster: posterUrl(b.film?.poster) || posterUrl(b.heroPoster) || '',
      cover: posterUrl(b.film?.poster) || '', story: (b.short || b.name).replace(/^the\s+/i, ''),
    }
  })
  const depts = depAll.depts.filter((d) => d.slug !== 'leadership').map((d) => {
    const m = depAll.people.filter((x) => x.dept === d.slug)
    return { name: d.name, line: d.line || '', href: `/team/${d.slug}`, avs: m.map((x) => ({ img: x.img, iOnly: x.img ? '' : x.init, href: x.href, name: x.name })) }
  })
  const p = await db()
  const [er, SPK, SHW] = await Promise.all([p.find({ collection: 'episodes', where: { and: [LIVE, { number: { greater_than: 0 } }] }, sort: '-published', limit: 4, depth: 1 }), getSpeakers(), getShows()])
  const eps = (er.docs as Episode[]).map((e) => {
    const sh = typeof e.show === 'object' ? (e.show as Show) : null
    const d = e.duration || 0
    return { ep: toEp(e, SPK, SHW.find((x) => x.slug === sh?.slug)?.art), id: String(e.id), title: e.title, show: `${sh?.name || ''}${e.number ? ` · Ep ${String(e.number).padStart(2, '0')}` : ''}`, len: d ? `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}` : '', tone: sh?.bg || '#1D1B1A' }
  })
  return {
    reel: HOME_REEL,
    net: { brands: String(net.brands), locations: String(net.locations), states: String(net.states) },
    P, depts, eps, shows: shows.map(({ raw: _r, ...s }) => s),
  }
})

/* ---------------- Podcasts ---------------- */
const firstSentence = (t?: string | null) => {
  const x = (t || '').replace(/\s+/g, ' ').trim()
  for (const m of x.matchAll(/[.!?](?=\s+[A-Z"“]|$)/g)) {
    const i = m.index ?? 0
    if (i < 30 || /\b(Dr|Mr|Mrs|Ms|St|Jr|vs)$/.test(x.slice(0, i))) continue
    return x.slice(0, i + 1)
  }
  return x.length > 220 ? x.slice(0, 200).replace(/\s\S*$/, '') + '…' : x
}
const cleanSched = (x?: string | null) => (x ? x.replace(/^new every/i, 'New every').replace(/\b(monday|tuesday|wednesday|thursday|friday|week)\b/gi, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()) : '')
const lenOf = (d?: number | null) => (d ? `${Math.round(d / 60)} min` : '')

/* ---------------- Podcast people ---------------- */
import type { Speaker } from '@/payload-types'
type PersonCard = { id: number; name: string; init: string; role: string; bio: string; img: string; href: string }
const bioShort = (t?: string | null) => { // first sentence or two, never cut mid-thought without an ellipsis
  const x = (t || '').replace(/\s+/g, ' ').trim(); if (x.length <= 260) return x
  const y = x.replace(/\b(Mrs|Mr|Ms|Dr|St|Jr|Sr|Inc|Co|U\.S)\./g, '$1\u2024') // keep titles like Mrs. from ending a sentence
  let out = ''; for (const sen of y.match(/[^.!?]+[.!?]+(\s|$)/g) || []) { if (out && (out + sen).length > 260) break; out += sen }
  out = out.replace(/\u2024/g, '.').trim(); if (out && out.length <= 320) return out
  return x.slice(0, 240).replace(/\s+\S*$/, '') + '…' }
export const getSpeakers = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'speakers', limit: 5000, depth: 2, pagination: false })
  const m = new Map<number, PersonCard>()
  for (const sp of r.docs as Speaker[]) {
    const t = sp.teamMember && typeof sp.teamMember === 'object' ? sp.teamMember : null
    const dept = t && typeof t.department === 'object' ? t.department : null
    m.set(sp.id, { id: sp.id, name: sp.name, init: initialsOf(sp.name), role: sp.role || t?.title || '', bio: bioShort(sp.bio),
      img: url(sp.headshot as Media, 'card') || url(t?.headshot as Media, 'card') || '', href: t && dept ? `/team/${dept.slug}/${t.slug}` : '' })
  }
  return m
})
const ids = (xs?: unknown[] | null) => (xs || []).map((x) => (x && typeof x === 'object' ? (x as { id: number }).id : (x as number)))
const peopleOf = (S: Map<number, PersonCard>, xs?: unknown[] | null) => ids(xs).map((i) => S.get(i)).filter((x): x is PersonCard => !!x)
const withLabel = (list: PersonCard[], hostIds: number[]) => list.map((x) => ({ ...x, label: hostIds.includes(x.id) ? 'Host' : 'Guest', iOnly: x.img ? '' : x.init, hasHref: !!x.href }))
  .sort((a, b) => Number(b.label === 'Host') - Number(a.label === 'Host'))
const hostLine = (S: Map<number, PersonCard>, sh: Show) => { const h = peopleOf(S, sh.hosts).map((x) => x.name.replace(/,.*$/, '')); return h.length ? 'With ' + (h.length > 2 ? h.slice(0, -1).join(', ') + ' + ' + h[h.length - 1] : h.join(' + ')) : '' }

export const getEpisodes = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'episodes', where: { and: [LIVE, { number: { not_equals: 0 } }] }, sort: '-published', limit: 5000, depth: 1 })
  return (r.docs as Episode[]).filter((e) => typeof e.show === 'object' && e.show)
})

/** Show logos (white SVG, used as a mask so they take each surface's color) and hero photography.
 *  Files live in /public/podcasts. Static until Shows gets logo + hero upload fields in the CMS. */
const SHOW_MEDIA: Record<string, { logo?: string; ar?: number; hero?: string }> = {
  'dear-tiffany': { logo: '/podcasts/dear-tiffany-logo.svg', ar: 252.38 / 196.71, hero: '/podcasts/dear-tiffany-hero.jpg' },
  'holding-time-back': { logo: '/podcasts/holding-time-back-logo.svg', ar: 728.02 / 211.03, hero: '/podcasts/holding-time-back-hero.jpg' },
}

const AUD: Record<string, string> = { owners: 'Practice owners', directors: 'Directors', providers: 'Providers', 'front-desk': 'Front desk', marketers: 'Marketers', patients: 'Patients' }
const TOPIC_ORDER = ['Leadership', 'Clinical', 'Cosmetic surgery', 'Culture', 'Financials', 'Growth', 'KPIs', 'Marketing', 'Private equity', 'Public speaking', 'Sales', 'Technology', 'Entertainment']
const PATHS: { t: string; f: { topics?: string[]; aud?: string[] } }[] = [
  { t: 'New to ownership', f: { aud: ['Practice owners'], topics: ['Leadership', 'Financials'] } },
  { t: 'Train your front desk', f: { aud: ['Front desk'] } },
  { t: 'Thinking about partnering', f: { topics: ['Private equity'] } },
  { t: 'Marketing that books', f: { topics: ['Marketing', 'Sales'] } },
]

export const getPodcasts = cache(async () => {
  const [shows, eps, SP] = await Promise.all([getShows(), getEpisodes(), getSpeakers()])
  const S: Record<string, { name: string; short: string; sched: string; hosts: string; bg: string; fg: string; tag: string; art: string; href: string; logo: string; noLogo: boolean; ar: string; hero: string }> = {}
  for (const s of shows) {
    const m = SHOW_MEDIA[s.slug] || {}
    S[s.slug] = { name: s.name, short: s.name.replace(/^The /, ''), sched: cleanSched(s.raw.schedule), hosts: hostLine(SP, s.raw), bg: s.bg, fg: s.fg, tag: firstSentence(s.raw.tagline), art: url(s.raw.artwork as Media, 'wide') || s.art, href: s.href,
      logo: m.logo || '', noLogo: !m.logo, ar: String(m.ar || 2.2), hero: m.hero || '' }
  }
  const E = eps.map((e, i) => {
    const sh = e.show as Show
    return { id: i, show: sh.slug, n: e.number ? String(e.number).padStart(3, '0') : '', title: e.title,
      topics: (e.tags || []).map((t) => (typeof t === 'object' ? t.name : '')).filter(Boolean), aud: (e.audience || []).map((a) => AUD[a]).filter(Boolean),
      spk: ids(e.speakers).filter((x) => SP.has(x)).map(String),
      date: iso(e.published), len: lenOf(e.duration), sec: e.duration || 0, href: `/podcasts/${sh.slug}/${e.slug}`, ep: toEp(e, SP, shows.find((x) => x.slug === sh.slug)?.art) }
  }).map((x) => Object.assign(x, { label: (x.n ? `EP ${x.n} / ` : '') + x.title }))
  const withEps = shows.filter((s) => E.some((e) => e.show === s.slug))
  // every show with episodes is a hero slide, featured first, so each shelf card drives the hero
  const feat = [...withEps.filter((s) => s.raw.featured), ...withEps.filter((s) => !s.raw.featured)].map((s) => s.slug)
  // filter groups from the board: topic and audience in a fixed order, speakers by how often they're on the mic
  const used = (k: 'topics' | 'aud' | 'spk') => { const c = new Map<string, number>(); E.forEach((e) => e[k].forEach((v) => c.set(v, (c.get(v) || 0) + 1))); return c }
  const tc = used('topics'), ac = used('aud'), sc = used('spk')
  const topics = [...TOPIC_ORDER.filter((t) => tc.has(t)), ...[...tc.keys()].filter((t) => !TOPIC_ORDER.includes(t)).sort()]
  const spk = [...sc.keys()].sort((a, b) => sc.get(b)! - sc.get(a)! || SP.get(+a)!.name.localeCompare(SP.get(+b)!.name))
  const P: Record<string, string> = {}, PI: Record<string, string> = {}
  spk.forEach((k) => { const x = SP.get(+k)!; P[k] = x.name; PI[k] = x.img })
  const G = [
    { key: 'show', t: 'Show', opts: shows.filter((s) => E.some((e) => e.show === s.slug)).map((s) => ({ v: s.slug, t: s.name })) },
    { key: 'topics', t: 'Topic', opts: topics.map((v) => ({ v, t: v })) },
    { key: 'aud', t: 'Who it’s for', opts: Object.values(AUD).filter((v) => ac.has(v)).map((v) => ({ v, t: v })) },
    { key: 'spk', t: 'Speakers', face: true, opts: spk.map((v) => ({ v, t: P[v] })) },
  ].filter((g) => g.opts.length)
  // the board's starter paths, kept only when every value they filter on exists
  const paths = PATHS.filter((x) => (x.f.topics || []).every((t) => tc.has(t)) && (x.f.aud || []).every((a) => ac.has(a)))
  return { S, P, PI, E, G, paths, feat }
})

const platsOf = (s: Show) => [['Spotify', s.links?.spotify], ['Apple Podcasts', s.links?.apple], ['YouTube', s.links?.youtube]].filter((x) => x[1]).map((x) => ({ t: x[0] as string, href: x[1] as string }))
const showCard = (s: Awaited<ReturnType<typeof getShows>>[number], n: number) => ({ name: s.name, href: s.href, bg: s.bg, fg: s.fg, art: s.art, noArt: !s.art, count: `${n} episodes` })
const epRow = (e: Episode, sh: Show, SP?: Map<number, PersonCard>) => ({
  title: e.title, n: e.number ? String(e.number).padStart(3, '0') : '', date: fmtLong(e.published), len: lenOf(e.duration), href: `/podcasts/${sh.slug}/${e.slug}`, ep: toEp(e, SP, url(sh.artwork, 'card')),
  label: e.number ? `EP ${String(e.number).padStart(3, '0')}` : 'Episode', sum: firstSentence(e.summary),
  meta: `${sh.name}${e.number ? ` · EP ${String(e.number).padStart(3, '0')}` : ''} · ${fmtLong(e.published)}`,
})

export const getShow = cache(async (slug: string) => {
  const [shows, eps, SP] = await Promise.all([getShows(), getEpisodes(), getSpeakers()])
  const s = shows.find((x) => x.slug === slug)
  if (!s) return null
  const mine = eps.filter((e) => (e.show as Show).slug === slug)
  const count = (k: string) => eps.filter((e) => (e.show as Show).slug === k).length
  const first = mine[mine.length - 1]
  return {
    show: { name: s.name, bg: s.bg, fg: s.fg, art: url(s.raw.artwork as Media, 'wide') || s.art, noArt: !s.art, sched: cleanSched(s.raw.schedule), tag: firstSentence(s.raw.tagline) },
    plats: platsOf(s.raw), since: first?.published ? String(new Date(first.published).getUTCFullYear()) : '',
    hosts: withLabel(peopleOf(SP, s.raw.hosts), ids(s.raw.hosts)),
    guests: String(new Set(mine.flatMap((e) => ids(e.speakers)).filter((i) => !ids(s.raw.hosts).includes(i))).size),
    eps: mine.map((e) => epRow(e, s.raw, SP)),
    shows: shows.filter((x) => x.slug !== slug).slice(0, 4).map((x) => showCard(x, count(x.slug))),
  }
})

/** YouTube id from any watch/share/embed/shorts/live URL. */
const ytId = (u?: string | null) => { const m = (u || '').match(/(?:youtu\.be\/|[?&]v=|\/(?:embed|shorts|live)\/)([\w-]{11})/); return m ? m[1] : '' }
/** Poster frame for the click-to-load embed: the HD thumbnail when YouTube has one, else the always-present HQ one. */
const ytPoster = async (id: string) => {
  if (!id) return ''
  const hd = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  try { const r = await fetch(hd, { method: 'HEAD', next: { revalidate: 86400 } }); if (r.ok) return hd } catch {}
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

export const getEpisodePage = cache(async (showSlug: string, slug: string) => {
  const [shows, eps, SP] = await Promise.all([getShows(), getEpisodes(), getSpeakers()])
  const s = shows.find((x) => x.slug === showSlug)
  const e = eps.find((x) => x.slug === slug && (x.show as Show).slug === showSlug)
  if (!s || !e) return null
  const mine = eps.filter((x) => (x.show as Show).slug === showSlug)
  const count = (k: string) => eps.filter((x) => (x.show as Show).slug === k).length
  const u = encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://partnerwithalpha.com'}/podcasts/${showSlug}/${slug}`)
  const row = epRow(e, s.raw, SP)
  const yt = ytId(e.video)
  return {
    show: { name: s.name, href: s.href, bg: s.bg, art: url(s.raw.artwork as Media, 'wide') || s.art, sched: cleanSched(s.raw.schedule), tag: firstSentence(s.raw.tagline), count: `${mine.length} episodes` },
    ep: { title: e.title, n: row.n, date: row.date, len: row.len, sum: e.summary || '', video: e.video || '', yt, poster: await ytPoster(yt), player: row.ep },
    plats: platsOf(s.raw),
    people: withLabel(peopleOf(SP, e.speakers), ids(s.raw.hosts)),
    pq: e.pullQuotes?.[0] ? { text: e.pullQuotes[0].text || '', at: e.pullQuotes[0].at || '' } : { text: '', at: '' },
    chapters: (e.chapters || []).map((c) => ({ at: c.at || '0:00', t: c.title || '' })),
    trHtml: html(e.transcript),
    share: { li: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, x: `https://x.com/intent/post?url=${u}&text=${encodeURIComponent(e.title)}`, fb: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    more: mine.filter((x) => x.id !== e.id).slice(0, 4).map((x) => epRow(x, s.raw, SP)),
    shows: shows.filter((x) => x.slug !== showSlug).slice(0, 6).map((x) => showCard(x, count(x.slug))),
  }
})
