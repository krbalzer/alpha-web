'use client'
/* Generated from design/boards/University.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { UniversityEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UniversityView(props: any) {
  const v = useDC(UniversityEngine, props)
  return (
    <div className="pg-university">


<Nav></Nav>

{/* ============ 1 / HERO ============ */}
<section className="hero">
<div className="hero_vid" aria-hidden="true"><video src="/university/hero.mp4" poster="/university/hero-poster.jpg" autoPlay muted loop playsInline preload="auto"></video></div>
<div className="hero_in">
<h1 className="sr">Alpha Aesthetics University: training excellence in aesthetics</h1>
<img className="hero_seal" src="/university/seal.svg" alt="" aria-hidden="true" />
<div className="hero_ctas"><a className="btn btn_fill" href="#roles">Find your role</a><a className="btn" href="https://alphaaesthetics.university">Member sign in</a></div>
</div>
</section>

{/* SCOREBOARD: slow ticker, live numbers from the Loops sync and Labs log */}
<div className="band" aria-label="Alpha University this week">
<div className="band_t"><span>AIM sessions <b>{v.d.aimN}</b></span><i>★</i><span>Labs since 2024 <b>{v.d.labsN}</b></span><i>★</i><span>AIM Season <b>{v.d.seasonN}</b></span><i>★</i><span>Podcast episodes <b>{v.d.eps}</b></span><i>★</i><span>Masters <b>{v.d.masters}</b></span><i>★</i><span>Est. <b>2023</b></span><i>★</i><span>Simul fortes</span><i>★</i><span>AIM sessions <b>{v.d.aimN}</b></span><i>★</i><span>Labs since 2024 <b>{v.d.labsN}</b></span><i>★</i><span>AIM Season <b>{v.d.seasonN}</b></span><i>★</i><span>Podcast episodes <b>{v.d.eps}</b></span><i>★</i><span>Masters <b>{v.d.masters}</b></span><i>★</i><span>Est. <b>2023</b></span><i>★</i><span>Simul fortes</span><i>★</i></div>
</div>

{/* ============ 2 / H2 + BODY ============ */}
<section className="intro">
<div className="wrap">
<div className="sec_h" style={{"marginBottom": "0"} as React.CSSProperties}>
<div>
<p className="eyebrow">Alpha University</p>
<h2 className="h2">Raising the standard<br />for every role<br />in aesthetics.</h2>
</div>
<div>
<p className="body">Injectors, estheticians, managers and the teams around them never work alone here. Every one of them has the whole network behind them: someone to ask in a Loop on any given day, a Lab nearby to train hands-on, and the masters of the specialty through AIM and the Alpha podcasts. Whatever your role, there is always someone who has solved it before and wants you to be the best at what you do.</p>
<span className="draft">Draft copy</span>
</div>
</div>
{/* PROGRAM EXPLORER: tabs, stats, and a simulation of what each one is like */}
<div className="px">
<div className="px_tabs" role="tablist" aria-label="Programs">
{(v.progs || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}>
<button className={p.cls} role="tab" aria-selected={p.sel} onClick={p.go}><img className="lg_ic" src={p.ic} alt="" /><img className="lg_w" src={p.w} alt={p.name} /><span>{p.line}</span></button>
</React.Fragment>))}
</div>

<div className="px_body">
<div className="px_stats">
{(v.prog.stats || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}>
<div className="px_st"><span className="px_n">{s.n}</span><span className="px_l">{s.l}</span></div>
</React.Fragment>))}
</div>

