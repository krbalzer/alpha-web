'use client'
import { useRef, useState } from 'react'

/** Long-form film: poster only until clicked (nothing downloads before that), then native controls with sound.
 *  Narrow screens get the 720 file. */
export function FilmPlay({ src, src720, poster, label }: { src: string; src720?: string; poster: string; label: string }) {
  const [on, setOn] = useState(false)
  const v = useRef<HTMLVideoElement>(null)
  const pick = () => (src720 && typeof window !== 'undefined' && window.innerWidth <= 820 ? src720 : src)
  return (
    <div className="tf_film">
      {on ? (
        <video ref={v} src={pick()} poster={poster} controls autoPlay playsInline preload="auto" />
      ) : (
        <button type="button" className="tf_play" onClick={() => setOn(true)} aria-label={`Play ${label}`}>
          <img src={poster} alt="" loading="lazy" decoding="async" />
          <span className="tf_btn"><svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><path d="M1 1l12 7-12 7z" fill="currentColor" /></svg></span>
        </button>
      )}
    </div>
  )
}
