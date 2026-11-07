// @ts-nocheck
/* Generated from design/boards/About.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class AboutEngine extends DCLogic {
  
  renderVals() {
    const s = this.state || {}, set = (o) => this.setState(o), wi = s.w || 0;
    const W = [
      { t: 'Security', s: 'De-risk what you built', q: 'You have built something valuable, and most of it is still riding on you.', pts: ['Take cash off the table without selling the brand', 'Spread risk across a national network', 'Keep running the practice the way you run it'], cta: 'Read the partner stories', href: '/locations' },
      { t: 'Growth', s: 'Remove the roadblocks', q: 'The next location, the next provider, the next campaign. All of it needs capital and people you do not have yet.', pts: ['Capital for new locations and devices', 'Recruiting and training through Practice', 'An in-house marketing team that only does aesthetics'], cta: 'See how Marketing works', href: '/team' },
      { t: 'Freedom', s: 'Get your weekends back', q: 'The practice runs on you. Payroll, vendors, hiring and every fire land on the same desk.', pts: ['HR, legal and accounting off your plate', 'Operations that run when you are not there', 'A peer group of owners who have been where you are'], cta: 'See what comes off your plate', href: '/team' }
    ];
    const Y = [
      ['2023', [['Apr 10', 'Thurston partners with Esthetics Center, forming Alpha Aesthetics Partners'], ['Jun 6', 'Holden Timeless Beauty partners with Alpha'], ['Jul 25', 'Refined Aesthetics partners with Alpha'], ['Oct 20', 'The Laser Center of Marin partners with Alpha'], ['Dec 19', 'The Williams Center and Dr. Edwin Williams join']]],
      ['2024', [['Jan 30', 'Anne Therese Aesthetic Medicine joins'], ['May 14', 'RN Esthetics, led by Michelle Doran, joins'], ['May 29', 'Dontage joins the network'], ['Jul 31', 'Significant growth and new state expansions'], ['Oct 22', 'The inaugural PartnerCon, Nashville'], ['Dec 3', 'Carolina Age Management Institute (CAMI) joins']]],
      ['2025', [['Jan 7', 'InBloom Health + MediSpa joins'], ['Jan 28', 'Flawless Medspa & Wellness joins'], ['Mar 18', 'Mint & Needle joins'], ['Jul 15', 'New Esthetics Center clinic in Fair Oaks, CA'], ['Dec 17', 'Privé Med Spa joins']]],
      ['2026', [['May 19', 'Expands in California and enters Colorado']]]
    ].reverse();
    return {
      who: W.map((w, i) => ({ t: w.t, s: w.s, cls: 'wtab' + (i === wi ? ' is-on' : ''), go: () => set({ w: i }) })),
      cur: Object.assign({}, W[wi], { pts: W[wi].pts.map((t, i) => ({ n: '0' + (i + 1), t })) }),
      years: Y.map((y) => ({ y: y[0], items: y[1].slice().reverse().map((i) => ({ d: i[0], t: i[1] })) })),
      execs: (this.props.execs && this.props.execs.length) ? this.props.execs : [['John Wheeler', 'CEO'], ['Jeff Peel', 'COO'], ['Henry Neely', 'CFO'], ['Andrea Beck', 'CMO'], ['Karin Durham', 'CHRO'], ['Andrew Goldfein', 'VP of New Partnerships']].map((e) => ({ n: e[0], t: e[1], i: e[0].split(' ').map((w) => w[0]).join(''), iOnly: e[0].split(' ').map((w) => w[0]).join(''), href: '/team', img: '' }))
    };
  }
}
