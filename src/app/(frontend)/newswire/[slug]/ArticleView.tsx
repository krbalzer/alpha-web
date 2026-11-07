'use client'
/* Generated from design/boards/Article.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { ArticleEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ArticleView(props: any) {
  const v = useDC(ArticleEngine, props)
  return (
    <div className="pg-article">

<Nav></Nav>
<article>
<header className="ar_h"><div className="wrap">
<div className="ar_meta"><a className="lnk k" href="/newswire">← Newswire</a><span className="k">Released {v.a.date}</span><span className="nw_tag">{v.a.tag}</span>{v.a.ptr ? (<><span className="k">{v.a.ptr}</span></>) : null}</div>
<h1 className="ar_t">{v.a.t}</h1>
{v.a.img ? (<><div className="ar_img" style={{"position": "relative", "overflow": "hidden"} as React.CSSProperties}><img className="ph_img" src={v.a.img} alt="" fetchPriority="high" /></div></>) : null}
</div></header>
<div className="wrap ar_grid">
<aside className="ar_side"><div className="ar_share"><span className="k" style={{"marginBottom": "6px"} as React.CSSProperties}>Share</span><a href={v.share.li} target="_blank" rel="noopener">LinkedIn</a><a href={v.share.x} target="_blank" rel="noopener">X</a><a href={v.share.fb} target="_blank" rel="noopener">Facebook</a><button onClick={v.copy}>{v.copyLabel}</button></div></aside>
<div className="ar_body" dangerouslySetInnerHTML={{ __html: v.a.html }} />
<aside className="ar_side">{v.brand ? (<><span className="k">In this release</span><a className="pcard" href={v.brand.href}><span className="pcard_img" style={{"background": "#5A5A55", "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{v.brand.img ? (<><img className="ph_img" src={v.brand.img} alt="" loading="lazy" /></>) : null}</span><span className="pcard_t"><span className="mono">PTR {v.brand.n} · {v.brand.where}</span><b>{v.brand.name}</b><span className="mono">View brand →</span></span></a><a className="lnk k" href="/locations">See it on the map →</a></>) : null}</aside>
</div>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}><div className="wrap"><h2 className="h3" style={{"marginBottom": "18px"} as React.CSSProperties}>More releases</h2><div className="rel">{(v.more || []).map((m: any, m_i: number) => (<React.Fragment key={m_i}><a href={m.href}><span className="mono">{m.d}</span><b>{m.t}</b><span className="mono">→</span></a></React.Fragment>))}</div></div></section>
</article>



    </div>
  )
}
