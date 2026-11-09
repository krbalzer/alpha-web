'use client'
/* Generated from design/boards/Podcasts.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { PodcastsEngine } from './engine'
import { QueueBtn } from '@/components/site/QueueBtn'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PodcastsView(props: any) {
  const v = useDC(PodcastsEngine, props)
  return (
    <div className="pg-podcasts">

<Nav dark></Nav>

{/* ============ FEATURED: TV-style hero ============ */}
<section className="tv dark" onMouseEnter={v.pause} onMouseLeave={v.resume} aria-roledescription="carousel" aria-label="Featured shows">
{(v.slides || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}>
<div className={s.cls} style={{"background": `${s.bg}`} as React.CSSProperties} aria-hidden={s.hidden}>
{s.hero ? (<><img className="tv_bg" src={s.hero} alt="" /></>) : null}{s.art ? (<><img className="tv_img" src={s.art} alt="" /></>) : null}{s.noArt ? (<><span className="tv_art" style={{"color": `${s.fg}`} as React.CSSProperties}>{s.short}</span></>) : null}
</div>
</React.Fragment>))}
<div className="tv_scrim" aria-hidden="true"></div>
<div className="wrap tv_in">
<div className={v.heroTxtCls}>
<p className="mono tv_k">{v.hs.sched}</p>
<h1 className="tv_t">{v.hs.logo ? (<><span className="tv_logo" role="img" aria-label={v.hs.name} style={{"--logo": `url(${v.hs.logo})`, "--ar": `${v.hs.ar}`} as React.CSSProperties}></span></>) : null}{v.hs.noLogo ? (<>{v.hs.name}</>) : null}</h1>
<p className="tv_d">{v.hs.tag}</p>
{v.hs.ep.title ? (<><p className="mono tv_latest"><span>Latest</span>{v.hs.ep.label}</p></>) : null}
<div className="tv_ctas"><button className="tv_play" onClick={v.hs.play}><svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true"><path d="M0 0l11 6.5L0 13z" fill="currentColor"></path></svg>Play latest</button><a className="btn" href={v.hs.href}>All episodes</a><span className="mono tv_hosts">{v.hs.hosts}</span></div>
</div>
</div>
</section>

{/* shelf overlaps the hero: it is the carousel's index */}
<section className="shelf_wrap">
<div className="wrap">
<div className="shelf_head mono"><span>Alpha podcast network</span><span>{v.showCount} shows · {v.epCount} episodes</span></div>
<div className="shelf">
{(v.shelf || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}>
<button className={s.cls} onClick={s.go} style={{"background": `${s.bg}`, "color": `${s.fg}`} as React.CSSProperties}>
{s.logo ? (<><span className="sh_logo" role="img" aria-label={s.short} style={{"--logo": `url(${s.logo})`, "--ar": `${s.ar}`} as React.CSSProperties}></span></>) : null}{s.noLogo ? (<><span className="sh_t">{s.short}</span></>) : null}
<span className="sh_s mono">{s.sched}</span>
<i className="sh_bar"><i style={{"width": `${s.prog}%`} as React.CSSProperties}></i></i>
</button>
</React.Fragment>))}
</div>
</div>
</section>

{/* ============ EPISODE DATABASE ============ */}
<section className="db" id="database">
<div className="wrap">
<div className="db_head">
<div><p className="eyebrow">Episode database</p><h2 className="display h2">What the network<br />knows, searchable.</h2></div>
<p className="lede" style={{"margin": "0"} as React.CSSProperties}>Every episode is tagged by topic, by who it&#39;s for and by who&#39;s talking. Stack filters to find the conversation you need, then share the exact list.</p>
</div>

{v.hasPaths ? (<><div className="paths"><span className="mono paths_k">Start with a path</span>{(v.paths || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><button className={p.cls} onClick={p.go}>{p.t}</button></React.Fragment>))}</div></>) : null}

