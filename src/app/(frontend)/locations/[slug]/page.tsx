import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Closer } from '@/components/site/Closer'
import { Hiring } from '@/components/site/Hiring'
import { getRoles } from '@/lib/careers'
import { getLocation, getLocationSlugs } from '@/lib/pages'
import { getBrandIndex } from '@/lib/data'
import LocationView from './LocationView'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getLocationSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = await getLocation((await params).slug)
  const l = d?.b.locations[0]
  return d && l ? { title: l.name || `${d.b.short} ${l.city}`, description: `${d.b.name}, ${l.a1}, ${l.a2}. An Alpha partner location.` } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const [data, brands, roles] = await Promise.all([getLocation(slug), getBrandIndex(), getRoles()])
  if (!data) notFound()
  const poster = data.b.locations[0].heroPoster
  return (
    <>
      {poster ? <link rel="preload" as="image" href={poster} fetchPriority="high" /> : null}
      <LocationView key={data.b.locations[0].href} data={data} brands={brands} />
      <Hiring roles={roles.filter((r) => r.locHref === `/locations/${slug}`)} name={data.b.short} total={roles.length} where={data.b.locations[0].city} />
      <Closer brand={data.b.href.split('/').pop()} location={slug} />
    </>
  )
}
