'use client'
import { useEffect, useState } from 'react'

export type CtaPick = { src: string; soft?: boolean; srcSet?: string; brand?: string; loc?: string; ptr?: string; name?: string; city?: string }

/** Picks one CTA image per page load from the pool the Closer hands it. Only the chosen image is ever requested. */
export function CloserBg({ items }: { items: CtaPick[] }) {
  const [p, setP] = useState<CtaPick | null>(null)
  useEffect(() => {
    if (items.length) setP(items[Math.floor(Math.random() * items.length)])
  }, [items])
  if (!p) return null
  return (
    <>
      <img className={'cta_bg' + (p.soft ? ' is-stand' : '')} src={p.src} srcSet={p.srcSet} sizes="100vw" alt="" aria-hidden="true" decoding="async" />
      {p.name && <span className="ph cta_cr"><b>{p.ptr}</b> / {p.name}{p.city && <><br />{p.city}</>}</span>}
    </>
  )
}
