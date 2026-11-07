import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticle, getNewswire } from '@/lib/pages'
import ArticleView from './ArticleView'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getNewswire()).map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = await getArticle((await params).slug)
  return d ? { title: d.a.t, description: d.a.sum, openGraph: d.a.img ? { images: [d.a.img] } : undefined } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const data = await getArticle((await params).slug)
  if (!data) notFound()
  return <ArticleView key={data.a.slug} data={data} />
}
