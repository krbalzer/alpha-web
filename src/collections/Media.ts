import { guard } from './guard'
import type { CollectionConfig } from 'payload'
import { allow, createdBy, scoped } from '../access'

// Resized copies are WebP. The original is stored untouched, so a poster exported as AVIF stays sharp.
const webp = { format: 'webp' as const, options: { quality: 82 } }
const isVideo = (d: unknown) => String((d as { mimeType?: string } | undefined)?.mimeType || '').startsWith('video/')

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: allow('contributor'),
    // contributors manage their own uploads; placing them on pages stays with admin
    update: scoped('contributor', (req) => ({ createdBy: { equals: req.user!.id } })),
    delete: scoped('contributor', (req) => ({ createdBy: { equals: req.user!.id } })),
  },
  admin: { defaultColumns: ['filename', 'alt', 'mimeType'] },
  hooks: { beforeValidate: [guard] },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { type: 'row', fields: [
      { name: 'brand', type: 'relationship', relationTo: 'brands', admin: { description: 'Which partner this is for.' } },
      { name: 'location', type: 'relationship', relationTo: 'locations', admin: { description: 'Optional: a specific address.' } },
    ] },
    {
      name: 'kind', label: 'Intended for', type: 'select', hasMany: true,
      admin: { description: 'Where you think it belongs. Placement is decided by the site admin.' },
      options: [
        { label: 'The practice (team backstage, founder with patient)', value: 'practice' },
        { label: 'The experience (arrival, desk, consult, treatment, detail, town)', value: 'experience' },
        { label: 'Why Alpha (partners with Alpha / each other)', value: 'why-alpha' },
        { label: 'Since partnering (a dated moment)', value: 'milestone' },
        { label: 'CTA (quiet location detail, room for type)', value: 'cta' },
        { label: 'Exterior / arrival', value: 'arrival' },
        { label: 'Rebrand: logo, mark, guidelines', value: 'rebrand-identity' },
        { label: 'Rebrand: applications, mockups, signage', value: 'rebrand-application' },
        { label: 'Podcast guest headshot', value: 'headshot' },
      ],
    },
    { name: 'credit', type: 'text', admin: { description: 'Photographer or designer.' } },
    createdBy,
    {
      name: 'variants',
      type: 'group',
      admin: { condition: isVideo, description: 'Web renditions, written by pnpm ingest:video. This file is the H.264 1080p default.' },
      fields: [
        { name: 'av1', label: 'AV1 1080p', type: 'upload', relationTo: 'media' },
        { name: 'small', label: 'H.264 720p (phones)', type: 'upload', relationTo: 'media' },
        { name: 'uhd', label: 'H.264 2160p (films, large screens)', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'application/pdf'],
    imageSizes: [
      { name: 'card', width: 800, withoutEnlargement: true, formatOptions: webp },
      { name: 'wide', width: 1600, withoutEnlargement: true, formatOptions: webp },
      { name: 'full', width: 2400, withoutEnlargement: true, formatOptions: webp },
    ],
  },
}
