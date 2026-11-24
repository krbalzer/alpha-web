'use client'
/* Generated from design/boards/Main.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { StoryVideo } from '@/components/site/StoryVideo'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { MainEngine } from './engine'
import { QueueBtn } from '@/components/site/QueueBtn'
import { HomeReel } from '@/components/site/HomeReel'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MainView(props: any) {
  const v = useDC(MainEngine, props)
  /* mobile: the film viewer sticks at the top of its section, so the partner under it becomes the one on screen */
  const vRef = React.useRef(v); vRef.current = v
  React.useEffect(() => {
    let raf = 0, last = -1
    const f = () => {
      if (window.innerWidth > 900) return
      const pv = document.querySelector('.pg-main .p_viewer') as HTMLElement | null, rows = Array.from(document.querySelectorAll('.pg-main .p_list .p_row')) as HTMLElement[]
      if (!pv || !rows.length) return
      const line = pv.getBoundingClientRect().bottom + 24
      let i = 0
      rows.forEach((r, k) => { if (r.getBoundingClientRect().top <= line) i = k })
      if (i !== last) { last = i; const ps = vRef.current.partners || [], p = ps[ps.length - 1 - i]; if (p && p.focus) p.focus() }
    }
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(f) }
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])
  /* lightbox: drag or swipe sideways for the next / previous film */
  const sw = React.useRef<{ x: number; y: number } | null>(null)
  const swDown = (e: React.PointerEvent) => { sw.current = { x: e.clientX, y: e.clientY } }
  const swUp = (e: React.PointerEvent) => {
    const s0 = sw.current; sw.current = null; if (!s0) return
    const dx = e.clientX - s0.x, dy = e.clientY - s0.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) v.thNext(); else v.thPrev() }
  }
  return (
    <div className="pg-main">


{/* ============ NAV + HERO ============ */}
<Nav></Nav>

<section id="top" className="wrap">
<div className="hero_grid">
<h1 className="display hero_title">Raise the<br />standard</h1>
<div className="hero_body">
<p className="hero_copy"><b>Alpha Aesthetics Partners</b> is a national partnership of medical aesthetics practices. Partners keep their brand, their team, and their clinical judgment, and gain shared operations, buying power, and a clinical training program built with the people using it.</p>
<div className="hero_ctas">
<a className="btn" href="#partners">See partners</a>
<a className="ulink" href="/how-it-works">How partnership works</a>
</div>
</div>
<div className="stats">
<a className="stat" href="#partners"><div className="stat_num">{v.net.brands}<svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M1 8L8 1M3 1h5v5" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></div><div className="stat_label">Brands</div></a>
<a className="stat" href="#network"><div className="stat_num">{v.net.locations}<svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M1 8L8 1M3 1h5v5" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></div><div className="stat_label">Locations</div></a>
<a className="stat" href="#network"><div className="stat_num">{v.net.states}<svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M1 8L8 1M3 1h5v5" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></div><div className="stat_label">States</div></a>
</div>
</div>
</section>

<HomeReel desktop={v.reelVid.d} mobile={v.reelVid.m}></HomeReel>

{/* ============ NETWORK: last week, replayed ============ */}
<section id="network" className="net on-dark">
<div className="wrap">
<div className="net_head">
<div>
<p className="eyebrow" style={{"color": "#9B978E"} as React.CSSProperties}>The network</p>
<h2 className="display h2">Separate brands.<br />One team.</h2>
<p className="lede">Every dot is a partner practice. Every gold line is Alpha, already inside all of them. This is last week, replayed. It looks like this every week.</p>
</div>
<div className="net_stats">
<div className="net_stat clk"><span className="net_num">{v.clock}</span><span className="net_lab">Last week, replayed</span><div className="net_days">{(v.days || []).map((d: any, d_i: number) => (<React.Fragment key={d_i}><i className={d.cls}></i></React.Fragment>))}</div></div>
<div className="net_stat"><span className="net_num">{v.c1}</span><span className="net_lab">Conversations between practices</span></div>
<div className="net_stat"><span className="net_num">{v.c2}</span><span className="net_lab">Questions answered</span></div>
<div className="net_stat"><span className="net_num">{v.c3}</span><span className="net_lab">Typical time to first answer</span></div>
</div>
</div>

<div className="net_stage" ref={v.setStage} role="img" aria-label="Conversations between partner practices over the last week">
<img className="net_dots" src="/boards/e237efa3c5f927fb28e8e1cda7a49ea0.svg" alt="" />
<canvas className="net_cv" ref={v.setCanvas} aria-hidden="true"></canvas>
{(v.nodes || []).map((n: any, n_i: number) => (<React.Fragment key={n_i}><i className={n.cls} style={{"left": `${n.px}%`, "top": `${n.py}%`} as React.CSSProperties}></i></React.Fragment>))}

{(v.chips || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}>
<div className={c.cls} style={{"left": `${c.left}%`, "top": `${c.top}%`} as React.CSSProperties}>
<div className="chip_t"><b><i className={c.mk}></i>{c.label}</b><span>{c.time}</span></div>
<div className="chip_row"><span className="pile">{(c.avs || []).map((v: any, v_i: number) => (<React.Fragment key={v_i}><span className={v.cls} style={{"background": `${v.bg}`} as React.CSSProperties}>{v.init}</span></React.Fragment>))}</span><div><p>{c.text}</p><div className="chip_who"><b>{c.name}</b> · {c.rest}</div></div></div>
{c.hasThread ? (<>
<div className="chip_thread">
<div className="chip_t"><b><i className="mk a"></i>{c.thLabel}</b><span className="fast">{c.thTime}</span></div>
<div className="chip_row"><span className="pile">{(c.thAvs || []).map((v: any, v_i: number) => (<React.Fragment key={v_i}><span className={v.cls} style={{"background": `${v.bg}`} as React.CSSProperties}>{v.init}</span></React.Fragment>))}</span><div><p>{c.thText}</p><div className="chip_who"><b>{c.thName}</b> · {c.thRest}</div></div></div>
</div>
</>) : null}
</div>
</React.Fragment>))}

