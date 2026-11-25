'use client'
/* Generated from design/boards/Portal.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { PortalEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortalView(props: any) {
  const v = useDC(PortalEngine, props)
  return (
    <div className="pg-portal">
<div className="pt">

{v.isTest ? (<><div className="pdemo"><div className="wrap"><span className="k" style={{"color": "#9B978E"} as React.CSSProperties}>Test lead / made-up practice</span><span className="pdemo_r"><i className="pdraft">Uploads here never reach Smartsheet, Dropbox or notifications</i></span></div></div></>) : null}
{v.vApp ? (<>
{/* ============ PORTAL NAV ============ */}
<header className="pnav"><div className="wrap pnav_in">
<button className="pnav_who" onClick={v.goProfile}><span className="pnav_av">{v.who.ini}</span><span><b>{v.who.practice}</b><em>{v.who.name}</em></span></button>
<a className="nav_logo" href="/" onClick={v.goDash}><img src="/brand/alpha-paper.svg" alt="Alpha" /></a>
<nav className="pnav_r" aria-label="Portal">{(v.navItems || []).map((n: any, n_i: number) => (<React.Fragment key={n_i}><button className={n.cls} onClick={n.go}>{n.label}</button></React.Fragment>))}</nav>
</div></header>

{/* ============ PATHWAY TRACKER ============ */}
<section className="trk_s"><div className="wrap">
<div className="trk_top"><p className="eyebrow">Pathway to partnership</p><span className="trk_eta">{v.etaLine}</span></div>
<div className="trk" role="list" aria-label="Partnership stages">
<span className="trk_fill" style={{"width": `${v.fillW}`} as React.CSSProperties}></span>
{(v.stages || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><div className={s.cls} role="listitem" style={{"left": `${s.x}`} as React.CSSProperties} aria-current={s.cur}><i></i><span className="trk_n">{s.n}</span><span className="trk_l">{s.t}</span></div></React.Fragment>))}
</div>
</div></section>

{/* ============ DASHBOARD ============ */}
{v.vDash ? (<>
<section className="dh"><div className="wrap dh_grid">
<div>
<h1 className="display dh_t">Stage {v.cur.num}</h1>
<p className="dh_name">{v.cur.t}</p>
<p className="lede dh_d">{v.cur.d}</p>
<div className="dh_ctas"><button className="btn btn-fill" onClick={v.ctaGo}>{v.ctaLabel}</button><button className="btn" onClick={v.goProfile}>Your Alpha profile</button></div>
</div>
<div>
{v.vRing ? (<>
<div className="dh_card">
<div className="ring" style={{"--p": `${v.pct}`} as React.CSSProperties}><b>{v.recv}</b><span>of {v.total}</span></div>
<div className="dh_card_t"><p className="k" style={{"color": "#9B978E"} as React.CSSProperties}>{v.cardK}</p><p className="dh_card_h">{v.cardH}</p><p className="dh_card_s">{v.cardS}</p></div>
</div>
</>) : null}
{v.vList ? (<>
<div className="dh_card is-col">
<div><p className="k" style={{"color": "#9B978E"} as React.CSSProperties}>{v.cardK}</p><p className="dh_card_h">{v.cardH}</p><p className="dh_card_s">{v.cardS}</p></div>
<ul className="cardlist">{(v.cardRows || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><li className={r.cls}><span className={r.dot}></span><span>{r.t}</span><em>{r.s}</em></li></React.Fragment>))}</ul>
{v.vResp ? (<><div className="resp"><p>{v.respQ}</p><div className="card_ctas">{(v.respBtns || []).map((b: any, b_i: number) => (<React.Fragment key={b_i}><button className={b.cls} onClick={b.go}>{b.t}</button></React.Fragment>))}</div></div></>) : null}
{v.vCardCta ? (<><div className="card_ctas"><button className="btn btn-fill" onClick={v.cardGo}>{v.cardCta}</button></div></>) : null}
</div>
</>) : null}
</div>
</div></section>

{/* diligence tracker (stage 7+) */}
{v.vDil ? (<>
<section className="dsec"><div className="wrap">
<div className="sec_h"><p className="eyebrow">Diligence tracker</p></div>
<p className="prof_line">One shared Dropbox data room for you, your attorney and your accountant. Requests show up here as they come in.</p>
<div className="dil">{(v.dil || []).map((d: any, d_i: number) => (<React.Fragment key={d_i}><div className={d.cls}><span>{d.n}</span><div><b>{d.t}</b><span className="dil_who">{d.who}</span></div><span className="dil_who">{d.what}</span><div><span className="dil_bar"><i style={{"width": `${d.pct}`} as React.CSSProperties}></i></span><span className="dil_s">{d.s}</span></div><span className="dil_ms">{d.ms}</span></div></React.Fragment>))}</div>
</div></section>
</>) : null}

<section className="dsec"><div className="wrap dgrid">
<div className="guide">
<p className="eyebrow">Your guide</p>
<div className="guide_who"><span className="guide_img">{v.g.ini}</span><div><b>{v.g.name}</b><span>{v.g.role}</span></div></div>
<p className="guide_msg">“{v.g.msg}”</p>
<div className="guide_ctas">{v.g.book ? (<><a className="btn" href={v.g.book}>Book 30 minutes</a></>) : null}{v.g.email ? (<><a className="btn" href={v.g.mail}>Message {v.g.first}</a></>) : null}</div>
</div>
<div className="story">
<p className="eyebrow">From a partner who did this</p>
<div className="story_v"><span className="ph">Founder interview clip</span><button className="play" aria-label="Play"><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z" fill="currentColor"></path></svg></button></div>
<p className="story_c"><b>Michelle Paty, Preva Aesthetics</b>On getting her financials together. [Verbatim clip from her interview, matched to stage 3.]</p>
</div>
</div></section>

<section className="dsec"><div className="wrap dgrid">
<div>
<div className="sec_h"><p className="eyebrow">Needs your attention</p><span className="k" style={{"color": "#9B978E"} as React.CSSProperties}>{v.attnCount}</span></div>
<div className="attn">{(v.attn || []).map((a: any, a_i: number) => (<React.Fragment key={a_i}><button className="attn_i" onClick={v.goStage}><span className={a.dot}></span><span><b>{a.t}</b><em>{a.n}</em></span><span className="attn_go" aria-hidden="true">→</span></button></React.Fragment>))}</div>
<div className="sec_h" style={{"marginTop": "56px"} as React.CSSProperties}><p className="eyebrow">Activity</p></div>
<ul className="feed">{(v.feed || []).map((f: any, f_i: number) => (<React.Fragment key={f_i}><li><span className="k" style={{"color": "#9B978E"} as React.CSSProperties}>{f.w}</span><span>{f.t}</span></li></React.Fragment>))}</ul>
</div>
<div className="prof_card">
<div className="sec_h"><p className="eyebrow">Your Alpha profile</p><span className="k" style={{"color": "#9B978E"} as React.CSSProperties}>{v.profPct} complete</span></div>
<div className="pbar"><i style={{"width": `${v.profPct}`} as React.CSSProperties}></i></div>
<p className="prof_line">This becomes your brand page when you join the network. Nothing publishes until you and Alpha approve it.</p>
<div className="pmini">
<div className="pmini_hero"><span className="pmini_pill">Draft</span><b>{v.who.practice}</b><span className="pmini_meta">{v.who.name} / {v.svcLine}</span></div>
<div className="pmini_rows"><span>Practice story</span><em className="is-miss">To do</em><span>Founder photo</span><em className="is-miss">To do</em><span>Location photos</span><em className="is-miss">To do</em><span>Why Alpha</span><em className="is-miss">To do</em></div>
</div>
<button className="btn" style={{"marginTop": "22px"} as React.CSSProperties} onClick={v.goProfile}>Continue profile</button>
</div>
</div></section>
</>) : null}

