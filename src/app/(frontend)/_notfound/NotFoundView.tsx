'use client'
/* Generated from design/boards/NotFound.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import { NotFoundEngine } from './engine'
import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NotFoundView(props: any) {
  const v = useDC(NotFoundEngine, props)
  return (
    <div className="pg-notfound">

<Nav dark></Nav>
<section className="nf dark">
<div className="wrap nf_grid">
<div><p className="mono" style={{"fontSize": "11px", "color": "#9B978E"} as React.CSSProperties}>PTR 404 · Not found</p><h1 className="nf_big">404</h1><p className="lede" style={{"maxWidth": "30rem"} as React.CSSProperties}>This page moved or never existed. The rest of the network is right here.</p></div>
<div className="nf_links"><a href="/locations">Every partner, on one map<span>Locations</span></a><a href="/podcasts">Search 130+ episodes<span>Podcasts</span></a><a href="/team">Meet the team<span>Team</span></a><a href="/talk">Start a conversation<span>Let&#39;s talk</span></a></div>
</div>
</section>



    </div>
  )
}
