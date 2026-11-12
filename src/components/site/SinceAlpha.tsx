'use client'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { SinceAlphaData } from '@/lib/data'
import './since-alpha.css'

/**
 * Brand page "Since Alpha" chapter: one black band after Why Alpha.
 * 01 the partnership timeline (click a marker to open it; the rebrand marker scrolls to 02),
 * 02 the rebrand carousel (every item at its own ratio, nothing cropped; videos play only while on screen).
 * Content: src/seed/content/since-alpha.json. Renders nothing for a brand without an entry.
 */
export function SinceAlpha({ d }: { d: SinceAlphaData }) {
  const M = d.milestones
  const rb = M.findIndex((m) => m.rebrand)
  const [sel, setSel] = useState(rb >= 0 ? rb : M.length - 1)
  const [inView, setInView] = useState(false)
  const band = useRef<HTMLDivElement>(null)
  const rebrand = useRef<HTMLElement>(null)

  // marker positions: even steps, the quiet stretch (gap) gets more room and a dashed line
  const pos = useMemo(() => {
    const steps = M.slice(1).map((_, i) => (d.gap && i === d.gap.after ? 2.2 : 1))
    const total = steps.reduce((a, b) => a + b, 0) || 1
    let acc = 0
    return [5, ...steps.map((s) => 5 + ((acc += s) / total) * 90)]
  }, [M, d.gap])

  useEffect(() => {
    const el = band.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect() } }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const m = M[sel]
  const tn = d.thenNow
  const go = (i: number) => { setSel(i); if (M[i].rebrand && rebrand.current) rebrand.current.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const years = d.since ? Math.max(1, Math.floor((Date.now() - new Date(d.since).getTime()) / 31557600000)) : 0
  const yearsWord = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][years] || String(years)

  return (
    <div className={'sa' + (inView ? ' is-in' : '')} ref={band}>
      <section className="sa_tl">
        <div className="wrap">
          <div className="sa_head">
            <div>
              <p className="eyebrow">Since Alpha{d.since ? ' / Partner since ' + d.since : ''}</p>
              <h2 className="sa_h">{years ? <><span className="sa_nw">{yearsWord} {years === 1 ? 'year' : 'years'}</span><br />in.</> : <>Since<br />Alpha.</>}</h2>
            </div>
            {d.quote ? (
              <figure className="sa_q">
                <blockquote>“{d.quote.text}”</blockquote>
                <figcaption className="mono">{d.quote.source}</figcaption>
              </figure>
            ) : null}
          </div>

          <div className="sa_rib" role="tablist" aria-label="Partnership timeline">
            <i className="sa_fill" />
            {d.gap && M[d.gap.after + 1] ? (
              <>
                <span className="sa_brk" style={{ left: `calc(${pos[d.gap.after]}% + 60px)`, width: `calc(${pos[d.gap.after + 1] - pos[d.gap.after]}% - 120px)` }} />
                <span className="sa_brkl mono" style={{ left: `${pos[d.gap.after]}%`, width: `${pos[d.gap.after + 1] - pos[d.gap.after]}%` }}>{d.gap.label}</span>
              </>
            ) : null}
            {M.map((x, i) => (
              <button key={i} role="tab" aria-selected={i === sel} className={'sa_mk' + (i === sel ? ' is-on' : '')} style={{ left: pos[i] + '%' }} onClick={() => go(i)}>
                <span className="mono sa_d">{x.date}</span><i /><span className="sa_t">{x.title}</span>
              </button>
            ))}
          </div>

          <div className="sa_det" role="tabpanel">
            <span className="mono sa_dd">{m.date}</span>
            <div><b>{m.title}</b><p>{m.detail}</p></div>
            {m.rebrand && d.rebrand ? <button className="btn sa_go" onClick={() => rebrand.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>See the {d.rebrand.noun || 'rebrand'} ↓</button> : m.link ? <a className="btn sa_go" href={m.link.href}>{m.link.label}</a> : <span />}
          </div>

          {tn?.rows?.length ? (
            <>
              <div className="sa_tn" style={{ gridTemplateColumns: `repeat(${tn.rows.length}, minmax(0, 1fr))` }}>
                {tn.rows.map((r) => (
                  <div key={r.label}><span className="mono">{r.label}</span><div className="sa_v"><s>{r.then}</s><b>{r.now}</b></div></div>
                ))}
              </div>
              <p className="mono sa_note">Then / now. {tn.note}</p>
            </>
          ) : null}
        </div>
      </section>

      {d.rebrand ? <Rebrand r={d.rebrand} work={d.work} date={d.date} innerRef={rebrand} /> : null}
    </div>
  )
}

export type RailItem = NonNullable<SinceAlphaData['rebrand']>['items'][number]

/** Side-scrolling media rail: drag (mouse), arrows, progress, loops play only while on screen. Shared with /work. */
export function useRail() {
  const rail = useRef<HTMLDivElement>(null)
  const [prog, setProg] = useState(0)
  const items = () => [...(rail.current?.children || [])] as HTMLElement[]
  const pad = () => parseFloat(getComputedStyle(rail.current!).paddingLeft)
  const idx = () => { const el = rail.current!; let k = 0; items().forEach((c, j) => { if (c.offsetLeft - el.offsetLeft - pad() <= el.scrollLeft + 5) k = j }); return k }
  const snap = (k: number) => { const it = items(); if (!it.length) return; k = Math.max(0, Math.min(it.length - 1, k)); rail.current!.scrollTo({ left: it[k].offsetLeft - rail.current!.offsetLeft - pad(), behavior: 'smooth' }) }
  const snapRef = useRef(snap)
  snapRef.current = snap
  useEffect(() => {
    const el = rail.current
    if (!el) return
    const vids = [...el.querySelectorAll('video')]
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target as HTMLVideoElement
      if (e.isIntersecting && !matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {}); else v.pause()
    }), { root: null, threshold: 0.35 })
    vids.forEach((v) => io.observe(v))
    let down = false, sx = 0, sl = 0, moved = false
    const pd = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; el.classList.add('is-drag') }
    const pm = (e: PointerEvent) => { if (!down) return; if (Math.abs(e.clientX - sx) > 4) moved = true; el.scrollLeft = sl - (e.clientX - sx) }
    const pu = () => { if (!down) return; down = false; el.classList.remove('is-drag'); snapRef.current(idx()) }
    const ck = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }
    const sc = () => setProg(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth))
    el.addEventListener('pointerdown', pd); addEventListener('pointermove', pm); addEventListener('pointerup', pu)
    el.addEventListener('click', ck, true); el.addEventListener('scroll', sc, { passive: true })
    return () => { io.disconnect(); el.removeEventListener('pointerdown', pd); removeEventListener('pointermove', pm); removeEventListener('pointerup', pu); el.removeEventListener('click', ck, true); el.removeEventListener('scroll', sc) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { rail, prog, prev: () => snap(idx() - 1), next: () => snap(idx() + 1) }
}

