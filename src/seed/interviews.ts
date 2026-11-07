/**
 * Partner copy sourced from the founder interview transcripts (src/seed/content/partners.json).
 * Runs after the Webflow import (SEED_ON_EMPTY=webflow) or on its own (SEED_ON_EMPTY=content)
 * and only overwrites the fields it has copy for.
 *
 * Every quote is verbatim from a transcript and carries its file and timecode in `source`.
 * Everything else (intros, headlines, bios, place stories) is drafted copy for review.
 */
import type { Payload } from 'payload'
import partners from './content/partners.json'
import locationFacts from './content/locations.json'

type Quote = { text: string; source: string; trimmed?: boolean }
type Founder = {
  name: string; kind?: 'provider' | 'business'; status?: 'active' | 'former'; headline?: string; credentials?: string
  bio?: string[]; traits?: { label: string; line: Quote }[]; quotes?: Quote[]; milestones?: [number, string][]
}
type Place = { story?: string[]; arrivalNote?: string; quote?: Quote; milestones?: [string, string][] }
type Partner = {
  brand: {
    intro?: string
    practice?: { headline?: string; body?: string[] }
    why?: { headline?: Quote; body?: Quote[] }
    quote?: Quote
  }
  founders?: Founder[]
  locations?: Record<string, Place>
  tuckIns?: Record<string, { story?: string[]; quote?: Quote }>
}

type Node = Record<string, unknown>
const text = (t: string, format = 0): Node => ({ type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 })
const para = (kids: Node[]): Node => ({ type: 'paragraph', children: kids, direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0 })
const rich = (paras: Node[]) => ({ root: { type: 'root', children: paras, direction: 'ltr', format: '', indent: 0, version: 1 } }) as never
const prose = (ps?: string[]) => (ps?.length ? rich(ps.map((p) => para([text(p)]))) : undefined)
/** Quotes as paragraphs in curly quotes, then one italic line naming the sources. */
const quoted = (qs?: Quote[]) => (qs?.length ? rich([...qs.map((q) => para([text(`“${q.text}”`)])), para([text(qs.map((q) => q.source).join('; '), 2)])]) : undefined)
const slugify = (s: string) => s.toLowerCase().replace(/^dr\.?\s+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const known = (s: string) => !/^\[.*\]$/.test(s) // skip [Year]-style placeholders

export async function applyContent(p: Payload) {
  const log = (m: string) => p.logger.info(`content: ${m}`)
  let n = 0
  for (const [ptr, raw] of Object.entries(partners as unknown as Record<string, Partner>)) {
    const found = await p.find({ collection: 'brands', where: { ptr: { equals: Number(ptr) } }, limit: 1, depth: 0 })
    const brand = found.docs[0] as unknown as Record<string, any> | undefined
    if (!brand) { log(`PTR ${ptr}: no brand, skipped`); continue }
    const b = raw.brand

    // founders: update by name, create the ones Webflow never had (e.g. former founders)
    const founderIds: (number | string)[] = [...(brand.founders || [])]
    for (const f of raw.founders || []) {
      const hit = await p.find({ collection: 'founders', where: { name: { equals: f.name } }, limit: 1, depth: 0 })
      const data: Record<string, unknown> = {
        ...(f.bio && { bio: prose(f.bio) }),
        ...(f.traits && { traits: f.traits.map((t) => ({ label: t.label, line: t.line.text })) }),
        ...(f.quotes && { quotes: f.quotes.map((q) => ({ text: q.text, source: q.source })) }),
        ...(f.milestones && { milestones: f.milestones.map(([year, line]) => ({ year, line })) }),
        ...(f.status && { status: f.status }),
        ...(f.kind && { kind: f.kind }),
      }
      if (hit.docs[0]) {
        await p.update({ collection: 'founders', id: hit.docs[0].id, data })
      } else {
        const doc = await p.create({ collection: 'founders', data: { name: f.name, slug: slugify(f.name), headline: f.headline, credentials: f.credentials, live: true, ...data } as never })
        if (!founderIds.includes(doc.id)) founderIds.push(doc.id)
      }
    }

    await p.update({ collection: 'brands', id: brand.id, data: {
      ...(b.intro && { intro: b.intro }),
      practice: { ...(brand.practice || {}), ...(b.practice?.headline && { headline: b.practice.headline }), ...(b.practice?.body && { body: prose(b.practice.body) }) },
      why: { ...(brand.why || {}), ...(b.why?.headline && { headline: b.why.headline.text }), ...(b.why?.body && { body: quoted(b.why.body) }) },
      ...(b.quote && { quote: { text: b.quote.text, source: b.quote.source } }),
      founders: founderIds as number[],
    } as never })

    for (const [city, l] of Object.entries(raw.locations || {})) {
      const loc = await p.find({ collection: 'locations', where: { and: [{ brand: { equals: brand.id } }, { city: { equals: city } }] }, limit: 1, depth: 0 })
      if (!loc.docs[0]) { log(`PTR ${ptr}: no ${city} location, skipped`); continue }
      await p.update({ collection: 'locations', id: loc.docs[0].id, data: {
        ...(l.story && { story: prose(l.story) }),
        ...(l.arrivalNote && { arrivalNote: l.arrivalNote }),
        ...(l.quote && { quote: { text: l.quote.text, source: l.quote.source } }),
        ...(l.milestones && { milestones: l.milestones.filter(([w]) => known(w)).map(([when, line]) => ({ when, line })) }),
      } as never })
    }

    for (const [slug, t] of Object.entries(raw.tuckIns || {})) {
      const ti = await p.find({ collection: 'tuck-ins', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
      if (!ti.docs[0]) { log(`PTR ${ptr}: no tuck-in ${slug}, skipped`); continue }
      await p.update({ collection: 'tuck-ins', id: ti.docs[0].id, data: {
        ...(t.story && { story: prose(t.story) }),
        ...(t.quote && { quote: { text: t.quote.text, source: t.quote.source } }),
      } as never })
    }
    n++
  }
  log(`${n} partners updated from interview transcripts`)
  await applyLocationFacts(p)
}

/** Google-sourced address facts (fill empty fields only) plus explicit corrections (always applied). */
export async function applyLocationFacts(p: Payload) {
  const { locations } = locationFacts as unknown as {
    locations: Record<string, { fill?: Record<string, unknown>; set?: Record<string, unknown> }>
  }
  let n = 0
  for (const [key, f] of Object.entries(locations)) {
    const [ptr, city] = key.split('|')
    const brand = await p.find({ collection: 'brands', where: { ptr: { equals: Number(ptr) } }, limit: 1, depth: 0 })
    if (!brand.docs[0]) continue
    const hit = await p.find({ collection: 'locations', where: { and: [{ brand: { equals: brand.docs[0].id } }, { city: { in: [city, f.set?.city].filter(Boolean) } }] }, limit: 1, depth: 0 })
    const loc = hit.docs[0] as unknown as Record<string, unknown> & { id: number }
    if (!loc) { p.logger.info(`locations: no ${key}, skipped`); continue }
    const data: Record<string, unknown> = { ...(f.set || {}) }
    for (const [k, v] of Object.entries(f.fill || {})) if (v != null && (loc[k] == null || loc[k] === '')) data[k] = v
    if (Object.keys(data).length) { await p.update({ collection: 'locations', id: loc.id, data: data as never }); n++ }
  }
  p.logger.info(`locations: ${n} updated with address facts and corrections`)
}
