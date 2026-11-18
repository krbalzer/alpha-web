import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Closer } from '@/components/site/Closer'
import { getFounder, getFounderSlugs } from '@/lib/pages'
import { getBrandIndex } from '@/lib/data'
import FounderView from './FounderView'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getFounderSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = await getFounder((await params).slug)
  return d ? { title: d.f.name, description: d.f.headline || `${d.f.role}, ${d.b.name}` } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [data, brands] = await Promise.all([getFounder((await params).slug), getBrandIndex()])
  if (!data) notFound()
  return (
    <>
      <FounderView key={data.f.name} data={data} brands={brands} />
      <Closer />
    </>
  )
}
