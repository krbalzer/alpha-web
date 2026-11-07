'use client'
import { useEffect, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

type Loc = { lng: number; lat: number; ang: number }
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
export const hasMapbox = Boolean(TOKEN)

/**
 * Real map under the board's flight choreography: Mapbox Standard, monochrome night theme, 3D buildings.
 * The board engine still owns timing, the carousel, pin and route label; this follows `idx` with matching flyTo durations.
 * Loads mapbox-gl only when the section nears the viewport, so the ~1MB library never blocks first paint.
 */
export function MapboxStage({ locs, idx, intro = 2600, travel = 3200 }: { locs: Loc[]; idx: number; intro?: number; travel?: number }) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<import('mapbox-gl').Map | null>(null)
  const shown = useRef(-1)
  const spin = useRef(0)

  const fly = (i: number, first: boolean) => {
    const m = map.current, l = locs[i]
    if (!m || !l) return
    cancelAnimationFrame(spin.current)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    m.flyTo({
      center: [l.lng, l.lat], zoom: 16.2, pitch: 62, bearing: (l.ang * 180) / Math.PI,
      duration: reduce ? 0 : first ? intro : travel, curve: 1.6, essential: true,
    })
    shown.current = i
    if (reduce) return
    // slow idle orbit once the camera lands, like the prototype
    m.once('moveend', () => {
      let last = performance.now()
      const turn = (now: number) => {
        m.setBearing(m.getBearing() + (now - last) * 0.0009)
        last = now
        spin.current = requestAnimationFrame(turn)
      }
      spin.current = requestAnimationFrame(turn)
    })
  }

  useEffect(() => {
    if (!TOKEN || !el.current) return
    let dead = false
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || map.current) return
      io.disconnect()
      const mapboxgl = (await import('mapbox-gl')).default
      if (dead || !el.current) return
      mapboxgl.accessToken = TOKEN
      const start = locs[0]
      const m = new mapboxgl.Map({
        container: el.current,
        style: 'mapbox://styles/mapbox/standard',
        config: { basemap: { theme: 'monochrome', lightPreset: 'night', showPointOfInterestLabels: false, showTransitLabels: false, showPlaceLabels: true, showRoadLabels: true } },
        center: [start.lng, start.lat], zoom: 3.4, pitch: 20, bearing: 0,
        interactive: false, attributionControl: true, antialias: true,
      })
      map.current = m
      m.on('load', () => fly(idx, true))
    }, { rootMargin: '200px' })
    io.observe(el.current)
    return () => { dead = true; io.disconnect(); cancelAnimationFrame(spin.current); map.current?.remove(); map.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (map.current?.loaded() && idx !== shown.current) fly(idx, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  return <div ref={el} className="map_gl" aria-hidden="true" />
}