{(v.snaps || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}>
<div className={s.cls} style={{"left": `${s.left}%`, "top": `${s.top}%`} as React.CSSProperties}><div className="snap_img ph" style={{"background": `${s.bg}`} as React.CSSProperties}>[Photo]</div><span className="snap_cap">{s.label}</span></div>
</React.Fragment>))}
<div className={v.moment.cls} style={{"left": `${v.moment.left}%`, "top": `${v.moment.top}%`} as React.CSSProperties}><div className="moment_img ph" style={{"background": `${v.moment.bg}`} as React.CSSProperties}>[Team photo]</div><div className="moment_cap"><b>{v.moment.type}</b><span>{v.moment.line}</span></div></div>
</div>

<div className="net_stack" aria-hidden="true">
{(v.feed || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}>
<div className={c.cls}>
<div className="chip_t"><b><i className={c.mk}></i>{c.label}</b><span>{c.time}</span></div>
<div className="chip_row"><span className="pile">{(c.avs || []).map((v: any, v_i: number) => (<React.Fragment key={v_i}><span className={v.cls} style={{"background": `${v.bg}`} as React.CSSProperties}>{v.init}</span></React.Fragment>))}</span><div><p>{c.text}</p><div className="chip_who"><b>{c.name}</b> · {c.rest}</div></div></div>
{c.hasThread ? (<>
<div className="chip_thread"><div className="chip_t"><b><i className="mk a"></i>{c.thLabel}</b><span className="fast">{c.thTime}</span></div><div className="chip_row"><span className="pile">{(c.thAvs || []).map((v: any, v_i: number) => (<React.Fragment key={v_i}><span className={v.cls} style={{"background": `${v.bg}`} as React.CSSProperties}>{v.init}</span></React.Fragment>))}</span><div><p>{c.thText}</p><div className="chip_who"><b>{c.thName}</b> · {c.thRest}</div></div></div></div>
</>) : null}
</div>
</React.Fragment>))}
</div>

<div className="net_base">
<div className="legend"><span><i className="mk"></i>Props</span><span><i className="mk q"></i>Question</span><span><i className="mk a"></i>Answer</span><span><i className="mk t"></i>Alpha team</span></div>
</div>
</div>
</section>

