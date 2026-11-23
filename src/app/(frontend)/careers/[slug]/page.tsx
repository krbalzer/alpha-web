import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/site/Nav'
import { Mark, RoleRow } from '@/components/site/Roles'
import { getRole, getRoles } from '@/lib/careers'
import '@/components/site/careers.css'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getRoles()).map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = await getRole((await params).slug)
  return d ? { title: `${d.role.title}, ${d.role.brand.name}`, description: `${d.role.title} at ${d.role.brand.name}, ${d.role.where}. An Alpha partner practice.` } : {}
}

/** One opening. Apply goes straight to the Paylocity application, so every applicant lands in the same pipeline. */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const d = await getRole((await params).slug)
  if (!d) notFound()
  const { role: r, more } = d
  const b = r.brand
  return (
    <div className="cr">
      <Nav>
        <div className="crumb"><div className="wrap" style={{ display: 'flex', alignItems: 'center', height: 34, fontFamily: 'var(--mono)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', gap: 6, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <a href="/careers">Alpha / Careers</a><span>/ {b.name} / {r.title}</span>
        </div></div>
      </Nav>
      <article className="jd"><div className="wrap jd_g">
        <aside className="jd_side">
          <a className="jd_back mono" href="/careers">← All openings</a>
          <div className="jd_brand mono"><Mark n={b.n} name={b.name} /><span>{b.name}</span></div>
          <h1 className="jd_t">{r.title}</h1>
          <dl className="jd_meta">
            <dt>Where</dt><dd>{r.locHref ? <a href={r.locHref}>{r.where}</a> : r.where}</dd>
            <dt>Team</dt><dd>{r.team}</dd>
            <dt>Posted</dt><dd>{r.date}</dd>
            {r.ref ? (<><dt>Ref</dt><dd>Paylocity {r.ref}</dd></>) : null}
          </dl>
          <div className="jd_acts">
            <a className="btn solid" href={r.applyUrl} target="_blank" rel="noopener">Apply on Paylocity ↗</a>
            <a className="btn" href={b.href}>About {b.name}</a>
          </div>
        </aside>
        <div>
          {b.img ? <div className="jd_ph" style={{ backgroundImage: `url(${b.img})` }} role="img" aria-label={`Inside ${b.name}`} /> : null}
          {b.img ? <p className="jd_cap mono">{b.name}{r.where ? ` · ${r.where}` : ''}</p> : null}
          {b.intro ? (
            <div className="jd_about">
              <p className="eyebrow">The practice</p>
              <p className="body">{b.intro}</p>
            </div>
          ) : null}
          <div className="jd_desc" dangerouslySetInnerHTML={{ __html: r.desc }} />
          <div className="jd_acts" style={{ marginTop: 32 }}>
            <a className="btn solid" href={r.applyUrl} target="_blank" rel="noopener">Apply on Paylocity ↗</a>
          </div>
        </div>
      </div></article>
      {more.length ? (
        <section className="jd_more"><div className="wrap">
          <p className="eyebrow">Also hiring at {b.name}</p>
          {more.map((m) => <RoleRow key={m.slug} r={m} compact />)}
        </div></section>
      ) : null}
    </div>
  )
}
