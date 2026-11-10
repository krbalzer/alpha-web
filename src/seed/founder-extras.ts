/**
 * Founder page copy that the Webflow import never had (src/seed/content/founders-extra.json), first Michelle Paty
 * from the Founder board. Quotes and trait lines are verbatim from the founder interview with timecodes; bios are drafted.
 * Applied once per founder: only while the founder has no traits, so CMS edits after that are never overwritten.
 */
import type { Payload } from 'payload'
import extra from './content/founders-extra.json'

type X = { bio?: string[]; traits?: { label: string; line: string }[]; quotes?: { text: string; source: string }[]; milestones?: [number, string][] }
const t = (s: string) => ({ type: 'text', text: s, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const rich = (ps: string[]) => ({ root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children: ps.map((p) => ({ type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, children: [t(p)] })) } })

export async function applyFounderExtras(p: Payload) {
  let n = 0
  for (const [slug, x] of Object.entries(extra as unknown as Record<string, X>)) {
    const f = (await p.find({ collection: 'founders', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0] as { id: number; traits?: unknown[] } | undefined
    if (!f || (f.traits || []).length) continue
    await p.update({ collection: 'founders', id: f.id, data: {
      ...(x.bio && { bio: rich(x.bio) }),
      ...(x.traits && { traits: x.traits.map((r) => ({ label: r.label, line: r.line })) }),
      ...(x.quotes && { quotes: x.quotes }),
      ...(x.milestones && { milestones: x.milestones.map(([year, line]) => ({ year, line })) }),
    } as never })
    n++
  }
  p.logger.info(`founders: ${n} filled from founders-extra.json`)
}
