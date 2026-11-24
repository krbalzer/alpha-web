import type { Metadata } from 'next'
import { getExecs, getNewswire } from '@/lib/pages'
import AboutView from './AboutView'

export const revalidate = 300
export const metadata: Metadata = { title: 'About', description: 'Independent practices, with the scale of a national platform. Your brand stays yours.' }

export default async function Page() {
  // timeline rows link to their own release, matched by publish date
  const releases = Object.fromEntries((await getNewswire()).map((r) => [r.date, r.href]))
  return <AboutView execs={await getExecs()} releases={releases} />
}
