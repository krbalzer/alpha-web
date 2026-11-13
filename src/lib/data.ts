import 'server-only'
import config from '@payload-config'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { Brand, Episode, Location, Media, Show, Speaker, Founder } from '@/payload-types'
import type { Ep, NetworkNums } from '@/components/site/SiteProvider'
import type { CtaPick } from '@/components/site/CloserBg'
import sinceAlpha from '@/seed/content/since-alpha.json'
import workContent from '@/seed/content/work.json'

export const db = cache(async () => getPayload({ config: await config }))

const LIVE = { live: { equals: true } }
export const ptr = (n?: number | null) => 'PTR ' + String(n ?? 0).padStart(3, '0')
const m = (x: unknown): Media | null => (x && typeof x === 'object' ? (x as Media) : null)
export const url = (x: unknown, size?: 'card' | 'wide' | 'full') => {
  const me = m(x)
  if (!me) return undefined
  return (size && me.sizes?.[size]?.url) || me.url || undefined
}
/** Posters ingested as AVIF are served as-is (already sized and sharp); anything else gets the 2400 WebP. */
export const posterUrl = (x: unknown) => (m(x)?.mimeType === 'image/avif' ? url(x) : url(x, 'full')) || ''
/** A video Media doc plus its web renditions (set by pnpm ingest:video). */
export const video = (x: unknown) => {
  const me = m(x)
  const v = (me as { variants?: Record<string, unknown> } | null)?.variants || {}
  return { src: me?.url || '', av1: url(v.av1) || '', small: url(v.small) || '', uhd: url(v.uhd) || '' }
}
const srcSet = (x: unknown) => {
  const me = m(x)
  if (!me?.sizes) return undefined
  return (['card', 'wide', 'full'] as const).map((k) => me.sizes?.[k]?.url && `${me.sizes[k]!.url} ${me.sizes[k]!.width}w`).filter(Boolean).join(', ') || undefined
}
export const html = (rt: unknown) => {
  try { return rt ? convertLexicalToHTML({ data: rt as never }) : '' } catch { return '' }
}
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

/** Counts come from live data unless an override is set in the Network global. */
export const getNetwork = cache(async (): Promise<NetworkNums & { address: string }> => {
  const p = await db()
  const [g, brands, locs] = await Promise.all([
    p.findGlobal({ slug: 'network' }),
    p.count({ collection: 'brands', where: LIVE }),
    p.find({ collection: 'locations', where: LIVE, limit: 1000, depth: 0, select: { state: true } }),
  ])
  const states = new Set(locs.docs.map((l) => l.state)).size
  return {
    brands: g.brandsOverride ?? brands.totalDocs,
    locations: g.locationsOverride ?? locs.totalDocs,
    states: g.statesOverride ?? states,
    address: g.address || '',
  }
})

/** Player payload. Pass `faces` (speaker id -> name + photo, see getSpeakers) so the sticky player shows real headshots;
 *  without it, populated speakers fall back to their own headshot, then to initials. */
export const toEp = (e: Episode, faces?: Map<number, { name: string; img?: string }>, art?: string): Ep => {
  const show = (typeof e.show === 'object' ? e.show : null) as Show | null
  const raw = (e.speakers || []) as (Speaker | number)[]
  const speakers = faces
    ? raw.map((s) => faces.get(typeof s === 'object' ? s.id : s)).filter((x): x is { name: string; img?: string } => !!x).map((x) => ({ name: x.name, initials: initials(x.name), img: x.img || '' }))
    : raw.filter((s): s is Speaker => typeof s === 'object').map((s) => ({ name: s.name, initials: initials(s.name), img: url(s.headshot, 'card') || '' }))
  return {
    id: String(e.id), slug: e.slug, href: show?.slug ? `/podcasts/${show.slug}/${e.slug}` : undefined, title: e.title,
    show: show?.name || '', showShort: show?.short || show?.name || '',
    n: e.number ? String(e.number).padStart(3, '0') : undefined,
    audio: e.audioUrl, dur: e.duration || 0, bg: show?.bg || '#1D1B1A', fg: show?.fg || '#FFFFFF', art: art || url(show?.artwork, 'card') || '',
    speakers,
    chapters: (e.chapters || []).map((c) => ({ at: c.at || '0:00', title: c.title || '' })),
  }
}

export const getLatestEpisode = cache(async (): Promise<Ep | null> => {
  const p = await db()
  const r = await p.find({ collection: 'episodes', where: LIVE, sort: '-published', limit: 1, depth: 2 })
  return r.docs[0] ? toEp(r.docs[0]) : null
})

