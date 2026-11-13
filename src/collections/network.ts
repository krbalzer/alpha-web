import type { CollectionConfig } from 'payload'
import { guard } from './guard'
import { img, live, publicRead, seo, slug } from './fields'

// 'Oh' and 'OH' must be the same state: flags, grouping and filters key on the code
const upperState = ({ value }: { value?: unknown }) => (typeof value === 'string' ? value.trim().toUpperCase() : value)

const SERVICES = ['Injectables', 'Lasers', 'Facials', 'Skincare', 'Wellness', 'Weight loss', 'Hormone therapy', 'Body', 'Surgery', 'Hair']

/** One partner brand. PTR number is join order and drives every "PTR 016" label. */
export const Brands: CollectionConfig = {
  slug: 'brands',
  access: publicRead,
  admin: { useAsTitle: 'name', defaultColumns: ['ptr', 'name', 'since', 'live'], listSearchableFields: ['name'] },
  defaultSort: 'ptr',
  hooks: { beforeValidate: [guard] },
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'short', type: 'text', admin: { description: 'Short name for tight spots, e.g. "Preva".' } },
      { name: 'ptr', label: 'PTR #', type: 'number', required: true, unique: true, admin: { description: 'Join order. 16 renders as PTR 016.' } },
    ] },
    { type: 'row', fields: [
      { name: 'since', label: 'Partner since', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } } },
      { name: 'established', type: 'number' },
      { name: 'website', label: 'Booking URL', type: 'text', admin: { description: 'Drives the "Book at" button on brand pages.' } },
    ] },
    { name: 'services', type: 'select', hasMany: true, options: SERVICES },
    { name: 'announced', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Partnership publicly launched. Off: the page can exist, but the brand is left out of "new partner" moments (homepage, newswire, menu).' } },
    { name: 'founders', type: 'relationship', relationTo: 'founders', hasMany: true },
    { name: 'intro', type: 'textarea', admin: { description: 'One or two sentences under the H1.' } },
    { name: 'practice', label: 'The practice', type: 'group', fields: [
      { name: 'eyebrow', type: 'text', defaultValue: 'The practice' },
      { name: 'headline', type: 'textarea' },
      { name: 'body', type: 'richText' },
      img('image'),
    ] },
    { name: 'insideTitle', label: 'Inside / headline', type: 'textarea', admin: { description: 'Over the Inside filmstrip, e.g. "A Tuesday at Privé". Empty: "A day at" + short name.' } },
    { name: 'inside', label: 'Inside the practice', type: 'array', admin: { description: 'Filmstrip under The practice, in order: a day inside the practice. Caption each one, e.g. "Tox / Room 2". Tall, wide and square photos all work.' }, fields: [
      img('image', undefined, true),
      { name: 'caption', type: 'text', admin: { description: 'Short, e.g. "Front desk / Lewis Center".' } },
    ] },
    { name: 'film', type: 'group', fields: [
      { name: 'video', type: 'upload', relationTo: 'media', admin: { description: 'Brand film, played on the page. Set by pnpm ingest:video with 720p / 1080p / 2160p renditions.' } },
      { name: 'url', label: 'External URL (fallback)', type: 'text', admin: { description: 'Only used when no video is uploaded.' } },
      img('poster'),
      { name: 'caption', type: 'textarea', admin: { description: 'Lines from the film itself, verbatim.' } },
    ] },
    { name: 'stats', type: 'array', maxRows: 3, admin: { description: 'Capacity / Demand / Depth columns.' }, fields: [
      { type: 'row', fields: [
        { name: 'kicker', type: 'text' }, { name: 'value', type: 'text' }, { name: 'label', type: 'text' },
      ] },
      { name: 'rows', type: 'array', maxRows: 4, fields: [{ type: 'row', fields: [{ name: 'k', type: 'text' }, { name: 'v', type: 'text' }] }] },
    ] },
    { name: 'why', label: 'Why Alpha', type: 'group', fields: [
      { name: 'headline', type: 'textarea', admin: { description: 'In the founder\'s words. Verbatim.' } },
      { name: 'body', type: 'richText' },
      img('image'),
    ] },
    { name: 'quote', type: 'group', fields: [
      { name: 'text', type: 'textarea', admin: { description: 'Verbatim only. Source it from an interview transcript.' } },
      { name: 'source', type: 'text', admin: { description: 'Where the line comes from (interview, date).' } },
    ] },
    { name: 'heroVideo', type: 'upload', relationTo: 'media', admin: { description: 'Silent loop, 100vh hero.' } },
    img('heroPoster', 'Hero poster'),
    img('logo'),
    { name: 'tone', type: 'text', admin: { description: 'Brand accent hex, used on cards and map pins.' } },
    { name: 'locations', type: 'join', collection: 'locations', on: 'brand' },
    { name: 'tuckIns', label: 'Tuck-ins', type: 'join', collection: 'tuck-ins', on: 'brand' },
    live,
    slug(),
    seo,
  ],
}

