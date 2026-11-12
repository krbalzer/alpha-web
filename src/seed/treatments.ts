import type { Payload } from 'payload'
import list from './content/treatments.json'

const slugify = (s: string) => s.toLowerCase().replace(/\+/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** The network's treatment list (Master Services List sheet). Creates missing treatments only; CMS edits win after that. */
export async function seedTreatments(p: Payload) {
  const brands = (await p.find({ collection: 'brands', limit: 200, depth: 0 })).docs
  const locs = (await p.find({ collection: 'locations', limit: 1000, depth: 0 })).docs
  let made = 0
  for (const t of list as { name: string; category: string; order: number; products: string; brands: string[]; only?: string[] }[]) {
    const slug = slugify(t.name)
    if ((await p.find({ collection: 'treatments', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs.length) continue
    const b = t.brands.map((s) => brands.find((x) => x.slug === s)?.id).filter((x): x is number => !!x)
    const only = (t.only || []).map((k) => {
      const [bs, city] = k.split('|'), bid = brands.find((x) => x.slug === bs)?.id
      const l = locs.find((x) => x.brand === bid && x.city === city)
      if (!l) p.logger.warn(`treatments: ${t.name}: no ${city} location for ${bs}`)
      return l?.id
    }).filter((x): x is number => !!x)
    await p.create({ collection: 'treatments', data: { name: t.name, category: t.category, order: t.order, products: t.products || undefined, brands: b, locations: only, slug, live: true } as never })
    made++
  }
  if (made) p.logger.info(`treatments: created ${made}`)
}