export const getCtaImages = cache(async (): Promise<CtaPick[]> => {
  const p = await db()
  const r = await p.find({ collection: 'cta-images', where: { active: { equals: true } }, limit: 100, depth: 2 })
  return r.docs.flatMap((d) => {
    const src = url(d.image, 'full')
    if (!src) return []
    const loc = (typeof d.location === 'object' ? d.location : null) as Location | null
    const b = (loc && typeof loc.brand === 'object' ? loc.brand : null) as Brand | null
    return [{ src, srcSet: srcSet(d.image), soft: !!d.soften, brand: b?.slug, ptr: b ? ptr(b.ptr) : undefined, name: loc?.name || b?.name, city: loc ? `${loc.city}, ${loc.state}` : undefined }]
  })
})

const fmtSince = (d?: string | null) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : '')

/* ---------- Treatments (collection `treatments`, seeded from the Master Services List) ---------- */
import { TREATMENT_CATEGORIES } from '@/collections/treatments'
export type TxGroup = { cat: string; items: { name: string; where: string }[] }
export const getTreatments = cache(async () => (await (await db()).find({ collection: 'treatments', where: LIVE, limit: 300, depth: 0, sort: 'order' })).docs)
const idOf = (x: unknown) => (typeof x === 'object' && x ? (x as { id: number }).id : (x as number))
/** What a brand (or one of its locations) offers. A treatment "only at" some of the brand's locations shows on those alone; on the brand page it names them. */
export function treatmentsFor(all: Awaited<ReturnType<typeof getTreatments>>, brandId: number, brandLocs: { id: number; city: string; name?: string | null }[], locId?: number): TxGroup[] {
  const ids = new Set(brandLocs.map((l) => l.id))
  const out: Record<string, TxGroup['items']> = {}
  for (const t of all) {
    if (!(t.brands || []).map(idOf).includes(brandId)) continue
    const only = (t.locations || []).map(idOf).filter((i) => ids.has(i))
    if (locId != null && only.length && !only.includes(locId)) continue
    const where = locId == null && only.length && only.length < ids.size ? brandLocs.filter((l) => only.includes(l.id)).map((l) => l.name || l.city).join(', ') : ''
    ;(out[t.category] ||= []).push({ name: t.name, where })
  }
  return TREATMENT_CATEGORIES.filter((c) => out[c]).map((c) => ({ cat: c, items: out[c] }))
}

/** Shape the Brand template reads. Mirrors the design board's data object so the board logic ports unchanged. */
export const getBrand = cache(async (slug: string) => {
  const p = await db()
  const r = await p.find({ collection: 'brands', where: { and: [{ slug: { equals: slug } }, LIVE] }, limit: 1, depth: 2 })
  const b = r.docs[0]
  if (!b) return null
  const locs = await p.find({ collection: 'locations', where: { and: [{ brand: { equals: b.id } }, LIVE] }, limit: 50, depth: 1, sort: ['order', 'createdAt'] })
  const fs = ((b.founders || []) as (Founder | string)[]).filter((x): x is Founder => typeof x === 'object' && x.status !== 'former')
  const f = fs[0] || ((b.founders || []) as (Founder | string)[]).find((x): x is Founder => typeof x === 'object')
  const est = b.established ? String(b.established) : ''
  return {
    id: String(b.id), slug: b.slug,
    n: String(b.ptr).padStart(3, '0'), ptr: ptr(b.ptr), name: b.name, short: b.short || b.name, story: (b.short || b.name).replace(/^the\s+/i, ''),
    book: b.website || locs.docs.find((l) => l.bookingUrl)?.bookingUrl || '',
    since: fmtSince(b.since), est,
    founder: fs.length > 1 ? fs.map((x) => x.name).join(' and ') : f?.name || '', cred: fs.length > 1 ? '' : f?.credentials || '', founderSlug: f?.slug || '',
    /** One block per active founder on the brand page; co-founders each get their own. */
    founders: (fs.length ? fs : f ? [f] : []).map((x, i, all) => ({
      name: x.name, cred: x.credentials || '', slug: x.slug, href: `/founders/${x.slug}`, html: html(x.bio),
      img: url(x.headshot, 'wide') || url(x.portrait, 'wide') || '', k: i ? '' : all.length > 1 ? 'The Founders' : 'The Founder', cls: 'wrap founder' + (i ? ' founder_next' : ''),
    })),
    founderImg: url(f?.headshot, 'wide') || url(f?.portrait, 'wide') || '',
    founderHtml: html(f?.bio),
    services: (b.services || []) as string[],
    treatments: treatmentsFor(await getTreatments(), b.id, locs.docs),
    states: [...new Set(locs.docs.map((l) => l.state))],
    intro: b.intro || '',
    practiceEyebrow: b.practice?.eyebrow || 'The practice',
    practiceHeadline: b.practice?.headline || '',
    practiceHtml: html(b.practice?.body),
    practiceImg: url(b.practice?.image, 'wide') || '',
    insideTitle: b.insideTitle || `A day at ${b.short || b.name}`,
    insideWhere: `Inside ${b.short || b.name} / ` + (locs.docs.length === 1 ? `${locs.docs[0].city}, ${locs.docs[0].state}` : `${locs.docs.length} locations`),
    inside: (b.inside || []).map((x) => { const me = m(x.image); return { src: url(me, 'wide') || '', w: Number(me?.width) || 4, h: Number(me?.height) || 3, caption: x.caption || '' } }).filter((x) => x.src),
    filmPoster: posterUrl(b.film?.poster),
    filmUrl: b.film?.url || '',
    film: video(b.film?.video),
    filmCaption: b.film?.caption || '',
    stats: (b.stats || []).map((s) => ({ k: s.kicker || '', n: s.value || '', l: s.label || '', rows: (s.rows || []).map((r) => ({ k: r.k || '', v: r.v || '' })) })),
    quote: b.quote?.text || '',
    whyHeadline: b.why?.headline ? `\u201C${b.why.headline.replace(/^["\u201C]|["\u201D]$/g, '')}\u201D` : '', // verbatim, so always in quote marks
    whyHtml: html(b.why?.body),
    whyImg: url(b.why?.image, 'wide') || '',
    heroVideo: url(b.heroVideo) || '',
    hero: video(b.heroVideo),
    heroPoster: posterUrl(b.heroPoster),
    logo: url(b.logo) || '',
    tone: b.tone || '',
    seo: { title: b.seo?.title || `${b.name} / Alpha partner`, description: b.seo?.description || b.intro || '' },
    locations: locs.docs.map((l, i) => ({
      city: l.city, st: l.state, name: l.name || '', a1: l.address1 || '', a2: l.address2 || `${l.city}, ${l.state} ${l.zip || ''}`.trim(),
      lng: l.lng, lat: l.lat, ang: ((l.mapBearing || 0) * Math.PI) / 180,
      hmax: 16 + ((i * 7) % 20), seed: 11 + i * 18,
      tone: 'linear-gradient(160deg,#8C7F6B,#4D463C)', img: url(l.photo, 'card') || '', slug: l.slug, streets: [] as string[],
    })),
  }
})
export type BrandData = NonNullable<Awaited<ReturnType<typeof getBrand>>>

