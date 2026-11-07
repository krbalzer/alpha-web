// @ts-nocheck
/* Generated from design/boards/Profile.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class ProfileEngine extends DCLogic {
  componentDidMount() { this.tall = typeof window !== 'undefined' && window.innerHeight > 1800; this.setState({ g: 0 }); }
  componentWillUnmount() { if (this.io) this.io.disconnect(); }
  st() { return this.state || {}; }

  /* CMS: Team Member items, filtered to one Department for the hero slider */
  data() { return this.props.data; }

  
  renderVals() {
    const D = this.data(), s = this.st(), set = (o) => this.setState(o);
    const N = D.team.length, i = s.i == null ? (D.start || 0) : s.i, p = D.team[i], dept = D.depts.find((x) => x.slug === p.dept);
    const go = (j, dir) => { j = (j + N) % N; if (j === i) return; set({ i: j, dx: dir * 60, g: (s.g || 0) + 1, focus: null, qi: 0, attr: null }); if (typeof history !== 'undefined' && D.team[j].href) history.replaceState(history.state, '', D.team[j].href); };
    const g = (s.g || 0) % 2 ? ' gA' : ' gB', anim = s.g ? g : '';
    const focus = s.focus || p.dept, fd = D.depts.find((x) => x.slug === focus), ROW = 56;
    const keys = ['Start → LOI', 'LOI → Closed', 'Closed → Integrated', 'Ongoing'];
    const qi = p.quotes.length ? (s.qi || 0) % p.quotes.length : 0, q = p.quotes[qi] || { q: '', who: '', role: '' };
    const flt = s.flt || 'all', dn = (k) => (D.depts.find((x) => x.slug === k) || { name: k === 'lead' ? 'Leadership' : k }).name;
    const ai = s.attr == null ? -1 : s.attr;
    if (!dept) return {};
    return {
      p: Object.assign({}, p, { noImg: !p.img }), deptName: dept ? dept.name : '', deptHref: D.deptHref,
      hasAttrs: p.attrs.length > 0, hasRecord: p.before.length > 0 || p.work.length > 0, hasWork: p.work.length > 0, hasQuotes: p.quotes.length > 0, hasYb: !!p.yb,
      heroH: this.tall ? '820px' : 'calc(100svh - 92px)',
      count: String(i + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0'),
      roster: D.team.map((t, j) => ({ init: t.init || '+', name: t.first + ' ' + t.last, cls: 'rf' + (j === i ? ' is-on' : ''), cur: j === i ? 'true' : 'false', go: () => go(j, j > i ? 1 : -1) })),
      figCls: 'ph_fig' + anim, txtCls: 'ph_txt' + anim, dx: s.dx || 0,
      next: () => go(i + 1, 1), prev: () => go(i - 1, -1),
      nextName: D.team[(i + 1) % N].first + ' ' + D.team[(i + 1) % N].last, prevName: D.team[(i - 1 + N) % N].first,
      heroKey: (e) => { if (e.key === 'ArrowRight') go(i + 1, 1); if (e.key === 'ArrowLeft') go(i - 1, -1); },
      attrs: p.attrs.map((a, j) => ({ t: a.t, cls: 'attr' + (j === ai ? ' is-on' : ''), go: () => set({ attr: j === ai ? null : j }) })),
      attrLine: ai >= 0 ? p.attrs[ai].d : 'Tap a word to see who said it.',
      marks: D.marks, tlH: D.depts.length * ROW - 10, tlCls: 'tl' + (s.tlOn ? ' is-on' : ''),
      bars: D.depts.map((x, k) => ({ name: x.name, l: x.l, w: Math.min(x.r, 101) - x.l, top: k * ROW, delay: 120 + k * 120,
        cls: 'tlb' + (x.r > 100 ? ' ongoing' : '') + (x.slug === p.dept ? ' home' : '') + (x.slug === focus ? ' is-on' : ''), on: x.slug === focus ? 'true' : 'false',
        faces: x.slug === p.dept ? D.team.map((t) => t.init) : ['', '', '', ''], go: () => set({ focus: x.slug }) })),
      setTl: (el) => { if (!el || this.io || typeof IntersectionObserver === 'undefined') return; this.io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { set({ tlOn: true }); this.io.disconnect(); } }, { threshold: .2 }); this.io.observe(el); },
      phases: fd.ph.map((t, k) => ({ k: keys[k], t, cls: 'ph4' + (t.indexOf('Not involved') === 0 ? '' : ' live') })),
      focusName: fd.name, notHome: focus !== p.dept, resetFocus: () => set({ focus: null }),
      q: Object.assign({ init: '' }, q), qCount: String(qi + 1).padStart(2, '0') + ' / ' + String(p.quotes.length).padStart(2, '0'),
      qNext: () => set({ qi: qi + 1 }), qPrev: () => set({ qi: qi - 1 + p.quotes.length }),
      hasPods: p.pods.length > 0,
      filters: ['all', p.dept, 'np', 'fin', 'lead'].filter((v, k, a) => a.indexOf(v) === k).map((f) => ({ t: f === 'all' ? 'Everyone' : dn(f), cls: 'flt' + (flt === f ? ' is-on' : ''), go: () => set({ flt: f }) })),
      others: D.everyone.filter((o) => o.slug !== p.slug && (flt === 'all' || o.dept === flt)).map((o) => ({ name: o.first + ' ' + o.last, init: o.init, iOnly: o.img ? '' : o.init, img: o.img, href: o.href, title: o.title, dept: dn(o.dept),
        go: () => { const j = D.team.indexOf(o); if (j >= 0) { go(j, j > i ? 1 : -1); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); } } }))
    };
  }
}
