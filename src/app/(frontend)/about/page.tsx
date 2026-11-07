import type { Metadata } from 'next'
import { getExecs } from '@/lib/pages'
import AboutView from './AboutView'

export const revalidate = 300
export const metadata: Metadata = { title: 'About', description: 'Independent practices, with the scale of a national platform. Your brand stays yours.' }

export default async function Page() {
  return <AboutView execs={await getExecs()} />
}
