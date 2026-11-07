'use client'
/* Generated from design/boards/Locations.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { LocationsEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LocationsView(props: any) {
  const v = useDC(LocationsEngine, props)
  return (
    <div className="pg-locations">

<Nav dark></Nav>

{/* ============ MAP: every location ============ */}
<section className="dmap dark" ref={v.setMap} aria-label="Partner map">
<canvas className="map_cv" ref={v.setCanvas} onMouseMove={v.onMove} onMouseLeave={v.onLeave} onClick={v.onClick} style={{"cursor": `${v.cursor}`} as React.CSSProperties} aria-hidden="true"></canvas>
<div className="map_fade2" aria-hidden="true"></div>
<div className="wrap dmap_head">
<div><p className="eyebrow">The portfolio</p><h1 className="display dmap_t">Every partner,<br />on one map</h1></div>
<p className="mono dmap_hint">{v.hint}</p>
</div>
{v.hasTip ? (<>
<div className="tip" style={{"left": `${v.tip.x}px`, "top": `${v.tip.y}px`} as React.CSSProperties}><b className="mono">{v.tip.t}</b><span>{v.tip.s}</span><em className="mono">{v.tip.cta}</em></div>
</>) : null}
<div className={v.pinCls} aria-hidden="true"><svg viewBox="0 0 34 46"><path d="M17 1C8.2 1 1 8 1 16.8 1 28.6 17 45 17 45s16-16.4 16-28.2C33 8 25.8 1 17 1z" fill="#E8E4DA"></path><circle cx="17" cy="16.5" r="6" fill="#151513"></circle></svg></div>
<div className={v.routeCls} aria-hidden="true">{v.route}</div>
{v.hasSel ? (<>
<aside className={v.panelCls} aria-label={`${v.sel.brand}, ${v.sel.city}`}>
<button className="mono pan_back" onClick={v.home}>← All locations</button>
{v.sel.photo ? (<><div className="pan_img ph" style={{"background": `${v.sel.tone}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{v.sel.img ? (<><img className="ph_img" src={v.sel.img} alt="" /></>) : null}</div></>) : null}
<span className="mono pan_k">PTR {v.sel.n} · {v.sel.st}</span>
<h2 className="pan_t">{v.sel.brand}</h2>
<p className="pan_a">{v.sel.a1}<br />{v.sel.a2}</p>
<dl className="pan_dl">{v.sel.founder ? (<><div className="pan_f"><dt className="mono">Founder</dt><dd>{v.sel.founder}</dd></div></>) : null}{v.sel.rating ? (<><div><dt className="mono">Google</dt><dd>{v.sel.rating}</dd></div></>) : null}<div><dt className="mono">Partner since</dt><dd>{v.sel.since}</dd></div><div><dt className="mono">Locations</dt><dd>{v.sel.locs}</dd></div><div><dt className="mono">Est</dt><dd>{v.sel.est}</dd></div></dl>
<div className="pan_ctas"><a className="btn" href={v.sel.href}>Location page</a><a className="btn" href={v.sel.brandHref}>Brand</a></div>
{v.sel.hasSib ? (<><button className="mono pan_sib" onClick={v.sel.nextSib}>Next {v.sel.brandShort} location →</button></>) : null}
</aside>
</>) : null}
</section>

{/* ============ STATS (live with the filters below) ============ */}
<section className="dstats dark">
<div className="wrap">
<div className="stats dk">
{(v.stats || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}>
<div className="stat"><span className="stat_k">{s.k}</span><span className="stat_n">{s.n}</span><span className="stat_l">{s.l}</span><div className="rows">{(s.rows || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><div className="row"><span>{r.k}</span><b>{r.v}</b></div></React.Fragment>))}</div></div>
</React.Fragment>))}
</div>
<p className="mono dstats_note">{v.statsNote}</p>
</div>
</section>

{/* ============ DIRECTORY ============ */}
<section className="sec" id="directory">
<div className="wrap">
<div className="split_head"><h2 className="display h2">Location directory</h2><p className="body" style={{"margin": "0", "maxWidth": "24rem"} as React.CSSProperties}>Filter by state or brand. The map and the numbers above follow along.</p></div>
<div className="dbar">
<label className="search"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="6" cy="6" r="4.6" stroke="currentColor" fill="none" strokeWidth="1.3"></circle><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3"></path></svg><input type="search" placeholder="City, brand or zip" value={v.q} onInput={v.onQ} aria-label="Search locations" /></label>
<label className="sel mono"><span>Brand</span><select onChange={v.onBrand} value={v.brandVal} aria-label="Brand">{(v.brandOpts || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><option value={o.v}>{o.t}</option></React.Fragment>))}</select></label>
<div className="sort mono"><span>Sort</span>{(v.sorts || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><button className={o.cls} onClick={o.go}>{o.t}</button></React.Fragment>))}</div>
</div>
<div className="schips">{(v.stateChips || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}><button className={c.cls} onClick={c.go}>{c.t}<span>{c.n}</span></button></React.Fragment>))}</div>
<div className="dres mono"><span><b>{v.nRes}</b> locations</span>{v.hasF ? (<><button onClick={v.clear}>Clear filters</button><button onClick={v.share}>{v.shareLabel}</button></>) : null}</div>
{(v.groups || []).map((g: any, g_i: number) => (<React.Fragment key={g_i}>
<div className="dgroup">
{g.hasHead ? (<><h3 className="dg_h mono">{g.t} <span>{g.n}</span></h3></>) : null}
<div className="dgrid">
{(g.items || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}>
<div className={c.cls}>
<a className="lc_img ph" href={c.href} style={{"background": `${c.tone}`, "position": "relative", "overflow": "hidden"} as React.CSSProperties}>{c.img ? (<><img className="ph_img" src={c.img} alt="" loading="lazy" /></>) : null}{c.noPhoto ? (<>{c.city}</>) : null}{c.still ? (<><img className="lc_still" src={c.still} alt="" /></>) : null}</a>
<div className="lc_txt">
<a className="lc_b mono" href={c.brandHref}>{c.brand}</a><a className="lc_go mono" href={c.href} aria-label={`View ${c.brand} ${c.city}`}>Location <i>→</i></a>
<span className="lc_a">{c.a1}<br />{c.a2}</span>
<span className="card_marks"><i className={`state s-${c.st}`} title={c.st}>{c.st}</i><span className="amark" aria-hidden="true"></span><span className="est"><small>EST</small>{c.est}</span>{c.origin ? (<><span className="lc_or mono">{c.origin}</span></>) : null}</span>
</div>
<button className="lc_map mono" onClick={c.map} aria-label={`Show ${c.brand} ${c.city} on the map`}>Map</button>
</div>
</React.Fragment>))}
</div>
</div>
</React.Fragment>))}
{v.empty ? (<><p className="body" style={{"padding": "40px 0"} as React.CSSProperties}>No locations match. <button className="mono lnk" onClick={v.clear}>Clear filters</button></p></>) : null}
</div>
</section>

{/* ============ FOUNDERS ============ */}
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<div className="split_head"><h2 className="display h2">Founder partners</h2><p className="body" style={{"margin": "0", "maxWidth": "24rem"} as React.CSSProperties}>The people who built these practices, and still lead them.</p></div>
<div className="fgrid">
{(v.founders || []).map((f: any, f_i: number) => (<React.Fragment key={f_i}><a className={f.cls} href={f.href}><span className="fav">{f.hasImg ? (<><img src={f.img} alt={f.name} /></>) : null}{f.noImg ? (<>{f.init}</>) : null}</span><b className="mono">{f.name}</b><span className="mono f_c">{f.cred}</span><span className="f_b">{f.brand} · {f.city}</span><span className="mono f_go" aria-hidden="true">Profile <i>→</i></span></a></React.Fragment>))}
</div>
</div>
</section>

{/* ============ BRANDS ============ */}
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<div className="split_head"><h2 className="display h2">Partner brands</h2><p className="body" style={{"margin": "0", "maxWidth": "24rem"} as React.CSSProperties}>Fifteen brands, each kept intact. Numbered in the order they joined.</p></div>
<div className="bgrid">
{(v.brands || []).map((b: any, b_i: number) => (<React.Fragment key={b_i}><a className={b.cls} href={b.href} style={{"background": `${b.tone}`} as React.CSSProperties}><span className="mono bt_n">PTR {b.n}</span><span className="bt_name">{b.name}</span><span className="mono bt_m">{b.locs} · {b.states}</span><span className="mono bt_go">View brand →</span></a></React.Fragment>))}
</div>
</div>
</section>



    </div>
  )
}
