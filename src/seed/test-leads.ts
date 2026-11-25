/**
 * Test leads for building and demoing the partner portal. Made-up practices and people, flagged `test`,
 * so they are never synced to Smartsheet, Dropbox or notifications.
 * Runs in prebuild: creates any that are missing (matched by portal link). Set TEST_LEADS=clear in Vercel and redeploy to remove them; TEST_LEADS=off skips.
 * Portal links are predictable on purpose (test data only): /portal/test-<slug>-portal-link
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'

type F = [report: 'pl' | 'prov' | 'svc' | 'payroll' | 'dist' | 'bs', file: string, status: 'review' | 'ok' | 'fix', feedback?: string]
type T = { practice: string; name: string; stage: 'intro' | 'nda' | 'financials' | 'proforma' | 'valuation' | 'offer' | 'diligence' | 'close'; note?: string; files?: F[]; answers?: Record<string, string> }

const LEADS: T[] = [
  { practice: 'Harbor Skin Co.', name: 'Jordan Ellis', stage: 'intro', answers: { locations: '2', revenue: '$2M to $5M', timing: 'Next 6 months' } },
  { practice: 'Juniper Aesthetics', name: 'Maya Chen', stage: 'financials', note: 'NDA is signed, thank you. Start with the P&L, it is usually the quickest.' },
  { practice: 'Saltbox Med Spa', name: 'Dana Ruiz', stage: 'financials', files: [
    ['pl', 'pl-annual.xlsx', 'fix', 'This one is annual. Can you export it monthly, January 2023 to today?'],
    ['prov', 'collections-by-provider.xlsx', 'review'],
    ['svc', 'collections-by-service.xlsx', 'ok'],
    ['dist', 'owner-distributions.xlsx', 'ok'],
  ] },
  { practice: 'Fernwood Medical Aesthetics', name: 'Priya Shah', stage: 'proforma', note: 'All six approved. Preston is building your pro forma now, and we will send a time for the call.', files: [
    ['pl', 'pl-monthly.xlsx', 'ok'], ['prov', 'collections-by-provider.xlsx', 'ok'], ['svc', 'collections-by-service.xlsx', 'ok'],
    ['payroll', 'payroll-by-month.xlsx', 'ok'], ['dist', 'owner-distributions.xlsx', 'ok'], ['bs', 'balance-sheet.xlsx', 'ok'],
  ] },
  { practice: 'Copperline Skin', name: 'Alex Moreno', stage: 'valuation' },
  { practice: 'Northpoint Aesthetics', name: 'Sam Patel', stage: 'diligence' },
  { practice: 'Tidewater Skin Studio', name: 'Casey Brooks', stage: 'offer' },
  { practice: 'Bayview Laser + Skin', name: 'Riley Park', stage: 'close' },
]

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export async function seedTestLeads(p: Payload, opts: { files: boolean }) {
  const mode = process.env.TEST_LEADS
  if (mode === 'off') return
  const existing = (await p.find({ collection: 'leads', where: { test: { equals: true } }, limit: 100, depth: 0, overrideAccess: true })).docs
  if (mode === 'clear') {
    for (const l of existing) {
      await p.delete({ collection: 'lead-files', where: { lead: { equals: l.id } }, overrideAccess: true })
      await p.delete({ collection: 'leads', id: l.id, overrideAccess: true })
    }
    p.logger.info(`test leads: removed ${existing.length}`)
    return
  }
  const have = new Set(existing.map((l) => l.portalToken))
  let made = 0
  for (const t of LEADS) {
    const s = slug(t.practice)
    if (have.has(`test-${s}-portal-link`)) continue
    made++
    const lead = await p.create({ collection: 'leads', overrideAccess: true, data: {
      kind: 'partner', test: true, status: 'new', practice: t.practice, name: t.name, email: `${s}@example.com`, phone: '(555) 010-0000',
      stage: t.stage, guide: 'Tyler', stageNote: t.note || '', portalToken: `test-${s}-portal-link`, answers: t.answers || {}, page: '/talk',
    } })
    if (!opts.files) continue
    for (const [report, file, status, feedback] of t.files || []) {
      const data = fs.readFileSync(path.resolve(process.cwd(), 'src/seed/test-leads', file))
      await p.create({ collection: 'lead-files', overrideAccess: true, data: { lead: lead.id, report, status, feedback: feedback || '' },
        file: { data, mimetype: XLSX, name: `test-${s}-${report}.xlsx`, size: data.length } })
    }
  }
  if (made) p.logger.info(`test leads: created ${made}`)
}
