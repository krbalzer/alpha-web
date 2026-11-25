import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { has } from '@/access'
import { db } from '@/lib/data'
import { REPORTS, STAGES } from '@/lib/portal'
import PortalAdminView from './PortalAdminView'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'New Partnerships', robots: { index: false, follow: false } }

const TZ = 'America/Los_Angeles'
const day = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ })
function when(iso: string) {
  const d = new Date(iso), now = new Date(), h = (now.getTime() - d.getTime()) / 36e5
  if (h < 1) return 'Just now'
  if (day(d) === day(now)) return `${Math.floor(h)}h ago`
  if (day(d) === day(new Date(now.getTime() - 864e5))) return 'Yesterday'
  return d.toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' })
}

/** New Partnerships admin (design/boards/PortalAdmin.dc.html): pipeline, review queue, lead detail. CMS login, partnerships role. */
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const p = await db()
  const { user } = await p.auth({ headers: await headers() })
  if (!user) redirect('/admin/login?redirect=%2Fpartnerships')
  if (!has(user, 'partnerships')) notFound()
  const sp = await searchParams

  const leads = (await p.find({ collection: 'leads', where: { kind: { equals: 'partner' } }, sort: '-updatedAt', limit: 500, depth: 0, overrideAccess: true })).docs
  const files = (await p.find({ collection: 'lead-files', sort: '-createdAt', limit: 2000, depth: 0, overrideAccess: true })).docs
  const title = (k: string) => REPORTS.find((r) => r.key === k)?.t || 'a file'

  const L = leads.map((l) => {
    const mine = files.filter((f) => f.lead === l.id)
    const lastTouch = [l.updatedAt, ...mine.map((f) => f.updatedAt)].sort().pop() as string
    const days = Math.floor((Date.now() - new Date(lastTouch).getTime()) / 864e5)
    const first = (l.name || '').split(' ')[0] || 'Lead'
    const ev: { at: string; t: string }[] = [{ at: l.createdAt, t: 'Lead created. Portal link issued' }]
    if (l.finSentAt) ev.push({ at: l.finSentAt, t: `${first} sent financials for review` })
    for (const f of mine) {
      ev.push({ at: f.createdAt, t: `${first} uploaded ${title(f.report as string)}` })
      if (f.status === 'ok') ev.push({ at: f.updatedAt, t: `Approved ${title(f.report as string)}` })
      if (f.status === 'fix') ev.push({ at: f.updatedAt, t: `Changes requested on ${title(f.report as string)}` })
    }
    ev.sort((a, b) => (a.at < b.at ? 1 : -1))
    return {
      id: l.id, practice: l.practice || l.name || l.email, name: l.name || '', email: l.email, phone: l.phone || '', guide: l.guide || '',
      stageIx: Math.max(0, STAGES.findIndex((s) => s.key === l.stage)), token: l.portalToken || '', test: !!l.test,
      days, daysL: days === 0 ? 'Active today' : `${days}d since last activity`,
      feed: ev.slice(0, 8).map((e) => ({ w: when(e.at), t: e.t })),
    }
  })
  const F = files.map((f) => ({
    id: f.id, lead: typeof f.lead === 'object' ? (f.lead as { id: number }).id : f.lead, report: f.report as string, status: f.status as string,
    feedback: f.feedback || '', filename: f.filename || '', url: f.url || '', when: when(f.createdAt),
  }))
  const lead = Number(sp.lead)
  const d = {
    me: { name: (user as { name?: string }).name || user.email },
    leads: L, files: F,
    start: { view: ['pipe', 'queue', 'lead'].includes(sp.view || '') ? sp.view : 'pipe', lead: L.some((x) => x.id === lead) ? lead : null },
  }
  return <PortalAdminView d={d} />
}
