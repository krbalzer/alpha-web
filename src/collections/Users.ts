import type { CollectionConfig } from 'payload'
import { admin, adminField, has, ROLES, visibleTo } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'roles'], hidden: visibleTo() },
  auth: true,
  access: {
    read: ({ req }) => has(req.user) || (req.user ? { id: { equals: req.user.id } } : false),
    create: admin,
    update: ({ req }) => has(req.user) || (req.user ? { id: { equals: req.user.id } } : false),
    delete: admin,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles', type: 'select', hasMany: true, saveToJWT: true,
      options: ROLES.map((r) => ({ label: r[0].toUpperCase() + r.slice(1), value: r })),
      access: { create: adminField, update: adminField },
      admin: { description: 'Admin: everything. Partnerships: leads. Contributor: uploads only (photos, rebrand assets).' },
    },
  ],
}
