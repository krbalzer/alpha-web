'use client'
import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { STAGES } from '@/lib/portal'
import './portal.css'

export type PortalReport = { key: string; t: string; sub: string; tip: string; pdf: boolean; status: 'todo' | 'review' | 'ok' | 'fix'; feedback: string; file: string; count: number }
export type PortalData = { token: string; practice: string; name: string; guide: string; test: boolean; stageIx: number; note: string; reports: PortalReport[] }

const LABEL = { todo: 'To do', review: 'In review', ok: 'Approved', fix: 'Needs changes' } as const

function Report({ r, token, onDone }: { r: PortalReport; token: string; onDone: () => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [tip, setTip] = useState(false)
  const send = async (f: File) => {
    setBusy(true); setErr('')
    const fd = new FormData(); fd.append('report', r.key); fd.append('file', f)
    try {
      const res = await fetch(`/portal/${token}/upload`, { method: 'POST', body: fd })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j.ok) setErr(j.error || 'That upload did not go through. Try again.')
      else onDone()
    } catch { setErr('That upload did not go through. Try again.') }
    setBusy(false)
    if (input.current) input.current.value = ''
  }
  const canSend = r.status === 'todo' || r.status === 'fix'
  return (
    <li className={'pt_rep is-' + r.status}>
      <div className="pt_rep_main">
        <b>{r.t}</b>
        <span className="pt_sub">{r.sub}</span>
        {r.file ? <span className="pt_file">{r.file}{r.count > 1 ? ` (version ${r.count})` : ''}</span> : null}
        {r.status === 'fix' && r.feedback ? <p className="pt_fb"><span>{'From ' + 'your guide'}</span>{r.feedback}</p> : null}
        {r.tip ? <button type="button" className="pt_tipb" onClick={() => setTip(!tip)}>{tip ? 'Hide' : "Don't know how to pull this?"}</button> : null}
        {tip ? <p className="pt_tip">{r.tip}</p> : null}
        {err ? <p className="pt_err" role="alert">{err}</p> : null}
      </div>
      <div className="pt_rep_side">
        <span className={'pt_pill is-' + r.status}>{LABEL[r.status]}</span>
        {canSend ? (
          <label className={'pt_up' + (busy ? ' is-busy' : '')}>
            {busy ? 'Uploading' : r.status === 'fix' ? 'Upload new version' : 'Upload'}
            <input ref={input} type="file" accept={r.pdf ? '.xlsx,.xls,.csv,.pdf' : '.xlsx,.xls,.csv'} disabled={busy} onChange={(e) => e.target.files?.[0] && send(e.target.files[0])} />
          </label>
        ) : null}
      </div>
    </li>
  )
}

export default function PortalView({ d }: { d: PortalData }) {
  const router = useRouter()
  const cur = STAGES[d.stageIx]
  const done = d.reports.filter((r) => r.status === 'ok').length
  const sent = d.reports.filter((r) => r.status !== 'todo').length
  const fix = d.reports.filter((r) => r.status === 'fix').length
  const pct = d.stageIx / (STAGES.length - 1)
  return (
    <div className="pg-portal">
      <header className="pt_top"><div className="pt_wrap"><a href="/" className="pt_brand">Alpha Aesthetics Partners</a><span className="pt_conf">Partner portal / Confidential</span></div></header>
      {d.test ? <div className="pt_test">Test lead. Made-up data, never synced.</div> : null}
      <main className="pt_wrap">
        <section className="pt_hello">
          <p className="pt_k">{d.practice}</p>
          <h1>{d.name ? `Welcome back, ${d.name}.` : 'Welcome back.'}</h1>
        </section>

        <section className="pt_track" aria-label="Path to partnership">
          <div className="pt_line"><i style={{ width: `${pct * 100}%` }}></i></div>
          <ol>
            {STAGES.map((s, i) => (
              <li key={s.key} className={i < d.stageIx ? 'is-done' : i === d.stageIx ? 'is-cur' : ''} style={{ left: `${(i / (STAGES.length - 1)) * 100}%` }} aria-current={i === d.stageIx ? 'step' : undefined}>
                <span className={'pt_dot' + (i === STAGES.length - 1 ? ' is-star' : '')}></span>
                <span className="pt_sl">{s.t}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="pt_grid">
          <div className="pt_now">
            <p className="pt_k">Step {d.stageIx + 1} of {STAGES.length}</p>
            <h2>{cur.t}</h2>
            <p>{cur.d}</p>
            {d.note ? <blockquote className="pt_note"><span>{d.guide}</span>{d.note}</blockquote> : null}
          </div>
          <aside className="pt_guide">
            <p className="pt_k">Your guide</p>
            <b>{d.guide}, New Partnerships</b>
            <p>Questions about any step go straight to {d.guide}.</p>
          </aside>
        </section>

        {cur.key === 'nda' ? (
          <section className="pt_check">
            <div className="pt_check_h">
              <div><p className="pt_k">Your numbers</p><h2>Six reports, January 2023 to today</h2></div>
              <div className="pt_counts"><span><b>{sent}</b> of {d.reports.length} sent</span><span><b>{done}</b> approved</span>{fix ? <span className="is-fix"><b>{fix}</b> need changes</span> : null}</div>
            </div>
            <ol className="pt_reps">{d.reports.map((r) => <Report key={r.key} r={r} token={d.token} onDone={() => router.refresh()} />)}</ol>
            <p className="pt_small">Excel, please. PDF is fine where noted. Files go to a private folder only you and our New Partnerships team can open, and a person reviews each one. It&#39;s normal for one or two to take a second pass.</p>
          </section>
        ) : null}
      </main>
      <footer className="pt_foot"><div className="pt_wrap">Shared under NDA between {d.practice} and Alpha Aesthetics Partners.</div></footer>
    </div>
  )
}
