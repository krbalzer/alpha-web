'use client'
import { useEffect, useRef, useState } from 'react'

type Item = { place: string; meta: string; href: string; here: boolean }

/** Location page crumb: the current location, opening a list of the brand's other locations with distances. Plain text for single-location brands. */
export function LocationSwitch({ here, brand, items }: { here: string; brand: string; items: Item[] }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!open) return
    const out = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false) }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', out); document.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', key) }
  }, [open])
  if (items.length < 2) return <span className="crumb_here">{here}</span>
  return (
    <span className="crumb_here sw" ref={box}>
      <button type="button" className="sw_btn" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
        {here}
        <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true"><path d="M1 1l3.5 3.5L8 1" stroke="currentColor" fill="none" strokeWidth="1.3" /></svg>
      </button>
      {open ? (
        <span className="sw_menu" role="menu">
          <span className="sw_k">{brand} locations</span>
          {items.map((x) => (
            <a key={x.href} className={'sw_i' + (x.here ? ' is-on' : '')} href={x.href} role="menuitem" aria-current={x.here ? 'page' : undefined}>
              <b>{x.place}</b><span>{x.meta}</span>
            </a>
          ))}
        </span>
      ) : null}
    </span>
  )
}
