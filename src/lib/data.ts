import 'server-only'
import config from '@payload-config'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { Brand, Episode, Location, Media, Show, Speaker, Founder } from '@/payload-types'
import type { Ep, NetworkNums } from '@/components/site/SiteProvider'
import type { CtaPick } from '@/components/site/CloserBg'

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

export const toEp = (e: Episode): Ep => {
  const show = (typeof e.show === 'object' ? e.show : null) as Show | null
  const spk = ((e.speakers || []) as (Speaker | string)[]).filter((s): s is Speaker => typeof s === 'object')
  return {
    id: String(e.id), slug: e.slug, title: e.title,
    show: show?.name || '', showShort: show?.short || show?.name || '',
    n: e.number ? String(e.number).padStart(3, '0') : undefined,
    audio: e.audioUrl, dur: e.duration || 0, bg: show?.bg || '#1D1B1A', fg: show?.fg || '#FFFFFF',
    speakers: spk.map((s) => ({ name: s.name, initials: initials(s.name) })),
    chapters: (e.chapters || []).map((c) => ({ at: c.at || '0:00', title: c.title || '' })),
  }
}

export const getLatestEpisode = cache(async (): Promise<Ep | null> => {
  const p = await db()
  const r = await p.find({ collection: 'episodes', where: LIVE, sort: '-published', limit: 1, depth: 1 })
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
    return [{ src, srcSet: srcSet(d.image), soft: !!d.soften, brand: b?.slug, ptr: b ? ptr(b.ptr) : undefined, name: b?.name, city: loc ? `${loc.city}, ${loc.state}` : undefined }]
  })
})

const fmtSince = (d?: string | null) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : '')

/** Shape the Brand template reads. Mirrors the design board's data object so the board logic ports unchanged. */
export const getBrand = cache(async (slug: string) => {
  const p = await db()
  const r = await p.find({ collection: 'brands', where: { and: [{ slug: { equals: slug } }, LIVE] }, limit: 1, depth: 2 })
  const b = r.docs[0]
  if (!b) return null
  const locs = await p.find({ collection: 'locations', where: { and: [{ brand: { equals: b.id } }, LIVE] }, limit: 50, depth: 1, sort: 'createdAt' })
  const f = ((b.founders || []) as (Founder | string)[]).find((x): x is Founder => typeof x === 'object')
  const est = b.established ? String(b.established) : ''
  return {
    id: String(b.id), slug: b.slug,
    n: String(b.ptr).padStart(3, '0'), ptr: ptr(b.ptr), name: b.name, short: b.short || b.name,
    book: b.website || locs.docs.find((l) => l.bookingUrl)?.bookingUrl || '',
    since: fmtSince(b.since), est,
    founder: f?.name || '', cred: f?.credentials || '', founderSlug: f?.slug || '',
    founderImg: url(f?.headshot, 'card') || url(f?.portrait, 'card') || '',
    founderHtml: html(f?.bio),
    services: (b.services || []) as string[],
    states: [...new Set(locs.docs.map((l) => l.state))],
    intro: b.intro || '',
    practiceEyebrow: b.practice?.eyebrow || 'The practice',
    practiceHeadline: b.practice?.headline || '',
    practiceHtml: html(b.practice?.body),
    practiceImg: url(b.practice?.image, 'wide') || '',
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
      city: l.city, st: l.state, a1: l.address1 || '', a2: l.address2 || `${l.city}, ${l.state} ${l.zip || ''}`.trim(),
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
