'use client'
/* Generated from design/boards/Pathway.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { PathwayEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PathwayView(props: any) {
  const v = useDC(PathwayEngine, props)
  return (
    <div className="pg-pathway">

<Nav dark></Nav>
<section className="pw_hero dark">
<div className="wrap">
<p className="eyebrow">How it works</p>
<h1 className="display">Two ways<br />in</h1>
<p className="lede">Some practices become an Alpha partner. Others join one. Either way the team and the patients come with you.</p>
<p style={{"marginTop": "16px"} as React.CSSProperties}><span className="draft" style={{"color": "#9B978E"} as React.CSSProperties}>Draft copy</span></p>
<div className="pw_tracks" role="tablist" aria-label="Choose a path">
<button className={v.tPartner} role="tab" aria-selected={v.selPartner} onClick={v.goPartner}><span className="k">01 / Partner with Alpha</span><b>Become a partner</b><p>For practices ready to grow into a platform. Your brand and your leadership stay; Alpha brings capital, systems and a network of founders.</p><span className="go">See the path <i></i></span></button>
<button className={v.tJoin} role="tab" aria-selected={v.selJoin} onClick={v.goJoin}><span className="k">02 / Join a partner</span><b>Join a partner</b><p>For practices that want to keep practicing without carrying the business alone. Join an Alpha partner in your market and keep your team, your patients and your building.</p><span className="go">See the path <i></i></span></button>
</div>
</div>
</section>

{v.isPartner ? (<>
<section className="sec">
<div className="wrap">
<div className="split_head"><h2 className="display h2">Becoming a partner</h2><span className="draft">Placeholder / existing partnership path</span></div>
<div className="pw_steps"><div><span className="k">01 / [Timing]</span><b>Qualify</b><p>[Five questions, then a real conversation with New Partnerships.]</p></div><div><span className="k">02 / [Timing]</span><b>Meet the partners</b><p>[Founders who have made the decision, in their own words.]</p></div><div><span className="k">03 / [Timing]</span><b>Partnership</b><p>[What changes, what stays, and the first ninety days.]</p></div></div>
</div>
</section>
</>) : null}

{v.isJoin ? (<>
<section className="sec" style={{"paddingBottom": "clamp(48px, 5vw, 80px)"} as React.CSSProperties}>
<div className="wrap">
<div className="split_head"><h2 className="display h2">Joining a partner</h2><span className="draft">Draft copy / timings to confirm</span></div>
<div className="pw_steps">
<div><span className="k">01 / [Within a week]</span><b>A conversation</b><p>New Partnerships learns what you have built and what you want next: keep practicing, step back, or something in between.</p></div>
<div><span className="k">02 / [Within a month]</span><b>Meet the partner in your market</b><p>You sit down with the founder you would join. Same city, same standards, a practice your patients already drive past.</p></div>
<div><span className="k">03 / [Day one]</span><b>Two teams, one practice</b><p>Your team, your patients and, where it makes sense, your building carry forward under the partner&#39;s name.</p></div>
</div>
</div>
</section>

<section style={{"paddingBottom": "clamp(48px, 5vw, 80px)"} as React.CSSProperties}>
<div className="wrap">
<div className="pw_feat">
<div className="split" style={{"alignItems": "end"} as React.CSSProperties}>
<div><p className="eyebrow">Bair Medical Spa joins Flawless / Albuquerque, NM</p><p className="pw_pull">&ldquo;When I talked to John, I felt immediately I can trust this guy, and that that was more important than the numbers or anything.&rdquo;</p><span className="cap">Dr. Dean Bair, DO / interview (bair1) 00:08:57</span></div>
<div className="pw_lock"><s>Bair Medical Spa<br />est. 2004</s><span aria-hidden="true">&rarr;</span><span className="bmark b-012" role="img" aria-label="Flawless"></span></div>
</div>
<div className="tk_pair">
<figure className="tk_f">
<div className="tk_who"><span className="tk_av" aria-hidden="true">DB</span><div><span className="tk_n">Dr. Dean Bair, DO</span><span className="tk_o">Co-founder / Bair Medical Spa</span></div></div>
<blockquote>&ldquo;I felt I could trust him, that he wasn&#39;t going to grind this business into the ground, that the legacy would continue.&rdquo;</blockquote>
<figcaption>Interview (bair1) 00:09:40</figcaption>
</figure>
<div className="tk_join" aria-hidden="true"><b>+</b><span style={{"background": "var(--bone-2)"} as React.CSSProperties}>2026</span></div>
<figure className="tk_f">
<div className="tk_who"><span className="tk_av"><img src="/img/h-heather.webp" alt="" /></span><div><span className="tk_n">Heather Badal</span><span className="tk_o">Founder / Flawless</span></div></div>
<blockquote>&ldquo;So when we brought our staffs together, it&#39;s like the joining of two families.&rdquo;</blockquote>
<figcaption>Interview (fl3) 00:05:58</figcaption>
</figure>
</div>
<div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "16px", "flexWrap": "wrap", "marginTop": "clamp(32px, 3vw, 48px)"} as React.CSSProperties}><span className="ph" style={{"color": "#5C5952"} as React.CSSProperties}>Film slot / two-founder short, Dean + Heather</span><a className="btn" href="/locations">Visit Flawless, formerly Bair</a></div>
</div>
</div>
</section>

<section style={{"paddingBottom": "clamp(60px, 7vw, 110px)"} as React.CSSProperties}>
<div className="wrap">
<div className="split_head"><h2 className="h3">Practices that joined a partner</h2><span className="draft">Card copy drafted / [Years] to confirm</span></div>
<div className="pw_cards">
<a className="pw_c" href="/locations">
<div className="pw_from"><s>Blossom Medical</s><span aria-hidden="true">&rarr;</span><span className="bmark b-003" role="img" aria-label="Refined Aesthetics"></span></div>
<h3>Refined at Blossom</h3>
<p>Blossom Medical joined Refined Aesthetics in Winchester and kept its name on the door, now as Refined at Blossom.</p>
<span className="arc"><span>Winchester, VA</span><b>Joined [Year]</b></span>
</a>
<a className="pw_c" href="/locations">
<div className="pw_from"><s>Demma Aesthetics</s><span aria-hidden="true">&rarr;</span><span className="bmark b-008" role="img" aria-label="RN Esthetics"></span></div>
<h3>RN Esthetics Boston</h3>
<p>Demma Aesthetics became RN Esthetics&#39; fourth location, bringing a Boston address to a North Shore practice.</p>
<span className="arc"><span>Boston, MA</span><b>Joined [Year]</b></span>
</a>
<a className="pw_c" href="/locations">
<div className="pw_from"><s>Seaside Aesthetics</s><span aria-hidden="true">&rarr;</span><span className="bmark b-008" role="img" aria-label="RN Esthetics"></span></div>
<h3>Seaside, now at RN Salem</h3>
<p>Seaside Aesthetics&#39; providers and patients moved to RN Esthetics in Salem, a short drive up the coast.</p>
<span className="arc"><span>Marblehead &rarr; Salem</span><b>3 mi</b></span>
</a>
</div>
</div>
</section>

<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<div className="pw_nums" style={{"marginBottom": "clamp(48px, 5vw, 80px)"} as React.CSSProperties}>
<div><b>4</b><span>Practices joined a partner</span></div>
<div><b>3</b><span>Partners grew this way</span></div>
<div><b>2</b><span>De novos opened</span></div>
<span className="ph" style={{"color": "#5C5952", "alignSelf": "flex-end"} as React.CSSProperties}>Counts from the Tuck-ins collection / live</span>
</div>
<div className="pw_cta">
<div><h2 className="display h2">Thinking about<br />joining a partner?</h2><p className="lede">Start with a conversation. We&#39;ll tell you which partner is in your market and introduce you.</p></div>
<a className="btn" href="/talk">Let&#39;s talk</a>
</div>
</div>
</section>
</>) : null}



    </div>
  )
}
