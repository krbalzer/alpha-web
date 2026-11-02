'use client'
/* Ported from the Brand board (Brand.dc.html). Markup and engine are generated; edit design/boards/Brand.dc.html or tools/port/port_brand.py, not this file. */
import Link from 'next/link'
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import type { BrandData } from '@/lib/data'
import { BrandEngine } from './engine'
import './brand.css'

export default function BrandView({ brand }: { brand: BrandData }) {
  const v = useDC(BrandEngine, { brand, singleLocation: false })
  return (
    <div className="pg-brand">
<Nav><div className="crumb"><div className="wrap"><span>{v.b.ptr}</span><span>{v.b.name}</span><span>{v.b.sinceLine}</span></div></div></Nav>

{/* ============ HERO: silent loop, everything pinned to the bottom of the fold ============ */}
<section className="hero dark" style={{"height": `${v.heroH}`}} aria-label={v.b.name}>
{v.hasVideo ? (<><video className="hero_vid" src={v.b.heroVideo} poster={v.b.heroPoster} autoPlay muted loop playsInline aria-hidden="true"></video></>) : null}{v.noVideo ? (<><div className="hero_media" aria-hidden="true"></div></>) : null}
<div className="hero_shade" aria-hidden="true"></div>
<div className="hero_in wrap">
<span className="pill">{v.b.ptr}</span>
<h1 className="h1">{v.b.name}</h1>
<div className="hero_meta">
<p className="addr">{v.addrLine}<br />{v.metaLine}</p>
<div className="marks">
<span className="amark" role="img" aria-label="Alpha partner"></span>
{v.b.logo ? (<><img className="logo_img" src={v.b.logo} alt={v.b.name} /></>) : null}
<span className="states">{(v.b.states || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><i className="state" title="State flag slot">{s}</i></React.Fragment>))}</span>
<span className="est"><small>EST</small>{v.b.est}</span>
</div>
<span className="spacer"></span>
<Link className="btn hero_cta" href="/talk">Let's talk</Link>
</div>
</div>
</section>

{/* ============ MAP: pin per location, carousel when there are more than one ============ */}
<section className="map dark" ref={v.setMap} aria-label="Locations">
<canvas className="map_cv" ref={v.setCanvas} aria-hidden="true"></canvas>
<div className="map_fade" aria-hidden="true"></div>
<div className="map_rule wrap"><hr /></div>
<div className={v.routeCls} aria-hidden="true">{v.route.from}<b>→</b>{v.route.to}<b>/</b>{v.route.mi}</div>
<span className={v.pinDotCls} aria-hidden="true"></span>
<div className={v.pinCls} aria-hidden="true"><svg viewBox="0 0 34 46"><path d="M17 1C8.2 1 1 8 1 16.8 1 28.6 17 45 17 45s16-16.4 16-28.2C33 8 25.8 1 17 1z" fill="#E8E4DA"></path><circle cx="17" cy="16.5" r="6" fill="#151513"></circle></svg></div>
<div className="carousel">
<div className="track" style={{"transform": `translateX(calc(${v.idx} * (var(--cw) + 16px) * -1))`}}>
{(v.cards || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}>
<button className={c.cls} onClick={c.go} aria-label={c.aria} aria-current={c.cur}>
<span className="card_img ph" style={{"background": `${c.tone}`}}>{c.img ? (<><img src={c.img} alt="" loading="lazy" /></>) : null}{c.noImg ? (<>{c.city}</>) : null}</span>
<span className="card_txt"><b>{c.name}</b><span className="card_addr">{c.a1}<br />{c.a2}</span><span className="card_marks"><i className="state">{c.st}</i><span className="amark" aria-hidden="true"></span><span className="est"><small>EST</small>{c.est}</span></span></span>
</button>
</React.Fragment>))}
</div>
{v.multi ? (<>
<div className="ctrl">
<button className={v.prevCls} onClick={v.prev} aria-label="Previous location"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><path d="M11 5H1M5 1L1 5l4 4" stroke="currentColor" fill="none" strokeWidth="1.2"></path></svg></button>
<span>{v.count}</span>
<button className={v.nextCls} onClick={v.next} aria-label="Next location"><svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><path d="M1 5h10M7 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.2"></path></svg></button>
</div>
</>) : null}
</div>
<Link className="map_link" href="/locations">See partner map</Link>
</section>

