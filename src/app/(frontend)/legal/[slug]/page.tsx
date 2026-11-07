import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLegal } from '@/lib/pages'
import LegalView from './LegalView'

export const revalidate = 300

async function load(slug: string) {
  const r = await getLegal()
  const doc = r.find((d) => d.slug === slug)
  return doc ? { doc, docs: r } : null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = await load((await params).slug)
  return d ? { title: d.doc.title } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const d = await load((await params).slug)
  if (!d) notFound()
  return <LegalView doc={d.doc} docs={d.docs} />
}
