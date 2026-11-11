'use client'
import { useEffect, useRef, useState } from 'react'
import './inside.css'

type Item = { src: string; w: number; h: number; caption: string }

/** Brand page: "Inside", a filmstrip of the practice that travels sideways as the page scrolls (pinned).
 *  Frames take their size from the photo: tall, wide or small; every fourth one rides high. Under 820px or with reduced motion it's a native swipe.
 *  Content: brands.inside (image + caption) and brands.insideTitle in the CMS. */
export function Inside({ items, title, where }: { items: Item[]; title: string; where: string }) {
  const sec = useRef<HTMLElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const n = items.length
  useEffect(() => {
    const s = sec.current, st = strip.current
    if (!s || !st) return
    let raf = 0
    const f = () => {
      if (innerWidth <= 820 || matchMedia('(prefers-reduced-motion: reduce)').matches) { st.style.transform = ''; return }
      const r = s.getBoundingClientRect(), total = Math.max(1, s.offsetHeight - innerHeight)
      const k = Math.min(1, Math.max(0, -r.top / total)), max = Math.max(0, st.scrollWidth - innerWidth)
      st.style.transform = `translate3d(${(-k * max).toFixed(1)}px,0,0)`
      setP(k)
    }
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(f) }
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); f()
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [n])
  if (!n) return null
  const at = String(Math.min(n, 1 + Math.floor(p * n))).padStart(2, '0') + ' / ' + String(n).padStart(2, '0')
  return (
    <section className="inside" ref={sec} style={{ height: `max(200vh, ${n * 30}vh)` }} aria-label={title}>
      <div className="in_pin">
        <div className="in_head">
          <div><p className="eyebrow in_k">{where}</p><h2 className="display in_t">{title.split('\n').map((l, i) => <span key={i}>{i ? <br /> : null}{l}</span>)}</h2></div>
          <span className="mono in_ct" aria-hidden="true">{at}</span>
        </div>
        <div className="in_strip" ref={strip}>
          {items.map((x, i) => {
            const r = x.w / x.h, kind = r < 0.9 ? 't' : r > 1.2 ? 'w' : 's'
            return (
              <figure key={i} className={`in_fr ${kind}${i % 4 === 1 ? ' up' : ''}`}>
                <img src={x.src} alt="" loading="lazy" decoding="async" width={x.w} height={x.h} />
                {x.caption ? <figcaption className="mono">{x.caption}</figcaption> : null}
              </figure>
            )
          })}
          <div className="in_end" aria-hidden="true" />
        </div>
        <div className="in_bar" aria-hidden="true"><i style={{ width: p * 100 + '%' }} /></div>
      </div>
    </section>
  )
}