{/* ============ THE PRACTICE ============ */}
<section className="sec">
<div className="wrap split">
<div>
<p className="eyebrow">{v.b.practiceEyebrow}</p>
<h2 className="h3">{v.b.practiceHeadline}</h2>
<div className="body" dangerouslySetInnerHTML={{ __html: v.b.practiceHtml }} />
</div>
<div className="img ph" style={{"aspectRatio": "1.1 / 1"}}>{v.b.practiceImg ? (<><img className="fill" src={v.b.practiceImg} alt="" loading="lazy" /></>) : null}</div>
</div>
</section>

{/* ============ STORY FILM ============ */}
<section style={{"paddingBottom": "clamp(80px, 9vw, 140px)"}}>
<div className="wrap">
<hr className="rule" />
<div className="bar"><span>{v.b.ptr}</span><span>{v.b.short} story</span></div>
<div className="film">
{v.b.filmPoster ? (<><img className="fill" src={v.b.filmPoster} alt="" loading="lazy" /></>) : null}
<button className="play" onClick={v.playFilm} aria-label={`Play the ${v.b.short} story`}><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M1 1l10 6-10 6z" fill="#0E0E0D"></path></svg></button>
</div>
{v.b.filmCaption ? (<><div className="body" style={{"marginTop": "clamp(28px, 3vw, 44px)"}}><p>{v.b.filmCaption}</p></div></>) : null}
</div>
</section>

{/* ============ STATS ============ */}
{v.hasStats ? (<><section style={{"paddingBottom": "clamp(90px, 10vw, 160px)"}}>
<div className="wrap">
<div className="stats">
{(v.stats || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}>
<div className="stat">
<span className="stat_k">{s.k}</span>
<span className="stat_n">{s.n}</span>
<span className="stat_l">{s.l}</span>
<div className="rows">{(s.rows || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><div className="row"><span>{r.k}</span><b>{r.v}</b></div></React.Fragment>))}</div>
</div>
</React.Fragment>))}
</div>
</div>
</section></>) : null}

{/* ============ FOUNDER ============ */}
{v.b.founder ? (<><section style={{"paddingBottom": "clamp(90px, 10vw, 160px)"}}>
<div className="wrap founder">
<div className="founder_img">{v.b.founderImg ? (<><img src={v.b.founderImg} alt={v.b.founder} loading="lazy" /></>) : null}</div>
<div style={{"maxWidth": "32rem", "paddingTop": "4px"}}>
<p className="eyebrow">Founder</p>
<h2 className="founder_name">{v.b.founder}</h2>
<p className="founder_cred">{v.b.cred}</p>
<div className="body" dangerouslySetInnerHTML={{ __html: v.b.founderHtml }} />
<Link className="btn" href={v.founderHref} style={{"marginTop": "10px"}}>Learn more</Link>
</div>
</div>
</section></>) : null}

{/* ============ QUOTE ============ */}
{v.b.quote ? (<><section style={{"padding": "clamp(40px, 5vw, 80px) 0 clamp(90px, 10vw, 160px)"}}>
<div className="wrap">
<figure className="quote" style={{"margin": "0 auto"}}>
<blockquote>“{v.b.quote}”</blockquote>
<figcaption>{v.b.founder} / {v.b.short} founder</figcaption>
</figure>
</div>
</section></>) : null}

{/* ============ WHY ALPHA ============ */}
{v.b.whyHeadline ? (<><section style={{"paddingBottom": "clamp(90px, 10vw, 160px)"}}>
<div className="wrap">
<hr className="rule" style={{"marginBottom": "clamp(28px, 3vw, 44px)"}} />
<div className="split">
<div>
<p className="eyebrow">Why Alpha</p>
<h2 className="h3">{v.b.whyHeadline}</h2>
<div className="body" dangerouslySetInnerHTML={{ __html: v.b.whyHtml }} />
<Link className="btn" href="/talk" style={{"marginTop": "10px"}}>Let's talk</Link>
</div>
<div className="img ph" style={{"aspectRatio": "4 / 5.2"}}>{v.b.whyImg ? (<><img className="fill" src={v.b.whyImg} alt="" loading="lazy" /></>) : null}</div>
</div>
</div>
</section></>) : null}


    </div>
  )
}
