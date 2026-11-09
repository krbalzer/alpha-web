// @ts-nocheck
/* Generated from design/boards/Podcasts.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class PodcastsEngine extends DCLogic {
  componentDidMount() {
    this.rm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.timer = setInterval(() => this.tick(), 100);
    this.setState({ hi: 0, he: 0, hg: 0 });
  }
  componentWillUnmount() { clearInterval(this.timer); }
  st() { return this.state || {}; }
  tick() {
    const s = this.st(), o = {}; let dirty = false;
    if (this.props.autoplay !== false && !s.paused && !this.rm) { const he = (s.he || 0) + 100; if (he >= 7000) { o.hi = ((s.hi || 0) + 1) % this.data().feat.length; o.he = 0; o.hg = (s.hg || 0) + 1; } else o.he = he; dirty = true; }
    
    if (dirty) this.setState(o);
  }

  /* CMS: Shows + Episodes. In production this reads a prebuilt JSON index, not 130 DOM items. */
  data() { return this.props.data; }
  hit(e, f, q, skip) {
    const has = (k, v) => !f[k] || !f[k].length || f[k].some((x) => (k === 'show' ? e.show === x : e[k].indexOf(x) >= 0));
    for (const k of ['show', 'topics', 'aud', 'spk']) if (k !== skip && !has(k)) return false;
    if (q) { const D = this.data(), hay = (e.title + ' ' + D.S[e.show].name + ' ' + e.topics.join(' ') + ' ' + e.aud.join(' ') + ' ' + e.spk.map((x) => D.P[x]).join(' ')).toLowerCase(); if (hay.indexOf(q) < 0) return false; }
    return true;
  }
  fmt(x) { x = Math.round(x); return Math.floor(x / 60) + ':' + String(x % 60).padStart(2, '0'); }
  dfmt(d) { const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], p = d.split('-'); return m[+p[1] - 1] + ' ' + +p[2] + ', ' + p[0]; }
  init(name) { return name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('').slice(0, 2); }

  
  renderVals() {
    const D = this.data(), s = this.st(), set = (o) => this.setState(o);
    const f = s.f || {}, q = (s.q || '').trim().toLowerCase(), sort = s.sort || 'new';
    const setF = (k, v) => { const cur = (f[k] || []).slice(), i = cur.indexOf(v); if (i >= 0) cur.splice(i, 1); else cur.push(v); set({ f: Object.assign({}, f, { [k]: cur }), shown: 10, path: null, shared: false }); };
    const hi = s.hi || 0, hk = D.feat[hi], hs = D.S[hk], lat = D.E.filter((e) => e.show === hk)[0] || { title: '', n: '', label: '' };
    const play = (id) => { const ep = (D.E.find((x) => x.id === id) || {}).ep; if (typeof window !== 'undefined' && ep) window.dispatchEvent(new CustomEvent('alpha:play', { detail: ep })); };
    let res = D.E.filter((e) => this.hit(e, f, q));
    res.sort((a, b) => sort === 'old' ? a.date.localeCompare(b.date) : sort === 'short' ? a.sec - b.sec : b.date.localeCompare(a.date));
    const shown = s.shown || 10;
    const active = []; D.G.forEach((g) => (f[g.key] || []).forEach((v) => { const o = g.opts.find((x) => x.v === v); active.push({ k: g.t, t: o ? o.t : v, go: () => setF(g.key, v) }); }));
    if (q) active.push({ k: 'Search', t: '“' + s.q + '”', go: () => set({ q: '' }) });
    const last = active[active.length - 1], nAct = active.length;
    const now = s.now != null ? D.E[s.now] : null;
    const eq = (a, b) => ['show','topics','aud','spk'].every((k) => JSON.stringify((a[k] || []).slice().sort()) === JSON.stringify((b[k] || []).slice().sort()));
    return {
      slides: D.feat.map((k, i) => ({ hero: D.S[k].hero || '', art: D.S[k].art, noArt: !D.S[k].art, cls: 'tv_slide' + (D.S[k].hero ? ' has-hero' : '') + (i === hi ? ' is-on' : ''), bg: D.S[k].bg, fg: D.S[k].fg, short: D.S[k].short, hidden: i === hi ? 'false' : 'true' })),
      heroTxtCls: 'tv_txt' + (s.hg ? ((s.hg % 2) ? ' gA' : ' gB') : ''),
      hs: Object.assign({}, hs, { ep: lat, play: () => play(lat.id) }), hasPaths: D.paths.length > 0,
      pause: () => set({ paused: true }), resume: () => set({ paused: false }),
      showCount: Object.keys(D.S).length, epCount: String(D.E.length),
      shelf: Object.keys(D.S).map((k) => { const fi = D.feat.indexOf(k); return { logo: D.S[k].logo || '', noLogo: !D.S[k].logo, ar: D.S[k].ar, short: D.S[k].short, sched: D.S[k].sched, bg: D.S[k].bg, fg: D.S[k].fg,
        cls: 'sh' + (fi === hi ? ' is-on' : ''), prog: fi === hi ? Math.min(100, (s.he || 0) / 70) : 0,
        go: () => { if (fi >= 0) set({ hi: fi, he: 0, hg: (s.hg || 0) + 1 }); else set({ f: { show: [k] }, shown: 10, path: null }); } }; }),
      paths: D.paths.map((p) => ({ t: p.t, cls: 'path' + (eq(f, p.f) ? ' is-on' : ''), go: () => set({ f: eq(f, p.f) ? {} : JSON.parse(JSON.stringify(p.f)), shown: 10, q: '' }) })),
      railCls: 'rail' + (s.rail ? ' is-open' : ''), openRail: () => set({ rail: true }), closeRail: () => set({ rail: false }),
      q: s.q || '', onQ: (e) => set({ q: e.target.value, shown: 10 }),
      groups: D.G.map((g) => { const open = s['g_' + g.key] !== false, sel = f[g.key] || [];
        return { t: g.t, badge: sel.length ? sel.length + ' on' : (open ? '−' : '+'), open, exp: open ? 'true' : 'false', toggle: () => set({ ['g_' + g.key]: !open }), listCls: 'fl' + (g.face ? ' tall' : ''),
          opts: g.opts.map((o) => { const on = sel.indexOf(o.v) >= 0, n = D.E.filter((e) => this.hit(e, Object.assign({}, f, { [g.key]: [o.v] }), q, null) ).length;
            return { t: o.t, n: on ? '' : n, on: on ? 'true' : 'false', dis: !on && n === 0, cls: 'opt2' + (on ? ' is-on' : ''), go: () => setF(g.key, o.v), faceCls: g.face ? 'of' : 'nf', init: g.face ? this.init(o.t) : '' }; }) }; }),
      nRes: res.length, nResLabel: res.length === 1 ? 'episode' : 'episodes',
      activeCountLabel: nAct ? '(' + nAct + ')' : '',
      sorts: [['new', 'Newest'], ['old', 'Oldest'], ['short', 'Shortest']].map((o) => ({ t: o[1], cls: 'sb' + (sort === o[0] ? ' is-on' : ''), go: () => set({ sort: o[0] }) })),
      hasActive: nAct > 0, active, clearAll: () => set({ f: {}, q: '', shown: 10 }),
      share: () => { const qs = []; ['show','topics','aud','spk'].forEach((k) => { if ((f[k] || []).length) qs.push(k + '=' + encodeURIComponent(f[k].join(','))); }); if (q) qs.push('q=' + encodeURIComponent(s.q)); try { navigator.clipboard.writeText(location.origin + '/podcasts?' + qs.join('&')); } catch (err) {} set({ shared: true }); },
      shareLabel: s.shared ? 'Link copied' : 'Share this list',
      rows: res.slice(0, shown).map((e) => { const sh = D.S[e.show]; return { href: e.href, art: sh.art, artText: sh.art ? '' : sh.short, meta: sh.name + (e.n ? ' · EP ' + e.n : '') + ' · ' + this.dfmt(e.date), title: e.title, n: e.n, show: sh.name, short: sh.short, bg: sh.bg, fg: sh.fg, date: this.dfmt(e.date), len: e.len,
        cls: 'row' + (s.now === e.id ? ' is-now' : ''), icon: s.now === e.id && s.playing ? '❚❚' : '▶', play: () => play(e.id),
        spk: e.spk.map((p) => ({ name: D.P[p], init: this.init(D.P[p]), go: () => setF('spk', p) })),
        tags: e.topics.slice(0, 2).map((t) => ({ t, cls: 'tg' + ((f.topics || []).indexOf(t) >= 0 ? ' is-on' : ''), go: () => setF('topics', t) })) }; }),
      empty: res.length === 0, dropLast: () => last && last.go(), lastLabel: last ? last.t : '',
      hasMore: res.length > shown, shownN: Math.min(shown, res.length), loadMore: () => set({ shown: shown + 10 }),
      hasNow: false, now: now ? { title: now.title, n: now.n, show: D.S[now.show].name, short: D.S[now.show].short, bg: D.S[now.show].bg, fg: D.S[now.show].fg } : {},
      toggle: () => set({ playing: !s.playing }), playLabel: s.playing ? 'Pause' : 'Play', playIcon: s.playing ? '❚❚' : '▶',
      nowPct: now ? ((s.t || 0) / now.sec * 100).toFixed(2) : 0, nowTime: now ? this.fmt(s.t || 0) + ' / ' + this.fmt(now.sec) : ''
    };
  }
}
