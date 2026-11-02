import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Closer } from '@/components/site/Closer'
import { getBrand, getBrandSlugs } from '@/lib/data'
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
  const brand = await getBrand((await params).slug)
  if (!brand) notFound()
  return (
    <>
      <BrandView brand={brand} />
      <Closer skipBrand={brand.slug} />
    </>
  )
}
