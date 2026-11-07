'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Board markup uses plain <a href>. This turns same-origin clicks into client navigations,
 * so the player and menu never remount and pages swap without a full reload.
 */
export function LinkCatcher() {
  const router = useRouter()
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target || a.hasAttribute('download') || a.dataset.native != null) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return
      if (url.pathname === location.pathname && url.hash) return // in-page anchor
      e.preventDefault()
      router.push(url.pathname + url.search + url.hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [router])
  return null
}
