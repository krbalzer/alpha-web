import { guard } from './guard'
import type { CollectionConfig } from 'payload'

// Resized copies are WebP. The original is stored untouched, so a poster exported as AVIF stays sharp.
const webp = { format: 'webp' as const, options: { quality: 82 } }
const isVideo = (d: unknown) => String((d as { mimeType?: string } | undefined)?.mimeType || '').startsWith('video/')

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  admin: { defaultColumns: ['filename', 'alt', 'mimeType'] },
  hooks: { beforeValidate: [guard] },
  fields: [
    { name: 'alt', type: 'text', required: true },
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
