import type { Role } from '@/lib/roles'
import './careers.css'

const MARKED = new Set(['001', '002', '003', '005', '006', '007', '008', '009', '010', '012', '013', '014', '015', '016'])

/** A partner's mark (mask, takes the text color), or its initials until the mark is added to careers.css. */
export function Mark({ n, name }: { n: string; name: string }) {
  return MARKED.has(n)
    ? <span className={`bm b-${n}`} role="img" aria-label={name} />
    : <span className="bm_i" aria-label={name}>{name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()}</span>
}

/** One opening. `compact` drops the team column (brand + location modules). */
export function RoleRow({ r, compact = false }: { r: Role; compact?: boolean }) {
  return (
    <a className={'jr' + (compact ? ' compact' : '')} href={r.href}>
      <span className="jr_t">{r.title}</span>
      <span className="jr_w mono">{r.where}</span>
      {compact ? null : <span className="jr_f mono">{r.team}</span>}
      <span className="jr_a mono">{r.ago}</span>
      <span className="jr_go" aria-hidden="true">→</span>
    </a>
  )
}