{/* LOOPS: a thread playing out */}
{v.prog.isLoops ? (<>
<div className="sim">
<div className="sim_h"><span># injector-loop</span><span>Illustration, not a real conversation</span></div>
<div className="msg m1"><span className="who">NP <b>/ Columbus, OH</b></span><p>Patient 2 weeks post filler, small firm nodule at the injection site. Anyone seen this with this product? What would you do first?</p><span className="t">9:12 AM</span></div>
<div className="msg m2"><span className="who">RN <b>/ San Diego, CA</b></span><p>Seen it twice. Massage protocol first, recheck in a week. Happy to share our follow-up sheet.</p><span className="t">9:19 AM</span></div>
<div className="msg m3"><span className="who">Medical director <b>/ Leesburg, VA</b></span><p>Agree. Photo it today so you can compare. Flag me if it changes before then.</p><span className="t">9:24 AM</span></div>
<div className="msg m4 mine"><span className="who">NP <b>/ Columbus, OH</b></span><p>Perfect, thank you. Booking the recheck now.</p><span className="t">9:26 AM</span></div>
<div className="sim_f"><span className="typing"><i></i><i></i><i></i></span><span>Answered in 7 min by 2 clinics, 2 states</span></div>
</div>
</>) : null}

{/* LABS: photo sets from several Labs, switch between them */}
{v.prog.isLabs ? (<>
<div className="sim labsim">
<div className="sim_h"><span>{v.lab.track} / {v.lab.city}</span><span>{v.lab.date}</span></div>
<div className="mos" aria-label="Photos from this Lab">
{(v.lab.tiles || []).map((t: any, t_i: number) => (<React.Fragment key={t_i}><div className={t.cls}><span>{t.l}</span></div></React.Fragment>))}
</div>
<div className="sim_f">
<div className="lab_sw" role="tablist" aria-label="Choose a Lab">{(v.labsw || []).map((b: any, b_i: number) => (<React.Fragment key={b_i}><button className={b.cls} role="tab" aria-selected={b.sel} onClick={b.go}>{b.l}</button></React.Fragment>))}</div>
<span>Photos from the Labs log</span>
</div>
</div>
</>) : null}

{/* LEARN: AIM + podcasts */}
{v.prog.isLearn ? (<>
<div className="sim learn">
<div className="lrn_aim">
<img src="/university/aim-mark.png" alt="AIM" className="lrn_mark" />
<span className="lrn_k"><i className="lock" aria-hidden="true"></i>Closed door / Alpha providers only</span>
<span className="lrn_t">{v.d.learnNow}</span>
<span className="lrn_s">{v.d.learnPrev}</span>
</div>
<div className="lrn_pod">
<span className="lrn_k">Podcasts / the network on demand</span>
<div className="player">
<button className="pl_btn" aria-label="Play">▶</button>
<div className="pl_meta"><span className="pl_show">Operation Med Spa</span><span className="pl_t"><span className="ph">[Start-here episode title]</span></span></div>
<div className="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
</div>
<div className="pods"><span className="pod"><b>OMS</b>Operation Med Spa</span><span className="pod"><b>MSM</b>Med Spa Marketing Group Chat</span><span className="pod"><b>WCE</b>White Coat Entrepreneur</span><span className="pod"><b>HTB</b>Holding Time Back</span></div>
</div>
</div>
</>) : null}
</div>
</div>
</div>
</section>

{/* ============ 3 / LIVE MAP: Labs + Loop conversations ============ */}
<section className="live_sec dark" id="labs">
<div className="wrap">
<div className="sec_h">
<div>
<p className="eyebrow">Right now</p>
<h2 className="h3">The network,<br />training.</h2>
</div>
<p className="body">Every pin is a Lab. Every line is a Loop conversation, a question in one clinic answered by a provider in another.</p>
</div>

