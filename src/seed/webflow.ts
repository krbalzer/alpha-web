/**
 * One-time import of the current partnerwithalpha.com Webflow CMS (src/seed/webflow/export.json).
 * Run by prebuild with SEED_ON_EMPTY=webflow: wipes the content collections, then loads
 * partners, locations, founders, CTA images, departments, team, shows and newswire.
 * Images are fetched from the Webflow CDN and re-uploaded to Blob. Copy is imported verbatim.
 */
import { JSDOM } from 'jsdom'
import type { Payload } from 'payload'
import data from './webflow/export.json'

type Node = Record<string, unknown>
const text = (t: string, format = 0): Node => ({ type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 })
const block = (type: string, children: Node[], extra: Node = {}): Node => ({ type, children, direction: 'ltr', format: '', indent: 0, version: 1, ...extra })

/** Minimal HTML → Lexical: paragraphs, headings, lists, bold/italic, links (kept as text). */
export function htmlToLexical(html?: string | null) {
  if (!html) return undefined
  const doc = new JSDOM(`<body>${html}</body>`).window.document
  const inline = (el: ChildNode, fmt = 0): Node[] => {
    if (el.nodeType === 3) { const t = (el.textContent || '').replace(/\s+/g, ' '); return t ? [text(t, fmt)] : [] }
    if (el.nodeType !== 1) return []
    const tag = (el as Element).tagName.toLowerCase()
    if (tag === 'br') return [{ type: 'linebreak', version: 1 }]
    const f = fmt | (tag === 'strong' || tag === 'b' ? 1 : 0) | (tag === 'em' || tag === 'i' ? 2 : 0)
    return [...el.childNodes].flatMap((c) => inline(c, f))
  }
  const out: Node[] = []
  for (const el of [...doc.body.children]) {
    const tag = el.tagName.toLowerCase()
    if (/^h[1-6]$/.test(tag)) out.push(block('heading', inline(el), { tag: tag === 'h1' ? 'h2' : tag }))
    else if (tag === 'ul' || tag === 'ol') out.push(block('list', [...el.children].map((li, i) => block('listitem', inline(li), { value: i + 1 })), { listType: tag === 'ul' ? 'bullet' : 'number', start: 1, tag }))
    else if (tag === 'figure' || tag === 'img' || tag === 'div' && !el.textContent?.trim()) continue
    else { const kids = inline(el); if (kids.length) out.push(block('paragraph', kids, { textFormat: 0 })) }
  }
  if (!out.length) return undefined
  return { root: block('root', out) } as never
}
const plain = (html?: string | null) => (html ? new JSDOM(`<body>${html}</body>`).window.document.body.textContent?.replace(/\s+/g, ' ').trim() || '' : '')
const firstPara = (html?: string | null) => {
  if (!html) return ''
  const p = new JSDOM(`<body>${html}</body>`).window.document.querySelector('p')
  return (p?.textContent || '').replace(/\s+/g, ' ').trim()
}

