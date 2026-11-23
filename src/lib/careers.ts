import 'server-only'
import { cache } from 'react'
import { db, url } from './data'

/**
 * Open roles for /careers, /careers/[slug], and the hiring modules on brand and location pages.
 * Source: the Jobs collection, mirrored hourly from Paylocity (src/seed/jobs.ts). Only open, matched, non-hidden roles show.
 */

import { teamOf, type Role } from './roles'
export { TEAMS, teamOf, type Role, type RoleBrand, type Team } from './roles'

/** Paylocity HTML minus the network boilerplate: the "Description" label, the job-title line, the Company Overview block, empty paragraphs, scripts and inline handlers. */
export function cleanDescription(html: string) {
  let h = String(html || '')
  h = h.replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '').replace(/\son\w+="[^"]*"/gi, '').replace(/\sstyle="[^"]*"/gi, '')
  h = h.replace(/^\s*<p>\s*Description\s*<\/p>/i, '')
  h = h.replace(/<p>\s*(<strong>)?\s*Job Title:[\s\S]*?<\/p>/i, '')
  // Company Overview heading plus every plain paragraph after it, up to the next bold heading / list / h-tag
  h = h.replace(/<p>\s*<strong>\s*Company Overview:?\s*<\/strong>\s*<\/p>(\s*<p>(?!\s*<strong>)[\s\S]*?<\/p>)*/i, '')
  h = h.replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
  return h.trim()
}

const ago = (iso: string, now = Date.now()) => {
  const d = Math.max(0, Math.round((now - new Date(iso).getTime()) / 864e5))
  if (d < 1) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 14) return `${d} days ago`
  if (d < 60) return `${Math.round(d / 7)} weeks ago`
  return `${Math.round(d / 30)} months ago`
}

type Doc = { [k: string]: unknown }
const obj = (x: unknown): Doc | null => (x && typeof x === 'object' ? (x as Doc) : null)

export const getRoles = cache(async (): Promise<Role[]> => {
  const p = await db()
  const r = await p.find({
    collection: 'jobs' as never, limit: 500, depth: 2, sort: '-posted',
    where: { and: [{ status: { equals: 'open' } }, { hidden: { not_equals: true } }, { brand: { exists: true } }] } as never,
  })
  const out: Role[] = []
  for (const d of r.docs as unknown as Doc[]) {
    const b = obj(d.brand), l = obj(d.location)
    if (!b || b.live === false) continue
    const prac = obj(b.practice)
    const city = l ? String(l.city || '') : '', state = l ? String(l.state || '') : ''
    const remote = !!d.remote && !l
    const posted = String(d.posted || d.createdAt)
    out.push({
      slug: String(d.slug), href: `/careers/${d.slug}`, title: String(d.title), team: teamOf(String(d.title)),
      brand: {
        id: Number(b.id), n: String(b.ptr ?? 0).padStart(3, '0'), slug: String(b.slug), name: String(b.name || b.short),
        href: `/brands/${b.slug}`, intro: String(b.intro || ''), img: url(prac?.image, 'wide') || '',
      },
      locId: l ? Number(l.id) : null, locHref: l ? `/locations/${l.slug}` : '', city, state,
      where: remote ? 'Remote' : [city, state].filter(Boolean).join(', '), remote,
      posted, ago: ago(posted),
      date: new Date(posted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      applyUrl: String(d.applyUrl), ref: String(d.paylocityId || ''), desc: cleanDescription(String(d.description || '')),
    })
  }
  return out
})

export const getRole = cache(async (slug: string) => {
  const all = await getRoles()
  const role = all.find((x) => x.slug === slug)
  if (!role) return null
  return { role, more: all.filter((x) => x.brand.id === role.brand.id && x.slug !== slug) }
})

/** For the brand and location hiring modules: no rendering at zero. */
export const rolesFor = async (q: { brand?: string; location?: string }) =>
  (await getRoles()).filter((x) => (q.brand ? x.brand.slug === q.brand : true) && (q.location ? x.locHref === `/locations/${q.location}` : true))
