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


{/* ============ DEMO BAR (board only) ============ */}
<div className="pdemo"><div className="wrap">
<span className="k" style={{"color": "#9B978E"} as React.CSSProperties}>Partner portal / post-NDA</span>
<div className="pdemo_tabs">{(v.tabs || []).map((t: any, t_i: number) => (<React.Fragment key={t_i}><button className={t.cls} onClick={t.go}>{t.label}</button></React.Fragment>))}</div>
<span className="pdemo_r"><button className="chipb" onClick={v.fillAll}>Simulate: all received</button><button className="chipb" onClick={v.resetAll}>Reset</button><i className="pdraft">Stand-in stages + copy</i></span>
</div></div>

{/* ============ SIGN IN ============ */}
{v.vSignin ? (<>
<section className="si">
<div className="si_in">
<img className="si_logo" src="/brand/alpha-paper.svg" alt="Alpha" />
<p className="eyebrow" style={{"color": "#9B978E"} as React.CSSProperties}>Partner portal</p>
<h1 className="display si_t">Welcome back,<br />Jordan.</h1>
{v.siForm ? (<>
<div className="field si_f"><label htmlFor="si-e">Email</label><input id="si-e" type="email" value="jordan@harborskin.co" autoComplete="email" /></div>
<button className="btn btn-fill si_b" onClick={v.siSend}>Email me a sign-in link</button>
<p className="si_n">No password. The link works once and expires in 15 minutes.</p>
</>) : null}
{v.siSent ? (<>
<p className="si_ok"><b>Check your inbox.</b> We sent a link to jordan@harborskin.co. Open it on this device.</p>
<button className="ulink" style={{"background": "none", "borderTop": "0", "borderLeft": "0", "borderRight": "0", "cursor": "pointer", "color": "#E8E4DA"} as React.CSSProperties} onClick={v.siOpen}>Open the link (demo)</button>
</>) : null}
<p className="si_conf">Shared under NDA. Everything here is confidential to you and Alpha.</p>
</div>
</section>
</>) : null}

