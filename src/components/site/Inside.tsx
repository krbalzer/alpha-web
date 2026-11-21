'use client'
import { useEffect, useRef, useState } from 'react'
import './inside.css'

type Item = { src: string; w: number; h: number; caption: string }

/** Brand page "Inside": a filmstrip of the practice the visitor moves themselves, with arrows, drag or a trackpad swipe.
 *  No scroll lock: the page scrolls past it normally. Frames take their size from the photo: tall, wide or small; every fourth one rides high.
 *  Content: brands.inside (image + caption) and brands.insideTitle in the CMS. */
export function Inside({ items, title, where }: { items: Item[]; title: string; where: string }) {
  const strip = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(0)
  const [ends, setEnds] = useState({ start: true, end: false })
  const n = items.length
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  useEffect(() => {
    const st = strip.current
    if (!st) return
    const f = () => {
      const frames = Array.from(st.querySelectorAll('.in_fr')) as HTMLElement[]
      const x = st.scrollLeft
      let i = 0
      frames.forEach((fr, k) => { if (fr.offsetLeft - st.offsetLeft <= x + 40) i = k })
      setAt(i)
      setEnds({ start: x <= 2, end: x >= st.scrollWidth - st.clientWidth - 2 })
    }
    st.addEventListener('scroll', f, { passive: true }); addEventListener('resize', f); f()
    return () => { st.removeEventListener('scroll', f); removeEventListener('resize', f) }
  }, [n])

  const go = (d: 1 | -1) => {
    const st = strip.current
    if (!st) return
    const frames = Array.from(st.querySelectorAll('.in_fr')) as HTMLElement[]
    const t = frames[Math.max(0, Math.min(n - 1, at + d))]
    if (t) st.scrollTo({ left: t.offsetLeft - st.offsetLeft - parseFloat(getComputedStyle(st).paddingLeft || '0'), behavior: 'smooth' })
  }
  /* mouse drag; touch and trackpads use native scrolling */
  const down = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse' || !strip.current) return; drag.current = { x: e.clientX, left: strip.current.scrollLeft, moved: false }; strip.current.classList.add('is-drag') }
  const move = (e: React.PointerEvent) => { const d = drag.current, st = strip.current; if (!d || !st) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 4) d.moved = true; st.scrollLeft = d.left - dx }
  const up = () => { strip.current?.classList.remove('is-drag'); setTimeout(() => { drag.current = null }, 0) }

  if (!n) return null
  const ct = String(at + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0')
  return (
    <section className="inside" aria-label={title}>
      <div className="in_head">
        <div><p className="eyebrow in_k">{where}</p><h2 className="display in_t">{title.split('\n').map((l, i) => <span key={i}>{i ? <br /> : null}{l}</span>)}</h2></div>
        <div className="in_ctl">
          <span className="mono in_ct" aria-hidden="true">{ct}</span>
          <button type="button" className="in_ar" aria-label="Previous photo" disabled={ends.start} onClick={() => go(-1)}><svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true"><path d="M6 1L2 5l4 4" stroke="currentColor" fill="none" strokeWidth="1.3" /></svg></button>
          <button type="button" className="in_ar" aria-label="Next photo" disabled={ends.end} onClick={() => go(1)}><svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true"><path d="M2 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.3" /></svg></button>
        </div>
      </div>
      <div className="in_strip" ref={strip} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onClickCapture={(e) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation() } }}>
        {items.map((x, i) => {
          const r = x.w / x.h, kind = r < 0.9 ? 't' : r > 1.2 ? 'w' : 's'
          return (
            <figure key={i} className={`in_fr ${kind}${i % 4 === 1 ? ' up' : ''}`}>
              <img src={x.src} alt="" loading="lazy" decoding="async" width={x.w} height={x.h} draggable={false} />
              {x.caption ? <figcaption className="mono">{x.caption}</figcaption> : null}
            </figure>
          )
        })}
        <div className="in_end" aria-hidden="true" />
      </div>
    </section>
  )
}
