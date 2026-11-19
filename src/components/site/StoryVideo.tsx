'use client'
import { useEffect, useRef, useState } from 'react'

/** Homepage story card. A tiny silent preview (~100KB) loops while the card is on screen and nothing loads before it is near;
 *  a click swaps in the full clip and plays it from the top with sound, another click mutes it. */
export function StoryVideo({ src, preview, poster, quote }: { src: string; preview?: string; poster?: string; quote: string }) {
  const v = useRef<HTMLVideoElement>(null)
  const [on, setOn] = useState(false)
  const [near, setNear] = useState(false)
  const [full, setFull] = useState(!preview)
  useEffect(() => {
    const el = v.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setNear(true); if (el.muted) el.play().catch(() => {}) }
      else { el.pause(); if (!el.muted) { el.muted = true; setOn(false) } }
    }, { rootMargin: '200px 0px', threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const toggle = () => {
    const el = v.current
    if (!el) return
    if (on) { el.muted = true; setOn(false); return }
    setFull(true); setOn(true)
    requestAnimationFrame(() => { el.muted = false; el.currentTime = 0; el.play().catch(() => {}) })
  }
  const cur = full ? src : preview
  return (
    <button className={'story_media story_vid' + (on ? ' is-on' : '')} onClick={toggle} aria-label={on ? 'Mute' : 'Play with sound'}>
      <video ref={v} src={near ? cur : undefined} poster={poster} muted loop={!on} playsInline autoPlay={near} preload="none" onEnded={() => setOn(false)} onLoadedData={(e) => { if (on) { const el = e.currentTarget; el.muted = false; el.play().catch(() => {}) } }} />
      <span className="story_play" aria-hidden="true">
        {on
          ? <svg width="9" height="10" viewBox="0 0 10 12"><path d="M1 0h3v12H1zM6 0h3v12H6z" fill="currentColor" /></svg>
          : <svg width="9" height="10" viewBox="0 0 9 10"><path d="M1 .8v8.4L8.3 5z" fill="currentColor" /></svg>}
      </span>
      <p className="story_quote">{quote}</p>
    </button>
  )
}
