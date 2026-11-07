'use client'
/* Generated from design/boards/Dept.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { DeptEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DeptView(props: any) {
  const v = useDC(DeptEngine, props)
  return (
    <div className="pg-dept">

<Nav></Nav>

{/* ============ HERO ============ */}
<section className="dh">
<div className="wrap dh_grid">
<div>
<h1 className="dh_t">{v.d.h1a}{v.d.h1b ? (<><br />{v.d.h1b}<br />{v.d.h1c}</>) : null}</h1>
<p className="dh_sub mono">{v.d.line}</p>
<div className="dh_ctas">{v.hasGrid ? (<><a className="btn" href="#work">See the work</a></>) : null}<a className="btn" href="#team">Meet the team</a></div>
</div>
<div className="dh_side">
<div className="dh_faces">{(v.team || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><span className="face">{p.img ? (<><img className="ph_img" src={p.img} alt="" loading="lazy" /></>) : null}{p.iOnly}</span></React.Fragment>))}</div>
<div className="dh_stats">{(v.d.stats || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><div className="dh_stat"><b>{s.n}</b><span className="mono">{s.l}</span></div></React.Fragment>))}</div>
</div>
</div>
</section>

{/* ============ RECURRING MODULE: ALPHA TIMELINE ============ */}
<section className="tlx dark" ref={v.setTl}>
<div className="wrap">
<div className="tlx_head">
<div><p className="eyebrow" style={{"color": "#9B978E"} as React.CSSProperties}>The network</p><h2 className="display h2">When you&#39;ll work<br />with {v.d.name}</h2></div>
<p className="lede" style={{"margin": "0"} as React.CSSProperties}>From the week you close, for as long as you&#39;re a partner. Here&#39;s where {v.d.name} sits alongside every other team. Tap any team to see its part.</p>
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
<div className="tl_phases">
{(v.phases || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><div className={p.cls}><b className="mono">{p.k}</b><p>{p.t}</p></div></React.Fragment>))}
</div>
<div className="tl_foot mono"><span>Showing <b>{v.focusName}</b></span>{v.notHome ? (<><button onClick={v.resetFocus}>Back to {v.d.name}</button><a href={v.focusHref}>Visit {v.focusName} →</a></>) : null}</div>
</div>
</section>

{/* ============ WHAT COMES OFF YOUR PLATE ============ */}{v.hasPlate ? (<>
<section className="sec">
<div className="wrap">
<h2 className="display h2" style={{"marginBottom": "clamp(28px, 3vw, 44px)"} as React.CSSProperties}>What comes off<br />your plate</h2>
<div className="plate">
<div className="plate_h mono"><span>You stop</span><span>You get</span></div>
{(v.d.plate || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><div className="plate_r"><s>{p.stop}</s><b>{p.get}</b></div></React.Fragment>))}
</div>
</div>
</section>

</>) : null}
{/* ============ WHAT WE RUN ============ */}{v.hasScope ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<div className="split_head"><div><p className="eyebrow">What {v.d.name} runs</p><h2 className="h3">Everything customer-facing. You keep the final say.</h2></div><p className="body" style={{"margin": "0", "maxWidth": "24rem"} as React.CSSProperties}>Every line below has an owner. We run it, you approve what goes out under your name.</p></div>
<div className="scope">
<div className="scope_h mono"><span>Area</span><span>What that means</span><span>We run</span><span>You approve</span></div>
{(v.d.scope || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><div className="scope_r"><b>{s.a}</b><span>{s.d}</span><i className="dot on" aria-label="Alpha runs"></i><i className={s.you} aria-label={s.youLabel}></i></div></React.Fragment>))}
</div>
</div>
</section>

</>) : null}
{/* ============ FIRST 90 DAYS ============ */}{v.hasNinety ? (<>
<section className="ninety">
<div className="wrap">
<div className="split_head"><div><p className="eyebrow">After you close</p><h2 className="h3">Your first 90 days with {v.d.name}.</h2></div></div>
<ol className="steps">
{(v.d.ninety || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><li><span className="mono step_d">{s.d}</span><b>{s.t}</b><p>{s.x}</p></li></React.Fragment>))}
</ol>
</div>
</section>

</>) : null}
{/* ============ EVERY BRAND, WHERE IT STANDS ============ */}{v.hasGrid ? (<>
<section id="work" className="sec">
<div className="wrap">
<div className="split_head"><h2 className="display h2">Every brand,<br />where it stands</h2><p className="body" style={{"margin": "0", "maxWidth": "24rem"} as React.CSSProperties}>Some brands needed a new identity and site. Some were right already. Pick any partner to see what changed.</p></div>
<div className="wb">
<div>
<div className="wb_view" style={{"background": `${v.sel.tone}`} as React.CSSProperties}>
{v.sel.hasImg ? (<><img src={v.sel.img} alt={v.sel.name} /></>) : null}
{v.sel.noImg ? (<><span className="ph">{v.sel.phLabel}</span></>) : null}
</div>
<div className="wb_cap"><span className="mono"><b>PTR {v.sel.n}</b> · {v.sel.name} · {v.sel.statusLong}</span><span className="wb_ba"><button className={v.beforeCls} onClick={v.showBefore}>Before</button><button className={v.afterCls} onClick={v.showAfter}>After</button></span></div>
<p className="wb_q">“[A line from {v.sel.name}&#39;s founder on the work, verbatim.]”</p>
</div>
<div>
<div className="cells">{(v.cells || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}><button className={c.cls} onClick={c.go} aria-label={c.aria}><span>PTR {c.n}</span><em>{c.tag}</em></button></React.Fragment>))}</div>
<div className="legend2 mono"><span><i className="lg relaunched"></i>Relaunched</span><span><i className="lg prod"></i>In production</span><span><i className="lg kept"></i>Brand kept</span></div>
</div>
</div>
</div>
</section>

</>) : null}
{/* ============ THE TEAM ============ */}
<section id="team" style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<h2 className="display h2" style={{"marginBottom": "clamp(24px, 2.4vw, 36px)"} as React.CSSProperties}>The team</h2>
<div className="team4">
{(v.team || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><a className="tm" href={p.href} style={{"textDecoration": "none"} as React.CSSProperties}><div className="tm_img">{p.img ? (<><img className="ph_img" src={p.img} alt="" loading="lazy" /></>) : null}{p.iOnly}</div><b>{p.name}</b><span className="mono">{p.role}</span>{p.ask ? (<><span className="tm_ask">Ask about: {p.ask}</span></>) : null}</a></React.Fragment>))}
</div>
</div>
</section>

