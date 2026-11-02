'use client'
import { usePathname } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export type Ep = {
  id: string
  slug: string
  title: string
  show: string
  showShort?: string
  n?: string
  audio: string
  dur: number
  bg: string
  fg: string
  speakers: { name: string; initials: string }[]
  chapters: { at: string; title: string }[]
}

export type NetworkNums = { brands: number; locations: number; states: number }

type Site = {
  menuOpen: boolean
  setMenu: (o: boolean) => void
  net: NetworkNums
  latest: Ep | null
  // player
  ep: Ep | null
  playing: boolean
  t: number
  rate: number
  queue: Ep[]
  play: (e: Ep, at?: number) => void
  toggle: () => void
  seek: (sec: number) => void
  skip: (d: number) => void
  cycleRate: () => void
  close: () => void
  enqueue: (e: Ep) => void
}

const Ctx = createContext<Site | null>(null)
export const useSite = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useSite outside SiteProvider')
  return c
}

const KEY = 'alpha.player'
const RATES = [1, 1.25, 1.5, 2]

/**
 * Lives in the root layout, so it never unmounts on navigation.
 * One <audio> element for the whole site: that is the entire persistence trick.
 */
export function SiteProvider({ children, net, latest }: { children: React.ReactNode; net: NetworkNums; latest: Ep | null }) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [ep, setEp] = useState<Ep | null>(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [rate, setRate] = useState(1)
  const [queue, setQueue] = useState<Ep[]>([])
  const path = usePathname()

  // close the menu on navigation, lock scroll while open
  useEffect(() => setMenuOpen(false), [path])
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  // restore last episode, paused, at the saved second
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null')
      if (s?.ep) {
        setEp(s.ep)
        setT(s.t || 0)
      }
    } catch {}
  }, [])
  // save position every 2s and on tab close, not on every timeupdate
  const live = useRef({ ep, t })
  live.current = { ep, t }
  useEffect(() => {
    const save = () => { const s = live.current; if (s.ep) try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} }
    const id = setInterval(save, 2000)
    window.addEventListener('pagehide', save)
    return () => { clearInterval(id); window.removeEventListener('pagehide', save) }
  }, [])

  const el = () => {
    if (!audio.current) {
      const a = new Audio()
      a.preload = 'metadata'
      a.addEventListener('timeupdate', () => setT(a.currentTime))
      a.addEventListener('play', () => setPlaying(true))
      a.addEventListener('pause', () => setPlaying(false))
      a.addEventListener('ended', () => setQueue((q) => { if (q[0]) { load(q[0]); return q.slice(1) } return q }))
      audio.current = a
    }
    return audio.current
  }

  const load = useCallback((e: Ep, at = 0) => {
    const a = el()
    if (a.src !== e.audio) a.src = e.audio
    a.currentTime = at
    a.playbackRate = rate
    setEp(e)
    setT(at)
    a.play().catch(() => setPlaying(false))
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: e.title, artist: e.show, album: 'Alpha podcasts' })
      navigator.mediaSession.setActionHandler('seekbackward', () => skip(-15))
      navigator.mediaSession.setActionHandler('seekforward', () => skip(30))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate])

  const toggle = useCallback(() => {
    const a = el()
    if (!ep) return
    if (!a.src) return load(ep, t)
    if (a.paused) a.play().catch(() => {})
    else a.pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ep, t, load])

  const seek = (sec: number) => { const a = el(); if (a.src) a.currentTime = sec; setT(sec) }
  const skip = (d: number) => { const a = el(); const n = Math.max(0, Math.min((ep?.dur || a.duration || 0), (a.currentTime || t) + d)); seek(n) }
  const cycleRate = () => { const r = RATES[(RATES.indexOf(rate) + 1) % RATES.length]; setRate(r); el().playbackRate = r }
  const close = () => {
    const a = el(); a.pause(); a.removeAttribute('src'); a.load()
    setEp(null); setPlaying(false); setT(0)
    try { localStorage.removeItem(KEY) } catch {}
  }
  const enqueue = (e: Ep) => setQueue((q) => (q.some((x) => x.id === e.id) || ep?.id === e.id ? q : [...q, e]))
  const play = (e: Ep, at?: number) => {
    if (ep?.id === e.id && audio.current?.src) return toggle()
    setQueue((q) => q.filter((x) => x.id !== e.id))
    load(e, at ?? 0)
  }

  // body flag so the mobile dock reserves space
  useEffect(() => { document.body.classList.toggle('has-mpp', !!ep) }, [ep])

  const value = useMemo<Site>(() => ({
    menuOpen, setMenu: setMenuOpen, net, latest,
    ep, playing, t, rate, queue, play, toggle, seek, skip, cycleRate, close, enqueue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [menuOpen, net, latest, ep, playing, t, rate, queue, toggle])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const fmt = (x: number) => {
  x = Math.max(0, Math.round(x || 0))
  return Math.floor(x / 60) + ':' + String(x % 60).padStart(2, '0')
}
