'use client'
/* How it works: the path to partnership. Hand-built (was ported from design/boards/Pathway.dc.html; do not re-port).
 * Stages match the partner portal tracker. Change them in both places. */
import React from 'react'
import { FilmPlay } from '@/components/site/FilmPlay'
import { Nav } from '@/components/site/Nav'
import './page.css'

const STAGES: { n: string; t: string; d: string; q?: string; who?: string; cta?: string }[] = [
  { n: '01 / Week 1', t: 'Intro call', d: "Thirty minutes with our New Partnerships team about what you've built and what you want next.", cta: '/talk', q: 'When they first came here to talk to me, they did a lot more listening than they did talking', who: 'Dr. Edwin Williams / Williams Center' },
  { n: '02', t: 'NDA and numbers', d: 'We both sign an NDA. Then you share three years of financials and how the practice runs. This is the longest step, and every file is reviewed by a person.', q: "I like it that they're straight shooters.", who: 'Becky McDonald / Privé Med Spa' },
  { n: '03', t: 'Valuation and visit', d: "We value the practice from your numbers and walk you through it. Then we come to you, and you spend time with the people you'd work with.", q: 'We were just blown away because we pictured, you know, guys in suits walking in and very corporate', who: 'Ali Oxton, NP / RN Esthetics' },
  { n: '04', t: 'Letter of intent', d: 'Terms in writing, walked through line by line.' },
  { n: '05 / Week 15', t: 'Diligence and close', d: 'Our advisors confirm the details, then we sign and your integration plan starts.', q: 'When I talked to John, I felt immediately I can trust this guy, and that that was more important than the numbers or anything.', who: 'Dr. Dean Bair' },
]
const POINTS = [
  "Every step, where you are, and what's next.",
  'Upload files as you go. They land in a private folder only you and our team can open.',
  'One person on our side the whole way, a message or a call away.',
  'Start your brand page early. Nothing publishes until you approve it.',
]

export default function PathwayView() {
  return (
    <div className="pg-pathway">
      <Nav dark></Nav>

      <section className="pw_hero dark">
        <div className="wrap pw_hg">
          <div><p className="eyebrow">How it works</p><h1 className="display">The path to<br />partnership</h1></div>
          <div><p className="pw_copy">Five steps and about fifteen weeks from a first call to closing. Most of the work is getting to know each other. You&#39;ll see where you are the whole way, and nothing is final until you sign.</p><div className="pw_ctas"><a className="btn btn-fill" href="/talk">Book an intro call</a><a className="btn" href="#steps">See the steps</a></div></div>
        </div>
      </section>

      <section className="sec" id="steps">
        <div className="wrap">
          <div className="split_head"><div><p className="eyebrow">The steps</p><h2 className="display h2">From first call<br />to close</h2></div><span className="mono pw_len">About 15 weeks, start to close</span></div>
          <ol className="pw_track">
            {STAGES.map((s) => (
              <li key={s.t} className="pw_st"><i aria-hidden="true"></i><span className="mono">{s.n}</span><b>{s.t}</b><p>{s.d}</p>{s.cta ? (<a className="pw_go" href={s.cta}>Book an intro call &rarr;</a>) : null}
                {s.q ? (<><q>{s.q}</q><cite>{s.who}</cite></>) : null}
              </li>
            ))}
          </ol>
          <div className="pw_after"><div><b>After you sign</b><span>Your first 90 days, team by team.</span></div><a className="btn" href="/team">What comes off your plate</a></div>
        </div>
      </section>

      <section className="pw_trk dark">
        <div className="wrap pw_tg">
          <div>
            <p className="eyebrow">After the NDA</p>
            <h2 className="display h2">Your own<br />tracker</h2>
            <ol className="pw_pts">{POINTS.map((p, i) => (<li key={i}><span>0{i + 1}</span>{p}</li>))}</ol>
          </div>
          <div className="pw_ui" aria-hidden="true">
            <div className="pw_ui_top"><span>Partner portal / Harbor Skin Co.</span><span>Example</span></div>
            <p className="pw_ui_t">Pathway to partnership</p>
            <div className="pw_mt"><div className="pw_fill"></div>
              {['Intro call', 'NDA + numbers', 'Valuation', 'LOI', 'Close'].map((l, i) => (<span key={l} className={'pw_d' + (i === 0 ? ' done' : i === 1 ? ' cur' : '')} style={{ left: `${i * 25}%` }}><em>{l}</em></span>))}
            </div>
            <div className="pw_card"><div><b>Stage 2 / NDA and numbers</b><span>14 of 22 files received</span><div className="pw_bar"><i></i></div></div><span className="pw_pill">2 need changes</span></div>
            <div className="pw_guide"><span className="pw_av">NP</span><div><b>Your guide, New Partnerships</b><span>&ldquo;P&amp;L 2024 is annual. Can you export it monthly, by location?&rdquo;</span></div></div>
          </div>
        </div>
      </section>

      <section className="team_film dark">
        <div className="wrap">
          <div className="tf_head"><div><p className="eyebrow">What happens to your team</p><h2 className="display h2">&ldquo;Will I lose<br />my team?&rdquo;</h2></div><div><p className="lede">The question owners ask most. Providers and managers from across the network, on what changed after their practice partnered with us.</p></div></div>
          <FilmPlay src="https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/films/alpha-access-1080.mp4" src720="https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/films/alpha-access-720.mp4" poster="https://l61f00rkpzjhtyjz.public.blob.vercel-storage.com/films/alpha-access.jpg" label="Alpha Access film" />
          <div className="tf_meta mono"><span>Alpha Access</span><span>3:53</span></div>
          <div className="pw_filmcta"><span>Ask them yourself. We&#39;ll set up calls with partners once we&#39;ve talked.</span><a className="btn btn-fill" href="/talk">Book an intro call</a></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="pw_cta"><div><h2 className="display h2">Start with<br />an intro call</h2><p className="lede">Five quick questions about your practice, then we set up thirty minutes with our New Partnerships team. Your questions first.</p></div><a className="btn" href="/talk">Book an intro call</a></div>
        </div>
      </section>
    </div>
  )
}
