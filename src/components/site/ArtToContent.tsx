'use client'
import { useEffect } from 'react'

/** Show page hero: sizes the square art to the height of the text column beside it (desktop only; CSS ignores --art-h under 900px). */
export function ArtToContent({ grid = '.sh_grid', min = 200, max = 520 }: { grid?: string; min?: number; max?: number }) {
  useEffect(() => {
    const g = document.querySelector<HTMLElement>(grid)
    const txt = g?.lastElementChild as HTMLElement | null
    if (!g || !txt) return
    let last = 0
    const fit = () => {
      const h = Math.round(Math.min(max, Math.max(min, txt.getBoundingClientRect().height)))
      if (Math.abs(h - last) > 1) { last = h; g.style.setProperty('--art-h', h + 'px') }
    }
    const ro = new ResizeObserver(fit)
    ro.observe(txt)
    fit()
    return () => ro.disconnect()
  }, [grid, min, max])
  return null
}