<div className="map campus" role="img" aria-label="Map of Alpha Labs and Loop conversations across the network">
<div className="cart" aria-hidden="true"><span className="cart_k">Est. 2023</span><span className="cart_t">The Alpha Campus</span><span className="cart_s">Labs &amp; Loops across the network</span></div>
<div className="map_in">
<img className="usa_img" src="/university/usa.svg" alt="" />
<svg viewBox="0 0 100 61.45" preserveAspectRatio="none" aria-hidden="true">
{(v.d.arcs || []).map((a: any, a_i: number) => (<React.Fragment key={a_i}><path className={a.cls} d={a.d} pathLength="100"></path></React.Fragment>))}
</svg>
{(v.pins || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}>
<div className={p.cls} style={{"left": `${p.x}`, "top": `${p.y}`} as React.CSSProperties}><i style={{"width": `${p.s}`, "height": `${p.s}`, "--d": `${p.d}`} as React.CSSProperties} title={p.c}></i></div>
</React.Fragment>))}
</div>
<div className="ticker" aria-hidden="true">
{(v.d.ticks || []).map((t: any, t_i: number) => (<React.Fragment key={t_i}><span className="tk">{t.loop} <b>/ {t.route}</b></span></React.Fragment>))}
</div>
<div className="map_key"><span><i className="k_net"></i>Partner clinic</span><span><i className="k_dot"></i>Lab</span><span><i className="k_arc"></i>Loop conversation</span></div>
</div>

<div className="term"><a href="#aim"><span className="term_k"><i className="live" aria-hidden="true"></i>Vendor education</span><span className="term_t">{v.d.vendorN} Alpha-exclusive sessions</span><span className="term_s">AMI x Alpha, launches, Train the Trainer</span></a><a href="#roles"><span className="term_k">Latest Lab</span><span className="term_t">{v.d.lastLab.t}</span><span className="term_s">{v.d.lastLab.s}</span></a><a href="#aim"><span className="term_k">Latest AIM</span><span className="term_t">{v.d.lastAim.t}</span><span className="term_s">{v.d.lastAim.s}</span></a></div>
<p className="eyebrow" style={{"margin": "22px 0 0"} as React.CSSProperties}>Pins: every Lab since 2024, sized by how many it has hosted. Lines: how Loop questions travel.</p>
</div>
</section>

{/* ============ 4 / ROLE TOGGLE ============ */}
<section className="roles_sec" id="roles">
<div className="wrap">
<p className="eyebrow">Your training, by role</p>
<div className="rtog" role="tablist" aria-label="Choose a role">
{(v.roles || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}><button className={r.cls} role="tab" aria-selected={r.sel} onClick={r.go}><img className="ricon" src="/university/role-icon.png" alt="" /><span className="rnum">{r.n}</span><span>{r.label}</span></button></React.Fragment>))}
</div>
<div className="rp">
<div className="rp_row rp_main">
<span className="rp_k"><img src="/university/icon-loops.png" alt="" className="rp_ic" />Every day</span>
<div><img className="rp_logo" src={v.role.logo} alt={v.role.loop} /><p className="rp_p">{v.role.loopFor} <span className="draft">Draft</span></p></div>
<div className="rp_stat"><span className="rp_n"><span className="ph">[N]</span></span><span className="rp_l">members / live from Slack</span></div>
</div>
<div className="rp_row">
<span className="rp_k"><img src="/university/icon-labs.png" alt="" className="rp_ic" />In person</span>
<div><img className="rp_logo rp_lab" src="/university/labs-logo.svg" alt="Alpha Labs" /><p className="rp_p">Open to every provider, all over the network. {v.role.labFit}</p></div>
<div className="rp_stat"><span className="rp_l">Latest Lab</span><span className="rp_l2">{v.d.lastLab.s}</span></div>
</div>
{v.role.hasLearn ? (<>
<div className="rp_row">
<span className="rp_k"><img src="/university/icon-learn.png" alt="" className="rp_ic" />From the masters</span>
<div><img className="rp_logo rp_aim" src="/university/aim-logo.svg" alt="AIM, the Alpha Injector Masterclass" /><p className="rp_p">Closed-door sessions with the people who shaped the specialty. {v.d.seasonN} seasons, {v.d.masters} masters so far.</p></div>
<div className="rp_stat"><span className="rp_l">Latest session</span><span className="rp_l2">{v.d.lastAim.t} / {v.d.lastAim.d}</span></div>
</div>
</>) : null}
<div className="rp_row">
<span className="rp_k"><img src="/university/icon-learn.png" alt="" className="rp_ic" />Listen</span>
<div>
<span className="rp_t">From the Alpha podcast network</span>
<p className="rp_p">Start-here episodes picked for this role. They play in the site player, so the page keeps going while you listen.</p>
<div className="pods">{(v.role.pods || []).map((p: any, p_i: number) => (<React.Fragment key={p_i}><span className="pod"><b>{p.s}</b>{p.t}</span></React.Fragment>))}</div>
</div>
<div className="rp_stat"><span className="rp_l">Start here</span><span className="rp_l2"><span className="ph">[Episode title]</span></span><button className="btn" style={{"marginTop": "14px"} as React.CSSProperties}>▶ Play</button></div>
</div>
{v.role.hasPath ? (<>
<div className="rp_row">
<span className="rp_k">Where it goes</span>
<div><span className="rp_t">From the chair to the faculty</span><p className="rp_p">Alpha's best injectors teach the next generation at Practice.</p></div>
<div className="rp_stat"><span className="rp_l">Practice faculty from Alpha</span><span className="rp_l2"><span className="ph">[N]</span></span></div>
</div>
</>) : null}
</div>
</div>
</section>

