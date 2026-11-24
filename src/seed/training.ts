/**
 * Alpha University: the training log (Liz's master list, Public-worthy rows) loaded into Training events once.
 * Runs in prebuild. Does nothing when the collection already has records, so Katie's edits always win.
 * AIM covers ship in src/seed/media/aim and are uploaded only when the Blob token can write.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'

type Ev = {
  kind: 'aim' | 'lab'; date: string; status?: 'held' | 'upcoming' | 'cancelled'; speaker?: string; season?: number; topic: string; cover?: string
  track?: 'injector' | 'skincare' | 'cadaver' | 'regional' | 'surgical'; location?: string; venue?: string; city?: string; lat?: number; lng?: number; public?: boolean; note?: string
}

const AMI = { venue: 'Allergan Medical Institute', city: 'Irvine, CA', lat: 33.684, lng: -117.826 }
const EVENTS: Ev[] = [
  // AIM, season 1 (Nov 2024 to Jun 2025)
  { kind: 'aim', season: 1, date: '2024-11-05', speaker: 'Julie Horne', topic: 'Advanced lip techniques', cover: 'aim-horne.jpg' },
  { kind: 'aim', season: 1, date: '2025-01-07', speaker: 'Dr. Tom van Eijk', topic: 'The fern pattern technique', cover: 'aim-vaneijk.jpg' },
  { kind: 'aim', season: 1, date: '2025-03-11', speaker: 'Waseem Garbia', topic: 'Ariessence Q&A', public: false, note: 'Replaced Dr. Steve Yoelin. Product Q&A, kept off the page.' },
  { kind: 'aim', season: 1, date: '2025-03-12', speaker: 'Julie Horne', topic: 'Lips, with in-person sessions at HTB' },
  { kind: 'aim', season: 1, date: '2025-04-01', speaker: 'Leslie Fletcher', topic: 'Advanced injectables', cover: 'aim-fletcher.jpg' },
  { kind: 'aim', season: 1, date: '2025-05-13', speaker: 'Dr. Steve Weiner', topic: 'Live Q&A', cover: 'aim-weiner.jpg' },
  { kind: 'aim', season: 1, date: '2025-06-24', speaker: 'Lori Robertson', topic: 'Live Q&A, part one', cover: 'aim-robertson.jpg' },
  // AIM, season 2
  { kind: 'aim', season: 2, date: '2025-08-05', speaker: 'Dr. Steve Yoelin', topic: 'Advanced injectables, moderated by Sarah Safa', cover: 'aim-yoelin.jpg' },
  { kind: 'aim', season: 2, date: '2025-09-24', speaker: 'Dr. Kian Karimi', topic: 'Live Q&A', cover: 'aim-karimi.jpg' },
  { kind: 'aim', season: 2, date: '2025-12-02', speaker: 'Dr. Rami Batniji', topic: 'Live Q&A', status: 'cancelled' },
  { kind: 'aim', season: 2, date: '2026-01-27', speaker: 'Lori Robertson', topic: 'Live Q&A, part two' },
  // AIM, season 3
  { kind: 'aim', season: 3, date: '2026-08-25', speaker: 'Prof. Sebastian Cotofana, MD', topic: 'Live session, not recorded' },
  // Labs (in person)
  { kind: 'lab', date: '2024-10-10', track: 'injector', topic: 'Filler training, new temple indication', location: 'the-laser-center-of-marin-corte-matero-ca' },
  { kind: 'lab', date: '2025-01-20', track: 'regional', topic: 'First East Coast regional Lab', location: 'williams-center-latham-ny' },
  { kind: 'lab', date: '2025-03-14', track: 'injector', topic: 'Julie Horne lip training', location: 'holden-timeless-beauty-san-diego-ca' },
  { kind: 'lab', date: '2025-03-31', track: 'injector', topic: 'Alpha Labs training day', location: 'the-laser-center-of-marin-corte-matero-ca' },
  { kind: 'lab', date: '2025-06-04', track: 'skincare', topic: 'Esthetician training', location: 'the-laser-center-of-marin-corte-matero-ca' },
  { kind: 'lab', date: '2025-09-10', track: 'injector', topic: 'Injectables and BBL', location: 'cami-greensboro-nc' },
  { kind: 'lab', date: '2025-10-18', track: 'cadaver', topic: 'First Alpha Cadaver Lab, powered by AMI', ...AMI },
  { kind: 'lab', date: '2026-06-10', track: 'injector', topic: 'Plated training', location: 'williams-center-latham-ny', venue: 'The Rejuva Center' },
  { kind: 'lab', date: '2026-08-05', track: 'injector', topic: 'Radiesse, two days', location: 'esthetics-center-sacramento-ca' },
  { kind: 'lab', date: '2026-08-07', track: 'surgical', topic: 'Cutter training for the OR launch', location: 'williams-center-latham-ny' },
  { kind: 'lab', date: '2026-08-08', track: 'cadaver', topic: 'Second annual AMI Cadaver Lab', ...AMI },
  { kind: 'lab', date: '2026-10-03', track: 'injector', topic: 'Filler and neurotoxin training', location: 'mint-needle-lewes-de' },
]

async function cover(p: Payload, name: string, alt: string) {
  const hit = (await p.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1, depth: 0 })).docs[0]
  if (hit) return hit.id as number
  const file = path.resolve(process.cwd(), 'src/seed/media/aim', name)
  if (!fs.existsSync(file)) return undefined
  const data = fs.readFileSync(file)
  return (await p.create({ collection: 'media', data: { alt }, file: { data, mimetype: 'image/jpeg', name, size: data.length } })).id as number
}

export async function seedTraining(p: Payload, opts: { covers: boolean }) {
  if ((await p.count({ collection: 'training-events' })).totalDocs) return fillCovers(p, opts)
  const locs = new Map<string, number>()
  for (const l of (await p.find({ collection: 'locations', limit: 1000, depth: 0, select: { slug: true } })).docs) locs.set(String(l.slug), l.id as number)
  let n = 0
  for (const e of EVENTS) {
    const { cover: c, location, public: pub, status, ...rest } = e
    const data: Record<string, unknown> = { ...rest, date: e.date + 'T12:00:00.000Z', status: status || 'held', public: pub ?? true }
    if (location) data.location = locs.get(location)
    if (c && opts.covers) data.cover = await cover(p, c, `AIM: ${e.speaker}`)
    await p.create({ collection: 'training-events', data: data as never, overrideAccess: true })
    n++
  }
  // first numbers for the settings page
  await p.updateGlobal({ slug: 'university', data: { members: { injector: 133 }, support: { reply: '< 1 min', solved: '3 days' }, vendorSessions: 18 } as never, overrideAccess: true })
  p.logger.info(`training: ${n} events loaded from the training log`)
}

/** Shipped AIM covers for sessions that still have none (e.g. the first load ran without a Blob token). Never replaces a cover. */
async function fillCovers(p: Payload, opts: { covers: boolean }) {
  if (!opts.covers) return
  for (const e of EVENTS.filter((x) => x.cover)) {
    const hit = (await p.find({ collection: 'training-events', where: { and: [{ kind: { equals: 'aim' } }, { date: { equals: e.date + 'T12:00:00.000Z' } }] }, limit: 1, depth: 0 })).docs[0]
    if (hit && !hit.cover) await p.update({ collection: 'training-events', id: hit.id, data: { cover: await cover(p, e.cover!, `AIM: ${e.speaker}`) } as never, overrideAccess: true })
  }
}
