'use client'
/* Generated from design/boards/Founder.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { FounderEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FounderView(props: any) {
  const v = useDC(FounderEngine, props)
  return (
    <div className="pg-founder">

<Nav><div className="crumb loc"><div className="wrap"><span>{v.b.ptr}</span><a href={v.b.href} style={{"textDecoration": "none"} as React.CSSProperties}>{v.b.name}</a><span>{v.f.name}</span><span></span><span>Partner since {v.b.since}</span></div></div></Nav>

{/* ============ HERO (from XD) ============ */}
<section className="fhero" style={{"minHeight": `${v.heroH}`} as React.CSSProperties} aria-label={v.f.name}>
<div className="fhero_img">{v.f.portrait ? (<><img className="fhero_pic" src={v.f.portrait} alt={v.f.name} /></>) : null}</div>
<div className="fhero_txt">
<div className="fhero_main">
<span className="pill ink">{v.b.ptr}</span>
<h1 className="fname">{v.f.first}<br />{v.f.last}</h1>
<p className="fcred">{v.f.cred}</p>
<p className="fmeta">{v.f.role}, {v.b.name}<br />{v.f.markets}</p>
<div className="marks" style={{"marginTop": "clamp(22px, 2.2vw, 34px)"} as React.CSSProperties}>
<span className="pair" role="group" aria-label={`Alpha partner ${v.b.name}`}><span className="amark" aria-hidden="true"></span><i aria-hidden="true"></i><span className={`bmark b-${v.b.n}`} aria-hidden="true"></span></span>
<span className="states" style={{"marginLeft": "10px"} as React.CSSProperties}>{(v.b.states || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><i className={`state s-${s}`} title={s}>{s}</i></React.Fragment>))}</span>
</div>
</div>
<div className="fhero_ctas">{v.b.book ? (<><a className="btn" href={v.b.book} target="_blank" rel="noopener">Book at&nbsp; {v.b.short}<span className="ext" aria-hidden="true">↗</span></a></>) : null}<a className="btn" href="/talk">Partner with Alpha</a></div>
</div>
</section>

{/* ============ 01 / STATEMENT + FIGURES ============ */}
<section className="sec">
<div className="wrap">
<div className="state_grid">
<p className="eyebrow">01 / Who {v.f.first} is</p>
<div>
{v.f.headline ? (<><h2 className="lead">{v.f.headline}</h2></>) : null}<div className="body cols" dangerouslySetInnerHTML={{ __html: v.f.bioHtml }} />
</div>
</div>
{v.hasFigs ? (<><div className="figs">
{(v.figs || []).map((x: any, x_i: number) => (<React.Fragment key={x_i}><div className="fig"><span className="fig_n">{x.n}</span><span className="fig_l">{x.l}</span></div></React.Fragment>))}
</div></>) : null}
</div>
</section>

{/* ============ 02 / THE PATH ============ */}{v.hasPath ? (<>
<section className="path dark" ref={v.setPath}>
<div className="wrap">
<div className="path_head"><p className="eyebrow" style={{"color": "#9B978E"} as React.CSSProperties}>02 / The path</p><h2 className="h3">The road to {v.b.ptr}.</h2><p className="path_hint mono">Drag or scroll →</p></div>
</div>
<div className={v.tlCls}>
<div className="tl_line" aria-hidden="true"></div>
<ol className="tl_list">
{(v.path || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}>
<li className={p.cls} style={{"transitionDelay": `${p.delay}ms`} as React.CSSProperties}><i aria-hidden="true"></i><span className="tl_y">{p.y}</span><b>{p.t}</b><span className="tl_d">{p.d}</span></li>
</React.Fragment>))}
</ol>
</div>
</section>

</>) : null}
{/* ============ 03 / HOW SHE PRACTICES ============ */}{v.hasRules ? (<>
<section className="sec">
<div className="wrap">
<p className="eyebrow">03 / How {v.f.first} practices</p>
<div className="rules">
{(v.rules || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><div className="rule3"><span className="rule_n">{r.n}</span><h3>{r.t}</h3><p>{r.d}</p></div></React.Fragment>))}
</div>
</div>
</section>

</>) : null}
{/* ============ 04 / ON THE RECORD ============ */}{v.hasRecord ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<div className="rec_head"><div><p className="eyebrow">04 / On the record</p><h2 className="h3">Credentials, stages and press.</h2></div></div>
<div className="ledger">
{(v.record || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><a className="led" href="#record"><span className="led_y">{r.y}</span><span className="led_k">{r.k}</span><b>{r.t}</b><span className="led_o">{r.o}</span></a></React.Fragment>))}
</div>
</div>
</section>

</>) : null}
{/* ============ 05 / WHY SHE PARTNERED ============ */}{v.hasQuotes ? (<>
<section className="why dark">
<div className="wrap">
<p className="eyebrow" style={{"color": "#9B978E"} as React.CSSProperties}>04 / In {v.f.first}&#39;s words</p>
<div className="why_grid">
{(v.quotes || []).map((q: any, q_i: number) => (<React.Fragment key={q_i}><figure className="why_q"><blockquote>“{q.text}”</blockquote><figcaption className="mono">{v.f.name} / {q.source}</figcaption></figure></React.Fragment>))}
</div>

</div>
</section>

</>) : null}
{/* ============ 06 / THE ROOM ============ */}
<section className="sec">
<div className="wrap">
<div className="room_head"><div><p className="eyebrow">05 / The room {v.f.first} is in</p><h2 className="h3">Fifteen founders, one group chat.</h2></div><p className="body" style={{"margin": "0", "maxWidth": "26rem"} as React.CSSProperties}>Partners don't just share a back office. They share playbooks, shadow days and their numbers. These are the people {v.f.first} calls.</p></div>
<div className="room">
{(v.peers || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}>
<a className="peer" href={p.href}><span className="peer_av">{p.hasImg ? (<><img src={p.img} alt={p.name} /></>) : null}{p.noImg ? (<>{p.init}</>) : null}</span><b>{p.name}</b><span>{p.cred}</span><span className="peer_b">{p.brand} · {p.city}</span></a>
</React.Fragment>))}
<a className="peer you" href="/talk"><span className="peer_av">You</span><b>Your name</b><span>Your credentials</span><span className="peer_b">PTR 017 · Your city</span><span className="you_cta">Take the seat →</span></a>
</div>
</div>
</section>

{/* ============ 07 / HER PRACTICE ============ */}
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<p className="eyebrow">06 / {v.f.first}&#39;s practice</p>
<div className="prac">
<a className="prac_brand" href={v.b.href}><span className="mono" style={{"fontSize": "10.5px"} as React.CSSProperties}>{v.b.ptr}</span><span className="prac_name">{v.b.name}</span><span className="mono" style={{"fontSize": "10.5px", "opacity": ".75"} as React.CSSProperties}>{v.f.markets}{v.b.est ? (<> · Est {v.b.est}</>) : null}</span><span className="prac_go mono">View brand →</span></a>
{(v.b.locations || []).map((l: any, l_i: number) => (<React.Fragment key={l_i}><a className="prac_loc" href={l.href}><span className="prac_img ph" style={{"background": `${l.tone}`} as React.CSSProperties}>{l.img ? (<><img src={l.img} alt="" loading="lazy" /></>) : null}{l.noImg ? (<>{l.city}</>) : null}</span><b>{l.label}</b><span>{l.a1}</span><span className="prac_go mono">View location →</span></a></React.Fragment>))}
</div>
</div>
</section>

{/* ============ CLOSER ============ */}


    </div>
  )
}
