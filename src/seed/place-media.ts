/**
 * Photography placed by hand-off (Kevin picks, Claude crops), shipped with the repo and applied once.
 * Each placement uploads its file only if a Media item with that filename does not exist yet, so a later
 * hand edit in the CMS is never overwritten by a redeploy. Runs in prebuild.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'

const dir = path.resolve(process.cwd(), 'src/seed/media')
type Doc = Record<string, unknown> & { id: number }

const PLACEMENTS: { file: string; alt: string; apply: (p: Payload, id: number) => Promise<unknown> }[] = [
  { file: 'preva/practice-team.jpg', alt: 'The Preva team between appointments', apply: (p, id) => brand(p, 'preva', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'preva/why-reception.jpg', alt: 'Preva reception through the gold doorway', apply: (p, id) => brand(p, 'preva', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'preva/film-poster-laser.jpg', alt: 'Laser treatment at Preva', apply: (p, id) => brand(p, 'preva', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'preva/founder-michelle-paty.jpg', alt: 'Michelle Paty', apply: async (p, id) => {
    const f = (await p.find({ collection: 'founders', where: { slug: { equals: 'michelle-paty' } }, limit: 1, depth: 0 })).docs[0]
    if (f) await p.update({ collection: 'founders', id: f.id, data: { headshot: id } })
  } },
]

async function brand(p: Payload, slug: string, patch: (b: Doc) => Record<string, unknown>) {
  const b = (await p.find({ collection: 'brands', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0] as unknown as Doc | undefined
  if (b) await p.update({ collection: 'brands', id: b.id, data: patch(b) as never })
}

export async function placeMedia(p: Payload) {
  for (const x of PLACEMENTS) {
    const name = 'placed-' + x.file.replace(/\//g, '-')
    const have = await p.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1, depth: 0 })
    if (have.docs.length) continue
    try {
      const data = fs.readFileSync(path.join(dir, x.file))
      const m = await p.create({ collection: 'media', data: { alt: x.alt }, file: { data, mimetype: 'image/jpeg', name, size: data.length } })
      await x.apply(p, m.id as number)
      p.logger.info(`media: placed ${x.file}`)
    } catch (e) { p.logger.warn(`media: ${x.file} skipped (${(e as Error).message})`) }
  }
}
