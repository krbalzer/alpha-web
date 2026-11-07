import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDept, getTeamParams } from '@/lib/pages'
import DeptView from './DeptView'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getTeamParams()).depts.map((dept) => ({ dept }))
}

export async function generateMetadata({ params }: { params: Promise<{ dept: string }> }): Promise<Metadata> {
  const d = await getDept((await params).dept)
  return d ? { title: `${d.d.name} team`, description: d.d.line } : {}
}

export default async function Page({ params }: { params: Promise<{ dept: string }> }) {
  const data = await getDept((await params).dept)
  if (!data) notFound()
  return <DeptView key={data.d.slug} data={data} />
}