{/* ============ 5 / CONTENT ============ */}
<section className="aim_sec" id="aim">
<div className="aim_hero" aria-hidden="true"><div className="aim_grid"></div><img className="aim_big" src="/university/aim-logo.svg" alt="" /></div>
<div className="wrap">
<div className="sec_h">
<div>
<p className="eyebrow">Learn / Alpha Injector Masterclass</p>
<h2 className="h3">The masters,<br />behind closed doors.</h2>
</div>
<p className="body">The room is for Alpha providers only. The lineup is not a secret. Each session gets its own page: who taught, what they covered, and a short recap after.</p>
</div>
<div className="tabs" role="tablist" aria-label="AIM seasons">
{(v.seasons || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}><button className={s.cls} role="tab" aria-selected={s.sel} onClick={s.go}>{s.label}</button></React.Fragment>))}
</div>
<ol className="aim">
{(v.sessions || []).map((x: any, x_i: number) => (<React.Fragment key={x_i}>
<li><a href="#aim"><span className="aim_cv">{x.hasC ? (<><img src={x.c} alt="" loading="lazy" /></>) : null}{x.noC ? (<><b>AIM</b></>) : null}</span><span className="aim_d">{x.d}</span><span className="aim_n">{x.n}</span><span className="aim_t">{x.t}</span><span className="aim_s"><i className="lock" aria-hidden="true"></i>{x.s}</span></a></li>
</React.Fragment>))}
</ol>

</div>
</section>

<section className="sec" id="loops">
<div className="wrap">
<div className="sec_h">
<div>
<p className="eyebrow">Alpha Loops</p>
<h2 className="h3">Six Loops,<br />one network.</h2>
</div>
<p className="body">Member counts update nightly from Slack.</p>
</div>
<div className="loops">
{(v.loops || []).map((l: any, l_i: number) => (<React.Fragment key={l_i}>
<div className="loop">{l.logo ? (<><img className="loop_logo" src={l.logo} alt={l.c} /></>) : null}{l.noLogo ? (<><span className="loop_c">{l.c}</span></>) : null}<span className="loop_n"><span className="ph">[N]</span></span><span className="loop_l">Members</span></div>
</React.Fragment>))}
</div>
</div>
</section>