const sound = (e: React.MouseEvent<HTMLButtonElement>) => {
  const v = e.currentTarget.parentElement?.querySelector('video')
  if (!v) return
  v.muted = !v.muted
  e.currentTarget.textContent = v.muted ? 'Sound on' : 'Sound off'
  if (!v.muted) { window.dispatchEvent(new CustomEvent('alpha:pause')); v.play().catch(() => {}) }
}

/** Every item at its own ratio, nothing cropped. */
export function RailItems({ items }: { items: RailItem[] }) {
  return (
    <>
      {items.map((it, i) => {
        if (it.kind === 'palette') return (
          <figure key={i} className="sa_s sa_pal">{(it.colors || []).map(([n, hex, lt]) => <i key={n} className={lt ? 'lt' : ''} style={{ background: hex }}><span className="mono">{n}</span></i>)}</figure>
        )
        if (it.kind === 'ann') return (
          <figure key={i} className="sa_s sa_ann">
            <video src={it.src} poster={it.poster || undefined} muted loop playsInline preload="none" aria-label={it.caption} />
            {!it.silent ? <button className="mono sa_snd" onClick={sound}>Sound on</button> : null}
            {it.caption ? <figcaption className="mono">{it.caption}</figcaption> : null}
          </figure>
        )
        const ar = it.w && it.h ? `${it.w} / ${it.h}` : undefined
        return (
          <figure key={i} className="sa_s" style={{ aspectRatio: ar, background: it.bg }}>
            {it.kind === 'video'
              ? <video src={it.src} poster={it.poster || undefined} muted loop playsInline preload="metadata" aria-hidden="true" />
              : <img src={it.src} alt="" loading="lazy" decoding="async" width={it.w} height={it.h} />}
            {it.caption ? <figcaption className="mono">{it.caption}</figcaption> : null}
          </figure>
        )
      })}
    </>
  )
}

function Rebrand({ r, work, date, innerRef }: { r: NonNullable<SinceAlphaData['rebrand']>; work: string | null; date: string; innerRef: React.RefObject<HTMLElement | null> }) {
  const { rail, prog, prev, next } = useRail()
  const cta = work
    ? { href: work, label: 'See the ' + (r.noun || 'rebrand'), sub: 'The full story' + (date ? ' / ' + date : ''), ext: false }
    : r.msm ? { href: r.msm.href, label: 'Hear how it was made', sub: 'The full story / ' + r.msm.label, ext: false }
    : r.site ? { href: r.site, label: 'Visit the site', sub: 'The new site / live', ext: true } : null

  return (
    <section className="sa_rb" ref={innerRef}>
      <div className="wrap"><div className="sa_seam mono">02 / The {r.noun || 'rebrand'}</div></div>
      <div className="wrap sa_rbh">
        <div>
          <p className="eyebrow">{r.eyebrow}</p>
          <h2 className="h3">{r.headline.split('\n').map((l, i) => <span key={i}>{i ? <br /> : null}{l}</span>)}</h2>
          <p className="sa_body">{r.body}</p>
        </div>
        <div className="sa_cta">
          <button className="sa_arr" aria-label="Previous" onClick={prev}>←</button>
          <button className="sa_arr" aria-label="Next" onClick={next}>→</button>
          {cta ? (cta.ext ? <a className="btn sa_btn" href={cta.href} target="_blank" rel="noopener">{cta.label} ↗</a> : <Link className="btn sa_btn" href={cta.href}>{cta.label} →</Link>) : null}
        </div>
      </div>
      <div className="sa_rail" ref={rail}>
        <RailItems items={r.items} />
        {cta ? (
          cta.ext
            ? <a className="sa_s sa_end" href={cta.href} target="_blank" rel="noopener"><span className="mono">{cta.sub}</span><b>{cta.label} ↗</b></a>
            : <Link className="sa_s sa_end" href={cta.href}><span className="mono">{cta.sub}</span><b>{cta.label} →</b></Link>
        ) : null}
      </div>
      <div className="wrap sa_foot">
        <div className="mono sa_led">{r.ledger.map(([n, l]) => <span key={l}><b>{n}</b> {l}</span>)}</div>
        <div className="sa_prog"><i style={{ width: prog * 100 + '%' }} /></div>
      </div>
    </section>
  )
}
