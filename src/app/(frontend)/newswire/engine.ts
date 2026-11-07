// @ts-nocheck
/* Generated from design/boards/Newswire.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class NewswireEngine extends DCLogic {
  data() { return this.props.data; }
  fd(d) { const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], p = d.split('-'); return m[+p[1] - 1] + ' ' + +p[2]; }
  
  renderVals() {
    const R = this.data(), s = this.state || {}, f = s.f || 'All', q = (s.q || '').toLowerCase();
    const res = R.filter((r) => (f === 'All' || r.tag === f) && (!q || r.t.toLowerCase().indexOf(q) >= 0));
    const ys = res.map((r) => r.date.slice(0, 4)).filter((v, i, a) => a.indexOf(v) === i);
    const top = R[0];
    return {
      top: { date: this.fd(top.date) + ', ' + top.date.slice(0, 4), tag: top.tag, t: top.t, tone: '#8C7350', sum: top.sum, href: top.href, img: top.img },
      tabs: ['All', 'New partner', 'Expansion', 'Network'].map((t) => ({ t, n: String(t === 'All' ? R.length : R.filter((r) => r.tag === t).length), cls: 'chipb' + (f === t ? ' is-on' : ''), go: () => this.setState({ f: t }) })),
      q: s.q || '', onQ: (e) => this.setState({ q: e.target.value }),
      years: ys.map((y) => ({ y, items: res.filter((r) => r.date.slice(0, 4) === y).map((r) => ({ href: r.href, d: this.fd(r.date), t: r.t, tag: r.tag, ptr: r.ptr ? 'PTR ' + r.ptr : '' })) })),
      empty: res.length === 0
    };
  }
}
