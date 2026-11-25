import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/data'
import { GUIDES, REPORTS, STAGES } from '@/lib/portal'
import PortalView from './PortalView'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Partner portal', robots: { index: false, follow: false } }

const TZ = 'America/Los_Angeles'
const day = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ })
function when(iso: string) {
  const d = new Date(iso), now = new Date()
  if (day(d) === day(now)) return 'Today'
  if (day(d) === day(new Date(now.getTime() - 864e5))) return 'Yesterday'
  return d.toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' })
}

/** A prospect's private portal (design/boards/Portal.dc.html). The token in the URL is the only key. */
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[A-Za-z0-9_-]{24,64}$/.test(token)) notFound()
  const p = await db()
  const lead = (await p.find({ collection: 'leads', where: { portalToken: { equals: token } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!lead || lead.kind !== 'partner') notFound()
  const files = (await p.find({ collection: 'lead-files', where: { lead: { equals: lead.id } }, sort: '-createdAt', limit: 200, depth: 0, overrideAccess: true })).docs
  const title = (k: string) => REPORTS.find((r) => r.key === k)?.t || 'a file'
  const guide = lead.guide || 'Tyler'

  const ev: { at: string; t: string }[] = [{ at: lead.createdAt, t: 'Portal opened' }]
  if (lead.finSentAt) ev.push({ at: lead.finSentAt, t: `You sent your financials to ${guide}` })
  for (const f of files) {
    ev.push({ at: f.createdAt, t: `You uploaded ${title(f.report as string)}` })
    if (f.status === 'ok') ev.push({ at: f.updatedAt, t: `${guide} approved ${title(f.report as string)}` })
    if (f.status === 'fix') ev.push({ at: f.updatedAt, t: `${guide} asked for changes on ${title(f.report as string)}` })
  }
  ev.sort((a, b) => (a.at < b.at ? 1 : -1))

  const d = {
    token,
    test: !!lead.test,
    practice: lead.practice || 'Your practice',
    name: lead.name || '',
    guide: { name: guide, ...(GUIDES[guide] || { role: 'New Partnerships' }) },
    stageIx: Math.max(0, STAGES.findIndex((s) => s.key === lead.stage)),
    note: lead.stageNote || '',
    sent: !!lead.finSentAt,
    feed: ev.slice(0, 6).map((e) => ({ w: when(e.at), t: e.t })),
    reports: REPORTS.map((r) => {
      const mine = files.filter((f) => f.report === r.key), last = mine[0]
      return { key: r.key, status: last ? (last.status as string) : 'todo', feedback: last?.status === 'fix' ? last.feedback || '' : '', file: last?.filename || '' }
    }),
  }
  return <PortalView d={d} />
}
