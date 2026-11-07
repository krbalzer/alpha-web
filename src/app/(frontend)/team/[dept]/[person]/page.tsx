import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProfile, getTeamParams } from '@/lib/pages'
import ProfileView from './ProfileView'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getTeamParams()).people
}

export async function generateMetadata({ params }: { params: Promise<{ dept: string; person: string }> }): Promise<Metadata> {
  const { dept, person } = await params
  const d = await getProfile(dept, person)
  const m = d?.team[d.start]
  return m ? { title: `${m.first} ${m.last}`, description: `${m.title}, Alpha` } : {}
}

export default async function Page({ params }: { params: Promise<{ dept: string; person: string }> }) {
  const { dept, person } = await params
  const data = await getProfile(dept, person)
  if (!data) notFound()
  return <ProfileView key={dept + person} data={data} />
}
