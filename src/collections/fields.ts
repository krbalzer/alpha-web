import type { Field } from 'payload'

/** URL slug, required + unique, shown in the sidebar. */
export const slug = (from = 'name'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: `URL segment. Lowercase, hyphens. Usually from ${from}.` },
})

export const img = (name: string, label?: string, required = false): Field => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  required,
})

export const seo: Field = {
  name: 'seo',
  type: 'group',
  admin: { position: 'sidebar' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea', maxLength: 160 },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

/** Publish switch that every public query filters on. */
export const live: Field = {
  name: 'live',
  type: 'checkbox',
  defaultValue: true,
  admin: { position: 'sidebar', description: 'Off hides it everywhere on the site.' },
}

export const publicRead = { read: () => true }
