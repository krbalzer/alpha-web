import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  admin: { defaultColumns: ['filename', 'alt', 'mimeType'] },
  fields: [{ name: 'alt', type: 'text', required: true }],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'application/pdf'],
    imageSizes: [
      { name: 'card', width: 800 },
      { name: 'wide', width: 1600 },
      { name: 'full', width: 2400 },
    ],
    formatOptions: { format: 'webp', options: { quality: 80 } },
  },
}
