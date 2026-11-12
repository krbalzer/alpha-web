'use client'
/* Generated from design/boards/Location.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { LocationEngine } from './engine'
import { MapStage } from '@/components/site/MapStage'
import { Treatments } from '@/components/site/Treatments'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LocationView(props: any) {
  const v = useDC(LocationEngine, props)
  return (
    <div className="pg-location">

<Nav><div className="crumb loc"><div className="wrap"><span>{v.b.ptr}</span><a href={v.b.href} style={{"textDecoration": "none"} as React.CSSProperties}>{v.b.name}</a><span>{v.loc.place}</span><span></span><span>Partner since {v.b.since}</span></div></div></Nav>

{/* ============ HERO ============ */}
{v.hasVid ? (<>
<section className="hero dark" style={{"height": `${v.heroH}`} as React.CSSProperties} aria-label={v.title}>
{v.loc.heroVideo ? (<><video className="hero_vid" ref={v.vidRef} poster={v.loc.heroPoster} autoPlay muted loop playsInline preload="auto" aria-hidden="true">{v.loc.heroAv1 ? (<><source src={v.loc.heroAv1} type="video/mp4; codecs=av01.0.08M.08" /></>) : null}{v.loc.heroSmall ? (<><source src={v.loc.heroSmall} type="video/mp4" media="(max-width: 820px)" /></>) : null}<source src={v.loc.heroVideo} type="video/mp4" /></video></>) : null}{v.loc.noVideo ? (<><div className="hero_media" aria-hidden="true"></div></>) : null}
<div className="hero_shade" aria-hidden="true"></div>
<div className="hero_in wrap">
<span className="pill">{v.b.ptr} location</span>{v.former ? (<><span className="formerly">Formerly {v.former}</span></>) : null}
<h1 className="h1">{v.title}</h1>
<div className="hero_meta">
<p className="addr">{v.loc.a1}, {v.loc.a2} /<br />{v.servicesLine}</p>
<div className="marks">
<span className="pair" role="group" aria-label={`Alpha partner ${v.b.name}`}><span className="amark" aria-hidden="true"></span><i aria-hidden="true"></i><span className={`bmark b-${v.b.n}`} aria-hidden="true"></span></span>
<span className="states"><i className={`state s-${v.loc.st}`} title={v.loc.st}>{v.loc.st}</i></span>
<span className="est"><small>EST</small>{v.loc.est}</span>
</div>
<span className="spacer"></span>
<div className="hero_ctas">{v.b.book ? (<><a className="btn" href={v.b.book} target="_blank" rel="noopener">Book at {v.b.short}<span className="ext" aria-hidden="true">↗</span></a></>) : null}<a className="btn" href="/talk">Partner with Alpha</a></div>
</div>
</div>
</section>
</>) : null}