{/* ============ PARTNERS: roster + theater ============ */}
<section id="partners" className="partners">
<div className="wrap">
<h2 className="display h2">The partners raising<br />the standard</h2>
<p className="lede">Every brand in the network, newest first, and the founder who built it. Open a brand for its story, or a founder for theirs.</p>
<div className="p_grid">
<div className="p_list" role="list">
{(v.partners || []).slice().reverse().map((p: any, p_i: number) => (<React.Fragment key={p_i}>
<a className={p.cls} href={p.href} onMouseEnter={p.hover} onFocus={p.focus} role="listitem" style={{"textDecoration": "none"} as React.CSSProperties}><span>{p.n}</span><span className="nm">{p.name}</span><span className="ct">{p.city}</span><span className="yr">{p.yr}</span></a>
</React.Fragment>))}
</div>
<div className="p_viewer">
<button className={v.frameCls} onClick={v.openCur} onMouseMove={v.frameMove} aria-label={v.cur.frameLabel}>
{(v.posters || []).map((q: any, q_i: number) => (<React.Fragment key={q_i}>
<div className={q.cls} style={{"background": `${q.tone}`} as React.CSSProperties}>
{q.hasImg ? (<><img src={q.img} alt="" /></>) : null}
{q.noImg ? (<><div className="tcard"><div className="mono" style={{"fontSize": "10px", "letterSpacing": ".14em", "marginBottom": "10px"} as React.CSSProperties}>Partner {q.n}</div><div className="tcard_name">{q.name}</div><div className="tcard_rule"></div><div className="mono" style={{"fontSize": "10px", "letterSpacing": ".1em", "opacity": ".85"} as React.CSSProperties}>{q.cityLong}</div></div></>) : null}
</div>
</React.Fragment>))}
{v.cur.film ? (<><div className="film_card" aria-hidden="true"><span className="film_mark"><span className="amark"></span></span><i className="film_rule"></i><span className="film_name">The {v.cur.story} Story</span></div><span className="film_cur" aria-hidden="true"><svg width="12" height="14" viewBox="0 0 12 14"><path d="M1 1l10 6-10 6z" fill="#0E0E0D"></path></svg><span>Play</span></span></>) : null}
</button>
<div className="p_meta"><span>{v.cur.n}&nbsp;&nbsp;&nbsp;<b>{v.cur.name}</b></span><span>{v.cur.since}</span></div>
<div className="p_bar">
<a className="p_who" href={v.cur.founderHref}><span className="av">{v.cur.hasHead ? (<><img src={v.cur.head} alt="" /></>) : null}{v.cur.noHead ? (<><span>{v.cur.init}</span></>) : null}</span><span><b>{v.cur.founder}</b><span>{v.cur.role}</span></span></a>

</div>
<div className="p_bar">
<span className="mono" style={{"fontSize": "10.5px", "color": "#5C5952"} as React.CSSProperties}>{v.cur.locLine}</span>
<a className="btn" href={v.cur.href}>Open partner page</a>
</div>
</div>
</div>
<hr className="rule" style={{"marginTop": "88px"} as React.CSSProperties} />
</div>
</section>

{/* ============ PEOPLE ============ */}
<section id="team" className="people" style={{"paddingTop": "0"} as React.CSSProperties}>
<div className="wrap">
<div className="sec_head">
<div>
<h2 className="display h2">The people behind<br />every practice.</h2>
<p className="lede">You keep your brand, your team and your clinical judgment. These are the people who take everything else off your plate.</p>
</div>
<a className="btn" href="/team">Meet the whole team</a>
</div>
<div className="ldg">
{(v.depts || []).map((d: any, d_i: number) => { const all = d.avs || [], cap = 6, shown = all.length > cap ? all.slice(0, cap - 1) : all, more = all.length - shown.length; return (<div className="ldg_row" key={d_i}>
<a className="ldg_name" href={d.href}>{d.name}</a>
<p className="ldg_line">{d.line}</p>
<div className="ldg_avs">{shown.map((a: any, a_i: number) => (<a key={a_i} className="av" href={a.href} title={a.name} aria-label={a.name}>{a.img ? <img className="ph_img" src={a.img} alt="" loading="lazy" /> : null}{a.iOnly}</a>))}{more > 0 ? <a className="ldg_more" href={d.href} aria-label={`${more} more in ${d.name}`}>+{more}</a> : null}</div>
<span className="ldg_go" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 5h8M5.5 1.5L9 5l-3.5 3.5" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></span>
</div>) })}
</div>
<hr className="rule" style={{"marginTop": "72px"} as React.CSSProperties} />
</div>
</section>

