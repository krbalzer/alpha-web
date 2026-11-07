'use client'
/* Generated from design/boards/Newswire.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { NewswireEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NewswireView(props: any) {
  const v = useDC(NewswireEngine, props)
  return (
    <div className="pg-newswire">

<Nav></Nav>
<section className="pg_h">
<div className="wrap pg_grid">
<div><p className="eyebrow">Newswire</p><h1 className="display">Every release,<br />on the record</h1></div>
<p className="lede">New partners, new locations and network news, in the order it happened.</p>
</div>
</section>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<a className="feat" href={v.top.href}><div className="feat_img" style={{"background": `${v.top.tone}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{v.top.img ? (<><img className="ph_img" src={v.top.img} alt="" fetchPriority="high" /></>) : null}</div><div className="feat_txt"><span className="k">Latest · {v.top.date} · {v.top.tag}</span><h2 className="feat_t">{v.top.t}</h2><p>{v.top.sum}</p><span className="feat_go">Read the release →</span></div></a>
<div className="nw_bar"><div className="chiprow">{(v.tabs || []).map((t: any, t_i: number) => (<React.Fragment key={t_i}><button className={t.cls} onClick={t.go}>{t.t}<span>{t.n}</span></button></React.Fragment>))}</div><label className="search"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="6" cy="6" r="4.6" stroke="currentColor" fill="none" strokeWidth="1.3"></circle><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3"></path></svg><input type="search" placeholder="Search releases" value={v.q} onInput={v.onQ} aria-label="Search releases" /></label></div>
{(v.years || []).map((y: any, y_i: number) => (<React.Fragment key={y_i}>
<div className="nw_y"><span className="nw_yy">{y.y}</span><div>{(y.items || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><a className="nw_r" href={r.href}><span className="mono">{r.d}</span><b>{r.t}</b><span className="nw_tag">{r.tag}</span><span className="nw_ptr">{r.ptr}</span></a></React.Fragment>))}</div></div>
</React.Fragment>))}
{v.empty ? (<><p className="body" style={{"padding": "40px 0"} as React.CSSProperties}>No releases match.</p></>) : null}
</div>
</section>



    </div>
  )
}