{/* ============ MAP (single pin) ============ */}
{/* No hero loop: the location map is the hero. Same section, so the map never appears twice. */}
<section className={v.mapCls} ref={v.setMap} aria-label={v.mapAria} style={{"height": `${v.mapH}`} as React.CSSProperties}>
<MapStage locs={[props.data.b.locations[props.data.li]]} idx={0} /><canvas className="map_cv" ref={v.setCanvas} aria-hidden="true"></canvas>
<div className="map_fade" aria-hidden="true"></div>
<div className="map_rule wrap"><hr /></div>
<div className={v.routeCls} aria-hidden="true">{v.route.from}<b>→</b>{v.route.to}<b>/</b>{v.route.mi}</div>
<span className={v.pinDotCls} aria-hidden="true"></span>
<div className={v.pinCls} aria-hidden="true"><svg viewBox="0 0 34 46"><path d="M17 1C8.2 1 1 8 1 16.8 1 28.6 17 45 17 45s16-16.4 16-28.2C33 8 25.8 1 17 1z" fill="#E8E4DA"></path><circle cx="17" cy="16.5" r="6" fill="#151513"></circle></svg></div>
<div className="carousel">
<div className="track">
<a className="card is-on" href={v.loc.dir} target="_blank" rel="noopener" style={{"textDecoration": "none"} as React.CSSProperties} aria-label={`Directions to ${v.title}`}>
<span className="card_img ph" style={{"background": `${v.loc.tone}`} as React.CSSProperties}>{v.loc.img ? (<><img src={v.loc.img} alt="" loading="lazy" /></>) : null}{v.loc.noImg ? (<>{v.loc.city}</>) : null}</span>
<span className="card_txt"><b>{v.loc.cardT}</b><span className="card_addr">{v.loc.a1}<br />{v.loc.a2}</span><span className="card_marks"><i className={`state s-${v.loc.st}`} title={v.loc.st}>{v.loc.st}</i><span className="amark" aria-hidden="true"></span><span className="est"><small>EST</small>{v.loc.est}</span></span></span>
</a>
</div>
</div>
{v.mapHero ? (<>
<div className="hero_in wrap map_hin">
<span className="pill">{v.b.ptr} location</span>{v.former ? (<><span className="formerly">Formerly {v.former}</span></>) : null}
<h1 className="h1">{v.title}</h1>
<div className="hero_meta">
<p className="addr">{v.loc.a1}, {v.loc.a2} /<br />{v.servicesLine}</p>
<div className="marks">
<span className="pair" role="group" aria-label={`Alpha partner ${v.b.name}`}><span className="amark" aria-hidden="true"></span><i aria-hidden="true"></i><span className={`bmark b-${v.b.n}`} aria-hidden="true"></span></span>
<span className="states"><i className={`state s-${v.loc.st}`} title={v.loc.st}>{v.loc.st}</i></span>
<span className="est"><small>EST</small>{v.loc.est}</span>
</div>
<span className="spacer"></span>
<div className="hero_ctas">{v.b.book ? (<><a className="btn" href={v.b.book} target="_blank" rel="noopener">Book at {v.b.short}<span className="ext" aria-hidden="true">↗</span></a></>) : null}<a className="btn" href="/talk">Partner with Alpha</a></div>
</div>
</div>
</>) : null}
<a className="map_link" href="/locations">See partner map</a>
</section>

{/* ============ VISIT ============ */}
<section className="visit" aria-label={`Visit ${v.title}`}>
<div className="wrap visit_in">
<div className="v_col"><p className="eyebrow">Address</p><p className="v_t">{v.loc.a1}<br />{v.loc.a2}</p><a className="v_link" href={v.loc.dir} target="_blank" rel="noopener">Directions<span className="ext" aria-hidden="true">↗</span></a></div>
{v.visit.hasHours ? (<><div className="v_col"><p className="eyebrow">Hours</p><div className="v_rows">{(v.visit.hours || []).map((h: any, h_i: number) => (<React.Fragment key={h_i}><div><span>{h.d}</span><b>{h.t}</b></div></React.Fragment>))}</div></div></>) : null}
{v.visit.phone ? (<><div className="v_col"><p className="eyebrow">Phone</p><p className="v_t"><a href={v.visit.tel}>{v.visit.phone}</a></p></div></>) : null}
{v.visit.arrive ? (<><div className="v_col"><p className="eyebrow">Arriving</p><p className="v_t">{v.visit.arrive}</p></div></>) : null}
<div className="v_cta">{v.b.book ? (<><a className="btn" href={v.b.book} target="_blank" rel="noopener">Book at {v.b.short}<span className="ext" aria-hidden="true">↗</span></a></>) : null}</div>
</div>
</section>

