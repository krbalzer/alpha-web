import type { CollectionConfig } from 'payload'
import { img, live, publicRead, seo, slug } from './fields'

const SERVICES = ['Injectables', 'Lasers', 'Facials', 'Skincare', 'Wellness', 'Weight loss', 'Hormone therapy', 'Body', 'Surgery', 'Hair']

/** One partner brand. PTR number is join order and drives every "PTR 016" label. */
export const Brands: CollectionConfig = {
  slug: 'brands',
  access: publicRead,
  admin: { useAsTitle: 'name', defaultColumns: ['ptr', 'name', 'since', 'live'], listSearchableFields: ['name'] },
  defaultSort: 'ptr',
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'short', type: 'text', admin: { description: 'Short name for tight spots, e.g. "Preva".' } },
      { name: 'ptr', label: 'PTR #', type: 'number', required: true, unique: true, admin: { description: 'Join order. 16 renders as PTR 016.' } },
    ] },
    { type: 'row', fields: [
      { name: 'since', label: 'Partner since', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } } },
      { name: 'established', type: 'number' },
      { name: 'website', type: 'text' },
    ] },
    { name: 'services', type: 'select', hasMany: true, options: SERVICES },
    { name: 'founders', type: 'relationship', relationTo: 'founders', hasMany: true },
    { name: 'intro', type: 'textarea', admin: { description: 'One or two sentences under the H1.' } },
    { name: 'practice', label: 'The practice', type: 'group', fields: [
      { name: 'eyebrow', type: 'text', defaultValue: 'The practice' },
      { name: 'headline', type: 'textarea' },
      { name: 'body', type: 'richText' },
      img('image'),
    ] },
    { name: 'film', type: 'group', fields: [
      { name: 'url', label: 'Vimeo or YouTube URL', type: 'text' },
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
    live,
    slug(),
    seo,
  ],
}

export const Locations: CollectionConfig = {
  slug: 'locations',
  access: publicRead,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'brand', 'city', 'state', 'live'] },
  hooks: {
    beforeChange: [({ data }) => ({ ...data, title: [data.city, data.state].filter(Boolean).join(', ') })],
  },
  fields: [
    { name: 'title', type: 'text', admin: { hidden: true } },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { type: 'row', fields: [
      { name: 'city', type: 'text', required: true },
      { name: 'state', type: 'text', required: true, maxLength: 2 },
      { name: 'zip', type: 'text' },
    ] },
    { name: 'address1', type: 'text' },
    { name: 'address2', type: 'text' },
    { type: 'row', fields: [
      { name: 'lat', type: 'number', required: true },
      { name: 'lng', type: 'number', required: true },
      { name: 'mapBearing', type: 'number', defaultValue: 0, admin: { description: 'Map rotation in degrees when flying to this pin.' } },
    ] },
    { name: 'phone', type: 'text' },
    { name: 'bookingUrl', type: 'text' },
    { name: 'providers', type: 'array', fields: [{ name: 'name', type: 'text' }, { name: 'title', type: 'text' }, img('photo')] },
    img('photo', 'Location photo'),
    live,
    slug('brand + city'),
    seo,
  ],
}

/** KOL pages. Founders are the hero, Alpha is the guide. */
export const Founders: CollectionConfig = {
  slug: 'founders',
  access: publicRead,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'credentials', 'live'] },
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'credentials', type: 'text', admin: { description: 'e.g. MSN, CPNP-AC, FNP-C. Confirm with the founder.' } },
    ] },
    { name: 'brands', type: 'join', collection: 'brands', on: 'founders' },
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
