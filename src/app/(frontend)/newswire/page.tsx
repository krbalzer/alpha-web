import type { Metadata } from 'next'
import { getNewswire } from '@/lib/pages'
import NewswireView from './NewswireView'

export const revalidate = 300
export const metadata: Metadata = { title: 'Newswire', description: 'New partners, new locations and network news, in the order it happened.' }

export default async function Page() {
  return <NewswireView data={await getNewswire()} />
}
