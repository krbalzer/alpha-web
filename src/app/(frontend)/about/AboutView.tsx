'use client'
/* Generated from design/boards/About.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { AboutEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AboutView(props: any) {
  const v = useDC(AboutEngine, props)
  return (
    <div className="pg-about">

<Nav></Nav>
<section className="ab_h">
<div className="wrap">
<p className="eyebrow">About Alpha</p>
<h1 className="display">Aesthetics<br />is growing up.</h1>
<div className="ab_sub"><p className="lead">Independent practices, with the scale of a national platform. Your brand stays yours.</p><p className="lede">The industry is consolidating. Alpha gives founders the muscle that consolidation brings (capital, buying power, a team behind every function) without asking them to give up the practice they built.</p></div>
</div>
</section>

<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<div className="pill3">
<div className="p3"><span className="k">01 / The model</span><h3>Keep your<br />brand</h3><p>Every partner keeps its name, its team and its clinical judgment. Alpha unites independent practices into one entity, not one look.</p></div>
<div className="p3"><span className="k">02 / The muscle</span><h3>Share the<br />back office</h3><p>Operations, finance, HR, IT, marketing and integrations, run by people who only do aesthetics. Volume pricing across the network.</p></div>
<div className="p3"><span className="k">03 / The upside</span><h3>Own a piece<br />of all of it</h3><p>Partners take cash up front and become owners in Alpha. Your single stock becomes a stake in the whole fund.</p></div>
</div>
</div>
</section>

<section className="who dark">
<div className="wrap">
<div className="pg_grid"><div><p className="eyebrow">Who are you?</p><h2 className="display h2">Three reasons owners<br />call us</h2></div><p className="lede">Most founders recognise themselves in one of these. Pick yours.</p></div>
<div className="who_tabs">{(v.who || []).map((w: any, w_i: number) => (<React.Fragment key={w_i}><button className={w.cls} onClick={w.go}><b>{w.t}</b><span>{w.s}</span></button></React.Fragment>))}</div>
<div className="who_body">
<p className="who_q">{v.cur.q}</p>
<div><ul className="who_list">{(v.cur.pts || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><li><span>{p.n}</span>{p.t}</li></React.Fragment>))}</ul><a className="btn" href={v.cur.href} style={{"marginTop": "24px", "color": "#E8E4DA"} as React.CSSProperties}>{v.cur.cta}</a></div>
</div>
</div>
</section>

<section className="sec">
<div className="wrap">
<div className="split_head"><div><p className="eyebrow">Alpha, by the year</p><h2 className="display h2">From one practice<br />to sixteen</h2></div><p className="body" style={{"margin": "0", "maxWidth": "24rem"} as React.CSSProperties}>Every milestone links to its release on the Newswire.</p></div>
{(v.years || []).map((y: any, y_i: number) => (<React.Fragment key={y_i}>
<div className="yr"><span className="yr_y">{y.y}</span><ol className="yr_l">{(y.items || []).map((i: any, i_i: number) => (<React.Fragment key={i_i}><li><span className="mono">{i.d}</span><b>{i.t}</b><a href="/newswire">Release →</a></li></React.Fragment>))}</ol></div>
</React.Fragment>))}
</div>
</section>

<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<div className="backer">
<div><p className="eyebrow">Who&#39;s backing us</p><h2 className="display h2">Thurston Group</h2><p className="body" style={{"marginTop": "18px"} as React.CSSProperties}>A private equity firm that specializes in healthcare consolidation. Alpha is the aesthetics platform in a portfolio that has done this before.</p></div>
<div><span className="k">Thurston healthcare platforms</span><div className="backer_logos"><span>Smile Doctors</span><span>US Endo Partners</span><span>Options Medical Weight Loss</span><span>Arc Health</span><span>US Orthopaedic Partners</span></div><p className="ph" style={{"color": "#5C5952", "marginTop": "18px"} as React.CSSProperties}>Swap for logos with permission</p></div>
</div>
</div>
</section>

<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<div className="split_head"><h2 className="display h2">Leadership</h2><a className="btn" href="/team">Meet the whole team</a></div>
<div className="execs">{(v.execs || []).map((e: any, e_i: number) => (<React.Fragment key={e_i}><a className="ex" href={e.href}><span className="ex_i">{e.img ? (<><img className="ph_img" src={e.img} alt="" loading="lazy" /></>) : null}{e.iOnly}</span><b>{e.n}</b><span>{e.t}</span></a></React.Fragment>))}</div>
</div>
</section>

<section id="qualify" className="qual dark">
<div className="wrap qual_grid" style={{"alignItems": "end"} as React.CSSProperties}>
<div><h2 className="display h2">Make the next era<br />your best one</h2></div>
<div><p className="lede" style={{"margin": "0 0 22px"} as React.CSSProperties}>Five questions about your practice. If it&#39;s a fit, you&#39;ll talk with people who have already made this decision.</p><a className="btn" href="/talk" style={{"color": "#E8E4DA"} as React.CSSProperties}>Is your practice qualified?</a></div>
</div>
</section>



    </div>
  )
}
