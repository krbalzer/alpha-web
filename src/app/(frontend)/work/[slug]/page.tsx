import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Closer } from '@/components/site/Closer'
import { getWork, getWorkSlugs } from '@/lib/data'
import WorkView from './WorkView'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getWorkSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = await getWork((await params).slug)
  return w ? { title: `${w.brand.name} ${w.noun || 'rebrand'}`, description: w.intro.slice(0, 160) } : {}
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const w = await getWork((await params).slug)
  if (!w) notFound()
  return (
    <>
      <WorkView d={w} />
      <Closer brand={w.brand.slug} />
    </>
  )
}
