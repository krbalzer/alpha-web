import type { Metadata } from 'next'
import PathwayView from './PathwayView'

export const metadata: Metadata = { title: 'How it works', description: 'The path to partnership: five steps and about fifteen weeks from a first call to closing.' }

export default function Page() {
  return <PathwayView />
}
