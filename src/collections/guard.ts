import { APIError, type CollectionBeforeValidateHook } from 'payload'

/**
 * Blocks any save that mentions a name on the Network global's "Never publish" list.
 * The list is readable by logged-in staff only and is never sent to the site.
 */
export const guard: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data) return data
  const g = await req.payload.findGlobal({ slug: 'network', depth: 0, overrideAccess: true, req })
  const names = ((g as { suppressed?: { name?: string | null }[] }).suppressed || []).map((x) => (x.name || '').trim()).filter(Boolean)
  if (!names.length) return data
  const text = JSON.stringify(data).toLowerCase()
  const hit = names.find((n) => text.includes(n.toLowerCase()))
  if (hit) throw new APIError('This entry mentions a name that cannot appear on the site. Remove it and save again.', 400, undefined, true)
  return data
}