{/* ============ STORIES ============ */}
<section id="stories" className="stories" style={{"paddingTop": "0"} as React.CSSProperties}>
<div className="wrap">
<div className="sec_head">
<div>
<h2 className="display h2">In their<br />own words</h2>
<p className="lede">Providers, managers and founders from across the network, on what they were worried about going in and what partnership has actually been like.</p>
</div>
<div className="arrows"><button className="arrow" aria-label="Previous story" onClick={v.storyPrev} disabled={v.storyAtStart}><svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true"><path d="M6 1L2 5l4 4" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></button><button className="arrow" aria-label="Next story" onClick={v.storyNext} disabled={v.storyAtEnd}><svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true"><path d="M2 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></button></div>
</div>
<div className="rail story_rail" style={{"marginTop": "32px"} as React.CSSProperties} onPointerDown={v.storyDown} onPointerMove={v.storyMove} onPointerUp={v.storyUp} onPointerCancel={v.storyUp} onPointerLeave={v.storyUp} onClickCapture={v.storyClick}>
<div className="track" style={{"gap": "10px", "transform": `translateX(${v.storyShift})`} as React.CSSProperties}>
{(v.stories || []).map((s: any, s_i: number) => (<React.Fragment key={s_i}>
<article className="story">
{s.video ? (<StoryVideo src={s.video} preview={s.preview} poster={s.poster} quote={s.quote} />) : (<div className="story_media">
<span className="story_play" aria-hidden="true"><svg width="9" height="10" viewBox="0 0 9 10"><path d="M1 .8v8.4L8.3 5z" fill="currentColor"></path></svg></span>
<p className="story_quote">{s.quote}</p>
</div>)}
<div className="story_meta"><div><div className="story_name">{s.name}</div><div className="story_role">{s.role}</div></div>{s.mark ? (<span className="story_mark" role="img" aria-label={s.brand} style={s.mark as React.CSSProperties}></span>) : (<span className="story_brand">{s.brand}</span>)}</div>
</article>
</React.Fragment>))}
</div>
</div>

</div>
</section>

{/* ============ PRACTICE ============ */}
<section id="practice" className="practice" aria-label="Practice Aesthetics Training">
<img className="practice_bg" src="/home/practice-bg.jpg" alt="" loading="lazy" aria-hidden="true" />
<div className="wrap" style={{"width": "100%"} as React.CSSProperties}>
<div className="practice_grid">
<span className="practice_logo" role="img" aria-label="Practice Aesthetics Training"></span>
<div className="practice_r"><p className="practice_tag">University-Backed<br />Injector Training</p><a className="practice_cta" href="/training#practice">Learn more <span aria-hidden="true">→</span></a></div>
</div>
</div>
<div className="practice_unis"><div className="pu_track"><img src="/university/uni-bc.png" alt="Boston College" /><img src="/university/uni-cuson.png" alt="Columbia University School of Nursing" className="pu_wide" /><img src="/university/uni-upenn.png" alt="University of Pennsylvania" /><img src="/university/uni-unc.png" alt="UNC Chapel Hill School of Nursing" className="pu_tall" /><img src="/university/uni-bc.png" aria-hidden="true" alt="Boston College" /><img src="/university/uni-cuson.png" aria-hidden="true" alt="Columbia University School of Nursing" className="pu_wide" /><img src="/university/uni-upenn.png" aria-hidden="true" alt="University of Pennsylvania" /><img src="/university/uni-unc.png" aria-hidden="true" alt="UNC Chapel Hill School of Nursing" className="pu_tall" /><img src="/university/uni-bc.png" aria-hidden="true" alt="Boston College" /><img src="/university/uni-cuson.png" aria-hidden="true" alt="Columbia University School of Nursing" className="pu_wide" /><img src="/university/uni-upenn.png" aria-hidden="true" alt="University of Pennsylvania" /><img src="/university/uni-unc.png" aria-hidden="true" alt="UNC Chapel Hill School of Nursing" className="pu_tall" /><img src="/university/uni-bc.png" aria-hidden="true" alt="Boston College" /><img src="/university/uni-cuson.png" aria-hidden="true" alt="Columbia University School of Nursing" className="pu_wide" /><img src="/university/uni-upenn.png" aria-hidden="true" alt="University of Pennsylvania" /><img src="/university/uni-unc.png" aria-hidden="true" alt="UNC Chapel Hill School of Nursing" className="pu_tall" /></div></div>
</section>

