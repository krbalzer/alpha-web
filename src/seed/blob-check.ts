/**
 * Prebuild sanity check for Vercel Blob. Logs which store the build's token points at (store ids are public,
 * they appear in every media URL) and whether that token can actually write. Never prints the token itself.
 * Returns false when uploads would fail, so importers can skip instead of logging 100+ identical errors.
 */
export async function checkBlob(log: (m: string) => void): Promise<boolean> {
  const t = (process.env.BLOB_READ_WRITE_TOKEN || '').trim()
  if (!t) { log('blob: no BLOB_READ_WRITE_TOKEN in this build'); return false }
  const store = (t.split('_')[3] || '?').toLowerCase()
  const raw = process.env.BLOB_READ_WRITE_TOKEN || ''
  const shape = `len ${raw.length}${raw !== t ? ', has whitespace' : ''}${/^["']|["']$/.test(t) ? ', has quotes' : ''}`
  const env = (process.env.BLOB_STORE_ID || '').replace(/^store_/, '').toLowerCase()
  log(`blob: token store ${store} (${shape})${env ? `, BLOB_STORE_ID ${env}${env === store ? ' (match)' : ' (MISMATCH)'}` : ''}`)
  try {
    const r = await fetch('https://vercel.com/api/blob/?pathname=build-probe.txt', {
      method: 'PUT', body: 'ok',
      headers: { authorization: `Bearer ${t}`, 'x-api-version': '12', 'x-vercel-blob-access': 'public', 'x-add-random-suffix': '0', 'x-allow-overwrite': '1' },
    })
    const body = await r.text()
    log(`blob: write probe ${r.status}${r.ok ? ' ok' : ` ${body.slice(0, 160)}`}`)
    return r.ok
  } catch (e) { log(`blob: probe failed (${(e as Error).message})`); return false }
}
