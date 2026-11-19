'use client'
import { useEffect, useRef, useState } from 'react'

/** Homepage story card: a muted preview loops while the card is on screen; a click plays it from the top with sound, another pauses. */
export function StoryVideo({ src, poster, quote }: { src: string; poster?: string; quote: string }) {
  const v = useRef<HTMLVideoElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = v.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (el.muted) el.play().catch(() => {}) } else { el.pause(); if (!el.muted) { el.muted = true; setOn(false) } }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const toggle = () => {
    const el = v.current
    if (!el) return
    if (on) { el.muted = true; setOn(false); return }
    el.muted = false; el.currentTime = 0; el.play().catch(() => {}); setOn(true)
  }
  return (
    <button className={'story_media story_vid' + (on ? ' is-on' : '')} onClick={toggle} aria-label={on ? 'Mute' : 'Play with sound'}>
      <video ref={v} src={src} poster={poster} muted loop playsInline preload="metadata" onEnded={() => setOn(false)} />
      <span className="story_play" aria-hidden="true">
        {on
          ? <svg width="9" height="10" viewBox="0 0 10 12"><path d="M1 0h3v12H1zM6 0h3v12H6z" fill="currentColor" /></svg>
          : <svg width="9" height="10" viewBox="0 0 9 10"><path d="M1 .8v8.4L8.3 5z" fill="currentColor" /></svg>}
      </span>
      <p className="story_quote">{quote}</p>
    </button>
  )
}
