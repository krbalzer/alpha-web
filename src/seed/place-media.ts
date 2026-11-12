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
  // Privé (014), Lexington shoot, Nov 2026
  { file: 'prive/practice-hallway.jpg', alt: 'The treatment hallway at Privé', apply: (p, id) => brand(p, 'prive', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'prive/why-brandice.jpg', alt: 'Brandice Harrison with a patient at Privé', apply: (p, id) => brand(p, 'prive', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'prive/film-poster-keeneland.jpg', alt: 'Keeneland barn in the snow, Lexington', apply: (p, id) => brand(p, 'prive', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'prive/location-lexington.jpg', alt: 'The Privé mark on marble, Lexington', apply: (p, id) => location(p, 'prive-lexington-ky', { photo: id }) },
  { file: 'prive/founder-brandice-harrison.jpg', alt: 'Brandice Harrison', apply: (p, id) => founder(p, 'brandice-harrison', { headshot: id }) },
  { file: 'prive/portrait-brandice-harrison.jpg', alt: 'Brandice Harrison at Privé', apply: (p, id) => founder(p, 'brandice-harrison', { portrait: id }) },
  { file: 'prive/founder-becky-mcdonald.jpg', alt: 'Becky McDonald', apply: (p, id) => founder(p, 'becky-mcdonald', { headshot: id }) },
  // LexRx (015), Boston shoot, Nov 2026
  { file: 'lexrx/practice-team.jpg', alt: 'The LexRx team at the front bar', apply: (p, id) => brand(p, 'lexrx', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'lexrx/why-mirror.jpg', alt: 'Alexa Nicholls Costa handing a patient the mirror', apply: (p, id) => brand(p, 'lexrx', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'lexrx/film-poster-studio.jpg', alt: 'LexRx', apply: (p, id) => brand(p, 'lexrx', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'lexrx/founder-alexa-nicholls-costa.jpg', alt: 'Alexa Nicholls Costa', apply: (p, id) => founder(p, 'alexa-nicholls-costa', { headshot: id }) },
  { file: 'lexrx/portrait-alexa-nicholls-costa.jpg', alt: 'Alexa Nicholls Costa at LexRx', apply: (p, id) => founder(p, 'alexa-nicholls-costa', { portrait: id }) },
  // Anne Therese (007), Ohio + Cape Coral shoot, Nov 2026
  { file: 'atam/practice-front-desk.jpg', alt: 'The front desk at Anne Therese, Lewis Center', apply: (p, id) => brand(p, 'anne-therese-aesthetic-medicine', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'atam/why-anne.jpg', alt: 'Dr. Anne Therese Stubbs with a patient', apply: (p, id) => brand(p, 'anne-therese-aesthetic-medicine', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'atam/film-poster-canal.jpg', alt: 'A Cape Coral canal at dawn', apply: (p, id) => brand(p, 'anne-therese-aesthetic-medicine', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'atam/founder-anne-therese-stubbs.jpg', alt: 'Dr. Anne Therese Stubbs', apply: (p, id) => founder(p, 'anne-therese-stubbs', { headshot: id }) },
  { file: 'atam/portrait-anne-therese-stubbs.jpg', alt: 'Dr. Anne Therese Stubbs at Anne Therese', apply: (p, id) => founder(p, 'anne-therese-stubbs', { portrait: id }) },
  { file: 'atam/location-lewis-center.jpg', alt: 'The lobby at Anne Therese, Lewis Center', apply: (p, id) => location(p, 'anne-therese-aesthetic-medicine-columbus-ohio', { photo: id }) },
  { file: 'atam/location-gahanna.jpg', alt: 'Anne Therese, Gahanna', apply: (p, id) => location(p, 'anne-therese-aesthetic-medicine-gahanna-oh', { photo: id }) },
  { file: 'atam/location-cape-coral.jpg', alt: 'Anne Therese on Cape Coral Parkway', apply: (p, id) => location(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', { photo: id }) },
  { file: 'atam/cta-cape-coral.jpg', alt: 'Sunrise on the water, Cape Coral', apply: (p, id) => cta(p, 'Anne Therese / Cape Coral', 'anne-therese-aesthetic-medicine-cape-coral-fl', id) },
  { file: 'atam/cta-gahanna.jpg', alt: 'A crystal sconce at Anne Therese, Gahanna', apply: (p, id) => cta(p, 'Anne Therese / Gahanna', 'anne-therese-aesthetic-medicine-gahanna-oh', id) },
  // Inside the practice rail (brand page) and location galleries
  { file: 'atam/inside-lobby-chandeliers.jpg', alt: 'Chandeliers in the Lewis Center lobby', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Lobby / Lewis Center') },
  { file: 'atam/inside-lewis-center-desk.jpg', alt: 'The front desk at Lewis Center', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Front desk / Lewis Center') },
  { file: 'atam/inside-anne-treatment.jpg', alt: 'Dr. Anne Therese Stubbs treating a patient', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Dr. Anne Therese Stubbs / Lewis Center') },
  { file: 'atam/inside-lewis-center-room.jpg', alt: 'A treatment at Lewis Center', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Treatment room / Lewis Center') },
  { file: 'atam/inside-gahanna-desk.jpg', alt: 'The front desk at Gahanna', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Front desk / Gahanna') },
  { file: 'atam/inside-gahanna-laser.jpg', alt: 'A laser treatment at Gahanna', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Laser / Gahanna') },
  { file: 'atam/inside-gahanna-skincare.jpg', alt: 'The skincare wall at Gahanna', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Skincare / Gahanna') },
  { file: 'atam/inside-gahanna-facial.jpg', alt: 'A facial at Gahanna', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Facial / Gahanna') },
  { file: 'atam/inside-cape-coral-desk.jpg', alt: 'The front desk at Cape Coral', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Front desk / Cape Coral') },
  { file: 'atam/inside-cape-coral-room.jpg', alt: 'A treatment at Cape Coral', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Treatment room / Cape Coral') },
  { file: 'atam/inside-cape-coral-palm.jpg', alt: 'A palm on Cape Coral Parkway', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Cape Coral') },
  { file: 'atam/gal-lewis-center-1.jpg', alt: 'The lobby at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'arrival') },
  { file: 'atam/gal-lewis-center-2.jpg', alt: 'The front desk at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'front-desk') },
  { file: 'atam/gal-lewis-center-3.jpg', alt: 'A treatment room at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'treatment-room') },
  { file: 'atam/gal-lewis-center-4.jpg', alt: 'A treatment room at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'treatment-room') },
  { file: 'atam/gal-lewis-center-5.jpg', alt: 'Syringes on a crystal tray at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'detail') },
  { file: 'atam/gal-gahanna-1.jpg', alt: 'Anne Therese, Gahanna, from the walk', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'arrival') },
  { file: 'atam/gal-gahanna-2.jpg', alt: 'The front desk at Gahanna', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'front-desk') },
  { file: 'atam/gal-gahanna-3.jpg', alt: 'A laser treatment at Gahanna', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'treatment-room') },
  { file: 'atam/gal-gahanna-4.jpg', alt: 'A consult at Gahanna', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'consult') },
  { file: 'atam/gal-gahanna-5.jpg', alt: 'The skincare wall at Gahanna', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'retail') },
  { file: 'atam/gal-cape-coral-1.jpg', alt: 'Anne Therese on Cape Coral Parkway', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'arrival') },
  { file: 'atam/gal-cape-coral-2.jpg', alt: 'The front desk at Cape Coral', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'front-desk') },
  { file: 'atam/gal-cape-coral-3.jpg', alt: 'A treatment at Cape Coral', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'treatment-room') },
  { file: 'atam/gal-cape-coral-4.jpg', alt: 'A consult at Cape Coral', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'consult') },
  { file: 'atam/gal-cape-coral-5.jpg', alt: 'The treatment room hallway at Cape Coral', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'treatment-room') },
  // Refined at Blossom (Winchester, tuck-in), Nov 2026 shoot
  { file: 'ra/location-winchester.jpg', alt: 'The lobby at Refined at Blossom, Winchester', apply: (p, id) => location(p, 'refined-aesthetics-winchester', { photo: id }) },
  { file: 'ra/gal-winchester-1.jpg', alt: 'The lobby and skincare wall at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'arrival') },
  { file: 'ra/gal-winchester-2.jpg', alt: 'A treatment room at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'treatment-room') },
  { file: 'ra/gal-winchester-3.jpg', alt: 'A Halo laser treatment at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'treatment-room') },
  { file: 'ra/gal-winchester-4.jpg', alt: 'A consult at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'consult') },
  { file: 'ra/gal-winchester-5.jpg', alt: 'A facial at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'treatment-room') },
  { file: 'ra/lead-lynn-nieman.jpg', alt: 'Dr. Lynn Nieman', apply: (p, id) => location(p, 'refined-aesthetics-winchester', { lead: { name: 'Dr. Lynn Nieman', credentials: 'MD', title: 'Medical Director', photo: id } }) },
  { file: 'ra/cta-winchester.jpg', alt: 'A treatment room at Refined at Blossom', apply: (p, id) => cta(p, 'Refined at Blossom / Winchester', 'refined-aesthetics-winchester', id) },
  // Bonita Springs (de novo), branding shoot, Nov 2025
  { file: 'atam/location-bonita-springs.jpg', alt: 'Anne Therese, Suite 154, Bonita Springs', apply: (p, id) => location(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', { photo: id }) },
  { file: 'atam/gal-bonita-springs-1.jpg', alt: 'The colonnade at Suite 154, Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'arrival') },
  { file: 'atam/gal-bonita-springs-2.jpg', alt: 'The front desk at Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'front-desk') },
  { file: 'atam/gal-bonita-springs-3.jpg', alt: 'A treatment at Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'treatment-room') },
  { file: 'atam/gal-bonita-springs-4.jpg', alt: 'A facial at Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'treatment-room') },
  { file: 'atam/gal-bonita-springs-5.jpg', alt: 'The skincare wall at Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'retail') },
  { file: 'atam/cta-lewis-center.jpg', alt: 'Dr. Anne Therese Stubbs with a patient, Lewis Center', apply: (p, id) => cta(p, 'Anne Therese / Lewis Center', 'anne-therese-aesthetic-medicine-columbus-ohio', id) },
  { file: 'atam/cta-bonita-springs.jpg', alt: 'The fountain courtyard, Bonita Springs', apply: (p, id) => cta(p, 'Anne Therese / Bonita Springs', 'anne-therese-aesthetic-medicine-bonita-springs-fl', id) },
  { file: 'atam/inside-bonita-exam-room.jpg', alt: 'An exam room at Bonita Springs', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Exam room / Bonita Springs') },
  { file: 'atam/inside-bonita-retail.jpg', alt: 'The skincare wall at Bonita Springs', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Skincare / Bonita Springs') },
]

async function founder(p: Payload, slug: string, data: Record<string, unknown>) {
  const f = (await p.find({ collection: 'founders', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  if (f) await p.update({ collection: 'founders', id: f.id, data: data as never })
}

async function cta(p: Payload, label: string, slug: string, id: number) {
  const l = (await p.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  if (l) await p.create({ collection: 'cta-images', data: { label, image: id, location: l.id, active: true } as never })
}

async function inside(p: Payload, slug: string, id: number, caption: string) {
  const b = (await p.find({ collection: 'brands', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0] as unknown as Doc | undefined
  if (b) await p.update({ collection: 'brands', id: b.id, data: { inside: [...((b.inside as object[]) || []), { image: id, caption }] } as never })
}

async function gallery(p: Payload, slug: string, id: number, kind: string, caption = '') {
  const l = (await p.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0] as unknown as Doc | undefined
  if (l) await p.update({ collection: 'locations', id: l.id, data: { gallery: [...((l.gallery as object[]) || []), { image: id, kind, caption }] } as never })
}

/** Locations that exist but were never in the Webflow import. Created once, then the CMS owns them. */
async function ensureLocations(p: Payload) {
  const ra = (await p.find({ collection: 'brands', where: { slug: { equals: 'refined-aesthetics' } }, limit: 1, depth: 0 })).docs[0]
  const have = (await p.find({ collection: 'locations', where: { slug: { equals: 'refined-aesthetics-winchester' } }, limit: 1, depth: 0 })).docs[0]
  if (!ra || have) return
  const loc = await p.create({ collection: 'locations', data: {
    brand: ra.id, city: 'Winchester', state: 'VA', zip: '22601', address1: '8 W Fairfax Ln', lat: 39.1872, lng: -78.1648, phone: '(540) 323-7254',
    origin: 'tuck-in', formerName: 'Blossom Medical', slug: 'refined-aesthetics-winchester', live: true,
  } as never })
  await p.create({ collection: 'tuck-ins', data: { formerName: 'Blossom Medical', brand: ra.id, kind: 'location', location: loc.id, city: 'Winchester', state: 'VA', slug: 'blossom-medical', live: true } as never })
  p.logger.info('locations: created Refined at Blossom, Winchester')
}

async function location(p: Payload, slug: string, data: Record<string, unknown>) {
  const l = (await p.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  if (l) await p.update({ collection: 'locations', id: l.id, data: data as never })
}

async function brand(p: Payload, slug: string, patch: (b: Doc) => Record<string, unknown>) {
  const b = (await p.find({ collection: 'brands', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0] as unknown as Doc | undefined
  if (b) await p.update({ collection: 'brands', id: b.id, data: patch(b) as never })
}

const rich = (ps: string[]) => ({ root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children: ps.map((t) => ({ type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, children: [{ type: 'text', text: t, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }] })) } })

/** Refined at Blossom: name, visit details and the Joined chapter. Runs once (skips when the chapter has a headline), after the photo placements. */
async function blossom(p: Payload) {
  const slug = 'refined-aesthetics-winchester'
  const l = (await p.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  const tk = (await p.find({ collection: 'tuck-ins', where: { slug: { equals: 'blossom-medical' } }, limit: 1, depth: 0 })).docs[0]
  if (!l || !tk || tk.chapter?.headline) return
  const sarah = (await p.find({ collection: 'founders', where: { slug: { equals: 'sarah-safa' } }, limit: 1, depth: 0 })).docs[0]
  await p.update({ collection: 'locations', id: l.id, data: {
    name: 'Refined at Blossom', googlePlaceId: 'ChIJt5r4LWjvtYkRSpe-zSufxk4',
    hours: [{ days: 'Mon to Fri', time: '8am to 4:30pm' }, { days: 'Sat, Sun', time: 'Closed' }],
    arrivalNote: 'Free parking near the entrance, just off West Fairfax Lane. Ground floor, just inside the main entrance.',
    story: rich([
      'Blossom began in a single treatment room, offered by two physician friends who had one to spare. Dr. Lynn Nieman, a board-certified anesthesiologist, had come to aesthetics while a riding fall kept her out of the operating room for twelve weeks.',
      'She named the practice for the Apple Blossom Festival, the week each spring when Winchester closes its streets for parades and opens its yards to neighbors. Blossom still sponsors festival events, local teams and a local cancer charity. The practice sits in Old Town, a few steps off the walking mall, down the street from George Washington’s old office.',
    ]),
    milestones: [{ when: 'Jul 2026', line: 'Blossom Medical joins Refined Aesthetics as Refined at Blossom.' }, { when: 'Sep 2026', line: 'Launch celebration in Winchester.' }],
    quote: { text: 'We are only getting better. We are not changing.', source: 'Dr. Lynn Nieman, interview 00:18:33' },
  } as never })
  await p.update({ collection: 'tuck-ins', id: tk.id, data: {
    closed: '2026-07-01T00:00:00.000Z',
    chapter: {
      headline: 'First she trained here. Now it is one practice.',
      intro: 'Dr. Lynn Nieman opened Blossom Medical in Old Town Winchester in a single borrowed treatment room. Some of her first hands-on injectables training was with Sarah Safa of Refined Aesthetics, an hour away in Leesburg. Years later Sarah called with an idea, and in 2026 the two practices became one: Refined at Blossom.',
      pair: [
        { name: 'Dr. Lynn Nieman, MD', line: 'Founder / Blossom Medical', photo: (l as unknown as { lead?: { photo?: number } }).lead?.photo ?? null, quote: 'She is one of the first people that I heard say community over competition.', source: 'Interview 00:13:07 / on Sarah' },
        { name: 'Sarah Safa, MS, PA-C', line: 'Founder / Refined Aesthetics', photo: (sarah?.headshot as number | undefined) ?? null, quote: 'Our goal is to continue to inspire and motivate and elevate each other.', source: 'Interview 00:04:09 / on Blossom' },
      ],
      kept: [
        { label: 'The name', title: 'Blossom stays in it', line: 'Lynn named Blossom for Winchester’s Apple Blossom Festival. It is still on the door.', quote: 'I wanted the namesake to be a nod to the people and the place which are at the heart of what we do.', source: 'Dr. Lynn Nieman, 00:07:13' },
        { label: 'The physician', title: 'Dr. Nieman stays', line: 'Same physician, same team, now with Refined’s training and protocols behind them.', quote: 'I’m not leaving.', source: 'Dr. Lynn Nieman, 00:18:33' },
        { label: 'The patients', title: 'Same building, same number', line: '8 W Fairfax Ln and (540) 323-7254. Appointments booked before the change still stand.' },
      ],
    },
  } as never })
  p.logger.info('locations: Refined at Blossom content set')
}

/** Location order within a brand (opening order). Only fills locations that have no order yet, so admin edits stand. */
const ORDER: Record<string, number> = {
  'anne-therese-aesthetic-medicine-columbus-ohio': 1, 'anne-therese-aesthetic-medicine-gahanna-oh': 2,
  'anne-therese-aesthetic-medicine-cape-coral-fl': 3, 'anne-therese-aesthetic-medicine-bonita-springs-fl': 4,
}
async function orderLocations(p: Payload) {
  for (const [slug, order] of Object.entries(ORDER)) {
    const l = (await p.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
    if (l && l.order == null) await p.update({ collection: 'locations', id: l.id, data: { order } as never })
  }
}

export async function placeMedia(p: Payload) {
  await ensureLocations(p)
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
  await blossom(p)
  await orderLocations(p)
}
