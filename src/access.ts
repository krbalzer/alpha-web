import type { Access, Field, FieldAccess, PayloadRequest, Where } from 'payload'

/**
 * Roles. Everyone else feeds the site from systems they already use (Libsyn + Drive, Paylocity, quarterly ops notes).
 *   admin         everything
 *   partnerships  leads (the only role that can see them)
 *   contributor   uploads to media (photos, rebrand assets), tagged for placement
 */
export const ROLES = ['admin', 'partnerships', 'contributor'] as const
export type Role = (typeof ROLES)[number]

type U = { id?: number | string; roles?: Role[] | null } | null | undefined

/** True for admins, or anyone holding one of the given roles. */
export const has = (user: unknown, ...roles: Role[]) => {
  const r = (user as U)?.roles || []
  return r.includes('admin') || roles.some((x) => r.includes(x))
}

export const admin: Access = ({ req }) => has(req.user)
export const allow = (...roles: Role[]): Access => ({ req }) => has(req.user, ...roles)
export const adminField: FieldAccess = ({ req }) => has(req.user)

/** Public site reads; only admins write. Collections that open writes to a role spread this and override. */
export const publicRead = { read: () => true, create: admin, update: admin, delete: admin }

/** Admin, or the role scoped by a query (e.g. contributors to their own uploads). */
export const scoped = (role: Role | Role[], where: (req: PayloadRequest) => Where | false): Access => ({ req }) => {
  if (has(req.user)) return true
  const mine = (req.user as U)?.roles || []
  return ([] as Role[]).concat(role).some((r) => mine.includes(r)) ? where(req) : false
}

/** Hide a collection in the admin nav from anyone without these roles. Access still decides what they can do. */
export const visibleTo = (...roles: Role[]) => ({ user }: { user: unknown }) => !has(user, ...roles)

/** Stamps who uploaded or created a doc. Read-only in the admin. */
export const createdBy: Field = {
  name: 'createdBy',
  type: 'relationship',
  relationTo: 'users',
  admin: { position: 'sidebar', readOnly: true },
  hooks: { beforeChange: [({ req, operation, value }) => (operation === 'create' && req.user ? req.user.id : value)] },
}
