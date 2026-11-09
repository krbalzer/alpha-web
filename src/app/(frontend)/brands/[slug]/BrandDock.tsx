'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { BrandIndex } from '@/lib/data'

/** Brand name in the crumb opens a dock of every partner brand, marks first. Esc, outside click or picking a brand closes it. */
export function BrandDock({ name, current, brands }: { name: string; current: string; brands: BrandIndex }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const down = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false) }
    window.addEventListener('keydown', key); window.addEventListener('pointerdown', down)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', down) }
  }, [open])
  return (
    <span ref={root} className="dock_root">
      <button className={'dock_btn' + (open ? ' is-open' : '')} aria-expanded={open} aria-controls="brand-dock" onClick={() => setOpen(!open)}>
        {name}<svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true"><path d="M1 1l3.5 3.5L8 1" stroke="currentColor" fill="none" strokeWidth="1.2" /></svg>
      </button>
      <div id="brand-dock" className={'dock' + (open ? ' is-open' : '')} role="region" aria-label="All partner brands" hidden={!open}>
        <div className="dock_grid">
          {brands.map((b) => (
            <Link key={b.slug} href={`/brands/${b.slug}`} className={'dock_i' + (b.slug === current ? ' is-on' : '')} aria-current={b.slug === current ? 'page' : undefined} onClick={() => setOpen(false)}>
              <span className="dock_mark"><span className={`bmark b-${b.n}`} aria-hidden="true" /></span>
              <span className="dock_n">PTR {b.n}</span>
              <span className="dock_name">{b.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </span>
  )
}
