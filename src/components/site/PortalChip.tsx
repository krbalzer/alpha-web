import type { PortalMe } from './SiteProvider'

/** The remembered partner's way back to their portal: practice, stage, initials. Sits where Let's talk usually does. */
export function PortalChip({ me, className = '' }: { me: PortalMe; className?: string }) {
  return (
    <a className={'pchip ' + className} href="/portal" data-native="" aria-label={`Your partner portal: ${me.practice}`}>
      <span className="pchip_t"><b>{me.practice}</b><em>{me.stage}</em></span>
      <span className="pchip_av" aria-hidden="true">{me.ini}</span>
    </a>
  )
}