{/* ============ FAQ ============ */}{v.hasFaq ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap faq_grid">
<div><p className="eyebrow">Questions owners ask</p><h2 className="h3">Before you hand over the keys.</h2></div>
<div className="faq">
{(v.faq || []).map((q: any, q_i: number) => (<React.Fragment key={q_i}><div className={q.cls}><button onClick={q.go} aria-expanded={q.exp}><span>{q.q}</span><i aria-hidden="true">+</i></button>{q.open ? (<><p>{q.a}</p></>) : null}</div></React.Fragment>))}
</div>
</div>
</section>

</>) : null}
{/* ============ OTHER TEAMS ============ */}
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<hr className="rule" style={{"marginBottom": "clamp(28px, 3vw, 44px)"} as React.CSSProperties} />
<p className="eyebrow">The rest of the Alpha team</p>
<div className="others">{(v.others || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><a className="other" href={o.href}><span className="mono other_n">{o.k}</span><b>{o.name}</b><span>{o.line}</span><span className="mono other_go">Meet {o.name} →</span></a></React.Fragment>))}</div>
</div>
</section>

{/* ============ QUALIFIER (shared with home) ============ */}
<section id="qualify" className="qual dark">
<div className="wrap qual_grid">
<div>
<h2 className="display h2">Is your practice<br />qualified?</h2>
<p className="lede">Five questions about your practice. If it&#39;s a fit, we set up a real conversation, with people who have already made this decision.</p>
<p className="ph" style={{"color": "#9B978E", "marginTop": "28px"} as React.CSSProperties}>Routes to GHL / alphacrm.io<br />Thresholds below are placeholders</p>
</div>
<div className="form">
{v.notDone ? (<>
<div className="form_top"><span>{v.qLabel}</span><span>{v.qCount}</span></div>
<div className="form_prog">{(v.qBars || []).map((b: any, b_i: number) => (<React.Fragment key={b_i}><i className={b.cls}></i></React.Fragment>))}</div>
{v.isChoice ? (<>
<h3 className="form_q">{v.q.title}</h3>
<p className="form_hint">{v.q.hint}</p>
<div className="opts" role="radiogroup" aria-label={v.q.title}>
{(v.q.opts || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><button className={o.cls} role="radio" aria-checked={o.on} onClick={o.pick}><span>{o.label}</span><span className="opt_dot"></span></button></React.Fragment>))}
</div>
</>) : null}
{v.isContact ? (<>
<h3 className="form_q">Where should we reach you?</h3>
<p className="form_hint">{v.contactHint}</p>
<div className="fields">
<div className="field"><label htmlFor="f-name">Name</label><input id="f-name" type="text" autoComplete="name" /></div>
<div className="field"><label htmlFor="f-practice">Practice</label><input id="f-practice" type="text" autoComplete="organization" /></div>
<div className="field"><label htmlFor="f-email">Email</label><input id="f-email" type="email" autoComplete="email" /></div>
<div className="field"><label htmlFor="f-phone">Phone</label><input id="f-phone" type="tel" autoComplete="tel" /></div>
</div>
</>) : null}
<div className="form_nav">
<button className="ulink" style={{"background": "none", "borderTop": "0", "borderLeft": "0", "borderRight": "0", "cursor": "pointer", "visibility": `${v.backVis}`} as React.CSSProperties} onClick={v.qBack}>Back</button>
<button className="btn btn-fill" onClick={v.qNext} disabled={v.nextDisabled} style={{"opacity": `${v.nextOpacity}`} as React.CSSProperties}>{v.nextLabel}</button>
</div>
</>) : null}
{v.isDone ? (<>
<div style={{"margin": "auto 0"} as React.CSSProperties}>
<p className="eyebrow" style={{"color": "#C9A26B"} as React.CSSProperties}>Received</p>
<h3 className="form_q" style={{"fontSize": "40px"} as React.CSSProperties}>Thanks. We&#39;ll be in touch.</h3>
<p className="form_hint" style={{"maxWidth": "440px"} as React.CSSProperties}>New Partnerships will reach out. Until then, the partner pages are the best preview of what comes next.</p>
<button className="ulink" style={{"background": "none", "borderTop": "0", "borderLeft": "0", "borderRight": "0", "cursor": "pointer"} as React.CSSProperties} onClick={v.qReset}>Start over</button>
</div>
</>) : null}
</div>
</div>
</section>



    </div>
  )
}
