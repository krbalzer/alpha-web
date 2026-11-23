import type { Role } from '@/lib/roles'
import { RoleRow } from './Roles'
import './careers.css'

/**
 * "Join the team" on brand and location pages. Renders nothing at zero open roles: no "no openings" message,
 * so a practice never reads as static.
 */
export function Hiring({ roles, name, total, where }: { roles: Role[]; name: string; total: number; where?: string }) {
  if (!roles.length) return null
  const cities = [...new Set(roles.map((r) => (r.remote ? 'Remote' : r.city)).filter(Boolean))]
  const n = roles.length
  return (
    <section className="cr mod" id="careers" aria-label={`Open roles at ${name}`}>
      <div className="wrap mod_g">
        <div>
          <p className="eyebrow">Join the team</p>
          <h2 className="h3">{where ? 'Hiring here.' : `${name} is hiring.`}</h2>
          <p className="body">{n} open {n === 1 ? 'role' : 'roles'}{cities.length ? ` in ${cities.join(', ')}` : ''}. Apply directly; the practice&apos;s hiring manager reviews every application.</p>
        </div>
        <div>
          {roles.map((r) => <RoleRow key={r.slug} r={r} compact />)}
          <div className="mod_more"><a className="btn" href="/careers">All {total} openings across the network</a></div>
        </div>
      </div>
    </section>
  )
}
