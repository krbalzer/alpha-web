import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/data'
import { REPORTS, STAGES } from '@/lib/portal'
import PortalView, { type PortalData } from './PortalView'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Partner portal', robots: { index: false, follow: false } }

/** A prospect's private portal. The token in the URL is the only key, so nothing here links anywhere else in the CMS. */
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[A-Za-z0-9_-]{24,64}$/.test(token)) notFound()
  const p = await db()
  const lead = (await p.find({ collection: 'leads', where: { portalToken: { equals: token } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!lead || lead.kind !== 'partner') notFound()
  const files = (await p.find({ collection: 'lead-files', where: { lead: { equals: lead.id } }, sort: '-createdAt', limit: 200, depth: 0, overrideAccess: true })).docs
  const stageIx = Math.max(0, STAGES.findIndex((s) => s.key === lead.stage))
  const data: PortalData = {
    token,
    practice: lead.practice || 'Your practice',
    name: (lead.name || '').split(' ')[0],
    guide: lead.guide || 'Tyler',
    test: !!lead.test,
    stageIx,
    note: lead.stageNote || '',
    reports: REPORTS.map((r) => {
      const mine = files.filter((f) => f.report === r.key)
      const last = mine[0]
      return { key: r.key, t: r.t, sub: r.sub, tip: 'tip' in r ? r.tip : '', pdf: r.pdf, status: last ? (last.status as 'review' | 'ok' | 'fix') : 'todo', feedback: last?.status === 'fix' ? last.feedback || '' : '', file: last?.filename || '', count: mine.length }
    }),
  }
  return <PortalView d={data} />
}
