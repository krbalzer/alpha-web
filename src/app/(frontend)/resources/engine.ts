// @ts-nocheck
/* Generated from design/boards/Resources.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class ResourcesEngine extends DCLogic {
  data() {
    return [
      ['M&A', 'The Ultimate Guide to Selling Your Med Spa', 'eBook', 'PDF', 'What buyers look at, what it is worth, and how to prepare.'],
      ['M&A', 'The Ultimate Med Spa M&A Checklist', 'Cheat sheet', 'PDF', 'Every document and decision, in order.'],
      ['M&A', 'The 5 Biggest Mistakes Med Spa Owners Make When Selling', 'Webinar', 'Video', 'An exclusive webinar.'],
      ['M&A', 'Med Spa Business Valuation', 'Tool', '[Format]', '[Short description]'],
      ['M&A', 'In-Depth P&L Opportunity Analysis', 'Tool', '[Format]', '[Short description]'],
      ['Marketing', 'Social Media Toolkit', 'eBook', 'PDF', 'Every tool you need for scaling to 30K+ followers.'],
      ['Marketing', 'Strategy to Boost Engagement on Instagram', '30-minute strategy', 'PDF', '[Short description]'],
      ['Marketing', 'Content Calendar Template', 'Template', 'Google Sheet', 'Plan your social content, because if you fail to plan you plan to fail.'],
      ['Marketing', 'GBP Optimization Checklist', 'Checklist', 'Google Doc', '[Short description]'],
      ['Marketing', 'YouTube Ad Scripts', 'Scripts', 'Google Doc', 'Ad scripts patients actually respond to.'],
      ['Marketing', 'Med Spa Ads That Actually Convert', 'Masterclass', 'Video', '[Short description]'],
      ['Marketing', 'Influencer Contract', 'Template', 'PDF', 'Find and manage influencers who make your life easier.'],
      ['Growth', '3 Minute Consult', 'Playbook', 'PDF', 'Double or even triple the lifetime value of each new patient.'],
      ['Growth', 'Reactivation Campaign', 'Scripts', 'Google Doc', 'Turn inactive patients into top spenders with three simple texts.'],
      ['Operations', 'Med Spa Scoreboard', 'Template', 'Google Sheet', '[Short description]']
    ].map((r) => ({ cat: r[0], t: r[1], type: r[2], fmt: r[3], d: r[4] }));
  }
  
  renderVals() {
    const R = this.data(), s = this.state || {}, f = s.f || 'All', set = (o) => this.setState(o);
    const bg = { 'M&A': '#2E2A25', Marketing: '#56646E', Growth: '#7B3C26', Operations: '#4C5949' }, ic = { 'M&A': '$', Marketing: '@', Growth: '↗', Operations: '#' };
    return {
      tabs: ['All', 'M&A', 'Marketing', 'Growth', 'Operations'].map((t) => ({ t, n: t === 'All' ? '' : String(R.filter((r) => r.cat === t).length), cls: 'chipb' + (f === t ? ' is-on' : ''), go: () => set({ f: t }) })),
      items: R.filter((r) => f === 'All' || r.cat === f).map((r) => Object.assign({}, r, { bg: bg[r.cat], icon: ic[r.cat], cta: s.ok ? 'Download' : 'Get it', go: () => { if (!s.ok) set({ gate: r.t }); } })),
      unlocked: !!s.ok, who: s.name || 'you',
      gateOpen: !!s.gate, gateTitle: s.gate || '', closeGate: () => set({ gate: null }), stop: (e) => e.stopPropagation(),
      gName: s.name || '', onName: (e) => set({ name: e.target.value }),
      unlock: () => set({ ok: true, gate: null })
    };
  }
}
