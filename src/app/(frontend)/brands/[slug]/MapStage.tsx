'use client'
import { useEffect, useRef } from 'react'
import type { Map as MLMap, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

type Loc = { lng: number; lat: number; ang: number }
/** Real map: no account or token (MapLibre + OpenFreeMap tiles). The board's canvas map stays as the fallback. */
export const hasRealMap = true

// The board's palette: near-black ground, quiet streets, extruded blocks. Real geometry, prototype mood.
const C = { ground: '#151513', water: '#10100f', park: '#181816', minor: '#252522', major: '#2f2e2a', block: '#262522', top: '#34332f' }
const STYLE: StyleSpecification = {
  version: 8,
  sources: { omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet', attribution: '© OpenStreetMap contributors, OpenFreeMap' } },
  layers: [
    { id: 'bg', type: 'background', paint: { 'background-color': C.ground } },
    { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': C.water } },
    { id: 'park', type: 'fill', source: 'omt', 'source-layer': 'landuse', filter: ['in', ['get', 'class'], ['literal', ['park', 'grass', 'cemetery']]], paint: { 'fill-color': C.park } },
    { id: 'minor', type: 'line', source: 'omt', 'source-layer': 'transportation', filter: ['in', ['get', 'class'], ['literal', ['minor', 'service', 'track', 'path']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': C.minor, 'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 12, 0.4, 18, 7] } },
    { id: 'major', type: 'line', source: 'omt', 'source-layer': 'transportation', filter: ['in', ['get', 'class'], ['literal', ['primary', 'secondary', 'tertiary', 'trunk', 'motorway']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': C.major, 'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 8, 0.6, 18, 14] } },
    { id: 'blocks', type: 'fill-extrusion', source: 'omt', 'source-layer': 'building', minzoom: 13,
      paint: {
        'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 6], 0, C.block, 40, C.top],
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13, 0, 14.5, ['coalesce', ['get', 'render_height'], 6]],
        'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
        'fill-extrusion-opacity': 0.92, 'fill-extrusion-vertical-gradient': true,
      } },
  ],
}

/**
 * Follows the board's flight choreography: the engine owns timing, carousel, pin and route label;
 * this flies to `idx` with matching durations. The library loads only when the section nears the viewport.
 */
export function MapStage({ locs, idx, intro = 2600, travel = 3200 }: { locs: Loc[]; idx: number; intro?: number; travel?: number }) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<MLMap | null>(null)
  const shown = useRef(-1)
  const spin = useRef(0)
  const ready = useRef(false)

  const fly = (i: number, first: boolean) => {
    const m = map.current, l = locs[i]
    if (!m || !l || l.lng == null || l.lat == null) return
    cancelAnimationFrame(spin.current)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    m.flyTo({ center: [l.lng, l.lat], zoom: 16.4, pitch: 60, bearing: (l.ang * 180) / Math.PI, duration: reduce ? 0 : first ? intro : travel, curve: 1.6, essential: true })
    shown.current = i
    if (reduce) return
    m.once('moveend', () => { // slow idle orbit once the camera lands, like the prototype
      let last = performance.now()
      const turn = (now: number) => { m.setBearing(m.getBearing() + (now - last) * 0.0009); last = now; spin.current = requestAnimationFrame(turn) }
      spin.current = requestAnimationFrame(turn)
    })
  }

  useEffect(() => {
    if (!el.current || !locs.length) return
    let dead = false
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || map.current) return
      io.disconnect()
      const { Map, setWorkerUrl, getVersion } = await import('maplibre-gl')
      setWorkerUrl('/vendor/maplibre-gl-worker.mjs?v=' + getVersion()) // copied from node_modules on install (package.json postinstall)
      if (dead || !el.current) return
      const s = locs[0]
      const m = new Map({ container: el.current, style: STYLE, center: [s.lng, s.lat], zoom: 3.4, pitch: 20, interactive: false, attributionControl: { compact: true }, fadeDuration: 0 })
      map.current = m
      m.on('load', () => { ready.current = true; fly(idx, true) })
    }, { rootMargin: '200px' })
    io.observe(el.current)
    return () => { dead = true; io.disconnect(); cancelAnimationFrame(spin.current); map.current?.remove(); map.current = null; ready.current = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (ready.current && idx !== shown.current) fly(idx, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  return <div ref={el} className="map_gl" aria-hidden="true" />
}