{/* ============ STAGE ============ */}
{v.vStage ? (<>
<section className="st_h"><div className="wrap dh_grid">
<div><h1 className="display dh_t">Stage {v.fin.num}</h1><p className="dh_name">{v.fin.t}</p></div>
<p className="lede dh_d" style={{"marginTop": "8px"} as React.CSSProperties}>{v.fin.d}</p>
</div></section>

<section className="dsec flush"><div className="wrap">
<div className="st_v"><span className="ph">Financials walkthrough / 2 min</span><button className="play" aria-label="Play stage walkthrough"><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z" fill="currentColor"></path></svg></button></div>
</div></section>

<section className="dsec"><div className="wrap st_grid">
<aside className="st_side">
<p className="eyebrow">Checklist</p>
<div className="st_count"><b>{v.recv}</b><span>/ {v.total} received</span></div>
<div className="pbar"><i style={{"width": `${v.pct100}`} as React.CSSProperties}></i></div>
<ul className="legend"><li><span className="dot is-ok"></span>Approved <em>{v.nOk}</em></li><li><span className="dot is-rev"></span>In review <em>{v.nRev}</em></li><li><span className="dot is-fix"></span>Needs changes <em>{v.nFix}</em></li><li><span className="dot"></span>To do <em>{v.nTodo}</em></li></ul>
<p className="st_note">Excel files only, straight from your software, no edits. Payroll and the balance sheet can be PDFs. Everything lands in a private deal folder only you and the New Partnerships team can open, and a person reviews every file.</p>
{v.canSubmit ? (<><button className="btn btn-fill st_submit" onClick={v.submit}>Send financials to {v.g.first}</button></>) : null}
{v.cantSubmit ? (<><button className="btn st_submit is-off" disabled>Send financials to {v.g.first}</button><p className="st_hint">{v.submitHint}</p></>) : null}
{v.submitted ? (<><p className="st_done"><b>Sent to {v.g.first}.</b> Each file gets a look from a person. When all six are approved, Preston starts your pro forma.</p></>) : null}
</aside>
<div className="cl">
{(v.groups || []).map((g: any, g_i: number) => (<React.Fragment key={g_i}>
<div className="cl_g">
<p className="cl_gh"><span>{g.t}</span><em>{g.c}</em></p>
{(g.items || []).map((it: any, it_i: number) => (<React.Fragment key={it_i}>
<div className={it.cls}>
<span className={it.dot}></span>
<div className="cl_t"><b>{it.t}</b><span>{it.sub}</span><div className="cl_meta"><span className="cl_fmt">{it.fmt}</span><button className="cl_tipb" onClick={it.tipGo}>{it.tipL}</button></div>{it.tipOn ? (<><ol className="cl_tip">{(it.tips || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><li>{p}</li></React.Fragment>))}</ol></>) : null}{it.chk ? (<><p className="cl_chk"><em>Claude check</em>{it.chk}</p></>) : null}{it.note ? (<><p className="cl_note"><em>{g.first}</em>{it.note}</p></>) : null}{it.err ? (<><p className="cl_note"><em>Upload</em>{it.err}</p></>) : null}{it.up ? (<><span className="cl_prog"><i></i></span></>) : null}</div>
<span className="cl_s">{it.label}</span>
{it.act ? (<><button className="btn cl_b" onClick={it.go}>{it.act}</button></>) : null}
</div>
</React.Fragment>))}
</div>
</React.Fragment>))}
</div>
</div></section>
</>) : null}

