'use client'
/* Generated from design/boards/PortalAdmin.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { PortalAdminEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortalAdminView(props: any) {
  const v = useDC(PortalAdminEngine, props)
  return (
    <div className="pg-portaladmin">
<div className="ad">

{/* ============ ADMIN NAV ============ */}
<header className="anav"><div className="anav_in">
<div className="anav_l"><img src="/brand/alpha-ink.svg" alt="Alpha" /><span>New Partnerships</span></div>
<nav className="anav_m" aria-label="Admin">{(v.navItems || []).map((n: any, n_i: number) => (<React.Fragment key={n_i}><button className={n.cls} onClick={n.go}>{n.label}{n.badge ? (<><em>{n.badge}</em></>) : null}</button></React.Fragment>))}</nav>
<div className="anav_r"><span className="av">{v.me.ini}</span><span><b>{v.me.name}</b><em><a href="/admin/collections/leads" style={{"color": "inherit"} as React.CSSProperties}>Open the CMS</a></em></span></div>
</div></header>

{/* ============ PIPELINE ============ */}
{v.vPipe ? (<>
<section className="a_sum"><div className="anav_in a_sum_in">
{(v.sums || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><button className={s.cls} onClick={s.go}><b>{s.n}</b><span>{s.l}</span></button></React.Fragment>))}
<div className="a_filt"><span className="k">Owner</span>{(v.owners || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><button className={o.cls} onClick={o.go}>{o.l}</button></React.Fragment>))}</div>
</div></section>
<section className="pipe"><div className="anav_in pipe_in">
{(v.cols || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}>
<div className="col">
<div className="col_h"><span className="col_n">{c.n}</span><b>{c.t}</b><em>{c.count}</em></div>
<div className="col_b">
{(c.cards || []).map((d: any, d_i: number) => (<React.Fragment key={d_i}>
<button className={d.cls} onClick={d.go}>
<span className="cd_top"><b>{d.name}</b><i className="av sm">{d.owner}</i></span>
<span className="cd_city">{d.sub}</span>
<span className="pbar"><i style={{"width": `${d.pct}`} as React.CSSProperties}></i></span>
<span className="cd_meta"><span>{d.prog}</span><span>{d.days}</span></span>
{d.flag ? (<><span className={d.flagCls}>{d.flag}</span></>) : null}
</button>
</React.Fragment>))}
</div>
</div>
</React.Fragment>))}
</div></section>
</>) : null}

{/* ============ REVIEW QUEUE ============ */}
{v.vQueue ? (<>
<section className="a_head"><div className="anav_in"><h1 className="display a_t">Review queue</h1><p className="a_sub">{v.queueSub}</p></div></section>
<section><div className="anav_in">
<div className="q_h"><span>Lead</span><span>Stage</span><span>Item</span><span>Received</span><span>File</span><span></span></div>
{(v.queue || []).map((q: any, q_i: number) => (<React.Fragment key={q_i}>
<div className={q.cls}>
<span className="q_lead"><button className="q_go" onClick={q.goLead}><b>{q.lead}</b></button><em>{q.owner}</em></span>
<span className="q_st">{q.stage}</span>
<span className="q_item"><b>{q.item}</b>{q.href ? (<><a href={q.href} target="_blank" rel="noopener">Open file ↗</a></>) : null}</span>
<span className="q_when">{q.when}</span>
<span className={q.aiCls}>{q.ai}</span>
<span className="q_act">{q.open ? (<><button className="btn btn-ink" onClick={q.ok}>{q.okLabel}</button><button className="btn" onClick={q.fix}>Request changes</button></>) : null}{q.done ? (<><em className="q_done">{q.doneLabel}</em></>) : null}</span>{q.editing ? (<><div className="fx"><label className="k" htmlFor={q.fxId}>Sent to {q.first} in their portal</label><textarea id={q.fxId} placeholder="What needs to change?"></textarea><div className="fx_b"><button className="btn btn-ink" onClick={q.send}>Request changes</button><button className="btn" onClick={q.cancel}>Cancel</button></div></div></>) : null}
</div>
</React.Fragment>))}
</div></section>
</>) : null}

