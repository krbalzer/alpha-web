import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Closer } from '@/components/site/Closer'
import { SinceAlpha } from '@/components/site/SinceAlpha'
import { getBrand, getBrandIndex, getBrandSlugs, getSinceAlpha } from '@/lib/data'
import BrandView from './BrandView'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getBrandSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = await getBrand((await params).slug)
  return b ? { title: b.seo.title, description: b.seo.description } : {}
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const [brand, brands] = await Promise.all([getBrand((await params).slug), getBrandIndex()])
  if (!brand) notFound()
  const since = await getSinceAlpha(brand.slug, brand.since)
  return (
    <>
      {/* The poster is the first thing anyone sees: fetch it ahead of the video and everything else. React hoists this into <head>. */}
      {brand.heroPoster ? <link rel="preload" as="image" href={brand.heroPoster} fetchPriority="high" /> : null}
      <BrandView brand={brand} brands={brands} />
      {since ? <SinceAlpha d={since} /> : null}
      <Closer brand={brand.slug} />
    </>
  )
}