{/* ============ CLINICAL DIRECTOR ============ */}{v.d.showCD ? (<>
<section className="cd" id="clinical" aria-label="Curriculum lead">
<span className="cd_hold">Hold until signed</span>
<div className="wrap">
<div className="cd_grid">
<div className="cd_plate">
<svg viewBox="0 0 100 125" preserveAspectRatio="none" aria-hidden="true"><path d="M30 20 C 22 45, 24 80, 42 104 C 48 112, 56 112, 62 104 C 78 82, 80 46, 70 20"></path><path d="M38 52 C 44 48, 50 48, 54 52"></path><path d="M56 70 C 62 74, 66 80, 66 90"></path><path d="M34 74 C 40 84, 46 92, 50 98"></path><path d="M64 40 C 70 50, 72 62, 70 72"></path></svg>
<span className="cd_pin" style={{"left": "58%", "top": "33%"} as React.CSSProperties}><i></i>Temporal fat <b>/ 01</b></span>
<span className="cd_pin" style={{"left": "54%", "top": "58%"} as React.CSSProperties}><i></i>Midface ligaments <b>/ 02</b></span>
<span className="cd_pin" style={{"left": "22%", "top": "70%"} as React.CSSProperties}><i></i>Facial artery <b>/ 03</b></span>
<span className="cd_ph">[Portrait, b/w, studio. Anatomy layers trace over the face on scroll]</span>
</div>
<div>
<p className="cd_k">Curriculum lead</p>
<h2 className="cd_name">Sebastian<br />Cotofana</h2>
<p className="cd_cred">Clinical Director · Founder, Cotofana Anatomy</p>
<p className="cd_lede">Every course in the University starts from the same anatomy. Sebastian signs off the curriculum, from a first Loop question to a hands-on Lab, so what an injector learns in Denver is what they learn in Boston.</p>
<span className="cd_draft">Draft copy</span>
<blockquote className="cd_q">[Verbatim line on teaching anatomy]<cite>Sebastian Cotofana</cite></blockquote>
<ul className="cd_scope">
<li><span>01</span><b>Labs</b><em>Hands-on, anatomy-first</em></li>
<li><span>02</span><b>AIM</b><em>Masters of the specialty</em></li>
<li><span>03</span><b>Practice</b><em>Cohorts with university partners</em></li>
</ul>
<div className="cd_ctas"><a className="cd_btn fill" href="#clinical">▶ Watch him teach</a><a className="cd_btn" href="/team">Full profile</a></div>
</div>
</div>
</div>
</section>

{/* Practice: integrated into the page flow; the cutout bleeds off the left edge and runs the full height of the section */}
<section className="pracx neutral" id="practice">
<img className="pracx_img" src="/university/practice-cutout.webp" alt="An injector working with facial anatomy revealed" />
<div className="wrap pracx_in">
<div className="pracx_txt">
<img className="prac_logo" src="/university/practice-logo.png" alt="Practice Aesthetics Training" />
<p className="body">Alpha's best injectors teach the next generation at Practice, university-partnered injector training open to every clinician, not just ours.</p>
<p className="eyebrow" style={{"margin": "28px 0 12px"} as React.CSSProperties}>University partners</p>
<div className="ulogos"><img src="/university/uni-bc.png" alt="Boston College" /><img src="/university/uni-cuson.png" alt="Columbia University School of Nursing" className="ul_wide" /><img src="/university/uni-upenn.png" alt="University of Pennsylvania" /><img src="/university/uni-unc.png" alt="UNC Chapel Hill School of Nursing" className="ul_tall" /></div>
<div className="prac_ctas"><a className="pbtn pbtn_fill" href="#practice">Apply to Cohort</a><a className="pbtn" href="#practice">Visit Practice ↗</a></div>
</div>
</div>
</section>

<section className="close">
<div className="wrap">
<p className="eyebrow">Two ways in</p>
<p className="close_t">Train with the network.</p>
<div className="close_c"><a className="btn" href="/talk">Partner with Alpha</a><a className="btn" href="/careers">Join a partner</a></div>
</div>
</section>

</>) : null}

    </div>
  )
}
