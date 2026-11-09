'use client'
/* Generated from design/boards/Episode.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { EpisodeEngine } from './engine'
import { QueueBtn } from '@/components/site/QueueBtn'
import { EpisodeBar } from '@/components/site/EpisodeBar'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EpisodeView(props: any) {
  const v = useDC(EpisodeEngine, props)
  return (
    <div className="pg-episode">

<Nav></Nav>

<section className="eh"><div className="wrap eh_grid">
<div className="art eh_art" style={{"background": `${v.show.bg}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties} aria-label={`${v.show.name} cover`}>{v.show.art ? (<><img className="ph_img" src={v.show.art} alt="" /></>) : null}</div>
<div className="eh_info">
<h1 className="eh_t">{v.ep.title}</h1>
<p className="eh_m mono"><a href={v.show.href} style={{"color": "inherit"} as React.CSSProperties}>{v.show.name}</a>{v.ep.n ? (<> // EP {v.ep.n}</>) : null} <span>{v.ep.date}{v.ep.len ? (<> · {v.ep.len}</>) : null}</span></p>
{v.hasPeople ? (<><div className="eh_spk" style={{"marginTop": "18px"} as React.CSSProperties}>{(v.people || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><span className="spk" title={p.name}>{p.img ? (<><img src={p.img} alt="" loading="lazy" /></>) : null}{p.iOnly ? (<>{p.init}</>) : null}</span></React.Fragment>))}</div></>) : null}
<div className="plats" style={{"marginTop": "18px"} as React.CSSProperties}><button className="tv_play" onClick={v.play}><svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true"><path d="M0 0l11 6.5L0 13z" fill="currentColor"></path></svg>Play episode</button><QueueBtn ep={v.ep.player} className="qb_lg"></QueueBtn>{(v.plats || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><a className="plat" href={p.href} target="_blank" rel="noopener">{p.t}<span aria-hidden="true">↗</span></a></React.Fragment>))}</div>
</div>
</div></section>
<EpisodeBar ep={v.ep.player}></EpisodeBar>
{v.ep.video ? (<><section className={v.vidCls} aria-label="Episode video">{v.vidOn ? (<><iframe className="vid_ifr" src={v.vidSrc} title={v.ep.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen></iframe></>) : null}{v.vidOff ? (<>{v.ep.poster ? (<><img className="vid_poster" src={v.ep.poster} alt="" loading="lazy" /></>) : null}<button className="vid_btn" onClick={v.watch}><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M1 1l10 6-10 6z" fill="#0E0E0D"></path></svg><span>Watch the episode</span></button></>) : null}</section></>) : null}
<section className="sec"><div className="wrap about">
<div className="about_l">
<h2 className="about_h">About this episode</h2>
{v.pq.text ? (<><blockquote className="pq">“{v.pq.text}”</blockquote>{v.pq.at ? (<><button className="pq_play mono" onClick={v.playQuote}><span aria-hidden="true">▶</span> Hear it at {v.pq.at}</button></>) : null}</>) : null}
<div className="share mono"><span>Share</span><a href={v.share.x} target="_blank" rel="noopener">X</a><a href={v.share.li} target="_blank" rel="noopener">LinkedIn</a><a href={v.share.fb} target="_blank" rel="noopener">Facebook</a><button onClick={v.copy}>{v.copyLabel}</button></div>
</div>
<div className="about_r">
<div className="body ep_body"><p>{v.ep.sum}</p></div>
{v.hasChapters ? (<><h2 className="list_h">In this episode</h2><ol className="chap">{(v.chapters || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}><li><button onClick={c.go}><span className="mono">{c.at}</span><span>{c.t}</span><span className="chap_go" aria-hidden="true">▶</span></button></li></React.Fragment>))}</ol></>) : null}
{v.trHtml ? (<><button className="tr_btn mono" onClick={v.toggleTr} aria-expanded={v.trOpenS}>{v.trLabel}</button>{v.trOpen ? (<><div className="tr" dangerouslySetInnerHTML={{ __html: v.trHtml }} /></>) : null}</>) : null}
</div>
</div></section>
{v.hasPeople ? (<><section style={{"paddingBottom": "clamp(70px, 8vw, 120px)"} as React.CSSProperties}><div className="wrap">
<hr className="rule" style={{"marginBottom": "clamp(36px, 4vw, 60px)"} as React.CSSProperties} />
<p className="eyebrow">In the room</p>
<div className="room2">{(v.people || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><div className="person">
<span className="person_av">{p.img ? (<><img src={p.img} alt="" loading="lazy" /></>) : null}{p.iOnly ? (<>{p.init}</>) : null}</span>
<div><span className="person_k mono">{p.label}</span><h3 className="person_n">{p.name}</h3>{p.role ? (<><p className="person_t mono">{p.role}</p></>) : null}{p.bio ? (<><p className="person_b">{p.bio}</p></>) : null}{p.hasHref ? (<><a className="btn" href={p.href}>Profile</a></>) : null}</div>
</div></React.Fragment>))}</div>
</div></section></>) : null}
<section className="show"><div className="wrap show_grid">
<div className="art" style={{"background": `${v.show.bg}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties} aria-label={`${v.show.name} cover`}>{v.show.art ? (<><img className="ph_img" src={v.show.art} alt="" loading="lazy" /></>) : null}</div>
<div><p className="eyebrow">About the show</p><h2 className="show_n">{v.show.name}</h2></div>
<div><p className="body" style={{"marginTop": "0"} as React.CSSProperties}>{v.show.tag}</p><p className="mono" style={{"fontSize": "10.5px", "color": "#5C5952", "margin": "18px 0 22px"} as React.CSSProperties}>{v.show.count}{v.show.sched ? (<> · {v.show.sched}</>) : null}</p><a className="btn" href={v.show.href}>All episodes</a></div>
</div></section>
{v.hasMore ? (<><section className="sec"><div className="wrap">
<h2 className="h3" style={{"marginBottom": "clamp(24px, 2.4vw, 36px)"} as React.CSSProperties}>More from {v.show.name}</h2>
<div className="eps">{(v.more || []).map((e: any, e_i: number) => (<React.Fragment key={e_i}><div className="ep">
<div className="art art_sm" style={{"background": `${v.show.bg}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{v.show.art ? (<><img className="ph_img" src={v.show.art} alt="" loading="lazy" /></>) : null}</div>
<div className="ep_d"><b className="mono">{e.title}</b><span className="mono">{v.show.name}</span><span className="mono ep_date">{e.date}{e.len ? (<> · {e.len}</>) : null}</span></div>
<span className="mono ep_no">{e.n}</span><span></span><span></span>
<span className="ep_links"><a className="btn" href={e.href}>View episode</a><button className="btn" onClick={e.play}>Play</button><QueueBtn ep={e.ep}></QueueBtn></span>
</div></React.Fragment>))}</div>
<div style={{"display": "flex", "justifyContent": "center", "marginTop": "clamp(28px, 3vw, 44px)"} as React.CSSProperties}><a className="btn" href={v.show.href}>See show</a></div>
</div></section></>) : null}
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}><div className="wrap">
<h2 className="h3">Explore other shows</h2><hr className="rule" style={{"margin": "clamp(20px, 2vw, 30px) 0 clamp(24px, 2.4vw, 36px)"} as React.CSSProperties} />
<div className="shows">{(v.shows || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><a className="tile" href={s.href} style={{"background": `${s.bg}`, "color": `${s.fg}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{s.art ? (<><img className="ph_img" src={s.art} alt={s.name} loading="lazy" /></>) : null}{s.noArt ? (<><span className="tile_t">{s.name}</span></>) : null}</a></React.Fragment>))}</div>
</div></section>


    </div>
  )
}
