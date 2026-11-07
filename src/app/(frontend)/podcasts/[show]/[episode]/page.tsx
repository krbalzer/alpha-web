import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEpisodePage } from '@/lib/pages'
import EpisodeView from './EpisodeView'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ show: string; episode: string }> }): Promise<Metadata> {
  const { show, episode } = await params
  const d = await getEpisodePage(show, episode)
  return d ? { title: `${d.ep.title} / ${d.show.name}`, description: d.ep.sum.slice(0, 160) } : {}
}

export default async function Page({ params }: { params: Promise<{ show: string; episode: string }> }) {
  const { show, episode } = await params
  const data = await getEpisodePage(show, episode)
  if (!data) notFound()
  return <EpisodeView key={episode} data={data} />
}
