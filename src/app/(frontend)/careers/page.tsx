import type { Metadata } from 'next'
import { getRoles } from '@/lib/careers'
import CareersView from './CareersView'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Careers',
  description: 'Open roles inside Alpha partner practices: clinical, patient experience, leadership and marketing.',
}

export default async function Page() {
  return <CareersView roles={await getRoles()} />
}
