'use client'
/* Ported from the Brand board (Brand.dc.html). Markup and engine are generated; edit design/boards/Brand.dc.html or tools/port/port_brand.py, not this file. */
import Link from 'next/link'
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import type { BrandData } from '@/lib/data'
import { BrandEngine } from './engine'
import { MapboxStage, hasMapbox } from './MapboxStage'
import './brand.css'

export default function BrandView({ brand }: { brand: BrandData }) {
  const v = useDC(BrandEngine, { brand, singleLocation: false, mapbox: hasMapbox })
  return (
    <div className="pg-brand">
<Nav><div className="crumb"><div className="wrap"><span>{v.b.ptr}</span><span>{v.b.name}</span><span>{v.b.sinceLine}</span></div></div></Nav>

{/* ============ HERO: silent loop, everything pinned to the bottom of the fold ============ */}
<section className="hero dark" style={{"height": `${v.heroH}`} as React.CSSProperties} aria-label={v.b.name}>
{v.hasVideo ? (<><video className="hero_vid" ref={v.vidRef} poster={v.b.heroPoster || undefined} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true">{v.b.hero.av1 ? <source src={v.b.hero.av1} type={'video/mp4; codecs="av01.0.08M.08"'} /> : null}{v.b.hero.small ? <source src={v.b.hero.small} type="video/mp4" media="(max-width: 820px)" /> : null}<source src={v.b.hero.src || v.b.heroVideo} type="video/mp4" /></video></>) : null}{v.posterOnly ? (<><img className="hero_vid" src={v.b.heroPoster} alt="" aria-hidden="true" fetchPriority="high" /></>) : null}{v.noMedia ? (<><div className="hero_media" aria-hidden="true"></div></>) : null}
<div className="hero_shade" aria-hidden="true"></div>
<div className="hero_in wrap">
<span className="pill">{v.b.ptr}</span>
<h1 className="h1">{v.b.name}</h1>
<div className="hero_meta">
<p className="addr">{v.metaLine}</p>
<div className="marks">
<span className="pair" role="group" aria-label={`Alpha partner ${v.b.name}`}><span className="amark" aria-hidden="true"></span><i aria-hidden="true"></i><span className={`bmark b-${v.b.n}`} aria-hidden="true"></span></span>
<span className="states">{(v.b.states || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><i className={`state s-${s}`} title={s}>{s}</i></React.Fragment>))}</span>
{v.b.est ? (<><span className="est"><small>EST</small>{v.b.est}</span></>) : null}
</div>
<span className="spacer"></span>
<div className="hero_ctas">{v.b.book ? (<><a className="btn" href={v.b.book} target="_blank" rel="noopener">Book at {v.b.short}<span className="ext" aria-hidden="true">↗</span></a></>) : null}<Link className="btn" href="/talk">Partner with Alpha</Link></div>
</div>
</div>
</section>

{/* ============ MAP: pin per location, carousel when there are more than one ============ */}
<section className="map dark" ref={v.setMap} aria-label="Locations">
{hasMapbox ? <MapboxStage locs={brand.locations} idx={v.idx} /> : null}<canvas className="map_cv" ref={v.setCanvas} aria-hidden="true"></canvas>
<div className="map_fade" aria-hidden="true"></div>
<div className="map_rule wrap"><hr /></div>
<div className={v.routeCls} aria-hidden="true">{v.route.from}<b>→</b>{v.route.to}<b>/</b>{v.route.mi}</div>
<span className={v.pinDotCls} aria-hidden="true"></span>
<div className={v.pinCls} aria-hidden="true"><svg viewBox="0 0 34 46"><path d="M17 1C8.2 1 1 8 1 16.8 1 28.6 17 45 17 45s16-16.4 16-28.2C33 8 25.8 1 17 1z" fill="#E8E4DA"></path><circle cx="17" cy="16.5" r="6" fill="#151513"></circle></svg></div>
<div className="carousel">
<div className="track" style={{"transform": `translateX(calc(${v.idx} * (var(--cw) + 16px) * -1))`} as React.CSSProperties}>
{(v.cards || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}>
<button className={c.cls} onClick={c.go} aria-label={c.aria} aria-current={c.cur}>
<span className="card_img ph" style={{"background": `${c.tone}`} as React.CSSProperties}>{c.img ? (<><img src={c.img} alt="" loading="lazy" /></>) : null}{c.noImg ? (<>{c.city}</>) : null}</span>
<span className="card_txt"><b>{c.name}</b><span className="card_addr">{c.a1}<br />{c.a2}</span><span className="card_marks"><i className={`state s-${c.st}`} title={c.st}>{c.st}</i><span className="amark" aria-hidden="true"></span>{c.est ? (<><span className="est"><small>EST</small>{c.est}</span></>) : null}</span></span>
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
<div className="img ph" style={{"aspectRatio": "1.1 / 1"} as React.CSSProperties}>{v.b.practiceImg ? (<><img className="fill" src={v.b.practiceImg} alt="" loading="lazy" /></>) : null}</div>
</div>
</section>

{/* ============ STORY FILM ============ */}
<section style={{"paddingBottom": "clamp(80px, 9vw, 140px)"} as React.CSSProperties}>
<div className="wrap">
<hr className="rule" />
<div className="bar"><span>{v.b.ptr}</span><span>{v.b.short} story</span></div>
<div className="film">
{v.b.filmPoster ? (<><img className="fill" src={v.b.filmPoster} alt="" loading="lazy" decoding="async" /></>) : null}
<button className="play" onClick={v.playFilm} aria-label={`Play the ${v.b.short} story`}><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M1 1l10 6-10 6z" fill="#0E0E0D"></path></svg></button>
</div>
{v.b.filmCaption ? (<><div className="body" style={{"marginTop": "clamp(28px, 3vw, 44px)"} as React.CSSProperties}><p>{v.b.filmCaption}</p></div></>) : null}
</div>
</section>

{/* ============ STATS ============ */}
{v.hasStats ? (<><section style={{"paddingBottom": "clamp(90px, 10vw, 160px)"} as React.CSSProperties}>
<div className="wrap">
<div className="stats" ref={v.setStats}>
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

{/* ============ LOCATIONS INDEX: only for multi-location brands ============ */}
{v.multi ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 160px)"} as React.CSSProperties}>
<div className="wrap">
<div className="lx_head"><h2 className="h3">{v.locHead}</h2><span className="eyebrow" style={{"margin": "0"} as React.CSSProperties}>{v.locCount}</span></div>
<div className="lx_wrap">
<div className={v.lxCls} ref={v.setLx}>
{(v.locRows || []).map((l: any, l_i: number) => (<React.Fragment key={l_i}>
<a className="lx" href={l.href}>
<span className="lx_n">{l.n}</span>
<span className="lx_t"><span className="lx_c"><span className="lx_ci" style={{"transitionDelay": `${l.d}`} as React.CSSProperties}>{l.city}</span></span><span className="lx_a" style={{"transitionDelay": `${l.d2}`} as React.CSSProperties}>{l.addr}</span></span>
<span className="lx_go" aria-hidden="true"><svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5h10M7 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.2"></path></svg></span>
</a>
</React.Fragment>))}
</div>
<div className="lx_prev" aria-hidden="true">{(v.locRows || []).map((l: any, l_i: number) => (<React.Fragment key={l_i}><div className="lx_pv" style={{"background": `${l.bg}`} as React.CSSProperties}>{l.img ? (<><img className="lx_pvi" src={l.img} alt="" /></>) : null}<span>{l.n} / {l.city}</span></div></React.Fragment>))}</div>
</div>
</div>
</section>
</>) : null}

{/* ============ FOUNDER ============ */}
{v.b.founder ? (<><section style={{"paddingBottom": "clamp(90px, 10vw, 160px)"} as React.CSSProperties}>
<div className="wrap founder">
<div className="founder_img">{v.b.founderImg ? (<><img src={v.b.founderImg} alt={v.b.founder} style={{"objectPosition": "50% 20%"} as React.CSSProperties} loading="lazy" /></>) : null}</div>
<div style={{"maxWidth": "32rem", "paddingTop": "4px"} as React.CSSProperties}>
<p className="eyebrow">Founder</p>
<h2 className="founder_name">{v.b.founder}</h2>
<p className="founder_cred">{v.b.cred}</p>
<div className="body" dangerouslySetInnerHTML={{ __html: v.b.founderHtml }} />
<Link className="btn" href={v.founderHref} style={{"marginTop": "10px"} as React.CSSProperties}>Learn more</Link>
</div>
</div>
</section></>) : null}

{/* ============ QUOTE ============ */}
{v.b.quote ? (<><section style={{"padding": "clamp(40px, 5vw, 80px) 0 clamp(90px, 10vw, 160px)"} as React.CSSProperties}>
<div className="wrap">
<figure className="quote" style={{"margin": "0 auto"} as React.CSSProperties}>
<blockquote>“{v.b.quote}”</blockquote>
<figcaption>{v.b.founder} / {v.b.short} founder</figcaption>
</figure>
</div>
</section></>) : null}

{/* ============ WHY ALPHA ============ */}
{v.b.whyHeadline ? (<><section style={{"paddingBottom": "clamp(90px, 10vw, 160px)"} as React.CSSProperties}>
<div className="wrap">
<hr className="rule" style={{"marginBottom": "clamp(28px, 3vw, 44px)"} as React.CSSProperties} />
<div className="split">
<div>
<p className="eyebrow">Why Alpha</p>
<h2 className="h3">{v.b.whyHeadline}</h2>
<div className="body" dangerouslySetInnerHTML={{ __html: v.b.whyHtml }} />
<Link className="btn" href="/talk" style={{"marginTop": "10px"} as React.CSSProperties}>Let's talk</Link>
</div>
<div className="img ph" style={{"aspectRatio": "4 / 5.2"} as React.CSSProperties}>{v.b.whyImg ? (<><img className="fill" src={v.b.whyImg} alt="" loading="lazy" /></>) : null}</div>
</div>
</div>
</section></>) : null}


    </div>
  )
}
