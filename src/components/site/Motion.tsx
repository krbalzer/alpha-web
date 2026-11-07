'use client'
import { useEffect } from 'react'
import { moStart } from '@/lib/motion'

/** Starts the reveal engine once. It watches the body, so pages added on navigation reveal too. */
export function Motion() {
  useEffect(() => {
    ;(window as unknown as { __mo?: number }).__mo = 1
    return moStart(document.body) || undefined
  }, [])
  return null
}
