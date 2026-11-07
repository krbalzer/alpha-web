import Link from 'next/link'
import { getCtaImages } from '@/lib/data'
import { CloserBg } from './CloserBg'

/** Shared closer: Alpha lockup centered, Let's talk under it. Background rotates through the CTA Images collection. */
export async function Closer({ skipBrand }: { skipBrand?: string }) {
  const items = await getCtaImages()
  return (
    <section className="closer dark" aria-label="Let's talk">
      <div className="closer_media">
        <CloserBg items={items} skipBrand={skipBrand} />
        <div className="lock" aria-label="Alpha, Stronger Together"><span className="amark" style={{ height: 40 }} aria-hidden="true" /><span className="badge">ST</span><span className="lock_w">STRONGER<br />TOGETHER</span></div>
        <Link className="btn" href="/talk" style={{ position: 'relative', zIndex: 2 }}>Let&apos;s talk</Link>
      </div>
    </section>
  )
}