{/* ============ LEAD DETAIL ============ */}
{v.vLead ? (<>
<section className="a_head"><div className="anav_in ld_head">
<div><button className="ld_back" onClick={v.goPipe}>← Pipeline</button><h1 className="display a_t">{v.ld.practice}</h1><p className="a_sub">{v.ld.sub}</p></div>
<div className="ld_links"><a className="btn" href={v.ld.portal} target="_blank" rel="noopener">View as lead ↗</a><a className="btn" href={v.ld.edit}>Edit lead</a></div>
</div></section>
<section className="ld_trk"><div className="anav_in">
<div className="trk light"><span className="trk_fill" style={{"width": `${v.fillW}`} as React.CSSProperties}></span>{(v.stages || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><div className={s.cls} style={{"left": `${s.x}`} as React.CSSProperties}><i></i><span className="trk_n">{s.n}</span><span className="trk_l">{s.t}</span></div></React.Fragment>))}</div>
</div></section>
<section><div className="anav_in ld_grid">
<div>
<div className="ld_gate">
<div><p className="k">Stage {v.curNum} / {v.curName}</p><p className="ld_gate_t">{v.gateT}</p><p className="ld_gate_s">{v.gateS}</p></div>
{v.canAdvance ? (<><button className="btn btn-ink ld_adv" onClick={v.advance}>Approve stage {v.curNum} and unlock {v.nextNum}</button></>) : null}
{v.approveAllShow ? (<><button className="btn btn-ink ld_adv" onClick={v.approveAll}>Approve all {v.nRevTxt} in review</button></>) : null}{v.cantAdvance ? (<><button className="btn ld_adv is-off" disabled>Approve stage {v.curNum}</button></>) : null}
</div>
{(v.groups || []).map((g: any, g_i: number) => (<React.Fragment key={g_i}>
<div className="cl_g">
<p className="cl_gh"><span>{g.t}</span><em>{g.c}</em></p>
{(g.items || []).map((it: any, it_i: number) => (<React.Fragment key={it_i}>
<div className={it.cls}>
<span className={it.dot}></span>
<div className="cl_t"><b>{it.t}</b><span>{it.sub}</span>{it.ai ? (<><p className={it.aiCls}><em>First pass</em>{it.ai}</p></>) : null}{it.note ? (<><p className="cl_note"><em>Sent to lead</em>{it.note}</p></>) : null}{it.href ? (<><a className="cl_file" href={it.href} target="_blank" rel="noopener">{it.file} ↗</a></>) : null}{it.editing ? (<><div className="fx"><label className="k" htmlFor={it.fxId}>Sent to {it.first} in their portal</label><textarea id={it.fxId} placeholder="What needs to change?"></textarea><div className="fx_b"><button className="btn btn-ink" onClick={it.send}>Request changes</button><button className="btn" onClick={it.cancel}>Cancel</button></div></div></>) : null}</div>
<span className="cl_s">{it.label}</span>
<span className="cl_acts">{it.canReview ? (<><button className="btn btn-ink cl_b" onClick={it.ok}>Approve</button><button className="btn cl_b" onClick={it.fix}>Changes</button></>) : null}</span>
</div>
</React.Fragment>))}
</div>
</React.Fragment>))}
{(v.panels || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}>
<div className="apan">
<div className="apan_h"><b>{p.t}</b><span className="k">{p.k}</span></div>
{(p.rows || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}>
<div className={r.cls}>
<div><b>{r.t}</b><span className="ar_d">{r.d}</span>{r.bar ? (<><span className="dl_bar"><i style={{"width": `${r.pct}`} as React.CSSProperties}></i></span></>) : null}</div>
<span className="ar_s">{r.s}</span>
<span className="ar_a">{r.vote ? (<><button className={r.upCls} onClick={r.up} aria-label="Thumbs up">👍</button><button className={r.dnCls} onClick={r.dn} aria-label="Thumbs down">👎</button></>) : null}{r.act ? (<><button className="btn cl_b" onClick={r.go}>{r.act}</button></>) : null}</span>
</div>
</React.Fragment>))}
</div>
</React.Fragment>))}
</div>
<aside className="ld_side">
<div className="ld_act">
<p className="k">Activity</p>
<ul>{(v.feed || []).map((f: any, f_i: number) => (<React.Fragment key={f_i}><li><span>{f.w}</span>{f.t}</li></React.Fragment>))}</ul>
</div>
</aside>
</div></section>
</>) : null}

</div>
    </div>
  )
}
