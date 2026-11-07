'use client'
/* Generated from design/boards/Talk.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { TalkEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TalkView(props: any) {
  const v = useDC(TalkEngine, props)
  return (
    <div className="pg-talk">

<Nav dark></Nav>
<section id="qualify" className="qual dark" style={{"paddingTop": "clamp(64px, 6vw, 110px)"} as React.CSSProperties}>
<div className="wrap qual_grid">
<div>
<p className="eyebrow">Let&#39;s talk</p>
<h1 className="display" style={{"fontSize": "clamp(44px, 4.6vw, 84px)", "lineHeight": ".88"} as React.CSSProperties}>Start with<br />a real<br />conversation</h1>
<p className="lede">No decks, no pressure. A short call with people who have made this decision themselves.</p>
</div>
<div>
<div className="tk_paths"><button className={v.pOwn} onClick={v.goOwn}><b>I own a practice</b><span>Five questions, then we set up a call.</span></button><button className={v.pOther} onClick={v.goOther}><b>Something else</b><span>Press, vendors, careers, partners.</span></button></div>
{v.isOwn ? (<>
<div className="form">
{v.notDone ? (<>
<div className="form_top"><span>{v.qLabel}</span><span>{v.qCount}</span></div>
<div className="form_prog">{(v.qBars || []).map((b: any, b_i: number) => (<React.Fragment key={b_i}><i className={b.cls}></i></React.Fragment>))}</div>
{v.isChoice ? (<><h3 className="form_q">{v.q.title}</h3><p className="form_hint">{v.q.hint}</p><div className="opts" role="radiogroup" aria-label={v.q.title}>{(v.q.opts || []).map((o: any, o_i: number) => (<React.Fragment key={o_i}><button className={o.cls} role="radio" aria-checked={o.on} onClick={o.pick}><span>{o.label}</span><span className="opt_dot"></span></button></React.Fragment>))}</div></>) : null}
{v.isContact ? (<><h3 className="form_q">Where should we reach you?</h3><p className="form_hint">{v.contactHint}</p><div className="fields"><div className="field"><label htmlFor="f-name">Name</label><input id="f-name" type="text" autoComplete="name" /></div><div className="field"><label htmlFor="f-practice">Practice</label><input id="f-practice" type="text" autoComplete="organization" /></div><div className="field"><label htmlFor="f-email">Email</label><input id="f-email" type="email" autoComplete="email" /></div><div className="field"><label htmlFor="f-phone">Phone</label><input id="f-phone" type="tel" autoComplete="tel" /></div></div><p className="ph" style={{"color": "#9B978E", "marginTop": "18px"} as React.CSSProperties}>SMS consent line and Privacy / Terms links go here</p></>) : null}
<div className="form_nav"><button className="ulink" style={{"background": "none", "borderTop": "0", "borderLeft": "0", "borderRight": "0", "cursor": "pointer", "color": "#E8E4DA", "visibility": `${v.backVis}`} as React.CSSProperties} onClick={v.qBack}>Back</button><button className="btn btn-fill" onClick={v.qNext} disabled={v.nextDisabled} style={{"opacity": `${v.nextOpacity}`} as React.CSSProperties}>{v.nextLabel}</button></div>
</>) : null}
{v.isDone ? (<><div style={{"margin": "auto 0"} as React.CSSProperties}><p className="eyebrow" style={{"color": "#C9A26B"} as React.CSSProperties}>Received</p><h3 className="form_q" style={{"fontSize": "40px"} as React.CSSProperties}>Thanks. Tyler will be in touch.</h3><p className="form_hint" style={{"maxWidth": "440px"} as React.CSSProperties}>While you wait: the M&amp;A guide and the one podcast episode every owner listens to first.</p><div style={{"display": "flex", "gap": "8px", "flexWrap": "wrap"} as React.CSSProperties}><a className="btn" href="/resources" style={{"color": "#E8E4DA"} as React.CSSProperties}>The M&amp;A guide</a><a className="btn" href="/podcasts" style={{"color": "#E8E4DA"} as React.CSSProperties}>What changes on day one</a></div><button className="ulink" style={{"background": "none", "borderTop": "0", "borderLeft": "0", "borderRight": "0", "cursor": "pointer", "color": "#E8E4DA", "marginTop": "24px"} as React.CSSProperties} onClick={v.qReset}>Start over</button></div></>) : null}
</div>
</>) : null}
{v.isOther ? (<>
<div className="form"><div className="fields"><div className="field" style={{"gridColumn": "1 / -1"} as React.CSSProperties}><label htmlFor="o-r">This is about</label><select id="o-r" className="sel2"><option>Press</option><option>Vendor or product</option><option>Careers</option><option>Something else</option></select></div><div className="field"><label htmlFor="o-n">Name</label><input id="o-n" type="text" /></div><div className="field"><label htmlFor="o-e">Email</label><input id="o-e" type="email" /></div><div className="field" style={{"gridColumn": "1 / -1"} as React.CSSProperties}><label htmlFor="o-m">Message</label><textarea id="o-m"></textarea></div></div><div className="form_nav"><span className="form_hint" style={{"margin": "0"} as React.CSSProperties}>{v.otherNote}</span><button className="btn btn-fill" onClick={v.sendOther} disabled={v.otherBusy}>{v.otherLabel}</button></div></div>
</>) : null}
</div>
</div>
</section>
<section className="sec">
<div className="wrap">
<p className="eyebrow">What happens next</p>
<div className="next3"><div><span className="k">01 / Within a day</span><b>A real conversation</b><p>Tyler or Andrew from New Partnerships calls. Thirty minutes, your questions first.</p></div><div><span className="k">02 / Within two weeks</span><b>Meet the people</b><p>Talk with founders who have partnered, and the team you would work with.</p></div><div><span className="k">03 / When you&#39;re ready</span><b>See the numbers</b><p>A clear picture of what partnering means for your practice, in writing.</p></div></div>
</div>
</section>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap hq"><div><p className="eyebrow">Headquarters</p><h2 className="h3">993 Governor Dr #101<br />El Dorado Hills, CA 95762</h2></div><div className="chiprow"><a className="btn" href="https://www.instagram.com/">Instagram</a><a className="btn" href="https://www.linkedin.com/">LinkedIn</a><a className="btn" href="/locations">See every location</a></div></div>
</section>



    </div>
  )
}
