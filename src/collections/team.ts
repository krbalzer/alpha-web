import { guard } from './guard'
import type { CollectionConfig } from 'payload'
import { img, live, publicRead, seo, slug } from './fields'

/** SSO departments. Timeline span is in percent of the partnership journey (Start 0, LOI 33.3, Closed 43.75, Integrated 76.1, Ongoing 89). */
export const Departments: CollectionConfig = {
  slug: 'departments',
  access: publicRead,
  admin: { useAsTitle: 'name', defaultColumns: ['order', 'name', 'live'] },
  defaultSort: 'order',
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'order', type: 'number', required: true },
    ] },
    { name: 'line', type: 'text', admin: { description: 'One line: what this team owns for a partner.' } },
    { name: 'intro', type: 'richText' },
    { name: 'timeline', type: 'group', fields: [
      { type: 'row', fields: [
        { name: 'start', type: 'number', min: 0, max: 101, required: true },
        { name: 'end', type: 'number', min: 0, max: 101, required: true },
      ] },
      { name: 'phases', type: 'array', minRows: 4, maxRows: 4, admin: { description: 'Before LOI, Diligence to close, Integration, Ongoing.' }, fields: [{ name: 'line', type: 'text' }] },
    ] },
    { name: 'owns', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'members', type: 'join', collection: 'team', on: 'department' },
    live,
    slug(),
    seo,
  ],
}

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Team member', plural: 'Team' },
  access: publicRead,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'title', 'department', 'order'] },
  defaultSort: 'order',
  hooks: { beforeValidate: [guard] },
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
    ] },
    { type: 'row', fields: [
      { name: 'department', type: 'relationship', relationTo: 'departments', required: true },
      { name: 'order', type: 'number', defaultValue: 99 },
      { name: 'leader', type: 'checkbox', admin: { description: 'Department lead, shown first.' } },
    ] },
    img('headshot'),
    { name: 'askAbout', label: 'Ask me about', type: 'text', admin: { description: 'Two to four words. Shows on hover on the Team page, e.g. "the 90-day plan".' } },
    { name: 'bio', type: 'richText' },
    { name: 'ownsForYou', label: 'What they own for a partner', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'metrics', type: 'array', maxRows: 3, admin: { description: 'Role metrics that replace vanity stats in the hero.' }, fields: [
      { name: 'value', type: 'text' }, { name: 'label', type: 'text' },
    ] },
    { name: 'background', type: 'array', fields: [{ name: 'org', type: 'text' }, { name: 'role', type: 'text' }, { name: 'years', type: 'text' }] },
    { name: 'linkedin', type: 'text' },
    { name: 'quote', type: 'group', fields: [{ name: 'text', type: 'textarea' }, { name: 'source', type: 'text' }] },
    live,
    slug(),
    seo,
  ],
}