{/* ============ JOINED: tuck-in chapter (tuck-ins.chapter). Shows once the tuck-in has a headline. ============ */}{v.hasJoined ? (<>
<section className="sec" style={{"paddingBottom": "clamp(60px, 7vw, 110px)"} as React.CSSProperties}>
<div className="wrap">
<hr className="rule" style={{"marginBottom": "clamp(36px, 4vw, 60px)"} as React.CSSProperties} />
<div className="split" style={{"alignItems": "end"} as React.CSSProperties}>
<div><p className="eyebrow">{v.jn.eyebrow}</p><h2 className="h3" style={{"maxWidth": "16ch", "margin": "0"} as React.CSSProperties}>{v.jn.h}</h2></div>
<div>{v.jn.intro ? (<><p className="body" style={{"margin": "0"} as React.CSSProperties}>{v.jn.intro}</p></>) : null}</div>
</div>
{v.jn.hasPair ? (<><div className="tk_pair">
<figure className="tk_f">
<div className="tk_who"><span className="tk_av">{v.jn.a.img ? (<><img src={v.jn.a.img} alt={v.jn.a.name} loading="lazy" /></>) : null}{v.jn.a.noImg ? (<>{v.jn.a.init}</>) : null}</span><div><span className="tk_n">{v.jn.a.name}</span><span className="tk_o">{v.jn.a.line}</span></div></div>
{v.jn.a.q ? (<><blockquote>&ldquo;{v.jn.a.q}&rdquo;</blockquote><figcaption>{v.jn.a.s}</figcaption></>) : null}
</figure>
<div className="tk_join" aria-hidden="true"><b>+</b>{v.jn.yr ? (<><span>{v.jn.yr}</span></>) : null}</div>
<figure className="tk_f">
<div className="tk_who"><span className="tk_av">{v.jn.b.img ? (<><img src={v.jn.b.img} alt={v.jn.b.name} loading="lazy" /></>) : null}{v.jn.b.noImg ? (<>{v.jn.b.init}</>) : null}</span><div><span className="tk_n">{v.jn.b.name}</span><span className="tk_o">{v.jn.b.line}</span></div></div>
{v.jn.b.q ? (<><blockquote>&ldquo;{v.jn.b.q}&rdquo;</blockquote><figcaption>{v.jn.b.s}</figcaption></>) : null}
</figure>
</div></>) : null}
{v.jn.hasKept ? (<><dl className="tk_kept">{(v.jn.kept || []).map((k: any, k_i: number) => (<React.Fragment key={k_i}><div><dt>{k.k}</dt><dd><b>{k.t}</b>{k.line}{k.q ? (<><q>&ldquo;{k.q}&rdquo;</q><small>{k.s}</small></>) : null}</dd></div></React.Fragment>))}</dl></>) : null}
{v.jn.hasFilms ? (<><div className="tk_films">
<div className="tk_films_h"><p className="eyebrow">{v.jn.filmsH}</p></div>
<div className="tk_fr">{(v.jn.films || []).map((f: any, f_i: number) => (<React.Fragment key={f_i}><figure className="tk_v"><div className="tk_vf"><video src={f.src} poster={f.poster} controls preload="none" playsInline></video></div><figcaption><b>{f.t}</b>{f.line}{f.q ? (<><q>&ldquo;{f.q}&rdquo;</q></>) : null}</figcaption></figure></React.Fragment>))}</div>
</div></>) : null}
</div>
</section>
</>) : null}
{/* ============ INSIDE ============ */}{v.hasInside ? (<>
<section className="sec">
<div className="wrap">
<hr className="rule" style={{"marginBottom": "clamp(36px, 4vw, 60px)"} as React.CSSProperties} />
<div className="inside_head"><div><h2 className="h3">Inside {v.loc.insideT}</h2>{v.loc.facts ? (<><p className="sub">{v.loc.facts}</p></>) : null}</div>{v.hasStory ? (<><div className="body inside_story" dangerouslySetInnerHTML={{ __html: v.storyHtml }} /></>) : null}</div>
{v.galOn ? (<>
<div className="gal two">
{(v.gal2 || []).map((g: any, g_i: number) => (<React.Fragment key={g_i}><figure><div className="img"><img className="ph_img" src={g.src} alt={g.alt} loading="lazy" decoding="async" /></div><figcaption className="cap"><b>{g.k}</b>{g.t}</figcaption></figure></React.Fragment>))}
</div>
<div className="gal three">
{(v.gal3 || []).map((g: any, g_i: number) => (<React.Fragment key={g_i}><figure><div className="img"><img className="ph_img" src={g.src} alt={g.alt} loading="lazy" decoding="async" /></div><figcaption className="cap"><b>{g.k}</b>{g.t}</figcaption></figure></React.Fragment>))}
</div>
</>) : null}
</div>
</section>

</>) : null}
<Treatments groups={props.data.treatments} where={props.data.b.locations[props.data.li].label} />
{/* ============ WHO LEADS HERE ============ */}
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<hr className="rule" style={{"marginBottom": "clamp(36px, 4vw, 60px)"} as React.CSSProperties} />
<h2 className="h3">Who leads here</h2>
{v.provLine ? (<><p className="sub">{v.provLine}</p></>) : null}
<div className="leads">
{(v.leads || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}>
<a className="lead" href={p.href}>
<div className="prov_img">{p.hasImg ? (<><img src={p.img} alt={p.name} /></>) : null}{p.noImg ? (<>{p.init}</>) : null}</div>
<div className="lead_t"><span className="lead_r">{p.role}</span><b>{p.name}</b><span className="lead_c">{p.cred}</span><span className="lead_go" aria-hidden="true">Profile →</span></div>
</a>
</React.Fragment>))}
</div>
</div>
</section>

