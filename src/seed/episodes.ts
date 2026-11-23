/**
 * Episodes import from each show's RSS feed (Libsyn). Runs in prebuild on every deploy, so new episodes appear without anyone touching the CMS.
 * Feed URL: the show's "Libsyn RSS URL", or resolved once from its Apple Podcasts link and saved back.
 * Upserts by RSS guid. Hand edits (chapters, guests, tags, quotes, transcript) are never overwritten; only feed fields refresh.
 *
 *   pnpm import:episodes            # standalone
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'

type Item = { guid: string; title: string; published: string; audioUrl: string; duration: number; number: number | null; summary: string }

const text = (x: string) =>
  x.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
const tag = (item: string, name: string) => { const m = item.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>')); return m ? text(m[1]) : '' }
const slugify = (t: string) => t.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70).replace(/-$/, '')
const secs = (d: string) => (d.includes(':') ? d.split(':').reduce((a, n) => a * 60 + Number(n || 0), 0) : Number(d) || 0)

export function parseFeed(xml: string): Item[] {
  return (xml.match(/<item>[\s\S]*?<\/item>/g) || []).map((it) => {
    const enc = it.match(/<enclosure[^>]*url="([^"]+)"/)
    const ep = tag(it, 'itunes:episode')
    return {
      guid: tag(it, 'guid'), title: tag(it, 'itunes:title') || tag(it, 'title'), published: new Date(tag(it, 'pubDate')).toISOString(),
      audioUrl: enc ? enc[1].replace(/&amp;/g, '&') : '', duration: secs(tag(it, 'itunes:duration')), number: ep ? Number(ep) : null,
      summary: (tag(it, 'itunes:summary') || tag(it, 'description')).slice(0, 1200),
    }
  }).filter((i) => i.guid && i.audioUrl && i.title)
}

async function feedFor(p: Payload, show: { id: number; rss?: string | null; links?: { apple?: string | null } | null; name: string }) {
  if (show.rss) return show.rss
  const id = show.links?.apple?.match(/id(\d+)/)?.[1]
  if (!id) return null
  const r = await fetch(`https://itunes.apple.com/lookup?id=${id}`, { signal: AbortSignal.timeout(10000) })
  const url = ((await r.json()) as { results?: { feedUrl?: string }[] }).results?.[0]?.feedUrl
  if (url) await p.update({ collection: 'shows', id: show.id, data: { rss: url } })
  return url || null
}


/** Shows added after the Webflow import. Created once (by slug); after that only the artwork syncs (new filename = new art). */
const NEW_SHOWS = [{
  slug: 'white-coat-entrepreneur', name: 'The White Coat Entrepreneur', short: 'WCE', order: 7, bg: '#1F2433', fg: '#FFFFFF',
  art: 'wce-art-2.jpg', rss: 'https://rss.libsyn.com/shows/634274/destinations/5602059.xml',
  apple: 'https://podcasts.apple.com/us/podcast/the-white-coat-entrepreneur/id1491976901',
  tagline: "Physicians have been sold out by the system, and there's no one teaching doctors the business of medicine. In this podcast, Dr. Edwin Williams helps physician entrepreneurs learn to think like a small business person, develop an organic culture, understand the importance of planning, and acquire with purpose.",
}]

async function upload(p: Payload, name: string, alt: string) {
  const hit = (await p.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1, depth: 0 })).docs[0]
  if (hit) return hit.id as number
  const file = path.resolve(process.cwd(), 'src/seed/media/podcasts', name)
  if (!fs.existsSync(file)) return undefined
  const data = fs.readFileSync(file)
  return (await p.create({ collection: 'media', data: { alt }, file: { data, mimetype: 'image/jpeg', name, size: data.length } })).id as number
}

async function ensureShows(p: Payload) {
  for (const x of NEW_SHOWS) {
    const have = (await p.find({ collection: 'shows', where: { slug: { equals: x.slug } }, limit: 1, depth: 1 })).docs[0] as { id: number; artwork?: { filename?: string } | null } | undefined
    if (have) {
      if (have.artwork?.filename !== x.art) {
        const artwork = await upload(p, x.art, x.name)
        if (artwork) { await p.update({ collection: 'shows', id: have.id, data: { artwork } as never }); p.logger.info(`episodes: new artwork for ${x.name}`) }
      }
      continue
    }
    const artwork = await upload(p, x.art, x.name)
    await p.create({ collection: 'shows', data: {
      name: x.name, short: x.short, slug: x.slug, order: x.order, bg: x.bg, fg: x.fg, tagline: x.tagline, rss: x.rss,
      links: { apple: x.apple }, artwork, featured: false, live: true,
    } as never })
    p.logger.info(`episodes: created show ${x.name}`)
  }
}

export async function importEpisodes(p: Payload) {
  await ensureShows(p)
  const shows = (await p.find({ collection: 'shows', limit: 50, depth: 0 })).docs
  let added = 0, updated = 0
  for (const s of shows) {
    try {
      const url = await feedFor(p, s)
      if (!url) { p.logger.info(`episodes: ${s.name}: no feed (add the Libsyn RSS URL or an Apple Podcasts link)`); continue }
      const xml = await (await fetch(url, { signal: AbortSignal.timeout(15000) })).text()
      const items = parseFeed(xml)
      const have = new Map((await p.find({ collection: 'episodes', where: { show: { equals: s.id } }, limit: 5000, depth: 0, select: { guid: true } })).docs.map((d) => [d.guid, d.id]))
      for (const i of items) {
        const data = { title: i.title, show: s.id, published: i.published, audioUrl: i.audioUrl, duration: i.duration, number: i.number, guid: i.guid }
        const id = have.get(i.guid)
        if (id) { if (process.env.REFRESH_EPISODES === '1') { await p.update({ collection: 'episodes', id, data }); updated++ } continue }
        else { await p.create({ collection: 'episodes', data: { ...data, summary: i.summary, live: true, slug: `${slugify(i.title)}-${i.guid.replace(/[^a-z0-9]/gi, '').slice(-6).toLowerCase()}` } }); added++ }
      }
      p.logger.info(`episodes: ${s.name}: ${items.length} in feed`)
    } catch (e) {
      p.logger.warn(`episodes: ${s.name}: skipped (${(e as Error).message})`)
    }
  }
  p.logger.info(`episodes: ${added} added, ${updated} refreshed`)
}
