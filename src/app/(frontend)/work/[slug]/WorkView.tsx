'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Nav } from '@/components/site/Nav'
import { RailItems, useRail } from '@/components/site/SinceAlpha'
import { fmt, useSite } from '@/components/site/SiteProvider'
import type { WorkData } from '@/lib/data'
import '@/components/site/since-alpha.css'
import './work.css'

/** Board presets: six tiles on a 12 x 6 grid. Brands pick one, never a custom layout. */
const LAY: Record<'square' | 'wide', [string, string][]> = {
  square: [['1/5', '1/5'], ['5/9', '1/3'], ['9/13', '1/4'], ['5/9', '3/7'], ['9/13', '4/7'], ['1/5', '5/7']],
  wide: [['1/7', '1/5'], ['7/10', '1/3'], ['10/13', '1/3'], ['7/13', '3/5'], ['1/7', '5/7'], ['7/13', '5/7']],
}
const sec = (a: string) => a.split(':').reduce((v, n) => v * 60 + +n, 0)
const lines = (s: string) => s.split('\n').map((l, i) => <span key={i}>{i ? <br /> : null}{l}</span>)
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

/**
 * /work/[slug]: one rebrand, told in Alpha's voice.
 * 01 intro, 02 the build (board assembles as you scroll), 03 the shoot (rail), 04 the site (scrolls itself), 05 how it got made (MSM episode).
 * Content: src/seed/content/work.json.
 */
