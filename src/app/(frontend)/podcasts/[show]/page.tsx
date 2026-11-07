import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShow, getShows } from '@/lib/pages'
import ShowView from './ShowView'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getShows()).map((s) => ({ show: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ show: string }> }): Promise<Metadata> {
  const d = await getShow((await params).show)
  return d ? { title: d.show.name, description: d.show.tag } : {}
}

export default async function Page({ params }: { params: Promise<{ show: string }> }) {
  const data = await getShow((await params).show)
  if (!data) notFound()
  return <ShowView key={data.show.name} data={data} />
}
