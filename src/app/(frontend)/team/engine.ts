// @ts-nocheck
/* Generated from design/boards/Team.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class TeamEngine extends DCLogic {
  data() { return this.props.data; }
  
  renderVals() {
    const { D, T } = this.data(), s = this.state || {}, f = s.f || 'all';
    const uniq = T.filter((t, i) => T.findIndex((x) => x[1] === t[1]) === i || t[1].charAt(0) === '[');
    return {
      total: uniq.length + '+',
      tabs: [{ k: 'all', t: 'Everyone', n: '' }].concat(D.map((d) => ({ k: d.k, t: d.t, n: String(T.filter((x) => x[0] === d.k).length) }))).map((t) => ({ t: t.t, n: t.n, cls: 'chipb' + (f === t.k ? ' is-on' : ''), go: () => this.setState({ f: t.k }) })),
      secs: D.filter((d) => f === 'all' || d.k === f).map((d) => ({ t: d.t, line: d.line, hasLink: d.link !== false,
        href: d.href, people: T.filter((x) => x[0] === d.k).map((x) => ({ n: x[1], t: x[2], ask: x[3], href: x[4], img: x[5], iOnly: x[5] ? '' : x[1].split(' ').map((w) => w[0]).join(''), i: x[1].charAt(0) === '[' ? '' : x[1].split(' ').map((w) => w[0]).join(''), cls: 'tp' + (d.k === 'lead' ? ' lead_p' : '') })) }))
    };
  }
}