export default function WorkView({ d }: { d: WorkData }) {
  const s = useSite()
  const build = useRef<HTMLElement>(null)
  const ap = useRef<HTMLElement>(null)
  const dsk = useRef<HTMLImageElement>(null)
  const mob = useRef<HTMLImageElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(0)
  const { rail, prog, prev, next } = useRail()
  const T = d.board.tiles

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const f = () => {
      const el = build.current
      if (el) {
        const r = el.getBoundingClientRect(), tot = Math.max(1, el.offsetHeight - innerHeight)
        setK(still || innerWidth <= 860 ? T.length : Math.ceil(Math.min(1, Math.max(0, -r.top / tot)) * (T.length + 0.2)))
      }
      const a = ap.current
      if (a && !still) {
        const r = a.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height + innerHeight)))
        for (const im of [dsk.current, mob.current]) {
          if (!im?.parentElement) continue
          const max = im.offsetHeight - im.parentElement.offsetHeight
          im.style.transform = max > 0 ? `translate3d(0,${(-max * p).toFixed(1)}px,0)` : ''
        }
      }
    }
    let raf = 0
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(f) }
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); f()
    // board loops play only while the board is on screen
    const vids = [...(board.current?.querySelectorAll('video') || [])]
    const io = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target as HTMLVideoElement; if (e.isIntersecting && !still) v.play().catch(() => {}); else v.pause() }), { threshold: 0.2 })
    vids.forEach((v) => io.observe(v))
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); io.disconnect() }
  }, [T.length])

  const m = d.msm
  const mine = !!m && s.ep?.id === m.ep.id
  const on = mine && s.playing
  const t = mine ? s.t : 0

  return (
    <div className="pg-work">
      <Nav>
        <div className="crumb"><div className="wrap">
          <Link href={`/brands/${d.brand.slug}`}>← {d.brand.name}</Link>
          <span>Work / Rebrand / {d.date}</span>
          <span>PTR {d.brand.ptr}</span>
        </div></div>
      </Nav>

      {/* 01 intro */}
      <section className="wrap wk_intro">
        <div>
          <p className="eyebrow">Rebrand + website / Alpha Marketing / {d.date}</p>
          <h1 className="display wk_h1">{lines(d.headline)}</h1>
        </div>
        <div>
          <p className="lede wk_lede">{d.intro}</p>
          <div className="wk_keep mono" aria-label="What stayed and what changed">
            {d.kept.map((x) => <span key={x}>{x}</span>)}
            {d.changed.map((x) => <span key={x} className="is-new">{x}</span>)}
          </div>
          <p className="mono wk_key"><i /> Stayed <i className="is-new" /> Made new</p>
        </div>
      </section>

      {/* 02 the build */}
      <section className="wk_build" ref={build} style={{ height: `${T.length * 70}vh` }}>
        <div className="wk_pin"><div className="wrap">
          <div className="wk_btop">
            <p className="eyebrow">The build / {d.board.line}</p>
            <div className="wk_steps mono">{T.map((x, i) => <span key={i} className={i < k ? 'is-on' : ''}>{String(i + 1).padStart(2, '0')} {x.label.split(' / ')[0]}</span>)}</div>
          </div>
          <div className="wk_board" ref={board}>
            {T.map((x, i) => {
              const [c, r] = LAY[d.board.layout][i] || ['auto', 'auto']
              return (
                <div key={i} className={`wk_t wk_t-${x.kind}${i < k ? ' is-on' : ''}`} style={{ gridColumn: c, gridRow: r, background: x.bg, color: x.fg }}>
                  <span className="mono wk_lab">{String(i + 1).padStart(2, '0')} / {x.label}</span>
                  {x.kind === 'image' ? <img src={x.src} alt="" loading="lazy" decoding="async" style={{ objectFit: x.fit || 'cover' }} /> : null}
                  {x.kind === 'video' ? <video src={x.src} poster={x.poster || undefined} muted loop playsInline preload="metadata" aria-hidden="true" style={{ objectFit: x.fit || 'cover' }} /> : null}
                  {x.kind === 'palette' ? (x.colors || []).map(([n, hex, lt]) => <i key={n} className={lt ? 'lt' : ''} style={{ background: hex }}><b>{n}</b><span className="mono">{hex}</span></i>) : null}
                  {x.kind === 'quote' ? <><blockquote>{x.text}</blockquote><span className="mono wk_src">{x.source}</span></> : null}
                </div>
              )
            })}
          </div>
        </div></div>
      </section>

      {/* 03 the shoot */}
      <section className="sa wk_shoot">
        <div className="wrap sa_rbh">
          <div>
            <p className="eyebrow">The shoot / in-house / {d.shoot.where}</p>
            <h2 className="display wk_h2">{lines(d.shoot.headline)}</h2>
          </div>
          <div className="sa_cta">
            <button className="sa_arr" aria-label="Previous" onClick={prev}>←</button>
            <button className="sa_arr" aria-label="Next" onClick={next}>→</button>
          </div>
        </div>
        <div className="sa_rail" ref={rail}><RailItems items={d.shoot.items} /></div>
        <div className="wrap sa_foot">
          <span className="mono sa_led">{d.shoot.items.length} pieces / every one at its own ratio</span>
          <div className="sa_prog"><i style={{ width: prog * 100 + '%' }} /></div>
        </div>
      </section>

      {/* 04 the site */}
      <section className="wrap wk_site" ref={ap}>
        <div className="wk_sh">
          <div><p className="eyebrow">Applied / the system at work</p><h2 className="display wk_h2">Then the site.</h2></div>
          <a className="btn" href={d.site.url} target="_blank" rel="noopener">{host(d.site.url)} ↗</a>
        </div>
        <div className="wk_dev">
          <div className="wk_browser"><div className="wk_chrome" aria-hidden="true"><i /><i /><i /><span className="mono">{host(d.site.url)}</span></div><div className="wk_scr"><img ref={dsk} src={d.site.desktop} alt={`${host(d.site.url)} on desktop`} loading="lazy" decoding="async" /></div></div>
          <div className="wk_phone"><div className="wk_scr"><img ref={mob} src={d.site.mobile} alt={`${host(d.site.url)} on a phone`} loading="lazy" decoding="async" /></div></div>
        </div>
        <div className="wk_ship">
          <div><p className="eyebrow">What shipped</p><h3 className="h3">One system,<br />every surface.</h3><p className="mono wk_note">Counted from the live sitemap, Nov 2026</p></div>
          <div className="wk_led">{d.site.ledger.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
        </div>
      </section>

      {/* 05 how it got made */}
      {m ? (
        <section className="wk_bts dark"><div className="wrap wk_bgrid">
          <div>
            <p className="eyebrow">Behind the scenes / Med Spa Marketing Group Chat</p>
            <h2 className="display wk_h2">How it<br />got made.</h2>
            <p className="wk_bl">{m.body}</p>
            {m.ep.href ? <Link className="btn" href={m.ep.href}>Episode page →</Link> : null}
          </div>
          <div className="wk_ep">
            <div className="wk_ept">
              {m.ep.art ? <img className="wk_art" src={m.ep.art} alt="" /> : <span className="wk_art" style={{ background: m.ep.bg, color: m.ep.fg }}>MSM</span>}
              <div><span className="mono">MSM / EP {m.n} / {Math.round(m.ep.dur / 60)} min</span><h3>{m.ep.title}</h3></div>
            </div>
            {m.quote ? (
              <>
                <blockquote className="wk_q">“{m.quote.text}”</blockquote>
                {m.quote.at ? <button className="mono wk_at" onClick={() => s.play(m.ep, sec(m.quote!.at))}>▶ Hear it at {m.quote.at}</button> : null}
              </>
            ) : null}
            <div className="wk_row">
              <button className="wk_pb" aria-label={on ? 'Pause' : 'Play'} onClick={() => (mine ? s.toggle() : s.play(m.ep))}>
                <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d={on ? 'M1 0h3v14H1zM8 0h3v14H8z' : 'M1 0l11 7-11 7z'} fill="currentColor" /></svg>
              </button>
              <div className="wk_trk"><i style={{ width: (m.ep.dur ? (t / m.ep.dur) * 100 : 0) + '%' }} /></div>
              <span className="mono">{fmt(t)} / {fmt(m.ep.dur)}</span>
            </div>
            {m.ep.chapters.length ? (
              <ol className="wk_chs">{m.ep.chapters.map((c) => <li key={c.at}><button onClick={() => s.play(m.ep, sec(c.at))}><span className="mono">{c.at}</span>{c.title}</button></li>)}</ol>
            ) : null}
          </div>
        </div></section>
      ) : null}

      {/* next */}
      <nav className="wrap wk_next" aria-label="More rebrands">
        <Link href={`/brands/${d.brand.slug}`} className="wk_nx"><span className="mono">The partner</span><b>{d.brand.name} →</b></Link>
        {d.next ? <Link href={`/work/${d.next.slug}`} className="wk_nx"><span className="mono">Next rebrand / {d.next.date}</span><b>{d.next.name} →</b></Link> : null}
      </nav>
    </div>
  )
}
