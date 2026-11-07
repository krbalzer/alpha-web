import { guard } from './guard'
import type { CollectionConfig } from 'payload'
import { img, live, publicRead, seo, slug } from './fields'

export const Shows: CollectionConfig = {
  slug: 'shows',
  access: publicRead,
  admin: { useAsTitle: 'name', defaultColumns: ['order', 'name', 'schedule', 'live'] },
  defaultSort: 'order',
  hooks: { beforeValidate: [guard] },
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'short', type: 'text' },
      { name: 'order', type: 'number' },
    ] },
    { name: 'tagline', type: 'textarea' },
    { name: 'schedule', type: 'text', admin: { description: 'e.g. New every Wednesday' } },
    { name: 'hosts', type: 'relationship', relationTo: 'speakers', hasMany: true },
    { type: 'row', fields: [
      { name: 'bg', label: 'Cover color', type: 'text' },
      { name: 'fg', label: 'Type color', type: 'text' },
    ] },
    img('artwork'),
    { name: 'rss', label: 'Libsyn RSS URL', type: 'text', admin: { description: 'Episodes import from here.' } },
    { name: 'links', type: 'group', fields: [
      { name: 'spotify', type: 'text' }, { name: 'apple', type: 'text' }, { name: 'youtube', type: 'text' },
    ] },
    { name: 'featured', type: 'checkbox', admin: { description: 'Shows in the podcasts hero carousel.' } },
    live,
    slug(),
    seo,
  ],
}

/** Imported from RSS (guid is the key), then enriched by hand: chapters, guests, tags, transcript. */
export const Episodes: CollectionConfig = {
  slug: 'episodes',
  access: publicRead,
  admin: { useAsTitle: 'title', defaultColumns: ['show', 'number', 'title', 'published'], listSearchableFields: ['title'] },
  defaultSort: '-published',
  hooks: { beforeValidate: [guard] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { type: 'row', fields: [
      { name: 'show', type: 'relationship', relationTo: 'shows', required: true, index: true },
      { name: 'number', type: 'number' },
      { name: 'published', type: 'date', index: true },
    ] },
    { type: 'row', fields: [
      { name: 'audioUrl', type: 'text', required: true },
      { name: 'duration', type: 'number', admin: { description: 'Seconds.' } },
      { name: 'guid', type: 'text', unique: true, admin: { description: 'RSS guid. Do not edit.' } },
    ] },
    { name: 'summary', type: 'textarea' },
    { name: 'speakers', type: 'relationship', relationTo: 'speakers', hasMany: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'brands', label: 'Brands mentioned', type: 'relationship', relationTo: 'brands', hasMany: true },
    { name: 'chapters', type: 'array', fields: [{ name: 'at', type: 'text', admin: { description: 'mm:ss' } }, { name: 'title', type: 'text' }] },
    { name: 'pullQuotes', type: 'array', admin: { description: 'Verbatim from the transcript, with timestamp.' }, fields: [
      { name: 'text', type: 'textarea' }, { name: 'at', type: 'text' },
    ] },
    { name: 'transcript', type: 'richText' },
    { name: 'video', label: 'YouTube URL', type: 'text' },
    live,
    slug('title'),
    seo,
  ],
}

export const Speakers: CollectionConfig = {
  slug: 'speakers',
  access: publicRead,
  admin: { useAsTitle: 'name' },
  hooks: { beforeValidate: [guard] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text' },
    img('headshot'),
    { name: 'bio', type: 'textarea' },
    { name: 'teamMember', type: 'relationship', relationTo: 'team', admin: { description: 'Link if they are on the Alpha team.' } },
    { name: 'founder', type: 'relationship', relationTo: 'founders', admin: { description: 'Link if they are a partner founder.' } },
    slug(),
  ],
}

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: publicRead,
  admin: { useAsTitle: 'name' },
  fields: [{ name: 'name', type: 'text', required: true }, slug()],
}
