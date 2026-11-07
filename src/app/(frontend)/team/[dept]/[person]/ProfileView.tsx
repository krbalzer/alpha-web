'use client'
/* Generated from design/boards/Profile.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { ProfileEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileView(props: any) {
  const v = useDC(ProfileEngine, props)
  return (
    <div className="pg-profile">

<Nav></Nav>

{/* ============ HERO: a slider through the department ============ */}
<section className="ph_hero" style={{"minHeight": `${v.heroH}`} as React.CSSProperties} tabIndex={0} onKeyDown={v.heroKey} aria-roledescription="carousel" aria-label={`${v.deptName} team`}>
<div className="wrap ph_bar">
<a className="mono ph_dept" href={v.deptHref}>{v.deptName} <span>{v.count}</span></a>
<div className="ph_roster">{(v.roster || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><button className={r.cls} onClick={r.go} aria-label={r.name} aria-current={r.cur}>{r.init}</button></React.Fragment>))}</div>
</div>
<div className="wrap ph_grid">
<div className={v.figCls} style={{"--dx": `${v.dx}px`} as React.CSSProperties}>
<div className="ph_cut" style={{"background": `${v.p.tone}`} as React.CSSProperties}>{v.p.img ? (<><img className="ph_img" src={v.p.img} alt="" loading="lazy" /></>) : null}{v.p.noImg ? (<><span className="ph_init">{v.p.init}</span></>) : null}</div>
<i className="ph_shadow" aria-hidden="true"></i>
</div>
<div className={v.txtCls} style={{"--dx": `${v.dx}px`} as React.CSSProperties}>
<span className="pill ink">{v.deptName}</span>
<h1 className="ph_name">{v.p.first} {v.p.last}</h1>
<p className="ph_title mono">{v.p.title}</p>
{v.p.line ? (<><p className="ph_line mono">{v.p.line}</p></>) : null}
<div className="ph_stats">{(v.p.stats || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><div className="ph_stat"><b>{s.n}</b><span className="mono">{s.l}</span></div></React.Fragment>))}</div>
<div className="ph_nav">
<button className="arw_d" onClick={v.prev} aria-label={`Previous: ${v.prevName}`}><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><path d="M11 5H1M5 1L1 5l4 4" stroke="currentColor" fill="none" strokeWidth="1.2"></path></svg></button>
<button className="btn ph_next" onClick={v.next}>{v.nextName} <span aria-hidden="true">→</span></button>
</div>
</div>
</div>
</section>

{/* ============ 01 / WHAT THEY OWN ============ */}
<section className="sec">
<div className="wrap pr_intro">
<p className="eyebrow">01 / What {v.p.first} owns</p>
<div>
{v.p.owns ? (<><h2 className="lead">{v.p.owns}</h2></>) : null}
<div className="body cols" dangerouslySetInnerHTML={{ __html: v.p.bioHtml }} />
{v.hasAttrs ? (<><div className="attrs"><span className="mono attrs_k">How partners describe {v.p.first}</span>{(v.attrs || []).map((a: any, a_i: number) => (<React.Fragment key={a_i}><button className={a.cls} onClick={a.go}>{a.t}</button></React.Fragment>))}</div>
<p className="attr_d">{v.attrLine}</p></>) : null}
</div>
</div>
</section>

{/* ============ 02 / TRACK RECORD ============ */}{v.hasRecord ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<p className="eyebrow">02 / Track record</p>
<div className="rec2">
<div>
<h3 className="rec_h">Before Alpha</h3>
<div className="ledger">{(v.p.before || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><div className="led2"><span className="mono">{r.y}</span><b>{r.role}</b><span>{r.org}</span></div></React.Fragment>))}</div>
</div>
{v.hasWork ? (<><div>
<h3 className="rec_h">At Alpha <span className="mono">{v.p.partnerCount} of 15 partners</span></h3>
<div className="pw">{(v.p.work || []).map((w: any, w_i: number) => (<React.Fragment key={w_i}><a className="pw_c" href="/locations#brands"><span className="mono">PTR {w.n}</span><b>{w.name}</b><span className="pw_did mono">{w.did}</span></a></React.Fragment>))}</div>
</div></>) : null}
</div>
</div>
</section>

