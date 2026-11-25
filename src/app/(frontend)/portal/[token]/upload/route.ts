import { db } from '@/lib/data'
import { EXCEL, MAX_UPLOAD, REPORTS } from '@/lib/portal'

const MIME: Record<string, string> = {
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.xls': 'application/vnd.ms-excel', '.csv': 'text/csv', '.pdf': 'application/pdf',
}

/** Portal upload: one report file per request, tied to the lead the token belongs to. */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[A-Za-z0-9_-]{24,64}$/.test(token)) return Response.json({ ok: false }, { status: 404 })
  let form: FormData
  try { form = await req.formData() } catch { return Response.json({ ok: false, error: 'Could not read the upload.' }, { status: 400 }) }
  const report = REPORTS.find((r) => r.key === form.get('report'))
  const file = form.get('file')
  if (!report || !(file instanceof File)) return Response.json({ ok: false, error: 'Pick a file for this report.' }, { status: 400 })
  const ext = (file.name.match(/\.[a-z0-9]+$/i)?.[0] || '').toLowerCase()
  const allowed = report.pdf ? [...EXCEL, '.pdf'] : EXCEL
  if (!allowed.includes(ext)) return Response.json({ ok: false, error: report.pdf ? 'Excel or PDF, please.' : 'Excel, please (.xlsx, .xls or .csv).' }, { status: 400 })
  if (file.size > MAX_UPLOAD) return Response.json({ ok: false, error: 'That file is over 4 MB. Send a smaller export, or ask your guide for another way.' }, { status: 400 })

  const p = await db()
  const lead = (await p.find({ collection: 'leads', where: { portalToken: { equals: token } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!lead || lead.kind !== 'partner') return Response.json({ ok: false }, { status: 404 })
  const safe = `${(lead.practice || 'lead').replace(/[^a-z0-9]+/gi, '-').slice(0, 40)}-${report.key}-${Date.now()}${ext}`.toLowerCase()
  await p.create({
    collection: 'lead-files', overrideAccess: true,
    data: { lead: lead.id, report: report.key, status: 'review' },
    file: { data: Buffer.from(await file.arrayBuffer()), mimetype: MIME[ext], name: safe, size: file.size },
  })
  // Smartsheet, Dropbox and notifications hook in here once connected; test leads will skip them.
  return Response.json({ ok: true })
}
