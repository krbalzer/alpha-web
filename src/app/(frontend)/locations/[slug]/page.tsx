import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Closer } from '@/components/site/Closer'
import { getLocation, getLocationSlugs } from '@/lib/pages'
import LocationView from './LocationView'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getLocationSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = await getLocation((await params).slug)
  const l = d?.b.locations[0]
  return d && l ? { title: `${d.b.short} ${l.city}`, description: `${d.b.name}, ${l.a1}, ${l.a2}. An Alpha partner location.` } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const data = await getLocation((await params).slug)
  if (!data) notFound()
  const poster = data.b.locations[0].heroPoster
  return (
    <>
      {poster ? <link rel="preload" as="image" href={poster} fetchPriority="high" /> : null}
      <LocationView key={data.b.locations[0].href} data={data} />
      <Closer skipBrand={data.b.href.split('/').pop()} />
    </>
  )
}
