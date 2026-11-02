'use client'
import { useEffect, useState } from 'react'

export type CtaPick = { src: string; soft?: boolean; srcSet?: string; brand?: string; ptr?: string; name?: string; city?: string }

/** Picks one CTA image per page load, skipping the current brand. Only the chosen image is ever requested. */
export function CloserBg({ items, skipBrand }: { items: CtaPick[]; skipBrand?: string }) {
  const [p, setP] = useState<CtaPick | null>(null)
  useEffect(() => {
    const pool = items.filter((i) => !skipBrand || i.brand !== skipBrand)
    const list = pool.length ? pool : items
    if (list.length) setP(list[Math.floor(Math.random() * list.length)])
  }, [items, skipBrand])
  if (!p) return null
  return (
    <>
      <img className={'cta_bg' + (p.soft ? ' is-stand' : '')} src={p.src} srcSet={p.srcSet} sizes="100vw" alt="" aria-hidden="true" decoding="async" />
      {p.name && <span className="ph cta_cr"><b>{p.ptr}</b> / {p.name}{p.city && <><br />{p.city}</>}</span>}
    </>
  )
}