export const Locations: CollectionConfig = {
  slug: 'locations',
  access: publicRead,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'brand', 'order', 'origin', 'state', 'live'] },
  hooks: {
    beforeValidate: [guard],
    beforeChange: [({ data }) => ({ ...data, title: data.name || [data.city, data.state].filter(Boolean).join(', ') })],
  },
  fields: [
    { name: 'title', type: 'text', admin: { hidden: true } },
    { name: 'name', label: 'Location name', type: 'text', admin: { description: 'Only when the location has its own name, e.g. Refined at Blossom. Otherwise the page reads "Refined / Winchester, VA".' } },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'order', type: 'number', admin: { position: 'sidebar', description: 'Order within the brand, 1 first (usually the order they opened). Used on every page that lists the brand\'s locations.' } },
    { type: 'row', fields: [
      { name: 'city', type: 'text', required: true },
      { name: 'state', type: 'text', required: true, maxLength: 2, hooks: { beforeValidate: [upperState] } },
      { name: 'zip', type: 'text' },
    ] },
    { type: 'row', fields: [
      { name: 'origin', type: 'select', defaultValue: 'original', options: [
        { label: 'With the partner at close', value: 'original' },
        { label: 'Tuck-in', value: 'tuck-in' },
        { label: 'De novo (opened since partnering)', value: 'de-novo' },
      ] },
      { name: 'opened', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } } },
      { name: 'formerName', type: 'text', admin: { condition: (_, s) => s?.origin === 'tuck-in', description: 'e.g. Blossom Medical' } },
    ] },
    { name: 'address1', type: 'text' },
    { name: 'address2', type: 'text' },
    { type: 'row', fields: [
      { name: 'lat', type: 'number', required: true },
      { name: 'lng', type: 'number', required: true },
      { name: 'mapBearing', type: 'number', defaultValue: 0, admin: { description: 'Map rotation in degrees when flying to this pin.' } },
    ] },
    { name: 'story', label: 'Place story', type: 'richText', admin: { description: 'Lead paragraph under "Inside". 80 to 120 words, true of this location only.' } },
    { type: 'row', fields: [
      { name: 'phone', type: 'text' },
      { name: 'bookingUrl', type: 'text' },
      { name: 'googlePlaceId', label: 'Google place ID', type: 'text', admin: { description: 'Google Maps listing for this location. Rating, reviews and (when Hours is empty) opening hours sync from it once a day, on deploy.' } },
    ] },
    { name: 'hours', type: 'array', admin: { description: 'One row per day range, e.g. "Mon to Fri" / "9am to 6pm".' }, fields: [
      { type: 'row', fields: [{ name: 'days', type: 'text', required: true }, { name: 'time', type: 'text', required: true }] },
    ] },
    { name: 'google', label: 'Google snapshot', type: 'group', admin: { readOnly: true, description: 'Written by the daily Google sync (src/seed/places-sync.ts). Not edited by hand.' }, fields: [
      { type: 'row', fields: [{ name: 'rating', type: 'number' }, { name: 'count', type: 'number' }, { name: 'syncedAt', type: 'date' }] },
      { name: 'uri', type: 'text' },
      { name: 'reviews', type: 'json' },
    ] },
    { name: 'arrivalNote', type: 'textarea', admin: { description: 'Parking and entrance, one or two lines.' } },
    { name: 'milestones', label: 'Since Alpha', type: 'array', maxRows: 5, admin: { description: 'What changed at this address. Dated, one line each.' }, fields: [
      { type: 'row', fields: [{ name: 'when', type: 'text', required: true, admin: { description: 'e.g. Jun 2025' } }, { name: 'line', type: 'text', required: true }] },
    ] },
    { name: 'quote', type: 'group', fields: [
      { name: 'text', type: 'textarea', admin: { description: 'Verbatim only, from the provider who leads this location.' } },
      { name: 'source', type: 'text', admin: { description: 'Where the line comes from (interview, date).' } },
    ] },
    { name: 'lead', label: 'Location lead', type: 'group', admin: { description: 'The provider who runs this location. The founder shows automatically; no full roster on purpose.' }, fields: [
      { type: 'row', fields: [{ name: 'name', type: 'text' }, { name: 'credentials', type: 'text' }, { name: 'title', type: 'text', admin: { description: 'e.g. Lead provider' } }] },
      img('photo'),
      { name: 'profile', type: 'relationship', relationTo: 'founders', admin: { description: 'Only if they have a Founder page.' } },
    ] },
    { name: 'roleMix', label: 'Team by role', type: 'array', admin: { description: 'Counts only, no names. Renders as "9 providers / 4 NPs, 3 RNs, 2 aestheticians".' }, fields: [
      { type: 'row', fields: [{ name: 'role', type: 'text', required: true, admin: { description: 'Plural, e.g. NPs' } }, { name: 'count', type: 'number', required: true, min: 1 }] },
    ] },
    img('photo', 'Location photo'),
    { name: 'gallery', type: 'array', admin: { description: 'Inside this location, in order: the first two run large (arrival, front desk), the next three in a row (treatment rooms, consult, retail).' }, fields: [
      img('image', undefined, true),
      { type: 'row', fields: [
        { name: 'kind', type: 'select', required: true, defaultValue: 'treatment-room', options: [
          { label: 'Arrival', value: 'arrival' }, { label: 'Front desk', value: 'front-desk' }, { label: 'Treatment room', value: 'treatment-room' },
          { label: 'Consult', value: 'consult' }, { label: 'Retail', value: 'retail' }, { label: 'Detail', value: 'detail' },
        ] },
        { name: 'caption', type: 'text' },
      ] },
    ] },
    { name: 'heroVideo', type: 'upload', relationTo: 'media', admin: { description: 'Silent loop, 100vh hero. Leave empty and the map becomes the hero.' } },
    img('heroPoster', 'Hero poster'),
    live,
    slug('brand + city'),
    seo,
  ],
}

