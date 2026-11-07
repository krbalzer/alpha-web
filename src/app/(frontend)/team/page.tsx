import type { Metadata } from 'next'
import { getTeamIndex } from '@/lib/pages'
import TeamView from './TeamView'

export const revalidate = 300
export const metadata: Metadata = { title: 'The Alpha team' }

export default async function Page() {
  return <TeamView data={await getTeamIndex()} />
}
