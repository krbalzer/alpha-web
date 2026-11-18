'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { BrandIndex } from '@/lib/data'

/** Crumb trigger ("PTR 014 ▾") that opens a dock of every partner brand. The current brand leads the list; off the brand page it links back as its overview. Esc, outside click or picking a brand closes it. */
export function BrandDock({ label, current, brands, onBrand = false }: { label: string; current: string; brands: BrandIndex; onBrand?: boolean }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const down = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false) }
    window.addEventListener('keydown', key); window.addEventListener('pointerdown', down)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', down) }
  }, [open])
  const list = [...brands.filter((b) => b.slug === current), ...brands.filter((b) => b.slug !== current)]
  return (
    <span ref={root} className="dock_root">
      <button className={'dock_btn' + (open ? ' is-open' : '')} aria-expanded={open} aria-controls="brand-dock" aria-label={`${label}, all partner brands`} onClick={() => setOpen(!open)}>
        {label}<svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true"><path d="M1 1l3.5 3.5L8 1" stroke="currentColor" fill="none" strokeWidth="1.2" /></svg>
      </button>
      <div id="brand-dock" className={'dock' + (open ? ' is-open' : '')} role="region" aria-label="All partner brands" hidden={!open}>
        <div className="dock_grid">
          {list.map((b) => {
            const here = b.slug === current
            return (
              <Link key={b.slug} href={`/brands/${b.slug}`} className={'dock_i' + (here ? ' is-on' : '')} aria-current={here && onBrand ? 'page' : undefined} onClick={() => setOpen(false)}>
                <span className="dock_mark"><span className={`bmark b-${b.n}`} aria-hidden="true" /></span>
                <span className="dock_n">PTR {b.n}</span>
                <span className="dock_name">{b.name}</span>
                {here && !onBrand ? <span className="dock_go">Overview →</span> : null}
              </Link>
            )
          })}
        </div>
      </div>
    </span>
  )
}