/** KOL pages. Founders are the hero, Alpha is the guide. */
export const Founders: CollectionConfig = {
  slug: 'founders',
  access: publicRead,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'kind', 'status', 'live'] },
  hooks: { beforeValidate: [guard] },
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'kind', type: 'select', defaultValue: 'provider', options: [{ label: 'Provider', value: 'provider' }, { label: 'Business founder', value: 'business' }] },
      { name: 'status', type: 'select', defaultValue: 'active', options: [{ label: 'Active with the practice', value: 'active' }, { label: 'No longer involved', value: 'former' }], admin: { description: 'Former founders keep their story, framed in the past tense.' } },
    ] },
    { name: 'credentials', type: 'text', admin: { condition: (_, s) => s?.kind !== 'business', description: 'e.g. MSN, CPNP-AC, FNP-C. Confirm with the founder.' } },
    { name: 'brands', type: 'join', collection: 'brands', on: 'founders' },
    { name: 'tuckIns', label: 'Tuck-ins', type: 'join', collection: 'tuck-ins', on: 'founders' },
    img('headshot', undefined, false),
    img('portrait', 'Portrait (wide)'),
    { name: 'headline', type: 'text' },
    { name: 'bio', type: 'richText' },
    { name: 'traits', type: 'array', maxRows: 4, fields: [{ name: 'label', type: 'text' }, { name: 'line', type: 'textarea' }] },
    { name: 'quotes', type: 'array', admin: { description: 'Verbatim lines only, with source.' }, fields: [
      { name: 'text', type: 'textarea', required: true },
      { name: 'source', type: 'text', required: true },
    ] },
    { name: 'milestones', type: 'array', fields: [{ name: 'year', type: 'number' }, { name: 'line', type: 'text' }] },
    { name: 'episodes', type: 'relationship', relationTo: 'episodes', hasMany: true },
    live,
    slug(),
    seo,
  ],
}

/** Closer backgrounds. Separate from location photos on purpose: curated, text-free, readable under a white headline. */
export const CtaImages: CollectionConfig = {
  slug: 'cta-images',
  labels: { singular: 'CTA image', plural: 'CTA images' },
  access: publicRead,
  admin: { useAsTitle: 'label', defaultColumns: ['label', 'location', 'active'] },
  fields: [
    { name: 'label', type: 'text', required: true },
    img('image', undefined, true),
    { name: 'location', type: 'relationship', relationTo: 'locations', admin: { description: 'Drives the caption, and lets a brand page skip its own image.' } },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'soften', type: 'checkbox', admin: { description: 'Heavy blur. Only for stand-in frames that have text burned in.' } },
  ],
}

