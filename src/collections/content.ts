import { randomBytes } from 'node:crypto'
import { REPORTS, STAGES } from '../lib/portal'
import { admin, adminField, allow } from '../access'
import { guard } from './guard'
import type { CollectionConfig, GlobalConfig } from 'payload'
import { img, live, publicRead, seo, slug } from './fields'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Newswire article', plural: 'Newswire' },
  // contributors (Lauren runs the PR account) write and publish releases; deleting stays with admin
  access: { ...publicRead, create: allow('contributor'), update: allow('contributor') },
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
  access: { read: () => true, update: admin },
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
      access: { read: ({ req }) => !!req.user, update: adminField },
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
  access: { read: allow('partnerships'), create: () => false, update: allow('partnerships'), delete: admin },
  admin: { useAsTitle: 'email', defaultColumns: ['createdAt', 'practice', 'name', 'stage', 'status', 'test'], description: 'Every Let\'s talk submission. Partner inquiries get a private portal link; move the stage here to move their tracker.' },
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
    { type: 'collapsible', label: 'Partner portal', admin: { initCollapsed: false }, fields: [
      { type: 'row', fields: [
        { name: 'stage', type: 'select', defaultValue: 'intro', options: STAGES.map((s) => ({ label: s.t, value: s.key })), admin: { description: 'Where they are on the path. Changing it moves their tracker.' } },
        { name: 'guide', type: 'text', defaultValue: 'Tyler', admin: { description: 'First name shown as their guide.' } },
      ] },
      { name: 'stageNote', label: 'Note for this stage', type: 'textarea', admin: { description: 'Shown to the prospect on their portal, under the current stage. Optional.' } },
      { name: 'portalToken', type: 'text', unique: true, index: true, admin: { readOnly: true, description: 'Private link: /portal/<this>. Anyone with it can see this portal, so send it only to the owner.' } },
      { name: 'files', type: 'join', collection: 'lead-files', on: 'lead' },
    ] },
    { name: 'test', label: 'Test lead', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Made-up data. Never synced to Smartsheet, Dropbox or notifications.' } },
  ],
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      // every lead gets a private portal link; older leads get one the next time they're saved
      if (data && !data.portalToken && !originalDoc?.portalToken) data.portalToken = randomBytes(24).toString('base64url')
      return data
    }],
  },
}

/** Files a prospect uploads through the portal. Read by New Partnerships only; served through Payload, never public. */
export const LeadFiles: CollectionConfig = {
  slug: 'lead-files',
  labels: { singular: 'Lead file', plural: 'Lead files' },
  access: { read: allow('partnerships'), create: allow('partnerships'), update: allow('partnerships'), delete: allow('partnerships') },
  admin: { useAsTitle: 'filename', defaultColumns: ['filename', 'lead', 'report', 'status', 'createdAt'], description: 'Review each file. "Needs changes" sends your note back to the prospect.' },
  defaultSort: '-createdAt',
  upload: { mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv', 'application/pdf'] },
  fields: [
    { type: 'row', fields: [
      { name: 'lead', type: 'relationship', relationTo: 'leads', required: true },
      { name: 'report', type: 'select', required: true, options: REPORTS.map((r) => ({ label: r.t, value: r.key })) },
    ] },
    { name: 'status', type: 'select', defaultValue: 'review', required: true, options: [{ label: 'In review', value: 'review' }, { label: 'Approved', value: 'ok' }, { label: 'Needs changes', value: 'fix' }] },
    { name: 'feedback', type: 'textarea', admin: { condition: (_, s) => s?.status === 'fix', description: 'What to change. The prospect sees this.' } },
  ],
}
