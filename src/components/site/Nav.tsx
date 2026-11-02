'use client'
import Link from 'next/link'
import { useSite } from './SiteProvider'

/** Page header. `children` renders under the nav row (e.g. the brand crumb). */
export function Nav({ dark = false, children }: { dark?: boolean; children?: React.ReactNode }) {
  const s = useSite()
  return (
    <header className={'b_top' + (dark ? ' dark_top' : '')}>
      <div className="wrap">
        <nav className="nav" aria-label="Primary">
          <button className="nav_menu" aria-label="Open menu" aria-expanded={s.menuOpen} aria-controls="site-menu" onClick={() => s.setMenu(true)}><span /><span /></button>
          <Link className="nav_logo" href="/"><img src={dark ? '/brand/alpha-paper.svg' : '/brand/alpha-ink.svg'} alt="Alpha" /></Link>
          <Link className="btn nav_cta" href="/talk">Let&apos;s talk</Link>
        </nav>
      </div>
      {children}
    </header>
  )
}
