/**
 * Copy passes: reviewed rewrites of partner-page copy (Alpha Site Copy Inventory, one tab per brand).
 * Each pass runs on deploy, but only while the brand still shows the copy it replaces, so a later CMS edit always wins.
 * Quotes are verbatim from the founder interview transcripts; the source sits next to each one.
 */
import type { Payload } from 'payload'

type Node = Record<string, unknown>
const text = (t: string): Node => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const para = (t: string): Node => ({ type: 'paragraph', children: [text(t)], direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0 })
const prose = (ps: string[]) => ({ root: { type: 'root', children: ps.map(para), direction: 'ltr', format: '', indent: 0, version: 1 } }) as never
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plain = (rt: any): string => (rt?.root?.children || []).map((p: any) => (p.children || []).map((c: any) => c.text || '').join('')).join('\n')

type Pass = {
  ptr: number
  /** the pass applies only while this is still the practice headline */
  was: string
  brand: Record<string, unknown>
  founder?: { name: string; wasIncludes: string; bio: string[] }
}

const PASSES: Pass[] = [
  {
    ptr: 3, // Refined Aesthetics, reviewed Nov 25 2026
    was: "Educate first. Say no when it's right.",
    brand: {
      intro: 'Refined Aesthetics in Leesburg, Virginia: a non-surgical practice in a restored building in the historic district, now with a second location in Winchester. Consultations are free.',
      established: 2014, // "ten years ago" in the 2024 interview (ra4 00:55)
      insideTitle: 'From Church Street to the Shenandoah Valley',
      practice: {
        headline: 'A practice that explains everything before it treats anything',
        body: prose([
          "At Refined Aesthetics the consultation is the main event. It's free, and patients leave knowing what's available, what each option does and whether they need it at all. Sarah Safa opened the practice more than ten years ago in a restored building in Leesburg's historic district. The building was preserved rather than remade, and that's how the team wants patients to feel walking out.",
          "It's non-surgical only, so nobody waits next to a surgery patient. Sarah says that's why more men come here than to most practices in Northern Virginia. Injectors are hired for bedside manner and trained in-house before they consult anyone, with a focus on serving, not selling. The team travels as far as Brazil and Canada to learn treatments before they reach the US. Patients come from young Arlington professionals to Middleburg horse country.",
        ]),
      },
      quote: {
        text: 'I knew that by joining a bigger and better team, we could make it happen together, and we could impact more people, more patients, more businesses, more educational platforms.',
        source: 'Sarah Safa, founder interview (ra3) 00:04:05',
      },
      why: {
        body: prose([
          // ra3 01:54; refined3 09:23 to 09:32; refined4 00:26
          'Sarah had heard plenty, good and bad, about what partnering with anyone would mean. The version she wanted no part of was the takeover: “They wanna change your name. They wanna change your brand. They wanna change your EMR.” Refined kept its name and the way it runs.',
          // ra3 03:08, 06:41, 05:15
          'She started telling us her plans before the deal even closed, and the second floor came out of those conversations. Day to day, we took on “a lot of the extra admin and, you know, monetary things,” so she could get back to the work.',
        ]),
      },
      // Capacity / Demand / Depth. Google rating is added live from the location syncs. Botox units and treatment rooms wait on ops numbers.
      stats: [
        { kicker: 'Capacity', value: '150', label: 'Patients a week', rows: [{ k: 'Providers', v: '7' }, { k: 'Locations', v: '2' }] },
        { kicker: 'Demand', value: '6.5k', label: 'Social followers', rows: [] },
        { kicker: 'Depth', value: '37', label: 'Treatments', rows: [{ k: 'Skincare items a year', v: '1.5k' }, { k: 'Filler syringes a year', v: '2.1k' }] },
      ],
    },
    founder: {
      name: 'Sarah Safa',
      wasIncludes: 'Eighteen years later',
      bio: [
        'A Virginia native, born in Charlottesville and raised outside Richmond, Sarah planned on orthopedics until an elective rotation in plastic surgery out of PA school. More than eighteen years in, she still calls aesthetics happy medicine.',
        'She also teaches, training other providers inside practices across the country, and has written on why the specialty needs more education as it grows.',
      ],
    },
  },
]

export async function applyCopyPasses(p: Payload) {
  for (const pass of PASSES) {
    const b = (await p.find({ collection: 'brands', where: { ptr: { equals: pass.ptr } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as unknown as Record<string, any> | undefined
    if (!b || b.practice?.headline !== pass.was) continue
    const x = pass.brand as Record<string, any>
    await p.update({ collection: 'brands', id: b.id, overrideAccess: true, data: {
      ...x,
      practice: { ...(b.practice || {}), ...(x.practice || {}) },
      why: { ...(b.why || {}), ...(x.why || {}) },
    } as never })
    if (pass.founder) {
      const f = (await p.find({ collection: 'founders', where: { name: { equals: pass.founder.name } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
      if (f && plain(f.bio).includes(pass.founder.wasIncludes)) await p.update({ collection: 'founders', id: f.id, overrideAccess: true, data: { bio: prose(pass.founder.bio) } })
    }
    p.logger.info(`copy: PTR ${pass.ptr} updated`)
  }
}
