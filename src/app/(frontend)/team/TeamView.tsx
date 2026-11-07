'use client'
/* Generated from design/boards/Team.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { TeamEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TeamView(props: any) {
  const v = useDC(TeamEngine, props)
  return (
    <div className="pg-team">

<Nav></Nav>
<section className="pg_h">
<div className="wrap pg_grid">
<div><p className="eyebrow">The Alpha team</p><h1 className="display">The people<br />behind the partners</h1></div>
<p className="lede">Seven departments that take everything off a founder&#39;s plate except the patients. Hover anyone to see what to ask them about.</p>
</div>
</section>
<div className="tm_bar"><div className="wrap"><div className="chiprow">{(v.tabs || []).map((t: any, t_i: number) => (<React.Fragment key={t_i}><button className={t.cls} onClick={t.go}>{t.t}<span>{t.n}</span></button></React.Fragment>))}</div><span className="k">{v.total} people</span></div></div>
{(v.secs || []).map((d: any, d_i: number) => (<React.Fragment key={d_i}>
<section className="tm_sec">
<div className="wrap">
<div className="tm_head"><h2>{d.t}</h2><p>{d.line}</p>{d.hasLink ? (<><a href={d.href}>Department page →</a></>) : null}</div>
<div className="tgrid">{(d.people || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><a className={p.cls} href={p.href}><span className="tp_i">{p.img ? (<><img className="ph_img" src={p.img} alt="" loading="lazy" /></>) : null}{p.iOnly}{p.ask ? (<><em>Ask about: {p.ask}</em></>) : null}</span><b>{p.n}</b><span>{p.t}</span></a></React.Fragment>))}</div>
</div>
</section>
</React.Fragment>))}
<div style={{"height": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}></div>



    </div>
  )
}
