import type { Metadata } from 'next'
import { Footer } from '@/components/site/Footer'
import { Menu } from '@/components/site/Menu'
import { Player } from '@/components/site/Player'
import { SiteProvider } from '@/components/site/SiteProvider'
import { getLatestEpisode, getNetwork } from '@/lib/data'
import './global.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Alpha Aesthetics Partners', template: '%s / Alpha' },
  description: 'A national partnership of medical aesthetics practices. Partners keep their brand, their team and their clinical judgment.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [net, latest] = await Promise.all([getNetwork(), getLatestEpisode()])
  return (
    <html lang="en">
      <head>
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
        </SiteProvider>
      </body>
    </html>
  )
}
