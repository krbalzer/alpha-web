import { createHash } from 'crypto'
import type { Payload } from 'payload'

/**
 * Records removed from the network for legal or partnership reasons. Matched by a hash of the slug
 * so the names never appear in this repo. Runs before every build; a no-op once they are gone.
 */
const REMOVED: Record<'articles' | 'founders' | 'brands', string[]> = {
  articles: [
    'f61cf2811ff42de3832d9ff9917c1d88304d648bf3a0f5894d4b23a474aa65c9',
    'b69b607d36670ae0b245606127366fc1745eeb4aef25a77ffe24f293289712e5',
  ],
  founders: [
    '9a6d4891f40174fb29efb174579fda8057d1dce227d9ce51f31cf01bd4bfc74b',
    'b06f207be65d760ce5920cd5a4b57604bd9dc69f8da6cb55c0afcf7251e48aa1',
  ],
  brands: [
    '867eb6fa868d4b3d22bf04404e0e7f47ab978f18a52ecadccc803ecc0a71c61b',
  ],
}

const hash = (s: string) => createHash('sha256').update(s).digest('hex')

export async function scrubRemoved(p: Payload) {
  for (const collection of ['articles', 'founders', 'brands'] as const) {
    const all = await p.find({ collection, limit: 2000, depth: 0, pagination: false, select: { slug: true } as never, overrideAccess: true })
    for (const d of all.docs as { id: number | string; slug: string }[]) {
      if (!REMOVED[collection].includes(hash(d.slug))) continue
      if (collection === 'brands') {
        await p.delete({ collection: 'cta-images', where: { 'location.brand': { equals: d.id } }, overrideAccess: true })
        await p.delete({ collection: 'locations', where: { brand: { equals: d.id } }, overrideAccess: true })
      }
      await p.delete({ collection, id: d.id, overrideAccess: true })
      p.logger.info(`scrub: removed one ${collection} record`)
    }
  }
}
