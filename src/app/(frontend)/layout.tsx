import type { Metadata } from 'next'
import { Footer } from '@/components/site/Footer'
import { LinkCatcher } from '@/components/site/LinkCatcher'
import { Menu } from '@/components/site/Menu'
import { Motion } from '@/components/site/Motion'
import { Player } from '@/components/site/Player'
import { SiteProvider } from '@/components/site/SiteProvider'
import { getLatestEpisode, getNetwork } from '@/lib/data'
import './global.css'
import './tune.css'
import './mobile.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Alpha Aesthetics Partners', template: '%s / Alpha' },
  description: 'A national partnership of medical aesthetics practices. Partners keep their brand, their team and their clinical judgment.',
}

const MO_BOOT = "(function(){var d=document.documentElement;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.setAttribute('data-mo','');setTimeout(function(){if(!window.__mo)d.removeAttribute('data-mo')},2500)})()"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [net, latest] = await Promise.all([getNetwork(), getLatestEpisode()])
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Hide reveal targets before first paint; un-hide if the engine never starts */}
        <script dangerouslySetInnerHTML={{ __html: MO_BOOT }} />
        <link rel="preload" href="/fonts/nhd-900.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/diatype-mono-400.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <SiteProvider net={net} latest={latest}>
          {/* Player and Menu live outside the page tree, so navigation never remounts them */}
          <Player />
          <main id="top">{children}</main>
          <Footer address={net.address} />
          <Menu />
          <Motion />
          <LinkCatcher />
        </SiteProvider>
      </body>
    </html>
  )
}
