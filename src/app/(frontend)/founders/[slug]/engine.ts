// @ts-nocheck
/* Generated from design/boards/Founder.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class FounderEngine extends DCLogic {
  componentDidMount() {
    this.tall = typeof window !== 'undefined' && window.innerHeight > 1800;
    this.rm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.setState({ ok: 1 });
  }
  componentWillUnmount() { if (this.io) this.io.disconnect(); }

  /* CMS: Founder item, with Brand + Locations by reference */
  data() { return this.props.data; }

  
  renderVals() {
    const { b, f, path, rules, quotes, peers } = this.data(), on = !!(this.state || {}).pathOn || this.rm;
    return {
      b, f, quotes,
      heroH: this.tall ? '820px' : 'calc(100svh - 126px)',
      figs: [], hasFigs: false, hasRecord: false, record: [],
      hasPath: path.length > 1, hasRules: rules.length > 0, hasQuotes: quotes.length > 0,
      setPath: (el) => {
        if (!el || this.io || typeof IntersectionObserver === 'undefined') return;
        this.io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { this.setState({ pathOn: true }); this.io.disconnect(); } }, { threshold: .25 });
        this.io.observe(el);
      },
      tlCls: 'tl' + (on ? ' is-on' : ''),
      path: path.map((p, i) => ({ y: p.y, t: p.t, d: p.d, cls: 'step' + (p.alpha ? ' alpha' : (i === path.length - 2 ? ' now' : '')), delay: 200 + i * 140 })),
      rules: rules.map((r, i) => ({ n: String(i + 1).padStart(2, '0'), t: r.t, d: r.d })),
      peers: peers.map((p) => Object.assign({}, p, { hasImg: !!p.img, noImg: !p.img, init: p.name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('').slice(0, 2) }))
    };
  }
}
