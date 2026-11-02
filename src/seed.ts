/**
 * Stand-in data so templates render before real content lands. Safe to re-run: wipes the seeded collections first.
 *   pnpm seed
 * Everything here is placeholder unless noted. Coordinates are approximate (city centers), addresses only for Preva.
 */
import config from '@payload-config'
import path from 'path'
import { getPayload } from 'payload'

const rt = (...paras: string[]) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: paras.map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
    })),
  },
}) as never

// map projection used on the boards, inverted back to lat/lng
const ll = (x: number, y: number) => ({ lng: +(x / 20.338 - 125.5).toFixed(3), lat: +(50 - (y - 20) / 25.81).toFixed(3) })

const BRANDS: { n: number; name: string; short?: string; city: string; st: string; xy: [number, number]; founder?: string; cred?: string; tone: string; img?: string; head?: string }[] = [
  { n: 1, name: 'Esthetics Center', city: 'Sacramento', st: 'CA', xy: [81.6, 314.8], tone: '#3B3A35' },
  { n: 2, name: 'Holden Timeless Beauty', short: 'Holden', city: 'San Diego', st: 'CA', xy: [169.6, 466], founder: 'Amanda Holden', cred: 'MD', tone: '#61788A' },
  { n: 3, name: 'Refined Aesthetics', short: 'Refined', city: 'Leesburg', st: 'VA', xy: [975.1, 300.8], founder: 'Sarah Safa', tone: '#4C5949' },
  { n: 5, name: 'Laser Center of Marin', short: 'LCM', city: 'Corte Madera', st: 'CA', xy: [60.4, 331.5], tone: '#2F4550' },
  { n: 6, name: 'Williams Center', city: 'Latham', st: 'NY', xy: [1052.3, 207.1], tone: '#4B4038' },
  { n: 7, name: 'Anne Therese Aesthetics', short: 'Anne Therese', city: 'Columbus', st: 'OH', xy: [864.6, 279.1], tone: '#6B5A55' },
  { n: 8, name: 'Dontage', city: 'Fairfax', st: 'VA', xy: [986, 316], tone: '#3D3D45' },
  { n: 9, name: 'RN Esthetics', city: 'Salem', st: 'MA', xy: [1110.5, 213.1], founder: 'Michelle Doran', tone: '#52606B' },
  { n: 10, name: 'CAMI Aesthetics', short: 'CAMI', city: 'Huntersville', st: 'NC', xy: [908.3, 396.6], tone: '#5B4E44' },
  { n: 11, name: 'InBloom Health + Medispa', short: 'InBloom', city: 'Londonderry', st: 'NH', xy: [1100.9, 204.3], founder: 'Tanya Lawson', cred: 'ND', tone: '#7A2A1E', img: 'p-inbloom.webp', head: 'h-tanya.webp' },
  { n: 12, name: 'Flawless', city: 'Albuquerque', st: 'NM', xy: [383.4, 405.1], founder: 'Heather Badal', tone: '#7B3C26', img: 'p-flawless.webp', head: 'h-heather.webp' },
  { n: 13, name: 'Mint + Needle', short: 'Mint', city: 'Middletown', st: 'DE', xy: [1012.5, 292.3], founder: 'Brandi Gregge', cred: 'MSN, FNP-BC', tone: '#8A8A76', img: 'p-mint.webp', head: 'h-brandi.webp' },
  { n: 14, name: 'Privé Med Spa', short: 'Privé', city: 'Lexington', st: 'KY', xy: [833.9, 328.7], founder: 'Brandice Harrison', cred: 'PA-C', tone: '#5A5A55', img: 'p-prive.webp' },
  { n: 15, name: 'LexRx', city: 'Boston', st: 'MA', xy: [1107.3, 217.2], founder: 'Alexa Nicholls Costa', cred: 'NP', tone: '#56646E', img: 'p-lexrx.webp', head: 'h-alexa.webp' },
  { n: 16, name: 'Preva Aesthetics', short: 'Preva', city: 'Encinitas', st: 'CA', xy: [167, 457.7], founder: 'Michelle Paty', cred: 'MSN, CPNP-AC, FNP-C', tone: '#8C7350', img: 'p-preva.webp', head: 'h-michelle.webp' },
]
const slugify = (s: string) => s.toLowerCase().replace(/[+é]/g, (c) => (c === 'é' ? 'e' : '')).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function run() {
  console.log('seed: start')
  const p = await getPayload({ config: await config })
  console.log('seed: payload ready')
  const IMG = path.resolve(process.cwd(), 'public/img')
  for (const c of ['cta-images', 'episodes', 'shows', 'speakers', 'locations', 'brands', 'founders', 'media'] as const) {
    await p.delete({ collection: c, where: { id: { exists: true } } })
  }
  const users = await p.count({ collection: 'users' })
  if (!users.totalDocs) await p.create({ collection: 'users', data: { email: 'kevin@partnerwithalpha.com', password: process.env.SEED_ADMIN_PASSWORD || 'change-me-now' } })

  const media = async (file: string, alt: string) => (await p.create({ collection: 'media', data: { alt }, filePath: path.join(IMG, file) })).id

  for (const b of BRANDS) {
    const founder = b.founder
      ? await p.create({ collection: 'founders', data: { name: b.founder, credentials: b.cred, slug: slugify(b.founder), headshot: b.head ? await media(b.head, b.founder) : undefined, live: true } })
      : null
    const isPreva = b.n === 16
    const brand = await p.create({
      collection: 'brands',
      data: {
        name: b.name, short: b.short, ptr: b.n, slug: slugify(b.name), tone: b.tone, live: true,
        founders: founder ? [founder.id] : [],
        ...(isPreva ? {
          since: '2025-06-01', established: 2016, services: ['Injectables', 'Lasers', 'Facials', 'Skincare'],
          founders: founder ? [founder.id] : [],
          intro: 'Two coastal-calm practices in Encinitas and Denver, built on prevention before correction.',
          practice: {
            eyebrow: 'The practice she built',
            headline: 'Eight years, two states, ten providers, and one rule: the best work is the work nobody can point to.',
            body: rt('Prevention before correction. Restraint before volume. Patients who look like themselves, just earlier. That came from the ICU, not from aesthetics, and it built a practice running 305 appointments a week across Encinitas and Denver.', 'Then it outgrew the part of the job she was best at. Two locations means two of every problem, and almost none of them are clinical.'),
          },
          stats: [
            { kicker: 'Capacity', value: '510', label: 'Weekly appointments', rows: [{ k: 'Providers', v: '19' }, { k: 'Per provider / week', v: '27' }, { k: 'Annualized visits', v: '26,520' }] },
            { kicker: 'Demand', value: '10.7K', label: 'Social followers', rows: [{ k: 'Markets', v: '2' }, { k: 'Followers per weekly visit', v: '21' }, { k: 'Est', v: '2016' }] },
            { kicker: 'Depth', value: '235K', label: '[Depth label]', rows: [{ k: 'Filler syringes / year', v: '2,500' }, { k: 'Skincare items / year', v: '14,000' }, { k: 'Retail attach rate', v: '1 in 2 visits' }] },
          ],
        } : {}),
      },
    })
    const loc = (city: string, st: string, xy: [number, number], extra: object = {}) =>
      p.create({ collection: 'locations', data: { brand: brand.id, city, state: st, ...ll(...xy), slug: slugify(`${b.short || b.name}-${city}`), live: true, ...extra } })
    if (isPreva) {
      const enc = await loc('Encinitas', 'CA', b.xy, { address1: '760 Garden View Ct, Ste 100', address2: 'Encinitas, CA 92024', zip: '92024', lat: 33.052, lng: -117.262, mapBearing: 22 })
      await loc('Denver', 'CO', [417.2, 284.8], { address1: '4045 N Pecos St, Unit 100', address2: 'Denver, CO 80211', zip: '80211', lat: 39.773, lng: -105.006 })
      if (b.img) await p.create({ collection: 'cta-images', data: { label: 'Preva stand-in', image: await media(b.img, `${b.name} location`), location: enc.id, active: true, soften: true } })
    } else {
      const l = await loc(b.city, b.st, b.xy)
      if (b.img) await p.create({ collection: 'cta-images', data: { label: `${b.name} stand-in`, image: await media(b.img, `${b.name} location`), location: l.id, active: true, soften: true } })
    }
  }

  // one show + episode so the player and menu slot have something real to play
  const tiff = await p.create({ collection: 'speakers', data: { name: 'Tiffany Ellison', role: 'Host', slug: 'tiffany-ellison' } })
  const dt = await p.create({ collection: 'shows', data: { name: 'Dear Tiffany', short: 'Dear Tiffany', schedule: 'New every other week', bg: '#1D1B1A', fg: '#FFFFFF', hosts: [tiff.id], order: 2, slug: 'dear-tiffany', live: true } })
  await p.create({
    collection: 'episodes',
    data: {
      title: 'You don’t have a spending problem', show: dt.id, number: 18, published: new Date().toISOString(),
      audioUrl: '/audio/sample.mp3', duration: 180, guid: 'seed-dt-018', speakers: [tiff.id], slug: 'dear-tiffany-018', live: true,
      chapters: [{ at: '0:00', title: 'Cold open' }, { at: '0:40', title: '[Chapter]' }, { at: '1:30', title: '[Chapter]' }],
    },
  })
  console.log('seeded')
  process.exit(0)
}
await run().catch((e) => { console.error(e); process.exit(1) })