/** A practice folded into a partner brand after close. Either it becomes a location (Blossom Medical, now Refined at Blossom)
 *  or only its providers and patients move over (Seaside into RN Esthetics). Founder stories hang here, framed as joining the brand and Alpha. */
export const TuckIns: CollectionConfig = {
  slug: 'tuck-ins',
  labels: { singular: 'Tuck-in', plural: 'Tuck-ins' },
  access: publicRead,
  admin: { useAsTitle: 'formerName', defaultColumns: ['formerName', 'brand', 'kind', 'closed', 'live'] },
  hooks: { beforeValidate: [guard] },
  fields: [
    { type: 'row', fields: [
      { name: 'formerName', label: 'Practice name before', type: 'text', required: true },
      { name: 'brand', label: 'Folded into', type: 'relationship', relationTo: 'brands', required: true, index: true },
      { name: 'closed', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } } },
    ] },
    { type: 'row', fields: [
      { name: 'kind', type: 'select', required: true, defaultValue: 'location', options: [
        { label: 'Became a location', value: 'location' },
        { label: 'Merged in (providers and patients, no location)', value: 'merged' },
      ] },
      { name: 'location', type: 'relationship', relationTo: 'locations', admin: { condition: (_, s) => s?.kind === 'location' } },
    ] },
    { type: 'row', fields: [{ name: 'city', type: 'text' }, { name: 'state', type: 'text', maxLength: 2, hooks: { beforeValidate: [upperState] } }] },
    { name: 'founders', type: 'relationship', relationTo: 'founders', hasMany: true },
    { name: 'story', type: 'richText', admin: { description: 'Packaged as joining the brand and Alpha.' } },
    { name: 'film', type: 'text', label: 'Founder story video (Stream ID)' },
    { name: 'quote', type: 'group', fields: [
      { name: 'text', type: 'textarea', admin: { description: 'Verbatim only.' } },
      { name: 'source', type: 'text' },
    ] },
    { name: 'chapter', label: 'Location page chapter', type: 'group', admin: { description: 'The "Joined" chapter on the location page. Shows once it has a headline.' }, fields: [
      { name: 'headline', type: 'text', admin: { description: 'e.g. First she trained here. Now it is one practice.' } },
      { name: 'intro', type: 'textarea', admin: { description: 'Two or three sentences: who, how they met, when it became one practice.' } },
      { name: 'pair', label: 'The two founders', type: 'array', maxRows: 2, admin: { description: 'Joining founder first, then the brand founder. One verbatim line each.' }, fields: [
        { type: 'row', fields: [{ name: 'name', type: 'text', required: true, admin: { description: 'With credentials, e.g. Dr. Lynn Nieman, MD' } }, { name: 'line', type: 'text', admin: { description: 'e.g. Founder / Blossom Medical' } }] },
        img('photo'),
        { name: 'quote', type: 'textarea', admin: { description: 'Verbatim only.' } },
        { name: 'source', type: 'text', admin: { description: 'e.g. Interview 00:13:07 / on Sarah' } },
      ] },
      { name: 'kept', label: 'What stays', type: 'array', maxRows: 3, admin: { description: 'What patients keep, e.g. the name, the physician, the address.' }, fields: [
        { type: 'row', fields: [{ name: 'label', type: 'text', required: true, admin: { description: 'e.g. The name' } }, { name: 'title', type: 'text', required: true, admin: { description: 'e.g. Blossom stays in it' } }] },
        { name: 'line', type: 'textarea' },
        { type: 'row', fields: [{ name: 'quote', type: 'text', admin: { description: 'Optional, verbatim.' } }, { name: 'source', type: 'text' }] },
      ] },
      { name: 'films', type: 'array', maxRows: 4, admin: { description: 'Vertical (9:16) story films, click to play.' }, fields: [
        { type: 'row', fields: [{ name: 'title', type: 'text', required: true }, { name: 'line', type: 'text' }] },
        { name: 'quote', type: 'text', admin: { description: 'A verbatim line from the film, shown on the poster.' } },
        { type: 'row', fields: [img('video', undefined, true), img('poster')] },
      ] },
    ] },
    live,
    slug('former name'),
  ],
}
