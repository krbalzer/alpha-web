import Link from 'next/link'
import { getCtaImages } from '@/lib/data'
import { CloserBg } from './CloserBg'

/** Shared closer: Alpha lockup centered, Let's talk under it. On a location page the background is that location's own CTA image, on a brand page it rotates through the brand's; elsewhere through the portfolio. */
export async function Closer({ brand, location }: { brand?: string; location?: string }) {
  const all = await getCtaImages()
  const mine = location ? all.filter((i) => i.loc === location) : []
  const own = mine.length ? mine : brand ? all.filter((i) => i.brand === brand) : []
  const items = own.length ? own : all
  return (
    <section className="closer dark" aria-label="Let's talk">
      <div className="closer_media">
        <CloserBg items={items} />
        <div className="lock" aria-label="Alpha, Stronger Together"><span className="amark" style={{ height: 40 }} aria-hidden="true" /><i className="lock_div" aria-hidden="true" /><img className="lock_st" src="/brand/stronger-together.svg" alt="" /></div>
        <Link className="btn" href="/talk" style={{ position: 'relative', zIndex: 2 }}>Let&apos;s talk</Link>
      </div>
    </section>
  )
}
