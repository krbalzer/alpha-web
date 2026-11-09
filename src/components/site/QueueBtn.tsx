'use client'
import { useSite, type Ep } from './SiteProvider'

/**
 * "+ Queue" on any episode list (Player board). Adds the episode to Up next in the persistent player;
 * reads "Queued" once it is in (tap again to take it out) and "Playing" for the episode that is on.
 */
export function QueueBtn({ ep, className = '' }: { ep?: Ep | null; className?: string }) {
  const s = useSite()
  if (!ep || !ep.audio) return null
  const playing = s.ep?.id === ep.id
  const queued = s.queue.some((q) => q.id === ep.id)
  const label = playing ? 'Playing' : queued ? 'Queued' : '+ Queue'
  return (
    <button
      type="button"
      className={'qb' + (queued ? ' is-q' : '') + (playing ? ' is-now' : '') + (className ? ' ' + className : '')}
      aria-pressed={queued}
      disabled={playing}
      title={playing ? 'Now playing' : queued ? 'Remove from Up next' : 'Add to Up next'}
      onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); if (queued) s.dequeue(ep.id); else s.enqueue(ep) }}
    >{label}</button>
  )
}