export const getBrandSlugs = async () => {
  const p = await db()
  const r = await p.find({ collection: 'brands', where: LIVE, limit: 500, depth: 0, select: { slug: true } })
  return r.docs.map((d) => d.slug)
}

/** Every live brand in join order, for the brand switcher in the crumb. */
export const getBrandIndex = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'brands', where: LIVE, limit: 500, depth: 0, sort: 'ptr', select: { slug: true, name: true, ptr: true } })
  return r.docs.map((d) => ({ slug: d.slug, name: d.name, n: String(d.ptr).padStart(3, '0') }))
})
export type BrandIndex = Awaited<ReturnType<typeof getBrandIndex>>

/* ---------- Since Alpha: partnership timeline + rebrand carousel (src/seed/content/since-alpha.json) ---------- */
const SA_BLOB = 'https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/since-alpha/'
type SAItem = { kind: 'ann' | 'video' | 'image' | 'palette'; src?: string; poster?: string; w?: number; h?: number; caption?: string; bg?: string; silent?: boolean; colors?: [string, string, boolean?][] }
type SAEntry = {
  quote?: { text: string; source: string }
  gap?: { after: number; label: string }
  milestones: { date: string; title: string; detail: string; rebrand?: boolean; link?: { href: string; label: string } }[]
  thenNow?: { note: string; rows: { label: string; then: string; now: string }[] }
  rebrand?: { noun?: string; eyebrow: string; headline: string; body: string; msm?: { show: string; n: number }; site?: string; items: SAItem[]; ledger: [string, string][] }
}
export const getSinceAlpha = cache(async (slug: string, since?: string) => {
  const e = (sinceAlpha as unknown as Record<string, SAEntry>)[slug]
  if (!e || !e.milestones?.length) return null
  let msm: { href: string; label: string } | null = null
  if (e.rebrand?.msm) {
    const p = await db()
    // MSM episodes carry their number in the slug prefix ("079-..."); `number` is empty in prod
    const pre = String(e.rebrand.msm.n).padStart(3, '0') + '-'
    const r = await p.find({ collection: 'episodes', where: { and: [{ slug: { like: pre } }, { 'show.slug': { equals: 'med-spa-marketing-group-chat' } }, LIVE] }, limit: 10, depth: 1 })
    const ep = r.docs.find((d) => d.slug?.startsWith(pre))
    const show = ep && typeof ep.show === 'object' ? (ep.show as Show) : null
    if (ep && show) msm = { href: `/podcasts/${show.slug}/${ep.slug}`, label: `MSM ${String(e.rebrand.msm.n).padStart(3, '0')} / ${Math.round((ep.duration || 0) / 60)} min` }
  }
  const abs = (f?: string) => (f ? (/^https?:/.test(f) ? f : SA_BLOB + f) : '')
  return {
    since: since || '',
    work: WORK[slug] ? `/work/${slug}` : null,
    date: WORK[slug]?.date || '',
    quote: e.quote || null,
    gap: e.gap || null,
    milestones: e.milestones,
    thenNow: e.thenNow || null,
    rebrand: e.rebrand
      ? { ...e.rebrand, msm, items: e.rebrand.items.map((i) => ({ ...i, src: abs(i.src), poster: abs(i.poster) })) }
      : null,
  }
})
export type SinceAlphaData = NonNullable<Awaited<ReturnType<typeof getSinceAlpha>>>