{/* ============ PROFILE ============ */}
{v.vProfile ? (<>
<section className="st_h"><div className="wrap dh_grid">
<div><h1 className="display dh_t">Your profile</h1><p className="dh_name">Becomes your brand page at launch</p></div>
<p className="lede dh_d" style={{"marginTop": "8px"} as React.CSSProperties}>Write it in your words. We'll pull quotes from your interview, tighten the copy with you, and nothing goes live until you approve it.</p>
</div></section>
<section className="dsec flush"><div className="wrap pf_grid">
<div className="pf">
<div className="pf_s"><p className="pf_h"><span>01</span>Practice</p><div className="fields"><div className="field"><label htmlFor="p1">Practice name</label><input id="p1" type="text" defaultValue={v.who.practice} /></div><div className="field"><label htmlFor="p2">Opened</label><input id="p2" type="text" defaultValue="" /></div><div className="field" style={{"gridColumn": "1 / -1"} as React.CSSProperties}><label>Services</label><div className="chips">{(v.svc || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}><button className={c.cls} onClick={c.go}>{c.t}</button></React.Fragment>))}</div></div></div></div>
<div className="pf_s"><p className="pf_h"><span>02</span>Founder</p><div className="pf_founder"><button className="drop"><b>Headshot</b><span>Drop a photo or browse. At least 2400px on the long edge.</span></button><div className="fields" style={{"gridTemplateColumns": "1fr"} as React.CSSProperties}><div className="field"><label htmlFor="p3">Name</label><input id="p3" type="text" defaultValue={v.who.name} /></div><div className="field"><label htmlFor="p4">Credentials</label><input id="p4" type="text" defaultValue="" /></div></div></div></div>
<div className="pf_s"><p className="pf_h"><span>03</span>In your words</p><div className="fields" style={{"gridTemplateColumns": "1fr"} as React.CSSProperties}><div className="field"><label htmlFor="p5">Why did you start the practice?</label><textarea id="p5"></textarea></div><div className="field"><label htmlFor="p6">What do patients say about you that you're proudest of?</label><textarea id="p6"></textarea></div><div className="field"><label htmlFor="p7">Why Alpha, and why now?</label><textarea id="p7"></textarea></div></div></div>
<div className="pf_s"><p className="pf_h"><span>04</span>Locations</p><div className="pf_locs"><button className="pf_add">+ Add a location</button></div></div>
</div>
<aside className="pf_prev">
<p className="eyebrow">Preview</p>
<div className="pmini ppmini_lg">
<div className="pmini_hero"><span className="pmini_pill">Draft</span><b>{v.who.practice}</b><span className="pmini_meta">{v.who.name} / {v.svcLine}</span></div>
<div className="pmini_body"><span className="pmini_k">The practice</span><p>Your story goes here, in your words.</p></div>
</div>
<p className="st_note">A preview for now. Profile editing saves once your guide opens it up.</p>
</aside>
</div></section>
</>) : null}

<footer className="pfoot"><div className="wrap pfoot_in"><span>Confidential. Shared under NDA between {v.who.practice} and Alpha Aesthetics Partners.</span><span><a href="/legal/privacy">Privacy</a></span></div></footer>
</>) : null}

{/* ============ MILESTONE MOMENT ============ */}
{v.msOn ? (<>
<div className="mso" role="dialog" aria-modal="true" aria-label={v.ms.k}>
<div className="mso_rays" aria-hidden="true">{(v.msRays || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><span style={{"--r": `${r.r}`, "--d": `${r.d}`} as React.CSSProperties}></span></React.Fragment>))}</div>
<div className="mso_in"><div className="mso_n">{v.ms.n}</div><p className="mso_k">{v.ms.k}</p><p className="mso_t">{v.ms.t}</p><p className="mso_s">{v.ms.s}</p><div className="mso_pips">{(v.msPips || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><i className={p.cls}></i></React.Fragment>))}</div><button className="btn btn-fill" onClick={v.msClose}>Continue</button></div>
</div>
</>) : null}
</div>
    </div>
  )
}
