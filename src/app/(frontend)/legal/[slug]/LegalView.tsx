'use client'
/* Generated from design/boards/Legal.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { LegalEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LegalView(props: any) {
  const v = useDC(LegalEngine, props)
  return (
    <div className="pg-legal">

<Nav></Nav>
<section className="pg_h">
<div className="wrap pg_grid"><div><p className="eyebrow">Legal</p><h1 className="display" style={{"fontSize": "clamp(40px, 4.4vw, 76px)"} as React.CSSProperties}>{v.doc.t}</h1></div><p className="lede">Last updated {v.updated}.</p></div>
</section>
<div className="wrap"><div className="lg_tabs">{(v.tabs || []).map((t: any, t_i: number) => (<React.Fragment key={t_i}><a className={t.cls} href={t.href}>{t.t}</a></React.Fragment>))}</div></div>
<div className="wrap lg_grid">
<nav className="toc" aria-label="On this page">{(v.toc || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><a className={s.cls} href={s.href}>{s.n} {s.t}</a></React.Fragment>))}</nav>
<div className="lg_body">{(v.toc || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><h2 id={s.id}>{s.n} {s.t}</h2><div className="lg_sec" dangerouslySetInnerHTML={{ __html: s.html }} /></React.Fragment>))}</div>
</div>



    </div>
  )
}