{v.vApp ? (<>
{/* ============ PORTAL NAV ============ */}
<header className="pnav"><div className="wrap pnav_in">
<button className="pnav_who" onClick={v.goProfile}><span className="pnav_av">HS</span><span><b>Harbor Skin Co.</b><em>Jordan Ellis</em></span></button>
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
<div className="dh_ctas"><button className="btn btn-fill" onClick={v.goStage}>{v.ctaLabel}</button><button className="btn" onClick={v.goProfile}>Your Alpha profile</button></div>
</div>
<div className="dh_card">
<div className="ring" style={{"--p": `${v.pct}`} as React.CSSProperties}><b>{v.recv}</b><span>of {v.total}</span></div>
<div className="dh_card_t"><p className="k" style={{"color": "#9B978E"} as React.CSSProperties}>{v.cardK}</p><p className="dh_card_h">{v.cardH}</p><p className="dh_card_s">{v.cardS}</p></div>
</div>
</div></section>

<section className="dsec"><div className="wrap dgrid">
<div className="guide">
<p className="eyebrow">Your guide</p>
<div className="guide_who"><span className="guide_img">TR</span><div><b>Tyler [Last name]</b><span>New Partnerships</span></div></div>
<p className="guide_msg">“[Short note from Tyler for this stage. Recorded or written. What to focus on this week, and that it's normal for financials to take a couple of passes.]”</p>
<div className="guide_ctas"><a className="btn" href="#book">Book 30 minutes</a><a className="btn" href="#msg">Message Tyler</a></div>
</div>
<div className="story">
<p className="eyebrow">From a partner who did this</p>
<div className="story_v"><span className="ph">Founder interview clip / Cloudflare Stream, loads on play</span><button className="play" aria-label="Play"><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z" fill="currentColor"></path></svg></button></div>
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
<div className="pmini_hero"><span className="pmini_pill">PTR 0[17]</span><b>Harbor Skin Co.</b><span className="pmini_meta">[Address] / Jordan Ellis, NP-C / Injectables Lasers Skincare</span></div>
<div className="pmini_rows"><span>Practice story</span><em>Started</em><span>Founder photo</span><em className="is-miss">Missing</em><span>Location photos</span><em className="is-miss">0 of 2</em><span>Why Alpha</span><em>Started</em></div>
</div>
<button className="btn" style={{"marginTop": "22px"} as React.CSSProperties} onClick={v.goProfile}>Continue profile</button>
</div>
</div></section>
</>) : null}

{/* ============ STAGE ============ */}
{v.vStage ? (<>
<section className="st_h"><div className="wrap dh_grid">
<div><h1 className="display dh_t">Stage {v.cur.num}</h1><p className="dh_name">{v.cur.t}</p></div>
<p className="lede dh_d" style={{"marginTop": "8px"} as React.CSSProperties}>{v.cur.d}</p>
</div></section>

<section className="dsec flush"><div className="wrap">
<div className="st_v"><span className="ph">Stage 3 walkthrough / Tyler, 2 min / Cloudflare Stream</span><button className="play" aria-label="Play stage walkthrough"><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z" fill="currentColor"></path></svg></button></div>
</div></section>

<section className="dsec"><div className="wrap st_grid">
<aside className="st_side">
<p className="eyebrow">Checklist</p>
<div className="st_count"><b>{v.recv}</b><span>/ {v.total} received</span></div>
<div className="pbar"><i style={{"width": `${v.pct100}`} as React.CSSProperties}></i></div>
<ul className="legend"><li><span className="dot is-ok"></span>Approved <em>{v.nOk}</em></li><li><span className="dot is-rev"></span>In review <em>{v.nRev}</em></li><li><span className="dot is-fix"></span>Needs changes <em>{v.nFix}</em></li><li><span className="dot"></span>To do <em>{v.nTodo}</em></li></ul>
<p className="st_note">Files go straight to a private folder only you and the New Partnerships team can open. Each one is reviewed by a person.</p>
{v.canSubmit ? (<><button className="btn btn-fill st_submit" onClick={v.submit}>Send stage {v.cur.num} for review</button></>) : null}
{v.cantSubmit ? (<><button className="btn st_submit is-off" disabled>Send for review</button><p className="st_hint">{v.submitHint}</p></>) : null}
{v.submitted ? (<><p className="st_done"><b>Sent to Tyler.</b> You'll hear back within [2 business days]. Stage 4 unlocks when it's approved.</p></>) : null}
</aside>
<div className="cl">
{(v.groups || []).map((g: any, g_i: number) => (<React.Fragment key={g_i}>
<div className="cl_g">
<p className="cl_gh"><span>{g.t}</span><em>{g.c}</em></p>
{(g.items || []).map((it: any, it_i: number) => (<React.Fragment key={it_i}>
<div className={it.cls}>
<span className={it.dot}></span>
<div className="cl_t"><b>{it.t}</b><span>{it.sub}</span>{it.note ? (<><p className="cl_note"><em>Tyler</em>{it.note}</p></>) : null}{it.up ? (<><span className="cl_prog"><i></i></span></>) : null}</div>
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
<div className="pf_s"><p className="pf_h"><span>01</span>Practice</p><div className="fields"><div className="field"><label htmlFor="p1">Practice name</label><input id="p1" type="text" value="Harbor Skin Co." /></div><div className="field"><label htmlFor="p2">Opened</label><input id="p2" type="text" value="2017" /></div><div className="field" style={{"gridColumn": "1 / -1"} as React.CSSProperties}><label>Services</label><div className="chips">{(v.svc || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}><button className={c.cls} onClick={c.go}>{c.t}</button></React.Fragment>))}</div></div></div></div>
<div className="pf_s"><p className="pf_h"><span>02</span>Founder</p><div className="pf_founder"><button className="drop"><b>Headshot</b><span>Drop a photo or browse. At least 2400px on the long edge.</span></button><div className="fields" style={{"gridTemplateColumns": "1fr"} as React.CSSProperties}><div className="field"><label htmlFor="p3">Name</label><input id="p3" type="text" value="Jordan Ellis" /></div><div className="field"><label htmlFor="p4">Credentials</label><input id="p4" type="text" value="MSN, NP-C" /></div></div></div></div>
<div className="pf_s"><p className="pf_h"><span>03</span>In your words</p><div className="fields" style={{"gridTemplateColumns": "1fr"} as React.CSSProperties}><div className="field"><label htmlFor="p5">Why did you start the practice?</label><textarea id="p5">[Started. Two sentences in.]</textarea></div><div className="field"><label htmlFor="p6">What do patients say about you that you're proudest of?</label><textarea id="p6"></textarea></div><div className="field"><label htmlFor="p7">Why Alpha, and why now?</label><textarea id="p7"></textarea></div></div></div>
<div className="pf_s"><p className="pf_h"><span>04</span>Locations</p><div className="pf_locs">{(v.locs || []).map((l: any, l_i: number) => (<React.Fragment key={l_i}><div className="pf_loc"><b>{l.city}</b><span>{l.a}</span><em className={l.cls}>{l.ph}</em></div></React.Fragment>))}<button className="pf_add">+ Add a location</button></div></div>
</div>
<aside className="pf_prev">
<p className="eyebrow">Preview</p>
<div className="pmini ppmini_lg">
<div className="pmini_hero"><span className="pmini_pill">PTR 0[17]</span><b>Harbor Skin Co.</b><span className="pmini_meta">[Address] / Jordan Ellis, MSN, NP-C / {v.svcLine}</span></div>
<div className="pmini_body"><span className="pmini_k">The practice</span><p>[Started. Two sentences in.]</p></div>
</div>
<p className="st_note">Saved as you type. Last saved [just now].</p>
</aside>
</div></section>
</>) : null}

<footer className="pfoot"><div className="wrap pfoot_in"><span>Confidential. Shared under NDA between Harbor Skin Co. and Alpha Aesthetics Partners.</span><span><a href="#security">How we protect your files</a> · <a href="/legal/privacy">Privacy</a> · <button className="ulink" style={{"background": "none", "borderTop": "0", "borderLeft": "0", "borderRight": "0", "cursor": "pointer", "color": "inherit", "padding": "0 0 2px"} as React.CSSProperties} onClick={v.signOut}>Sign out</button></span></div></footer>
</>) : null}

    </div>
  )
}
