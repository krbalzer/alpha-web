import { guard } from './guard'
import type { CollectionConfig, GlobalConfig } from 'payload'
import { img, live, publicRead, seo, slug } from './fields'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Newswire article', plural: 'Newswire' },
  access: publicRead,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'published', 'live'] },
  defaultSort: '-published',
  hooks: { beforeValidate: [guard] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { type: 'row', fields: [
      { name: 'category', type: 'select', options: ['Partnership', 'Network', 'Press', 'Team', 'Podcast'] },
      { name: 'published', type: 'date', required: true },
    ] },
    { name: 'dek', type: 'textarea' },
    img('cover'),
    { name: 'body', type: 'richText' },
    { name: 'brands', type: 'relationship', relationTo: 'brands', hasMany: true },
    { name: 'author', type: 'relationship', relationTo: 'team' },
    live,
    slug('title'),
    seo,
  ],
}

export const Resources: CollectionConfig = {
  slug: 'resources',
  access: publicRead,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'format', 'gated'] },
  hooks: { beforeValidate: [guard] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { type: 'row', fields: [
      { name: 'format', type: 'select', options: ['Guide', 'Template', 'Calculator', 'Checklist', 'Video'] },
      { name: 'gated', type: 'checkbox', defaultValue: true },
    ] },
    { name: 'summary', type: 'textarea' },
    img('cover'),
    { name: 'file', type: 'upload', relationTo: 'media' },
    live,
    slug('title'),
    seo,
  ],
}

/** Network numbers live in one place. Homepage, menu and Locations read from here. */
export const Network: GlobalConfig = {
  slug: 'network',
  access: { read: () => true },
  fields: [
    { type: 'row', fields: [
      { name: 'brandsOverride', type: 'number', admin: { description: 'Leave empty to count live Brands.' } },
      { name: 'locationsOverride', type: 'number', admin: { description: 'Leave empty to count live Locations.' } },
      { name: 'statesOverride', type: 'number', admin: { description: 'Leave empty to count distinct states.' } },
    ] },
    { name: 'address', type: 'text', defaultValue: '993 Governor Dr #101, El Dorado Hills, CA 95762' },
    { name: 'instagram', type: 'text' },
    { name: 'linkedin', type: 'text' },
    {
      name: 'suppressed', label: 'Never publish', type: 'array',
      access: { read: ({ req }) => !!req.user, update: ({ req }) => !!req.user },
      admin: { description: 'People who must not appear anywhere on the site. Any save that mentions one of these names is blocked. Staff only; never sent to the site.' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
}

/** Privacy, Terms, Accessibility. One template; each section is its own rich text so the page builds its table of contents. */
export const Legal: CollectionConfig = {
  slug: 'legal',
  labels: { singular: 'Legal page', plural: 'Legal' },
  access: publicRead,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updated'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'updated', type: 'date', required: true },
    { name: 'order', type: 'number', defaultValue: 1 },
    { name: 'sections', type: 'array', minRows: 1, fields: [{ name: 'heading', type: 'text', required: true }, { name: 'body', type: 'richText', required: true }] },
    live,
    slug('title'),
  ],
}

/** Let's talk submissions. Written by /talk/submit; staff only. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  access: { read: ({ req }) => !!req.user, create: () => false, update: ({ req }) => !!req.user, delete: ({ req }) => !!req.user },
  admin: { useAsTitle: 'email', defaultColumns: ['createdAt', 'kind', 'name', 'practice', 'email', 'status'] },
  defaultSort: '-createdAt',
  fields: [
    { type: 'row', fields: [
      { name: 'kind', type: 'select', options: [{ label: 'Partner inquiry', value: 'partner' }, { label: 'Something else', value: 'other' }], required: true },
      { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'contacted', 'qualified', 'closed'] },
    ] },
    { type: 'row', fields: [{ name: 'name', type: 'text' }, { name: 'practice', type: 'text' }] },
    { type: 'row', fields: [{ name: 'email', type: 'email', required: true }, { name: 'phone', type: 'text' }] },
    { name: 'topic', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'answers', type: 'json', admin: { description: 'Qualifier answers.' } },
    { name: 'page', type: 'text' },
  ],
}
