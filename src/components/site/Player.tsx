'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { fmt, useSite } from './SiteProvider'

const Play = () => <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z" fill="currentColor" /></svg>
const Pause = () => <svg width="9" height="11" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 0h3v12H1zM6 0h3v12H6z" fill="currentColor" /></svg>
const Back = () => <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 6.2A5.5 5.5 0 1 1 2.5 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M2.6 2.8v3.6h3.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
const Fwd = () => <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M12.8 6.2A5.5 5.5 0 1 0 13.5 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M13.4 2.8v3.6H9.8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>

const sec = (a: string) => a.split(':').reduce((v, n) => v * 60 + +n, 0)

/** Desktop: sticky bar above the nav. Mobile: docked to the bottom. Hidden on the playing episode's own page. */
export function Player() {
  const s = useSite()
  const path = usePathname()
  const [drawer, setDrawer] = useState(false)
  const swipe = useRef<number | null>(null)
  const e = s.ep
  const onOwnPage = !!e && path === `/podcasts/episodes/${e.slug}`
  const on = !!e && !onOwnPage
  const pct = e ? Math.min(100, (s.t / (e.dur || 1)) * 100) : 0
  const chs = e?.chapters.map((c) => sec(c.at)) || []
  let act = 0
  chs.forEach((c, k) => { if (s.t >= c) act = k })

  return (
    <>
      <div className={'pp' + (on ? ' is-on' : '')} role="region" aria-label="Now playing" aria-hidden={!on}>
        {e && (
          <>
            <div className="pp_in">
              <button className="pp_art" style={{ background: e.bg, color: e.fg }} onClick={() => setDrawer(!drawer)} aria-label="Show chapters and up next">{e.showShort || e.show}</button>
              <div className="pp_mid">
                <button className="pp_ti" onClick={() => setDrawer(!drawer)} aria-expanded={drawer}><b>{e.title}</b><span>{e.show}{e.n ? ` // EP ${e.n}` : ''}</span></button>
                <div className="pp_ctl">
                  <button className="pp_b pp_skip" onClick={() => s.skip(-15)} aria-label="Back 15 seconds" title="Back 15 seconds"><Back /></button>
                  <button className="pp_b pp_play" onClick={s.toggle} aria-label={s.playing ? 'Pause' : 'Play'}>{s.playing ? <Pause /> : <Play />}</button>
                  <button className="pp_b pp_skip" onClick={() => s.skip(30)} aria-label="Forward 30 seconds" title="Forward 30 seconds"><Fwd /></button>
                  <span className="pp_time">{fmt(s.t)}</span>
                  <div className="pp_track" role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} tabIndex={0}
                    onClick={(ev) => { const r = ev.currentTarget.getBoundingClientRect(); s.seek(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * e.dur) }}
                    onKeyDown={(ev) => { if (ev.key === 'ArrowLeft') s.skip(-15); if (ev.key === 'ArrowRight') s.skip(30) }}>
                    <i /><i className="f" style={{ width: pct + '%' }} /><i className="k" style={{ left: pct + '%' }} />
                  </div>
                  <span className="pp_time">{fmt(e.dur)}</span>
                </div>
              </div>
              <div className="pp_faces">{e.speakers.map((p) => <span key={p.name} title={p.name}>{p.initials}</span>)}</div>
              <div className="pp_right">
                <button className="pp_pill" onClick={s.cycleRate} aria-label="Playback speed">{s.rate}x</button>
                <button className="pp_x" onClick={s.close} aria-label="Close player">×</button>
              </div>
            </div>
            <div className={'pp_drawer' + (drawer ? ' is-on' : '')}>
              <div className="pp_dr_in">
                <div>
                  <h4>Chapters</h4>
                  {e.chapters.map((c, k) => (
                    <button key={k} className={'pp_ch' + (k === act ? ' is-on' : '')} onClick={() => s.seek(chs[k])}><span>{c.at}</span>{c.title}</button>
                  ))}
                  <Link className="pp_link" href={`/podcasts/episodes/${e.slug}`} onClick={() => setDrawer(false)}>Open the episode page →</Link>
                </div>
                <div>
                  <h4>Up next</h4>
                  {s.queue.map((q) => (
                    <div className="pp_q" key={q.id}><i style={{ background: q.bg }} /><div><b>{q.title}</b><span>{q.show}{q.n ? ` · EP ${q.n}` : ''}</span></div><button onClick={() => s.play(q)}>Play</button></div>
                  ))}
                  {!s.queue.length && <p className="k" style={{ margin: '10px 0 0' }}>Add episodes with + Queue on any list.</p>}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {e && (
        <div className={'mpp' + (on ? '' : ' is-off')}
          onPointerDown={(ev) => { swipe.current = ev.clientY }}
          onPointerUp={(ev) => { if (swipe.current !== null && ev.clientY - swipe.current > 40) s.close(); swipe.current = null }}>
          <i className="mpp_grab" aria-hidden="true" />
          <i className="a" style={{ background: e.bg }} />
          <div><b>{e.title}</b><span>{e.show}{e.n ? ` // EP ${e.n}` : ''}</span></div>
          <button onClick={s.toggle} aria-label={s.playing ? 'Pause' : 'Play'}>{s.playing ? <Pause /> : <span className="pl"><Play /></span>}</button>
          <button className="mpp_x" onClick={s.close} aria-label="Close player and stop">×</button>
          <em style={{ width: pct + '%' }} />
        </div>
      )}
    </>
  )
}
