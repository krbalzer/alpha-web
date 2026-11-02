import type { CollectionConfig, GlobalConfig } from 'payload'
import { img, live, publicRead, seo, slug } from './fields'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Newswire article', plural: 'Newswire' },
  access: publicRead,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'published', 'live'] },
  defaultSort: '-published',
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
  ],
}
