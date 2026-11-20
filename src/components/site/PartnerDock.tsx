'use client'
import { useEffect, useState } from 'react'

type Item = { n: string; name: string; href: string; hasMark: boolean }

/** Slim partner-brand carousel: newest first, arrows inline with the marks. Marks come from the page's .b-NNN classes. */
export function PartnerDock({ items }: { items: Item[] }) {
  const [pv, setPv] = useState(12)
  const [i, setI] = useState(0)
  useEffect(() => {
    const fit = () => setPv(window.innerWidth <= 520 ? 4 : window.innerWidth <= 900 ? 6 : 12)
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  const mx = Math.max(0, items.length - pv), at = Math.min(i, mx), step = Math.max(1, pv - 1)
  const arrow = (d: 1 | -1) => (
    <button type="button" aria-label={d < 0 ? 'Previous brands' : 'Next brands'} disabled={d < 0 ? at === 0 : at >= mx}
      onClick={() => setI(Math.max(0, Math.min(mx, at + d * step)))}>
      <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true"><path d={d < 0 ? 'M6 1L2 5l4 4' : 'M2 1l4 4-4 4'} stroke="currentColor" fill="none" strokeWidth="1.3" /></svg>
    </button>
  )
  return (
    <nav className="pdock" aria-label="Partner brands" style={{ ['--pv' as string]: String(pv) }}>
      <div className="wrap pdock_row">
        {arrow(-1)}
        <div className="pdock_v">
          <ul className="pdock_l" style={{ transform: `translateX(calc(${-at} * ((100% - (var(--pv) - 1) * var(--pg)) / var(--pv) + var(--pg))))` }}>
            {items.map((d) => (
              <li key={d.n}>
                <a className="pdock_i" href={d.href} title={d.name} aria-label={`${d.name}, PTR ${d.n}`}>
                  <span className={'pdock_c' + (d.n === '007' ? ' inv' : '')}>
                    {d.hasMark ? <span className={'bmark b-' + d.n} aria-hidden="true" /> : <b aria-hidden="true">{d.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</b>}
                  </span>
                  <span className="pdock_n">PTR {d.n}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {arrow(1)}
      </div>
    </nav>
  )
}
