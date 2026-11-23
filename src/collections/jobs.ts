import type { CollectionConfig } from 'payload'
import { admin } from '../access'
import { guard } from './guard'
import { slug } from './fields'

/**
 * Open roles across the network, synced from Paylocity (public careers board). People Ops never touches the site:
 * a posting in Paylocity appears here; a posting removed from Paylocity is marked filled and drops off.
 * `paylocityId` is the sync key. `hidden` is the only manual override.
 */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  access: { read: () => true, create: admin, update: admin, delete: admin },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'brand', 'location', 'status', 'posted'], listSearchableFields: ['title'], description: 'Synced from Paylocity. Edit postings there, not here.' },
  defaultSort: '-posted',
  hooks: {
    beforeValidate: [
      guard,
      ({ data }) => (data && !data.slug && data.title
        ? { ...data, slug: `${String(data.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${String(data.paylocityId || Date.now().toString(36))}` }
        : data),
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { type: 'row', fields: [
      { name: 'brand', type: 'relationship', relationTo: 'brands', index: true, admin: { description: 'From the location, or the hiring organization when the role is remote.' } },
      { name: 'location', type: 'relationship', relationTo: 'locations', index: true, admin: { description: 'Matched by ZIP, then city + state, then a location\'s Paylocity name.' } },
    ] },
    { type: 'row', fields: [
      { name: 'paylocityLocation', type: 'text', admin: { readOnly: true, description: 'As written in Paylocity.' } },
      { name: 'remote', type: 'checkbox', admin: { readOnly: true } },
    ] },
    { name: 'description', type: 'textarea', admin: { readOnly: true, description: 'HTML from the Paylocity posting.' } },
    { name: 'applyUrl', label: 'Apply link', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'status', type: 'select', required: true, defaultValue: 'open', options: [{ label: 'Open', value: 'open' }, { label: 'Filled / removed', value: 'filled' }], admin: { position: 'sidebar', readOnly: true } },
    { name: 'hidden', type: 'checkbox', admin: { position: 'sidebar', description: 'Keep off the site even while open in Paylocity.' } },
    { name: 'posted', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'paylocityId', type: 'text', unique: true, index: true, admin: { position: 'sidebar', readOnly: true } },
    slug('title'),
  ],
}
