'use client'
import { useEffect } from 'react'
import { fmt, useSite, type Ep } from './SiteProvider'

const sec = (a: string) => a.split(':').reduce((v, n) => v * 60 + +n, 0)
const Play = () => <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z" fill="currentColor" /></svg>
const Pause = () => <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 0h3v12H1zM6 0h3v12H6z" fill="currentColor" /></svg>
const Back = () => <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 6.2A5.5 5.5 0 1 1 2.5 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M2.6 2.8v3.6h3.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
const Fwd = () => <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M12.8 6.2A5.5 5.5 0 1 0 13.5 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M13.4 2.8v3.6H9.8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>

/**
 * The Episode board's sticky player (".player"), driven by the site-wide audio in SiteProvider.
 * Before this episode plays it shows 0:00 and the full length; play, seek and skip start it from here.
 * Chapter ticks sit on the track, and the matching row in the page's chapter list gets .is-on.
 */
export function EpisodeBar({ ep }: { ep?: Ep | null }) {
  const s = useSite()
  const mine = !!ep && s.ep?.id === ep.id
  const dur = ep?.dur || 0
  const t = mine ? s.t : 0
  const pct = dur ? Math.min(100, (t / dur) * 100) : 0
  const chs = (ep?.chapters || []).map((c) => sec(c.at))
  let act = -1
  if (mine) chs.forEach((c, k) => { if (t >= c) act = k })

  useEffect(() => {
    document.querySelectorAll('.chap button').forEach((b, k) => b.classList.toggle('is-on', k === act))
  }, [act])

  if (!ep || !ep.audio) return null
  const go = (at: number) => (mine ? s.seek(at) : s.play(ep, at))
  const skip = (d: number) => (mine ? s.skip(d) : s.play(ep, Math.max(0, d)))
  const playing = mine && s.playing

  return (
    <div className="player" role="region" aria-label="Audio player">
      <div className="wrap pl_grid">
        <span className="pl_ctl">
          <button className="pl_sk" onClick={() => skip(-15)} aria-label="Back 15 seconds" title="Back 15 seconds"><Back /></button>
          <button className="pl_btn" onClick={() => (mine ? s.toggle() : s.play(ep))} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause /> : <Play />}</button>
          <button className="pl_sk" onClick={() => skip(30)} aria-label="Forward 30 seconds" title="Forward 30 seconds"><Fwd /></button>
        </span>
        <span className="pl_now mono"><b>{act >= 0 ? ep.chapters[act].title : ep.title}</b><span>{act >= 0 ? `Chapter ${act + 1} of ${chs.length}` : ep.show}</span></span>
        <span className="pl_time mono">{fmt(t)}</span>
        <div className="pl_track" role="slider" tabIndex={0} aria-label="Seek" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}
          onClick={(ev) => { const r = ev.currentTarget.getBoundingClientRect(); go(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * dur) }}
          onKeyDown={(ev) => { if (ev.key === 'ArrowLeft') skip(-15); if (ev.key === 'ArrowRight') skip(30) }}>
          <i className="pl_rail" /><i className="pl_fill" style={{ width: pct + '%' }} />
          {dur > 0 && chs.slice(1).map((c, k) => <i key={k} className="pl_tick" style={{ left: (c / dur) * 100 + '%' }} title={ep.chapters[k + 1].title} />)}
          <i className="pl_knob" style={{ left: pct + '%' }} />
        </div>
        <span className="pl_time mono">{fmt(dur)}</span>
        <button className="pl_rate mono" onClick={s.cycleRate} aria-label="Playback speed">{s.rate}x</button>
      </div>
    </div>
  )
}
