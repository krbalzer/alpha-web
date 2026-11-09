import Link from 'next/link'
import { getCtaImages } from '@/lib/data'
import { CloserBg } from './CloserBg'

/** Shared closer: Alpha lockup centered, Let's talk under it. On a brand or location page the background is that brand's own CTA image; elsewhere it rotates through the portfolio. */
export async function Closer({ brand }: { brand?: string }) {
  const all = await getCtaImages()
  const own = brand ? all.filter((i) => i.brand === brand) : []
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