{/* ============ IN THEIR WORDS: Google reviews, synced nightly, top 6 auto-picked. Hidden under 3 qualifying reviews. ============ */}{v.hasReviews ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<hr className="rule" style={{"marginBottom": "clamp(36px, 4vw, 60px)"} as React.CSSProperties} />
<div className="rv_head">
<div><h2 className="h3">In their words</h2><p className="sub">From patients of {v.loc.label}, on Google.</p></div>
<div className="rv_agg"><span className="rv_n">{v.rv.rating}</span><span className="rv_st" role="img" aria-label={`${v.rv.rating} out of 5 stars`}><i style={{"width": `${v.rv.pct}%`} as React.CSSProperties}></i></span><span className="rv_c">{v.rv.count} Google reviews</span><a className="rv_all" href={v.rv.uri} target="_blank" rel="noopener">Read all on Google<span className="ext" aria-hidden="true">↗</span></a></div>
</div>
<div className="rv">{(v.rv.items || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><figure className={r.cls}>{r.tag ? (<><span className="rv_tag">{r.tag}</span></>) : null}<blockquote>{r.t}</blockquote>{r.long ? (<><label className="rv_more"><input type="checkbox" className="rv_x" /><span className="rv_m">Read more</span><span className="rv_l">Show less</span></label></>) : null}<figcaption className="rv_f"><span><a className="rv_who" href={r.whoUri} target="_blank" rel="noopener nofollow"><b>{r.who}</b></a> / {r.when}</span><span>via Google</span></figcaption></figure></React.Fragment>))}</div>
</div>
</section>

</>) : null}
{/* ============ SINCE ALPHA ============ */}{v.hasSince ? (<>
<section style={{"paddingBottom": "clamp(56px, 6vw, 90px)"} as React.CSSProperties}>
<div className="wrap">
<hr className="rule" style={{"marginBottom": "clamp(36px, 4vw, 60px)"} as React.CSSProperties} />
<div className="since">
<div><h2 className="h3">Since Alpha</h2><p className="sub">Partner since {v.b.since}</p></div>
<div>
<ol className="ms">{(v.ms || []).map((m: any, m_i: number) => (<React.Fragment key={m_i}><li><span>{m.y}</span><p>{m.t}</p></li></React.Fragment>))}</ol>
{v.q.t ? (<><figure className="ms_q"><blockquote>“{v.q.t}”</blockquote><figcaption className="cap">{v.q.s}</figcaption></figure></>) : null}
</div>
</div>
</div>
</section>

</>) : null}
{/* ============ STATS ============ */}{v.hasStats ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
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
</section>

</>) : null}
{/* ============ OPEN ROLES ============ */}{v.hasRoles ? (<>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<h2 className="h3">Open roles</h2>
<div className="roles">
{(v.roles || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><a className="role" href="#careers"><b>{r.t}</b><span>{r.where}</span><span aria-hidden="true">Apply →</span></a></React.Fragment>))}
</div>
</div>
</section>

</>) : null}
{/* ============ SIBLING ============ */}
{v.hasSib ? (<>
<section className="also" style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<h2 className="h3" style={{"marginBottom": "clamp(22px, 2.2vw, 34px)"} as React.CSSProperties}>Also {v.sib.label}</h2>
<a href={v.sib.href} style={{"display": "block", "textDecoration": "none"} as React.CSSProperties}><div className="img ph" style={{"background": `${v.sib.tone}`, "color": "rgba(232,228,218,.6)", "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{v.sib.img ? (<><img className="ph_img" src={v.sib.img} alt="" loading="lazy" /></>) : null}</div></a>
<div className="also_row cap"><span><b>{v.sib.place}</b>{v.sib.a1}, {v.sib.a2}</span><a href={v.sib.href}>View {v.sib.label} →</a></div>
</div>
</section>
</>) : null}

{/* ============ CLOSER ============ */}


    </div>
  )
}
