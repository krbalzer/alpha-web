import type { CollectionConfig, Field, GlobalConfig } from 'payload'
import { allow, has } from '../access'
import { guard } from './guard'

/**
 * Alpha University (/training). Katie (role: university) logs every AIM session and Lab; the page derives its counts,
 * seasons, map pins and "next / latest" from these records. Lauren (role: contributor) can open AIM sessions and set
 * the cover, nothing else. Changes show on the site within 5 minutes.
 */
const editors = allow('university')
const lock = (f: Field): Field => ('name' in f ? { ...f, access: { ...('access' in f ? f.access : {}), create: ({ req }) => has(req.user, 'university'), update: ({ req }) => has(req.user, 'university') } } as Field : f)
const lockAll = (fs: Field[]): Field[] => fs.map((f) => (f.type === 'row' ? { ...f, fields: lockAll(f.fields) } : lock(f)))
const isAim = (d: unknown) => (d as { kind?: string })?.kind === 'aim'
const isLab = (d: unknown) => (d as { kind?: string })?.kind === 'lab'

export const TrainingEvents: CollectionConfig = {
  slug: 'training-events',
  labels: { singular: 'Training event', plural: 'Training events' },
  access: {
    read: () => true,
    create: editors,
    // contributors (Lauren) may save AIM sessions, but only the cover field is writable for them (see field access)
    update: allow('university', 'contributor'),
    delete: editors,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'date', 'status', 'coverNeeded'],
    listSearchableFields: ['title', 'speaker'],
    description: 'Every AIM session and Lab. Log it when it is announced (Upcoming), mark it Held after. AIM covers: filter by "Needs cover".',
  },
  defaultSort: '-date',
  hooks: {
    beforeValidate: [guard],
    beforeChange: [({ data, originalDoc }) => {
      if (!data) return data
      const d = { ...(originalDoc || {}), ...data }
      const who = d.kind === 'aim' ? d.speaker : d.venue || ''
      const title = [who, d.topic].filter(Boolean).join(': ')
      return { ...data, title: title || d.title || 'Untitled', coverNeeded: d.kind === 'aim' && d.status !== 'cancelled' && !d.cover }
    }],
  },
  fields: [
    ...lockAll([
      { type: 'row', fields: [
        { name: 'kind', type: 'select', required: true, defaultValue: 'aim', options: [{ label: 'AIM session', value: 'aim' }, { label: 'Lab', value: 'lab' }] },
        { name: 'date', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM d, yyyy' } } },
        { name: 'status', type: 'select', required: true, defaultValue: 'upcoming', options: [{ label: 'Upcoming', value: 'upcoming' }, { label: 'Held', value: 'held' }, { label: 'Cancelled', value: 'cancelled' }] },
      ] },
      { type: 'row', fields: [
        { name: 'speaker', type: 'text', admin: { condition: isAim, description: 'As it should read on the site, e.g. "Dr. Kian Karimi".' } },
        { name: 'season', type: 'number', min: 1, admin: { condition: isAim, description: 'AIM season number.' } },
      ] },
      { name: 'topic', type: 'text', admin: { description: 'AIM: the topic ("Live Q&A" if none). Lab: what it covered.' } },
      { type: 'row', fields: [
        { name: 'track', type: 'select', defaultValue: 'injector', admin: { condition: isLab }, options: [
          { label: 'Injector', value: 'injector' }, { label: 'Skincare', value: 'skincare' }, { label: 'Cadaver', value: 'cadaver' }, { label: 'Regional (mixed)', value: 'regional' }, { label: 'Surgical', value: 'surgical' },
        ] },
        { name: 'location', label: 'Host location', type: 'relationship', relationTo: 'locations', admin: { condition: isLab, description: 'The partner location that hosted. Sets the city and the map pin.' } },
      ] },
      { type: 'collapsible', label: 'Off-network venue', admin: { condition: isLab, initCollapsed: true, description: 'Only when the Lab was not at a partner location (e.g. the Allergan Medical Institute).' }, fields: [
        { name: 'venue', type: 'text', admin: { description: 'Shown instead of the partner name.' } },
        { type: 'row', fields: [
          { name: 'city', type: 'text', admin: { description: 'City, ST' } },
          { name: 'lat', type: 'number' },
          { name: 'lng', type: 'number' },
        ] },
      ] },
      { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 5, admin: { condition: isLab, description: 'Up to five, for the Labs photo sets on the page.' } },
      { name: 'public', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Off keeps it out of the page and its counts.' } },
      { name: 'note', type: 'textarea', admin: { position: 'sidebar', description: 'Internal. Never shown.' } },
    ]),
    {
      name: 'cover', type: 'upload', relationTo: 'media',
      admin: { condition: isAim, description: 'Lauren: the AIM session cover, 4:5 (e.g. 1120 x 1400).' },
    },
    { name: 'coverNeeded', label: 'Needs cover', type: 'checkbox', admin: { readOnly: true, position: 'sidebar', condition: isAim } },
    { name: 'title', type: 'text', admin: { hidden: true } },
  ],
}

/** Numbers on /training that are not events. Katie keeps these current. */
export const University: GlobalConfig = {
  slug: 'university',
  label: 'University settings',
  access: { read: () => true, update: editors },
  fields: [
    { name: 'members', label: 'Loop members (Slack)', type: 'group', admin: { description: 'Leave a Loop empty to hide its count.' }, fields: [
      { type: 'row', fields: [
        { name: 'injector', type: 'number' }, { name: 'esthie', label: 'Esthie', type: 'number' }, { name: 'manager', type: 'number' },
      ] },
      { type: 'row', fields: [
        { name: 'marketing', type: 'number' }, { name: 'surgery', type: 'number' }, { name: 'body', type: 'number' },
      ] },
    ] },
    { name: 'support', label: 'Slack support standard', type: 'group', fields: [
      { type: 'row', fields: [
        { name: 'reply', label: 'First reply', type: 'text', defaultValue: '< 1 min' },
        { name: 'solved', label: 'Solved within', type: 'text', defaultValue: '3 days' },
      ] },
    ] },
    { type: 'row', fields: [
      { name: 'vendorSessions', label: 'Alpha-exclusive vendor sessions', type: 'number', defaultValue: 18 },
      { name: 'practiceFaculty', label: 'Practice faculty from Alpha', type: 'number', admin: { description: 'Empty hides it.' } },
    ] },
    { name: 'showClinicalDirector', label: 'Show the Clinical Director section', type: 'checkbox', defaultValue: false, admin: { description: 'Leave off until the announcement.' } },
  ],
}
