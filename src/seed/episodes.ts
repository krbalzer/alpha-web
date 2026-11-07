/**
 * Episodes import from each show's RSS feed (Libsyn). Runs in prebuild on every deploy, so new episodes appear without anyone touching the CMS.
 * Feed URL: the show's "Libsyn RSS URL", or resolved once from its Apple Podcasts link and saved back.
 * Upserts by RSS guid. Hand edits (chapters, guests, tags, quotes, transcript) are never overwritten; only feed fields refresh.
 *
 *   pnpm import:episodes            # standalone
 */
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

export async function importEpisodes(p: Payload) {
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
