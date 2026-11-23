import type { Metadata } from 'next'
import { getTraining } from '@/lib/training'
import UniversityView from './UniversityView'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Training',
  description: 'Alpha University: Loops by role, hands-on Labs across the network, and AIM sessions with the masters of the specialty.',
}

export default async function Page() {
  return <UniversityView data={await getTraining()} />
}