{/* ============ PODCASTS ============ */}
<section id="podcasts" className="pods">
<div className="wrap">
<div className="sec_head">
<div>
<h2 className="display h2">Hear from<br />the network</h2>
<p className="lede">Seven shows hosted by founders, providers and the Alpha team. Everything from the front desk to the balance sheet, published every week.</p>
</div>
<div style={{"display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "28px"} as React.CSSProperties}>
<div className="stats">
<div className="stat"><div className="stat_num">{v.nShows}</div><div className="stat_label">Shows</div></div>
</div>
<div className="arrows"><button className="arrow" aria-label="Previous show" onClick={v.podPrev} disabled={v.podAtStart}><svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true"><path d="M6 1L2 5l4 4" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></button><button className="arrow" aria-label="Next show" onClick={v.podNext} disabled={v.podAtEnd}><svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true"><path d="M2 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></button></div>
</div>
</div>
<div className="rail pcar" style={{"marginTop": "28px"} as React.CSSProperties}>
<div className="track" style={{"gap": "8px", "transform": `translateX(${v.podShift})`} as React.CSSProperties}>{(v.shows || []).map((c: any, c_i: number) => (<React.Fragment key={c_i}><a className="cover" href={c.href} style={{"textDecoration": "none"} as React.CSSProperties}><div className="cover_art" style={{"background": `${c.bg}`, "padding": "0", "overflow": "hidden", "position": "relative"} as React.CSSProperties}>{c.art ? (<><img className="ph_img" src={c.art} alt={c.name} loading="lazy" /></>) : null}</div><div className="cover_meta"><span className="mono" style={{"fontSize": "10px"} as React.CSSProperties}>{c.name}</span></div></a></React.Fragment>))}</div>
</div>


{v.hasEps ? (<><div id="how" className="start">
<div>
<hr className="rule" style={{"marginBottom": "40px"} as React.CSSProperties} />
<h2 className="display h2">Thinking about<br />partnership?<br />Start here.</h2>
<p className="lede">Four conversations picked for owners weighing the decision. Press play and keep browsing; the player stays with you.</p>
</div>
<div>
<hr className="rule" />
{(v.eps || []).map((e: any, e_i: number) => (<React.Fragment key={e_i}>
<div className="ep">
<button className={e.btnCls} aria-label={`Play ${e.title}`} onClick={e.play}><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M1.5 1v12L11 7z" fill="currentColor"></path></svg></button>
<div className="ep_art" style={{"background": `${e.tone}`} as React.CSSProperties}>{e.ep?.art ? (<img src={e.ep.art} alt="" loading="lazy" />) : null}</div>
<div><p className="ep_title">{e.title}</p><div className="ep_show">{e.show}</div></div>
<span className="ep_end"><QueueBtn ep={e.ep}></QueueBtn><span className="ep_len">{e.len}</span></span>
</div>
</React.Fragment>))}
<div style={{"display": "flex", "justifyContent": "flex-end", "marginTop": "28px"} as React.CSSProperties}><a className="btn" href="/podcasts">All shows and episodes</a></div>
</div>
</div></>) : null}
</div>
</section>

{/* ============ QUALIFY ============ */}
<section id="qualify" className="qual on-dark">
<div className="wrap qual_grid">
<div>
<h2 className="display h2">Is your practice<br />qualified?</h2>
<p className="lede">Five questions about your practice. If it's a fit, we set up a real conversation, with people who have already made this decision.</p>

</div>
<div className="form">
{v.notDone ? (<>
<div className="form_top"><span>{v.qLabel}</span><span>{v.qCount}</span></div>
<div className="form_prog">{(v.qBars || []).map((b: any, b_i: number) => (<React.Fragment key={b_i}><i className={b.cls}></i></React.Fragment>))}</div>
{v.isChoice ? (<>
<h3 className="form_q">{v.q.title}</h3>
<p className="form_hint">{v.q.hint}</p>
<div className="opts" role="radiogroup" aria-label={v.q.title}>
{(v.q.opts || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><button className={o.cls} role="radio" aria-checked={o.on} onClick={o.pick}><span>{o.label}</span><span className="opt_dot"></span></button></React.Fragment>))}
</div>
</>) : null}
{v.isContact ? (<>
<h3 className="form_q">Where should we reach you?</h3>
<p className="form_hint">{v.contactHint}</p>
<div className="fields">
<div className="field"><label htmlFor="f-name">Name</label><input id="f-name" type="text" autoComplete="name" /></div>
<div className="field"><label htmlFor="f-practice">Practice</label><input id="f-practice" type="text" autoComplete="organization" /></div>
<div className="field"><label htmlFor="f-email">Email</label><input id="f-email" type="email" autoComplete="email" /></div>
<div className="field"><label htmlFor="f-phone">Phone</label><input id="f-phone" type="tel" autoComplete="tel" /></div>
</div>
</>) : null}
<div className="form_nav">
<button className="ulink" style={{"background": "none", "borderTop": "0", "borderLeft": "0", "borderRight": "0", "cursor": "pointer", "visibility": `${v.backVis}`} as React.CSSProperties} onClick={v.qBack}>Back</button>
<button className="btn btn-fill" onClick={v.qNext} disabled={v.nextDisabled} style={{"opacity": `${v.nextOpacity}`} as React.CSSProperties}>{v.nextLabel}</button>
</div>
</>) : null}
{v.isDone ? (<>
<div style={{"margin": "auto 0"} as React.CSSProperties}>
<p className="eyebrow" style={{"color": "#C9A26B"} as React.CSSProperties}>Received</p>
<h3 className="form_q" style={{"fontSize": "40px"} as React.CSSProperties}>Thanks. We'll be in touch.</h3>
<p className="form_hint" style={{"maxWidth": "440px"} as React.CSSProperties}>While you wait, the four conversations above are the ones owners in your position listen to first.</p>
<button className="ulink" style={{"background": "none", "borderTop": "0", "borderLeft": "0", "borderRight": "0", "cursor": "pointer"} as React.CSSProperties} onClick={v.qReset}>Start over</button>
</div>
</>) : null}
</div>
</div>
</section>

{/* ============ CLOSER ============ */}




{/* ============ THEATER ============ */}
{v.thOpen ? (<>
<div className="theater" role="dialog" aria-modal="true" aria-label="Brand film" tabIndex={-1} ref={v.thRef} onKeyDown={v.thKey}>
<div className="th_bar"><span>Film {v.th.idx} of {v.th.total}</span><button className="th_close" onClick={v.thClose}>Close <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4"></path></svg></button></div>
<div className="th_stage" onPointerDown={swDown} onPointerUp={swUp} onPointerCancel={() => { sw.current = null }}>
<button className="th_arrow" aria-label="Previous film" onClick={v.thPrev}><svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true"><path d="M13 6H1M6 1L1 6l5 5" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></button>
<div className="th_screen">{v.th.src ? (<><video className="th_vid" src={v.th.src} poster={v.th.poster} ref={v.thVid} autoPlay controls playsInline></video></>) : null}
<div className={v.th.pcls} style={{"background": `${v.th.tone}`} as React.CSSProperties}>
{v.th.hasImg ? (<><img src={v.th.img} alt="" /></>) : null}
{v.th.noImg ? (<><div className="tcard"><div className="mono" style={{"fontSize": "11px", "letterSpacing": ".14em", "marginBottom": "12px"} as React.CSSProperties}>Partner {v.th.n}</div><div className="tcard_name" style={{"fontSize": "clamp(36px, 5vw, 80px)"} as React.CSSProperties}>{v.th.name}</div><div className="tcard_rule"></div><div className="mono" style={{"fontSize": "11px", "letterSpacing": ".1em", "opacity": ".85"} as React.CSSProperties}>{v.th.cityLong}</div></div></>) : null}
</div>
</div>
<button className="th_arrow" aria-label="Next film" onClick={v.thNext}><svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true"><path d="M1 6h12M8 1l5 5-5 5" stroke="currentColor" fill="none" strokeWidth="1.3"></path></svg></button>
</div>
<div className="th_foot">
<div className="th_foot_l"><span>PTR {v.th.n}</span><b>{v.th.name}</b>{v.th.founder ? (<><span>{v.th.founder} · {v.th.role}</span></>) : null}</div>
<div style={{"display": "flex", "gap": "16px", "alignItems": "center"} as React.CSSProperties}><span className="th_keys">← → to browse · Esc to close</span><a className="btn btn-light" href={v.cur.href} onClick={v.thClose} style={{"color": "#F3F0E9"} as React.CSSProperties}>Open partner page</a></div>
</div>
</div>
</>) : null}


    </div>
  )
}
