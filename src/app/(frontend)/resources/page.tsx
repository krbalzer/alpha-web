import type { Metadata } from 'next'
import ResourcesView from './ResourcesView'

export const metadata: Metadata = { title: 'Resources' }

export default function Page() {
  return <ResourcesView />
}