<div className="db_grid">
{/* filter rail */}
<aside className={v.railCls} aria-label="Filters">
<div className="rail_top"><span className="mono">Filters</span><button className="mono rail_x" onClick={v.closeRail}>Done</button></div>
<label className="search"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="6" cy="6" r="4.6" stroke="currentColor" fill="none" strokeWidth="1.3"></circle><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3"></path></svg><input type="search" placeholder="Search titles, guests, topics" value={v.q} onInput={v.onQ} aria-label="Search episodes" /></label>
{(v.groups || []).map((g: any, g_i: number) => (<React.Fragment key={g_i}>
<div className="fg">
<button className="fg_h mono" onClick={g.toggle} aria-expanded={g.exp}><span>{g.t}</span><span>{g.badge}</span></button>
{g.open ? (<>
<div className={g.listCls}>
{(g.opts || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><button className={o.cls} onClick={o.go} aria-pressed={o.on} disabled={o.dis}><i className="cb" aria-hidden="true"></i><span className={o.faceCls}>{o.img ? (<><img src={o.img} alt="" loading="lazy" /></>) : null}{o.init}</span><span className="o_t">{o.t}</span><span className="o_n mono">{o.n}</span></button></React.Fragment>))}
</div>
</>) : null}
</div>
</React.Fragment>))}
</aside>

{/* results */}
<div className="res">
<div className="res_bar">
<button className="btn rail_open" onClick={v.openRail}>Filters {v.activeCountLabel}</button>
<p className="res_n"><b>{v.nRes}</b> <span className="mono">{v.nResLabel}</span></p>
<div className="sort mono"><span>Sort</span>{(v.sorts || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><button className={o.cls} onClick={o.go}>{o.t}</button></React.Fragment>))}</div>
</div>
{v.hasActive ? (<>
<div className="active">{(v.active || []).map((a: any, a_i: number) => (<React.Fragment key={a_i}><button className="act mono" onClick={a.go}><span>{a.k}</span>{a.t}<i aria-hidden="true">×</i></button></React.Fragment>))}<button className="mono act_clear" onClick={v.clearAll}>Clear all</button><button className="mono act_share" onClick={v.share}>{v.shareLabel}</button></div>
</>) : null}

<div className="rows">
{(v.rows || []).map((e: any, e_i: number) => (<React.Fragment key={e_i}>
<div className={e.cls}>
<button className="r_play" onClick={e.play} aria-label={`Play ${e.title}`} style={{"background": `${e.bg}`, "color": `${e.fg}`} as React.CSSProperties}>{e.art ? (<><img className="ph_img" src={e.art} alt="" loading="lazy" /></>) : null}<span className="r_art">{e.artText}</span><i className="r_pi" aria-hidden="true">{e.icon}</i></button>
<a className="r_main" href={e.href}><b>{e.title}</b><span className="mono">{e.meta}</span></a>
<span className="r_spk">{(e.spk || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><button className="face" onClick={p.go} title={p.name}>{p.img ? (<><img src={p.img} alt="" loading="lazy" /></>) : null}{p.init}</button></React.Fragment>))}</span>
<span className="r_tags">{(e.tags || []).map((t: any, t_i: number) => (<React.Fragment key={t_i}><button className={t.cls} onClick={t.go}>{t.t}</button></React.Fragment>))}</span>
<span className="r_end"><QueueBtn ep={e.ep}></QueueBtn><span className="mono r_len">{e.len}</span></span>
</div>
</React.Fragment>))}
{v.empty ? (<>
<div className="empty"><b>No episodes match all of that.</b><p>Try removing <button className="mono" onClick={v.dropLast}>{v.lastLabel}</button> or <button className="mono" onClick={v.clearAll}>clear everything</button>.</p></div>
</>) : null}
</div>
{v.hasMore ? (<><div className="more"><span className="mono">Showing {v.shownN} of {v.nRes}</span><button className="btn" onClick={v.loadMore}>Load more</button></div></>) : null}



</div>
</div>
</div>
</section>



    </div>
  )
}