/** Webflow sometimes stores lat and lng swapped; the US latitude is the positive one. */
const coords = (a?: string | null, b?: string | null) => {
  const x = Number(a), y = Number(b)
  return x > 0 ? { lat: x, lng: y } : { lat: y, lng: x }
}
const monthYear = (s?: string | null) => {
  const d = s ? new Date(`1 ${s}`) : null
  return d && !isNaN(+d) ? d.toISOString() : undefined
}
const hsla = (c?: string | null) => c || '#1D1B1A'
const lightness = (c?: string | null) => {
  if (!c) return 0
  const h = c.match(/hsla?\([^,]+,[^,]+,\s*([\d.]+)%/)
  if (h) return Number(h[1])
  const m = c.match(/^#([0-9a-f]{6})$/i)
  if (!m) return 0
  const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255
  return ((Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255) * 100
}

/* Portfolio facts that are not in Webflow (confirmed by Kevin, Nov 2026) */
const BUSINESS_FOUNDERS = new Set(['6799087d6cc7f250af0020cf', '69431c039139201d1daf7e59']) // Flawless (012), Prive co-founder (014)
const UNANNOUNCED = new Set([1]) // Esthetics Center: set up first, never formally launched
const DE_NOVO = new Set(['6697007ce94ab14a2d563b6c']) // Holden Timeless Beauty, San Diego (a draft in Webflow: imported unpublished)
const TUCK_INS: { ptr: number; formerName: string; kind: 'location' | 'merged'; city: string; state: string; slug: string; draft?: boolean; loc?: { city: string; lat: number; lng: number; name: string } }[] = [
  { ptr: 3, formerName: 'Blossom Medical', kind: 'location', city: 'Winchester', state: 'VA', slug: 'blossom-medical', loc: { city: 'Winchester', lat: 39.1857, lng: -78.1633, name: 'Refined at Blossom' } },
  { ptr: 12, formerName: 'Bair Medical', kind: 'location', city: 'Albuquerque', state: 'NM', slug: 'bair-medical', draft: true }, // becomes a new Flawless location (Dec 2026); unpublished until then
  { ptr: 8, formerName: 'Seaside', kind: 'merged', city: 'Marblehead', state: 'MA', slug: 'seaside' },
  { ptr: 8, formerName: 'Demma', kind: 'location', city: 'Brighton', state: 'MA', slug: 'demma', loc: { city: 'Brighton', lat: 42.3484, lng: -71.1523, name: 'Brighton' } },
]

const STATE_NAMES: Record<string, string> = { ohio: 'OH', 'new hampshire': 'NH', florida: 'FL', massachusetts: 'MA', virginia: 'VA', california: 'CA', 'new york': 'NY', colorado: 'CO', kentucky: 'KY', delaware: 'DE', 'new mexico': 'NM', 'north carolina': 'NC' }
const stateCode = (s: string) => STATE_NAMES[s.trim().toLowerCase()] || s.trim().slice(0, 2).toUpperCase()

export async function importWebflow(p: Payload) {
  const log = (m: string) => p.logger.info(`webflow import: ${m}`)
  for (const c of ['cta-images', 'episodes', 'shows', 'speakers', 'tuck-ins', 'locations', 'brands', 'founders', 'team', 'departments', 'articles', 'media'] as const) {
    await p.delete({ collection: c, where: { id: { exists: true } } })
  }

  // images: fetch once per URL, 6 at a time
  const cache = new Map<string, Promise<number | string | undefined>>()
  let active = 0
  const queue: (() => void)[] = []
  const slot = () => new Promise<void>((r) => (active < 6 ? (active++, r()) : queue.push(() => (active++, r()))))
  const done = () => { active--; queue.shift()?.() }
  const media = (url?: string | null, alt = '') => {
    if (!url) return Promise.resolve(undefined)
    if (!cache.has(url)) cache.set(url, (async () => {
      await slot()
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`${res.status}`)
        const buf = Buffer.from(await res.arrayBuffer())
        const name = decodeURIComponent(url.split('/').pop() || 'image').replace(/^[0-9a-f]{24}_/, '').replace(/[^\w.-]+/g, '-').slice(-80)
        const doc = await p.create({ collection: 'media', data: { alt: alt || name }, file: { data: buf, mimetype: res.headers.get('content-type') || 'image/jpeg', name, size: buf.length } })
        return doc.id
      } catch (e) {
        p.logger.warn(`webflow import: image skipped ${url} (${(e as Error).message})`)
        return undefined
      } finally { done() }
    })())
    return cache.get(url)!
  }

  // departments
  const SPAN: Record<string, [number, number]> = { 'new-partnerships': [0, 43.75], finance: [33.3, 101], integrations: [37.5, 76.1], hr: [37.5, 101], it: [37.5, 101], marketing: [41, 101], operations: [43.75, 101] }
  const deptId = new Map<string, number | string>()
  for (const d of data.departments) {
    const [start, end] = SPAN[d.slug] || [37.5, 101]
    const doc = await p.create({ collection: 'departments', data: { name: d.name, slug: d.slug, order: Number(d.rank) || 99, line: d.line || '', intro: htmlToLexical(d.blog), timeline: { start, end }, live: true } })
    deptId.set(d.id, doc.id)
  }
  // executives without a department in Webflow (e.g. the CEO) land in Leadership
  if (data.team.some((t) => t.live && !t.dept)) {
    const lead = await p.create({ collection: 'departments', data: { name: 'Leadership', slug: 'leadership', order: 0, line: '', timeline: { start: 0, end: 101 }, live: true } })
    deptId.set('leadership', lead.id)
  }
  log(`${data.departments.length} departments`)

  // team
  let teamN = 0
  await Promise.all(data.team.filter((t) => t.live).map(async (t) => {
    const bio = [t.bio, t.experience].filter(Boolean).join('')
    await p.create({ collection: 'team', data: {
      name: t.name, slug: t.slug, title: t.title || '', department: deptId.get(t.dept || 'leadership') as number,
      order: Number(t.rank) || 99, leader: !!t.exec, headshot: await media(t.headshot, t.name) as number,
      bio: htmlToLexical(bio), linkedin: t.linkedin || undefined, live: true,
    } }).then(() => teamN++).catch((e) => p.logger.warn(`webflow import: team ${t.name} skipped (${e.message})`))
  }))
  log(`${teamN} team members`)

  // founders (KOL)
  const founderId = new Map<string, number | string>()
  await Promise.all(data.kol.filter((k) => k.live).map(async (k) => {
    const doc = await p.create({ collection: 'founders', data: {
      name: k.name, slug: k.slug, credentials: k.cred || undefined, headline: k.title || undefined,
      kind: BUSINESS_FOUNDERS.has(k.id) ? 'business' : 'provider',
      headshot: await media(k.headshot, k.name) as number, portrait: await media(k.portrait, k.name) as number,
      bio: htmlToLexical(k.bio), live: true,
    } })
    founderId.set(k.id, doc.id)
  }))
  log(`${founderId.size} founders`)

  // partners → brands, locations, CTA images
  const quotes = new Map(data.testimonials.map((t) => [t.partner, t]))
  let locN = 0
  for (const b of data.partners.filter((x) => x.live)) {
    const s = b.stats
    const unitsLabel = s.dysportOn ? 'Dysport units / year' : 'Botox units / year'
    const units = s.dysportOn ? s.dysport : s.botox
    const stats = b.hideStats ? [] : [
      { kicker: 'Capacity', value: s.weekly || '', label: 'Weekly appointments', rows: [{ k: 'Providers', v: s.providers || '' }, { k: 'Locations', v: s.locs || '' }].filter((r) => r.v) },
      { kicker: 'Demand', value: s.followers || '', label: 'Social followers', rows: [{ k: 'Markets', v: s.locs || '' }].filter((r) => r.v) },
      { kicker: 'Depth', value: s.syringes || '', label: 'Filler syringes / year', rows: [{ k: 'Skincare items / year', v: s.skincare || '' }, { k: unitsLabel, v: units || '' }].filter((r) => r.v) },
    ].filter((c) => c.value)
    const q = quotes.get(b.id)
    const founders = [b.keyKol, ...b.kol].filter((x, i, a) => x && a.indexOf(x) === i).map((x) => founderId.get(x!)).filter(Boolean)
    const [practiceImg, whyImg, filmPoster, logo] = await Promise.all([media(b.practiceImg, b.name), media(b.whyImg, b.name), media(b.filmPoster, b.name), media(b.logo, b.name)])
    const brand = await p.create({ collection: 'brands', data: {
      name: b.name, short: b.name, ptr: b.ptr, slug: b.slug, live: true, announced: !UNANNOUNCED.has(Number(b.ptr)),
      since: monthYear(b.since), established: Number(b.est) || undefined,
      founders: founders as number[], intro: firstPara(b.story),
      practice: { eyebrow: 'The practice', body: htmlToLexical(b.story), image: practiceImg as number },
      film: { url: b.film ? (b.film.startsWith('http') ? b.film : `https://${b.film}`) : undefined, poster: filmPoster as number },
      why: { image: whyImg as number },
      // Webflow hero images are film stills with the title burned in; leave heroPoster for a clean frame
      stats, logo: logo as number,
      quote: q ? { text: plain(q.copy).replace(/^"|"$/g, ''), source: `${q.author}, partnership announcement (Webflow testimonial)` } : undefined,
    } })
    let first: number | string | undefined
    // flagship (Webflow "main location") first: it is the one the brand hero names
    const mine = data.locations.filter((x) => (x.live || DE_NOVO.has(x.id)) && x.partner === b.id) // de novo builds come in unpublished until they open
    mine.sort((x, y) => Number(y.name === b.main) - Number(x.name === b.main))
    for (const l of mine) {
      const [city, st] = l.name.split(',').map((x) => x.trim())
      const loc = await p.create({ collection: 'locations', data: {
        brand: brand.id, city, state: stateCode(st || l.state || ''), ...coords(l.a, l.b),
        slug: `${b.slug}-${l.slug}`, photo: await media(l.photo, `${b.name}, ${l.name}`) as number, live: !!l.live,
        origin: DE_NOVO.has(l.id) ? 'de-novo' : 'original',
      } })
      first ??= loc.id
      locN++
    }
    for (const t of TUCK_INS.filter((x) => x.ptr === Number(b.ptr))) {
      const loc = t.loc ? await p.create({ collection: 'locations', data: {
        brand: brand.id, city: t.loc.city, state: t.state, lat: t.loc.lat, lng: t.loc.lng, origin: 'tuck-in', formerName: t.formerName,
        slug: `${b.slug}-${t.loc.city.toLowerCase().replace(/\W+/g, '-')}`, live: true,
      } }) : undefined
      if (loc) locN++
      await p.create({ collection: 'tuck-ins', data: { formerName: t.formerName, brand: brand.id, kind: t.kind, location: loc?.id as number, city: t.city, state: t.state, slug: t.slug, live: !t.draft } })
    }
    const cta = await media(b.cta, b.name)
    if (cta) await p.create({ collection: 'cta-images', data: { label: b.name, image: cta as number, location: first as number, active: true } })
  }
  log(`${data.partners.filter((x) => x.live).length} partners, ${locN} locations`)

  // shows
  for (const s of data.shows.filter((x) => x.live)) {
    await p.create({ collection: 'shows', data: {
      name: s.name, short: s.short || s.name, slug: s.slug, order: Number(s.rank) || 99, tagline: s.tagline || undefined,
      schedule: s.every ? `New every ${s.every.toLowerCase()}` : undefined, bg: hsla(s.color), fg: lightness(s.color) > 60 ? '#141414' : '#FFFFFF',
      artwork: await media(s.art, s.name) as number, links: { spotify: s.spotify || undefined, apple: s.apple || undefined, youtube: s.youtube || undefined },
      featured: Number(s.rank) <= 3, live: true,
    } })
  }
  log(`${data.shows.filter((x) => x.live).length} shows`)

  // one stand-in episode so the player and menu have something to play until the Libsyn import lands
  const dt = await p.find({ collection: 'shows', where: { slug: { equals: 'dear-tiffany' } }, limit: 1 })
  if (dt.docs[0]) await p.create({ collection: 'episodes', data: {
    title: 'Player test episode', show: dt.docs[0].id, number: 0, published: new Date().toISOString(),
    audioUrl: '/audio/sample.mp3', duration: 180, guid: 'standin-player-test', slug: 'player-test', live: true,
    chapters: [{ at: '0:00', title: 'Start' }],
  } })

  // newswire
  await Promise.all(data.newswire.filter((n) => n.live).map(async (n) => p.create({ collection: 'articles', data: {
    title: n.title, slug: n.slug, published: n.date || new Date().toISOString(), category: 'Network',
    dek: firstPara(n.body).slice(0, 280), cover: await media(n.cover, n.title) as number, body: htmlToLexical(n.body), live: true,
  } })))
  log(`${data.newswire.filter((n) => n.live).length} newswire articles`)
}
