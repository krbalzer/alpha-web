/**
 * People on episodes newer than the Webflow export (src/seed/webflow/podcast-people.json), taken from the current
 * Webflow site's "Podcast people" refs. Runs in prebuild. Adds a speaker only when missing (photo from
 * src/seed/media/speakers), and sets an episode's people only when it has none, so CMS edits always win.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'

const NEW: { slug: string; name: string; bio: string; photo: string }[] = [
  {
    slug: 'kelly-richardson', name: 'Kelly Richardson', photo: 'kelly-richardson.png',
    bio: 'Kelly Richardson is a licensed psychotherapist with more than 28 years of experience and a private practice in Folsom, California. She specializes in working with teenagers and young adults, helping them navigate anxiety, pressure, relationships, identity, and the challenges of growing up. Kelly also spent 15 years writing the Teen Talk advice column and now shares honest, thoughtful perspectives on parenting and mental health through her blog, TheraMom.',
  },
]

/** episode slug prefix (show + number) -> speaker slugs, in order */
const EPISODES: { show: string; prefix: string; people: string[] }[] = [
  { show: 'dear-tiffany', prefix: '024-', people: ['tiffany-ellison', 'kelly-richardson'] },
  { show: 'med-spa-marketing-group-chat', prefix: '090-', people: ['kevin-balzer', 'mitchell-outka', 'andrea-beck'] },
  { show: 'operation-med-spa', prefix: '044-', people: ['janelle-cordtz', 'rebekah-brannon'] },
]

export async function seedEpisodePeople(p: Payload, opts: { photos: boolean }) {
  for (const s of NEW) {
    const have = (await p.find({ collection: 'speakers', where: { slug: { equals: s.slug } }, limit: 1, depth: 0 })).docs[0] as { id: number; headshot?: unknown } | undefined
    if (have && have.headshot) continue
    let headshot: number | undefined
    const file = path.resolve(process.cwd(), 'src/seed/media/speakers', s.photo)
    if (opts.photos && fs.existsSync(file)) {
      const data = fs.readFileSync(file)
      headshot = (await p.create({ collection: 'media', data: { alt: s.name }, file: { data, mimetype: s.photo.endsWith('.png') ? 'image/png' : 'image/jpeg', name: `speaker-${s.photo}`, size: data.length } })).id as number
    }
    if (have) { if (headshot) await p.update({ collection: 'speakers', id: have.id, data: { headshot } as never }) }
    else await p.create({ collection: 'speakers', data: { name: s.name, slug: s.slug, bio: s.bio, ...(headshot ? { headshot } : {}) } as never })
  }
  const shows = new Map(((await p.find({ collection: 'shows', limit: 100, depth: 0 })).docs as { id: number; slug: string }[]).map((s) => [s.slug, s.id]))
  let n = 0
  for (const e of EPISODES) {
    const ep = (await p.find({ collection: 'episodes', where: { and: [{ show: { equals: shows.get(e.show) } }, { slug: { like: e.prefix } }] }, limit: 5, depth: 0 })).docs
      .find((d) => String(d.slug).startsWith(e.prefix)) as { id: number; speakers?: unknown[] | null } | undefined
    if (!ep || (ep.speakers || []).length) continue
    const ids: number[] = []
    for (const slug of e.people) {
      const s = (await p.find({ collection: 'speakers', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
      if (s) ids.push(s.id as number)
    }
    if (ids.length) { await p.update({ collection: 'episodes', id: ep.id, data: { speakers: ids } as never }); n++ }
  }
  p.logger.info(`episode people: ${n} episodes linked`)
}
