'use client'
/* Generated from design/boards/Show.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { ShowEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ShowView(props: any) {
  const v = useDC(ShowEngine, props)
  return (
    <div className="pg-show">

<Nav dark></Nav>

<section className="sh_h"><div className="wrap sh_grid">
<div className="sh_art" style={{"background": `${v.show.bg}`, "color": `${v.show.fg}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{v.show.art ? (<><img className="ph_img" src={v.show.art} alt={v.show.name} /></>) : null}{v.show.noArt ? (<><span>{v.show.name}</span><em>ALPHA®</em></>) : null}</div>
<div>
<span className="mono sh_k">Alpha podcast network{v.show.sched ? (<> · {v.show.sched}</>) : null}</span>
<h1 className="sh_t">{v.show.name}</h1>
{v.show.tag ? (<><p className="sh_d">{v.show.tag}</p></>) : null}
<div className="sh_row">{v.hasEps ? (<><button className="tv_play" onClick={v.playLatest}><svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true"><path d="M0 0l11 6.5L0 13z" fill="currentColor"></path></svg>Play latest</button></>) : null}{(v.plats || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><a className="plat light" href={p.href} target="_blank" rel="noopener">{p.t} ↗</a></React.Fragment>))}</div>
<div className="sh_stats"><div><b>{v.count}</b><span>Episodes</span></div>{v.since ? (<><div><b>{v.since}</b><span>Since</span></div></>) : null}</div>
</div></div></section>
{v.hasEps ? (<>
<section className="sec"><div className="wrap"><div className="latest" style={{"gridTemplateColumns": "1fr"} as React.CSSProperties}>
<div><span className="k">Latest · {v.lat.label} · {v.lat.date}</span><h3>{v.lat.title}</h3>{v.lat.sum ? (<><p>{v.lat.sum}</p></>) : null}<div style={{"display": "flex", "gap": "8px"} as React.CSSProperties}><button className="btn" onClick={v.playLatest}>Play</button><a className="btn" href={v.lat.href}>Episode page</a></div></div>
</div></div></section>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}><div className="wrap">
<div className="split_head"><h2 className="display h2">Every episode</h2></div>
<div className="res_bar" style={{"paddingBottom": "10px"} as React.CSSProperties}><p className="res_n"><b>{v.nRes}</b> <span className="mono">episodes</span></p><a className="lnk k" href="/podcasts">Search the whole network →</a></div>
<div className="rows">{(v.rows || []).map((e: any, e_i: number) => (<React.Fragment key={e_i}><div className={e.cls}>
<button className="r_play" onClick={e.play} aria-label={`Play ${e.title}`} style={{"background": `${e.bg}`, "color": `${e.fg}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{e.art ? (<><img className="ph_img" src={e.art} alt="" loading="lazy" /></>) : null}<i className="r_pi" aria-hidden="true" style={{"position": "relative"} as React.CSSProperties}>▶</i></button>
<a className="r_main" href={e.href}><b>{e.title}</b><span className="mono">{e.meta}</span></a><span></span><span></span><span className="mono r_len">{e.len}</span>
</div></React.Fragment>))}</div>
{v.hasMore ? (<><div className="more" style={{"display": "flex", "justifyContent": "center", "marginTop": "28px"} as React.CSSProperties}><button className="btn" onClick={v.loadMore}>Load more</button></div></>) : null}
</div></section>
</>) : null}
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}><div className="wrap">
<div className="nw_h"><h2 className="h3">More from the network</h2><a className="lnk mono" href="/podcasts" style={{"fontSize": "10.5px", "textTransform": "uppercase", "letterSpacing": ".05em"} as React.CSSProperties}>All shows</a></div>
<hr className="rule" style={{"margin": "20px 0 24px"} as React.CSSProperties} />
<div className="nw">{(v.shows || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><a className="nw_c" href={s.href}><div className="nw_art" style={{"background": `${s.bg}`, "color": `${s.fg}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{s.art ? (<><img className="ph_img" src={s.art} alt={s.name} loading="lazy" /></>) : null}</div><div className="nw_cap"><span>{s.name}</span><span>{s.count}</span></div></a></React.Fragment>))}</div>
</div></section>


    </div>
  )
}
