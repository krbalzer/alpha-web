import type { Metadata } from 'next'
import PathwayView from './PathwayView'

export const metadata: Metadata = { title: 'How it works' }

export default function Page() {
  return <PathwayView />
}
