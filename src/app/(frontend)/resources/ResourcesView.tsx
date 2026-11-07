'use client'
/* Generated from design/boards/Resources.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { ResourcesEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ResourcesView(props: any) {
  const v = useDC(ResourcesEngine, props)
  return (
    <div className="pg-resources">

<Nav></Nav>
<section className="pg_h">
<div className="wrap pg_grid">
<div><p className="eyebrow">Free resources</p><h1 className="display">Get the goods</h1></div>
<p className="lede">The playbooks, templates and trainings partners use, free for any practice. One quick form unlocks all of them.</p>
</div>
</section>
<section style={{"paddingBottom": "clamp(90px, 10vw, 150px)"} as React.CSSProperties}>
<div className="wrap">
<div className="rs_feat">
<div className="rs_feat_v ph" style={{"color": "rgba(232,228,218,.6)"} as React.CSSProperties}>Course trailer</div>
<div><span className="k" style={{"color": "#9B978E"} as React.CSSProperties}>8-course masterclass</span><h2>Med Spa M&amp;A Blueprint</h2><p>A detailed picture of what to expect from the process of partnership, from first call to integration.</p><a className="btn" href="#landing" style={{"color": "#E8E4DA"} as React.CSSProperties}>Start the course</a></div>
</div>
<div className="split_head" style={{"marginBottom": "14px"} as React.CSSProperties}><div className="chiprow">{(v.tabs || []).map((t: any, t_i: number) => (<React.Fragment key={t_i}><button className={t.cls} onClick={t.go}>{t.t}<span>{t.n}</span></button></React.Fragment>))}</div>{v.unlocked ? (<><div className="ok_bar"><i></i>Unlocked for {v.who}</div></>) : null}</div>
<div className="rs_grid">
{(v.items || []).map((r: any, r_i: number) => (<React.Fragment key={r_i}>
<div className="rs"><div className="rs_top" style={{"background": `${r.bg}`} as React.CSSProperties}><span className="rs_type">{r.type}</span><span className="rs_icon">{r.icon}</span></div><div className="rs_b"><span className="k">{r.cat}</span><b>{r.t}</b><p>{r.d}</p><div className="rs_go"><span>{r.fmt}</span><button onClick={r.go}>{r.cta}</button></div></div></div>
</React.Fragment>))}
</div>
</div>
</section>
{v.gateOpen ? (<>
<div className="gate_bg" onClick={v.closeGate}><div className="gate" role="dialog" aria-modal="true" aria-label="Unlock resources" onClick={v.stop}>
<span className="k">Unlock everything</span><h3>{v.gateTitle}</h3><p>One form, every resource. We&#39;ll email the link too.</p>
<div className="fields"><div className="field"><label htmlFor="g-n">Name</label><input id="g-n" type="text" autoComplete="name" value={v.gName} onInput={v.onName} /></div><div className="field"><label htmlFor="g-p">Practice</label><input id="g-p" type="text" autoComplete="organization" /></div><div className="field" style={{"gridColumn": "1 / -1"} as React.CSSProperties}><label htmlFor="g-e">Work email</label><input id="g-e" type="email" autoComplete="email" /></div></div>
<div className="gate_nav"><button className="lnk k" onClick={v.closeGate}>Not now</button><button className="btn btn-fill" onClick={v.unlock}>Unlock and download</button></div>
<p className="ph" style={{"color": "#5C5952", "margin": "18px 0 0"} as React.CSSProperties}>Routes to GHL / alphacrm.io · Owner-tagged leads alert New Partnerships</p>
</div></div>
</>) : null}



    </div>
  )
}