/* ---------- Work: rebrand case studies at /work/[slug] (src/seed/content/work.json) ---------- */
const BLOB = 'https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/'
const blob = (f?: string) => (f ? (/^https?:/.test(f) ? f : BLOB + f) : '')
type WorkTile = { kind: 'image' | 'video' | 'palette' | 'quote'; label: string; src?: string; poster?: string; fit?: 'cover' | 'contain'; bg?: string; fg?: string; colors?: [string, string, boolean?][]; text?: string; source?: string }
type WorkEntry = {
  date: string; headline: string; intro: string; kept: string[]; changed: string[]
  /** What the work was, when it wasn't a rebrand: kind for the eyebrow ('Shoot + website'), noun for labels ('rebuild'). */
  kind?: string; noun?: string
  board: { layout: 'square' | 'wide'; line: string; tiles: WorkTile[] }
  shoot: { where: string; headline: string; items: SAItem[] }
  site: { url: string; desktop: string; mobile: string; ledger: [string, string][] }
  msm?: { n: number; body: string }
}
const WORK = Object.fromEntries(Object.entries(workContent).filter(([k]) => !k.startsWith('_'))) as unknown as Record<string, WorkEntry>
export const getWorkSlugs = async () => Object.keys(WORK)

/** MSM episodes carry their number in the slug prefix ("079-..."). */
const msmEpisode = async (n: number) => {
  const p = await db()
  const pre = String(n).padStart(3, '0') + '-'
  const r = await p.find({ collection: 'episodes', where: { and: [{ slug: { like: pre } }, { 'show.slug': { equals: 'med-spa-marketing-group-chat' } }, LIVE] }, limit: 10, depth: 2 })
  return r.docs.find((d) => d.slug?.startsWith(pre)) || null
}

export const getWork = cache(async (slug: string) => {
  const w = WORK[slug]
  if (!w) return null
  const p = await db()
  const b = (await p.find({ collection: 'brands', where: { and: [{ slug: { equals: slug } }, LIVE] }, limit: 1, depth: 0, select: { name: true, slug: true, ptr: true } })).docs[0]
  if (!b) return null
  const e = w.msm ? await msmEpisode(w.msm.n) : null
  const q = e?.pullQuotes?.[0]
  const keys = Object.keys(WORK), nx = keys[(keys.indexOf(slug) + 1) % keys.length]
  const nb = nx !== slug ? (await p.find({ collection: 'brands', where: { slug: { equals: nx } }, limit: 1, depth: 0, select: { name: true } })).docs[0] : null
  return {
    ...w,
    brand: { name: WORK_NAMES[slug] || b.name, slug: b.slug, ptr: String(b.ptr ?? 0).padStart(3, '0') },
    board: { ...w.board, tiles: w.board.tiles.map((t) => ({ ...t, src: blob(t.src), poster: blob(t.poster) })) },
    shoot: { ...w.shoot, items: w.shoot.items.map((i) => ({ ...i, src: blob(i.src), poster: blob(i.poster) })) },
    site: { ...w.site, desktop: blob(w.site.desktop), mobile: blob(w.site.mobile) },
    msm: e && w.msm ? { n: String(w.msm.n).padStart(3, '0'), body: w.msm.body, ep: toEp(e), quote: q?.text ? { text: q.text, at: q.at || '' } : null } : null,
    next: nb ? { slug: nx, name: WORK_NAMES[nx] || nb.name, date: WORK[nx].date } : null,
  }
})
/** Display names where the brand record lags the rebrand. */
const WORK_NAMES: Record<string, string> = { 'holden-timeless-beauty': 'HTB Aesthetics', 'the-laser-center-of-marin': 'The Laser Center of Marin' }
export type WorkData = NonNullable<Awaited<ReturnType<typeof getWork>>>
