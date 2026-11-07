// @ts-nocheck
/* Generated from design/boards/Dept.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class DeptEngine extends DCLogic {
  componentWillUnmount() { if (this.io) this.io.disconnect(); }
  st() { return this.state || {}; }

  /* CMS: Department item. The timeline module reads every Department. */
  data() { return this.props.data; }

  
  send(kind, answers, ids, done) {
    const v = {}; ids.forEach((id) => { const el = document.getElementById(id); v[id] = el ? el.value.trim() : ''; });
    const email = v['f-email'] || v['o-e'];
    if (!email || !/.+@.+\..+/.test(email)) { this.setState({ err: 'Add an email so we can reply.' }); return; }
    this.setState({ busy: true, err: '' });
    fetch('/talk/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind, answers, fields: v, page: location.pathname }) })
      .then((r) => { if (!r.ok) throw new Error(); this.setState({ busy: false }); done(); })
      .catch(() => this.setState({ busy: false, err: 'That did not send. Please try again.' }));
  }
  renderVals() {
    const D = this.data(), s = this.st(), set = (o) => this.setState(o), d = D.d;
    const focus = s.focus || d.slug, fd = D.depts.find((x) => x.slug === focus);
    const ROW = 56, on = !!s.tlOn;
    const bars = D.depts.map((x, i) => ({ name: x.name, l: x.l, w: Math.min(x.r, 101) - x.l, top: i * ROW, delay: 120 + i * 120,
      cls: 'tlb' + (x.r > 100 ? ' ongoing' : '') + (x.slug === d.slug ? ' home' : '') + (x.slug === focus ? ' is-on' : ''), on: x.slug === focus ? 'true' : 'false',
      faces: ['', '', '', ''], go: () => set({ focus: x.slug }) }));
    const keys = ['Start → LOI', 'LOI → Closed', 'Closed → Integrated', 'Ongoing'];
    const sel = D.partners[s.sel == null ? 1 : s.sel] || ['', '', 'k'], after = s.ba !== 'before';
    const stat = { r: 'Relaunched', p: 'In production', k: 'Brand kept' };
    const qs = s.q ?? 0, ans = s.ans || {}, isDone = qs >= 5, isContact = qs === 4, qq = D.Q[Math.min(qs, 3)];
    const answered = isContact || !!ans[qq.key];
    return {
      hasPlate: d.plate.length > 0, hasScope: d.scope.length > 0, hasNinety: d.ninety.length > 0, hasGrid: D.partners.length > 0, hasFaq: D.faq.length > 0,
      focusHref: '/team/' + focus,
      d: Object.assign({}, d, { scope: d.scope.map((x) => ({ a: x.a, d: x.d, you: 'dot ' + (x.you ? 'on' : 'off'), youLabel: x.you ? 'You approve' : 'Handled for you' })) }), team: D.team.map((p) => Object.assign({}, p, { iOnly: p.img ? '' : p.init })), marks: D.marks, bars, tlH: D.depts.length * ROW - 10,
      setTl: (el) => { if (!el || this.io || typeof IntersectionObserver === 'undefined') return; this.io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { set({ tlOn: true }); this.io.disconnect(); } }, { threshold: .2 }); this.io.observe(el); },
      tlCls: 'tl' + (on ? ' is-on' : ''),
      phases: fd.ph.map((t, i) => ({ k: keys[i], t, cls: 'ph4' + (t.indexOf('Not involved') === 0 ? '' : ' live') })),
      focusName: fd.name, notHome: focus !== d.slug, resetFocus: () => set({ focus: null }),
      sel: { n: sel[0], name: sel[1], statusLong: stat[sel[2]] + (sel[2] === 'r' ? ', site rebuilt' : ''), tone: after ? '#3A352E' : '#8E887D',
        hasImg: after && !!sel[3], noImg: !(after && sel[3]), img: sel[3] || '', phLabel: (after ? 'After' : 'Before') + ' / ' + sel[1] + (after ? ' today' : ', brand and site before Alpha') },
      beforeCls: after ? '' : 'is-on', afterCls: after ? 'is-on' : '', showBefore: () => set({ ba: 'before' }), showAfter: () => set({ ba: 'after' }),
      cells: D.partners.map((p, i) => ({ n: p[0], tag: stat[p[2]], aria: 'PTR ' + p[0] + ', ' + p[1] + ', ' + stat[p[2]], cls: 'cell ' + ({ r: 'rel', p: 'prod', k: 'kept' })[p[2]] + ((s.sel == null ? 1 : s.sel) === i ? ' is-on' : ''), go: () => set({ sel: i, ba: 'after' }) })),
      faq: D.faq.map((f, i) => ({ q: f.q, a: f.a, open: s.fq === i, exp: s.fq === i ? 'true' : 'false', cls: 'fq' + (s.fq === i ? ' is-open' : ''), go: () => set({ fq: s.fq === i ? null : i }) })),
      others: D.depts.filter((x) => x.slug !== d.slug).map((x, i) => ({ k: String(i + 1).padStart(2, '0'), name: x.name, line: x.line, href: '/team/' + x.slug })),
      notDone: !isDone, isDone, isChoice: !isContact && !isDone, isContact,
      q: { title: qq.title, hint: qq.hint, opts: qq.opts.map((o) => ({ label: o, on: ans[qq.key] === o ? 'true' : 'false', cls: ans[qq.key] === o ? 'opt is-on' : 'opt', pick: () => set({ ans: Object.assign({}, ans, { [qq.key]: o }) }) })) },
      qBars: [0, 1, 2, 3, 4].map((i) => ({ cls: i <= qs ? 'is-on' : '' })), qLabel: isContact ? 'Contact' : 'Your practice', qCount: String(Math.min(qs + 1, 5)).padStart(2, '0') + ' / 05',
      backVis: qs > 0 ? 'visible' : 'hidden', qBack: () => set({ q: Math.max(0, qs - 1) }),
      qNext: () => { if (!answered) return; if (isContact) return this.send('partner', ans, ['f-name', 'f-practice', 'f-email', 'f-phone'], () => set({ q: qs + 1 })); set({ q: qs + 1 }); }, nextDisabled: !answered || !!s.busy, nextOpacity: answered ? 1 : 0.4,
      nextLabel: isContact ? (s.busy ? 'Sending…' : 'Submit') : 'Next', contactHint: s.err || 'A real person replies within [one business day].', qReset: () => set({ q: 0, ans: {} })
    };
  }
}
