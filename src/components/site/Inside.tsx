'use client'
import { RailItems, useRail } from '@/components/site/SinceAlpha'
import '@/components/site/since-alpha.css'

type Item = { src: string; w: number; h: number; caption: string }

/** Brand page: "Inside the practice", a side-scrolling photo rail under The practice. Every photo at its own ratio. Content: brands.inside in the CMS. */
export function Inside({ items, name }: { items: Item[]; name: string }) {
  const { rail, prog, prev, next } = useRail()
  if (!items.length) return null
  return (
    <section className="sa sa-lt" aria-label={`Inside ${name}`}>
      <div className="wrap sa_rbh">
        <div><p className="eyebrow">Inside the practice</p><h2 className="h3">Real rooms,<br />real people.</h2></div>
        {items.length > 2 ? <div className="sa_cta"><button className="sa_arr" aria-label="Previous" onClick={prev}>←</button><button className="sa_arr" aria-label="Next" onClick={next}>→</button></div> : null}
      </div>
      <div className="sa_rail" ref={rail}><RailItems items={items.map((x) => ({ kind: 'image' as const, src: x.src, w: x.w, h: x.h, caption: x.caption, poster: '' }))} /></div>
      <div className="wrap sa_foot"><span className="mono sa_led">{items.length} photos / {name}</span><div className="sa_prog"><i style={{ width: prog * 100 + '%' }} /></div></div>
    </section>
  )
}
