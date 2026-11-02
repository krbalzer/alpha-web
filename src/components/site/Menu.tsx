'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { fmt, useSite } from './SiteProvider'

const DEPTS: [string, string][] = [
  ['New Partnerships', 'new-partnerships'], ['Finance', 'finance'], ['Operations', 'operations'],
  ['Integrations', 'integrations'], ['HR', 'hr'], ['IT', 'it'], ['Marketing', 'marketing'],
]

export function Menu() {
  const s = useSite()
  const root = useRef<HTMLDivElement>(null)
  const open = s.menuOpen
  const { brands, locations, states } = s.net
  const items: [string, string, string][] = [
    ['Partners', '/brands', `${brands} brands, in join order`],
    ['Map', '/locations', `${locations} locations across ${states} states`],
    ['Pathway', '/how-it-works', 'From first call to fully integrated'],
    ['Podcasts', '/podcasts', 'Every show in the network'],
    ['About', '/about', 'Built by operators'],
    ['News', '/newswire', 'From the newswire'],
  ]
  const live = s.ep || s.latest
  const isCurrent = !!s.ep

  // Esc closes, focus moves in on open, Tab stays inside, focus returns to the hamburger on close
  useEffect(() => {
    if (!open) return
    const el = root.current!
    const prev = document.activeElement as HTMLElement | null
    const t = setTimeout(() => el.querySelector<HTMLElement>('.mn_i')?.focus(), 350)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') s.setMenu(false)
      if (e.key !== 'Tab') return
      const f = [...el.querySelectorAll<HTMLElement>('a,button')].filter((x) => x.offsetParent)
      if (!f.length) return
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus() }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [open, s])

  return (
    <div ref={root} className={'mn' + (open ? ' is-on' : '')} id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open}>
      <div className="wrap mn_top">
        <button className="mn_x" onClick={() => s.setMenu(false)} aria-label="Close menu">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" /></svg>Close<em>Esc</em>
        </button>
        <Link className="nav_logo" href="/"><img src="/brand/alpha-paper.svg" alt="Alpha" /></Link>
        <Link className="btn" href="/talk">Let&apos;s talk</Link>
      </div>
      <div className="wrap mn_body">
        <nav className="mn_list" aria-label="Main">
          {items.map(([w, href, p], i) => (
            <Link key={href} className="mn_i" href={href}>
              <span className="mn_n">{String(i + 1).padStart(3, '0')}</span>
              <span className="mn_w"><span style={{ transitionDelay: open ? `${(0.28 + i * 0.06).toFixed(2)}s` : '0s' }}>{w}</span></span>
              <span className="mn_p"><b>{href}</b>{p}</span>
            </Link>
          ))}
        </nav>
        <aside className="mn_side">
          <div className="mn_live">
            {live && (
              <>
                <p className="mn_k"><span>{isCurrent ? (s.playing ? 'Now playing' : 'Paused') : 'Latest episode'}</span>{s.playing && <i>Live</i>}</p>
                <div className="mn_ep">
                  <span className="mn_art" style={{ background: live.bg, color: live.fg, border: '1px solid rgba(232,228,218,.14)' }}>{live.showShort || live.show}</span>
                  <div><b>{live.title}</b><span>{live.show}{live.n ? ` // EP ${live.n}` : ''}</span></div>
                </div>
                <div className="mn_pl">
                  <button className="mn_pb" onClick={() => (isCurrent ? s.toggle() : s.play(live))} aria-label={s.playing ? 'Pause' : 'Play'}>
                    {s.playing
                      ? <svg width="9" height="11" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 0h3v12H1zM6 0h3v12H6z" fill="currentColor" /></svg>
                      : <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z" fill="currentColor" /></svg>}
                  </button>
                  <div className="mn_tr"><i style={{ width: (isCurrent ? (s.t / (live.dur || 1)) * 100 : 0) + '%' }} /></div>
                  <span className="mn_t">{isCurrent ? `${fmt(s.t)} / ${fmt(live.dur)}` : `${Math.round(live.dur / 60)} min`}</span>
                </div>
              </>
            )}
            <div className="mn_net"><div><b>{brands}</b>Brands</div><div><b>{locations}</b>Locations</div><div><b>{states}</b>States</div></div>
          </div>
          <div>
            <div className="mn_dep">
              <p className="mn_k"><span>Alpha team</span><span>SSO</span></p>
              <ul>{DEPTS.map(([n, sl]) => <li key={sl}><Link href={`/team/${sl}`}>{n}</Link></li>)}</ul>
            </div>
            <div className="mn_fol"><span>Follow</span><a href="https://www.instagram.com/" rel="noopener">Instagram ↗</a><a href="https://www.linkedin.com/" rel="noopener">LinkedIn ↗</a></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
