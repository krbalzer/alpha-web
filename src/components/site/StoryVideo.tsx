'use client'
import { useEffect, useRef, useState } from 'react'

/** Homepage story card. A still until engaged: hover loops a tiny silent preview (~100KB, loaded on hover only),
 *  click plays the full clip from the top with sound, click again stops. Touch devices skip the hover step. */
export function StoryVideo({ src, preview, poster, quote }: { src: string; preview?: string; poster?: string; quote: string }) {
  const v = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState<'still' | 'hover' | 'play'>('still')
  useEffect(() => {
    const el = v.current
    if (!el || mode !== 'play') return
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) setMode('still') }, { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [mode])
  const enter = (e: React.PointerEvent) => { if (e.pointerType === 'mouse' && mode === 'still' && preview) setMode('hover') }
  const leave = (e: React.PointerEvent) => { if (e.pointerType === 'mouse' && mode === 'hover') setMode('still') }
  const toggle = () => setMode((m) => (m === 'play' ? 'still' : 'play'))
  const cur = mode === 'play' ? src : mode === 'hover' ? preview : undefined
  return (
    <button className={'story_media story_vid' + (mode === 'play' ? ' is-on' : '')} onClick={toggle} onPointerEnter={enter} onPointerLeave={leave} aria-label={mode === 'play' ? 'Stop' : 'Play with sound'}>
      {poster ? <img className="story_still" src={poster} alt="" loading="lazy" decoding="async" /> : null}
      {cur ? (
        <video key={mode} ref={v} src={cur} autoPlay playsInline muted={mode !== 'play'} loop={mode === 'hover'} preload="auto"
          onLoadedData={(e) => { const el = e.currentTarget; if (mode === 'play') { el.muted = false; el.currentTime = 0 } el.play().catch(() => {}) }}
          onEnded={() => setMode('still')} />
      ) : null}
      <span className="story_play" aria-hidden="true">
        {mode === 'play'
          ? <svg width="9" height="10" viewBox="0 0 10 12"><path d="M1 0h3v12H1zM6 0h3v12H6z" fill="currentColor" /></svg>
          : <svg width="9" height="10" viewBox="0 0 9 10"><path d="M1 .8v8.4L8.3 5z" fill="currentColor" /></svg>}
      </span>
      <p className="story_quote">{quote}</p>
    </button>
  )
}
