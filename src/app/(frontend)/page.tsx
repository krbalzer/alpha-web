import Link from 'next/link'
import { Closer } from '@/components/site/Closer'
import { Nav } from '@/components/site/Nav'
import { db, ptr } from '@/lib/data'

export const revalidate = 300

/** Interim index until the homepage board is ported. Lists every live brand template. */
export default async function Home() {
  const p = await db()
  const brands = await p.find({ collection: 'brands', where: { live: { equals: true } }, sort: 'ptr', limit: 100, depth: 0 })
  return (
    <>
      <Nav />
      <section className="wrap" style={{ padding: 'clamp(56px,6vw,110px) 0 clamp(60px,6vw,100px)' }}>
        <p className="eyebrow">Build preview</p>
        <h1 style={{ fontFamily: 'var(--disp)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(46px,5.4vw,96px)', lineHeight: 0.88, margin: '0 0 40px' }}>Raise the<br />standard</h1>
        <hr className="rule" />
        {brands.docs.map((b) => (
          <Link key={b.id} href={`/brands/${b.slug}`} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', padding: '14px 0', borderBottom: '1px solid var(--line)', textDecoration: 'none' }}>
            <span className="mono" style={{ fontSize: 11 }}>{ptr(b.ptr)}</span><span style={{ fontFamily: 'var(--h3)', fontWeight: 700, fontSize: 20 }}>{b.name}</span>
          </Link>
        ))}
      </section>
      <Closer />
    </>
  )
}
