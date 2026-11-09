'use client'
import { useEffect, useRef, useState } from 'react'

export type ReelSrc = { av1?: string; h264: string; poster: string }

/**
 * Home "Network reel": muted autoplay loop, desktop (16:9) or mobile (9:16) cut chosen by screen width.
 * Plays only while on screen; "Sound on" pauses the persistent podcast player. Reduced motion: poster until tapped.
 */
export function HomeReel({ desktop, mobile }: { desktop?: ReelSrc | null; mobile?: ReelSrc | null }) {
  const vid = useRef<HTMLVideoElement | null>(null)
  const [src, setSrc] = useState<ReelSrc | null>(null)
  const [muted, setMuted] = useState(true)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    const pick = () => setSrc((mq.matches ? mobile : desktop) || desktop || mobile || null)
    pick()
    mq.addEventListener('change', pick)
    return () => mq.removeEventListener('change', pick)
  }, [desktop, mobile])

  useEffect(() => {
    const v = vid.current
    if (!v || !src) return
    v.load()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [src])

  const sound = () => {
    const v = vid.current
    if (!v) return
    const m = !muted
    v.muted = m
    setMuted(m)
    if (!m) { window.dispatchEvent(new CustomEvent('alpha:pause')); v.play().catch(() => {}) }
  }

  if (!desktop && !mobile) return null
  return (
    <section className={'reel reel_v' + (on ? ' is-on' : '')} aria-label="Alpha 2025 in numbers">
      {src && (
        <video ref={vid} className="reel_video" poster={src.poster} muted={muted} loop playsInline preload="metadata" onPlaying={() => setOn(true)} aria-hidden={muted}>
          {src.av1 && <source src={src.av1} type='video/mp4; codecs="av01.0.08M.08"' />}
          <source src={src.h264} type="video/mp4" />
        </video>
      )}
      <button className="btn btn-light reel_unmute" style={{ color: '#E8E4DA' }} onClick={sound} aria-pressed={!muted}>{muted ? 'Sound on' : 'Sound off'}</button>
    </section>
  )
}
