import type { Metadata } from 'next'
import { getLocationsDir } from '@/lib/pages'
import LocationsView from './LocationsView'

export const revalidate = 300
export const metadata: Metadata = { title: 'Locations', description: 'Every Alpha partner location, on one map.' }

export default async function Page() {
  return <LocationsView data={await getLocationsDir()} />
}