</>) : null}
{/* ============ 03 / WHEN YOU'LL WORK WITH THEM (recurring module) ============ */}
<section className="tlx dark" ref={v.setTl}>
<div className="wrap">
<div className="tlx_head">
<div><p className="eyebrow">03 / The network</p><h2 className="display h2">When you&#39;ll work<br />with {v.p.first}</h2></div>
<p className="lede" style={{"margin": "0"} as React.CSSProperties}>{v.p.first} sits on the {v.deptName} team. Here&#39;s where that team shows up, from your first call to month after month.</p>
</div>
<div className={v.tlCls}>
<div className="tl_rows" style={{"height": `${v.tlH}px`} as React.CSSProperties}>
{(v.marks || []).map((m: any, m_i: number) => (<React.Fragment key={m_i}><i className="tl_guide" style={{"left": `${m.x}%`} as React.CSSProperties}></i></React.Fragment>))}
{(v.bars || []).map((b: any, b_i: number) => (<React.Fragment key={b_i}>
<button className={b.cls} style={{"left": `${b.l}%`, "width": `${b.w}%`, "top": `${b.top}px`, "transitionDelay": `${b.delay}ms`} as React.CSSProperties} onClick={b.go} aria-pressed={b.on}><span className="tl_faces">{(b.faces || []).map((f: any, f_i: number) => (<React.Fragment key={f_i}><i>{f}</i></React.Fragment>))}</span><span className="tl_name mono">{b.name}</span></button>
</React.Fragment>))}
</div>
<div className="tl_axis">{(v.marks || []).map((m: any, m_i: number) => (<React.Fragment key={m_i}><span className="mono" style={{"left": `${m.x}%`} as React.CSSProperties}>{m.t}</span></React.Fragment>))}</div>
</div>
<div className="tl_phases">{(v.phases || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><div className={p.cls}><b className="mono">{p.k}</b><p>{p.t}</p></div></React.Fragment>))}</div>
<div className="tl_foot mono"><span>Showing <b>{v.focusName}</b></span>{v.notHome ? (<><button onClick={v.resetFocus}>Back to {v.deptName}</button></>) : null}</div>
</div>
</section>

{/* ============ 04 / WHAT PEOPLE SAY ============ */}{v.hasQuotes ? (<>
<section className="sec">
<div className="wrap says">
<p className="eyebrow">04 / What people say about {v.p.first}</p>
<figure className="say">
<blockquote>“{v.q.q}”</blockquote>
<figcaption><span className="say_av">{v.q.init}</span><span><b>{v.q.who}</b><span className="mono">{v.q.role}</span></span></figcaption>
</figure>
<div className="say_nav mono"><button className="arw_d" onClick={v.qPrev} aria-label="Previous quote"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><path d="M11 5H1M5 1L1 5l4 4" stroke="currentColor" fill="none" strokeWidth="1.2"></path></svg></button><span>{v.qCount}</span><button className="arw_d" onClick={v.qNext} aria-label="Next quote"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><path d="M1 5h10M7 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.2"></path></svg></button></div>
</div>
</section>

</>) : null}
{/* ============ 05 / OFF THE CLOCK (yearbook card) ============ */}{v.hasYb ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<p className="eyebrow">05 / Off the clock</p>
<div className="yb">
<div className="yb_photo"><span className="ph">Yearbook photo</span><span className="yb_cap mono">{v.p.first}, class of {v.p.yb.year}</span></div>
<div className="yb_txt">
<blockquote className="yb_q">“{v.p.yb.quote}”</blockquote>
<span className="mono yb_k">Yearbook quote</span>
<dl className="yb_dl">
<div><dt className="mono">Hometown</dt><dd>{v.p.yb.home}</dd></div>
<div><dt className="mono">Coffee order</dt><dd>{v.p.yb.coffee}</dd></div>
<div><dt className="mono">Spirit animal</dt><dd>{v.p.yb.animal}</dd></div>
<div><dt className="mono">Off the clock</dt><dd>{v.p.yb.hobbies}</dd></div>
</dl>
</div>
</div>
</div>
</section>

</>) : null}
{/* ============ 06 / LISTEN (hidden when empty) ============ */}
{v.hasPods ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<p className="eyebrow">06 / Listen to {v.p.first}</p>
<div className="pods">{(v.p.pods || []).map((e: any, e_i: number) => (<React.Fragment key={e_i}><a className="pod" href="/podcasts"><span className="pod_art" style={{"background": `${e.tone}`} as React.CSSProperties}>{e.showShort}</span><span><b>{e.title}</b><span className="mono">{e.show} · {e.len}</span></span><span className="mono pod_go">Listen →</span></a></React.Fragment>))}</div>
</div>
</section>
</>) : null}

{/* ============ TALK ============ */}
<section id="talk" className="talk dark">
<div className="wrap talk_grid">
<h2 className="display h2">Want {v.p.first} on<br />your first call?</h2>
<div><p className="lede" style={{"margin": "0 0 22px"} as React.CSSProperties}>Tell us about your practice. We&#39;ll bring the people you&#39;d actually work with.</p><a className="btn" href="/talk">Let&#39;s talk</a></div>
</div>
</section>

{/* ============ MEET THE OTHERS ============ */}
<section className="sec">
<div className="wrap">
<div className="split_head"><h2 className="display h2">Meet the others</h2><div className="filters">{(v.filters || []).map((f: any, f_i: number) => (<React.Fragment key={f_i}><button className={f.cls} onClick={f.go}>{f.t}</button></React.Fragment>))}</div></div>
<div className="others2">{(v.others || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><a className="o2" href={o.href} style={{"textDecoration": "none"} as React.CSSProperties}><span className="o2_img">{o.img ? (<><img className="ph_img" src={o.img} alt="" loading="lazy" /></>) : null}{o.iOnly}</span><b>{o.name}</b><span className="mono">{o.title}</span><span className="mono o2_d">{o.dept}</span></a></React.Fragment>))}</div>
</div>
</section>



    </div>
  )
}
