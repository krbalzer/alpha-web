'use client'
import { useMemo, useState } from 'react'
import { Nav } from '@/components/site/Nav'
import { Mark, RoleRow } from '@/components/site/Roles'
import { TEAMS, type Role, type Team } from '@/lib/roles'
import '@/components/site/careers.css'

/** /careers: every open role, grouped by practice (newest posting first), filterable by team and state. */
export default function CareersView({ roles }: { roles: Role[] }) {
  const [team, setTeam] = useState<Team | 'all'>('all')
  const [st, setSt] = useState('all')
  const states = useMemo(() => [...new Set(roles.filter((r) => !r.remote).map((r) => r.state).filter(Boolean))].sort(), [roles])
  const hasRemote = roles.some((r) => r.remote)
  const practices = new Set(roles.map((r) => r.brand.id)).size
  const shown = roles.filter((r) => (team === 'all' || r.team === team) && (st === 'all' || (st === 'remote' ? r.remote : r.state === st)))
  const groups: { b: Role['brand']; rs: Role[] }[] = []
  for (const r of shown) {
    const g = groups.find((x) => x.b.id === r.brand.id)
    if (g) g.rs.push(r); else groups.push({ b: r.brand, rs: [r] })
  }
  const count = (t: Team) => roles.filter((r) => r.team === t).length
  return (
    <div className="cr">
      <Nav>
        <div className="crumb"><div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 34, fontFamily: 'var(--mono)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>
          <span>Alpha / Careers</span><span>{roles.length} open {roles.length === 1 ? 'role' : 'roles'} · Updated daily</span>
        </div></div>
      </Nav>
      <section className="hero">
        <div className="wrap">
          <div className="hero_g">
            <h1 className="h1">Join a<br />practice.<br />Not a chain.</h1>
            <p>Every opening here is inside one of our partner practices. You join that team, with its founder and its patients, and with the training and support of the whole Alpha network behind you.</p>
          </div>
          <div className="hero_stats">
            <div><b>{roles.length}</b><span>Open roles</span></div>
            <div><b>{practices}</b><span>Practices hiring</span></div>
            <div><b>{states.length}</b><span>{hasRemote ? 'States + remote' : 'States'}</span></div>
          </div>
        </div>
      </section>
      <div className="fbar"><div className="wrap">
        <button className={'chip' + (team === 'all' ? ' on' : '')} onClick={() => setTeam('all')}>All <i>{roles.length}</i></button>
        {TEAMS.filter((t) => count(t)).map((t) => (
          <button key={t} className={'chip' + (team === t ? ' on' : '')} onClick={() => setTeam(team === t ? 'all' : t)}>{t} <i>{count(t)}</i></button>
        ))}
        <select value={st} onChange={(e) => setSt(e.target.value)} aria-label="Filter by state">
          <option value="all">All states</option>
          {states.map((s) => <option key={s} value={s}>{s}</option>)}
          {hasRemote ? <option value="remote">Remote</option> : null}
        </select>
      </div></div>
      <section className="ledger"><div className="wrap">
        {groups.map(({ b, rs }) => (
          <div className="grp" key={b.id}>
            <div className="grp_h">
              <Mark n={b.n} name={b.name} />
              <span className="grp_c mono">{rs.length} open</span>
              <a className="grp_l mono" href={b.href}>Practice →</a>
            </div>
            {rs.map((r) => <RoleRow key={r.slug} r={r} />)}
          </div>
        ))}
        {groups.length ? null : <p className="empty">No openings match. Check back: new roles post here the same day they go live.</p>}
      </div></section>
    </div>
  )
}
