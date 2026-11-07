import type { Metadata } from 'next'
import { getPodcasts } from '@/lib/pages'
import PodcastsView from './PodcastsView'

export const revalidate = 300
export const metadata: Metadata = { title: 'Podcasts', description: 'The Alpha podcast network: every show and every episode, searchable.' }

export default async function Page() {
  return <PodcastsView data={await getPodcasts()} />
}
