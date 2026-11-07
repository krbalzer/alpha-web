// @ts-nocheck
/* Map engine + template logic from the Brand board. Production swap: Mapbox GL for the canvas map. */
import { DCLogic } from '@/lib/dc'

export class BrandEngine extends DCLogic {
  componentDidMount() {
    this.rm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.tall = typeof window !== 'undefined' && window.innerHeight > 1800;
    this.idx = 0;
    this.bump();
  }
  componentWillUnmount() { if (this.raf) cancelAnimationFrame(this.raf); if (this.io) this.io.disconnect(); }
  bump() { this.setState({ n: ((this.state || {}).n || 0) + 1 }); }
  /* ---------- locations index: city names rise out of a mask, like the menu ---------- */
  watchLx(el) {
    if (!el || this.lxIO || typeof IntersectionObserver === 'undefined') return;
    if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.lxIn = false;
    this.lxIO = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      this.lxIO.disconnect();
      requestAnimationFrame(() => { this.lxIn = true; this.bump(); });
    }, { threshold: .25 });
    this.lxIO.observe(el);
    this.bump();
  }
  /* ---------- stat count-up: runs once when the stats scroll into view ---------- */
  watchStats(el) {
    if (!el || this.statIO || typeof IntersectionObserver === 'undefined') return;
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { this.statP = 1; return; }
    this.statP = 0;
    this.statIO = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      this.statIO.disconnect();
      const t0 = this.now(), dur = 1600;
      const step = () => { const t = Math.min(1, (this.now() - t0) / dur); this.statP = 1 - Math.pow(1 - t, 3); this.bump(); if (t < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: .35 });
    this.statIO.observe(el);
  }
  /* "2.5K" counts 0.0K to 2.5K, "26,520" keeps its commas; anything non-numeric shows as is */
  counted(list) {
    const p = this.statP == null ? 1 : this.statP;
    return (list || []).map((s) => {
      const m = String(s.n).match(/^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/);
      if (!m || p >= 1) return s;
      const raw = m[2].replace(/,/g, ''), dec = (raw.split('.')[1] || '').length, v = parseFloat(raw) * p;
      const num = m[2].includes(',') ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec);
      return { ...s, n: m[1] + num + m[3] };
    });
  }
  now() { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }

  /* ---------- CMS item (one Brand) ---------- */
  brand() { return this.props.brand; }
  locs() { const L = this.brand().locations; return this.props.singleLocation ? L.slice(0, 1) : L; }
  W(lng, lat) { return { x: (lng + 125.5) * 20.338, y: (50 - lat) * 25.81 + 20 }; }

  /* ---------- map geometry ---------- */
  dots() {
    if (this._dots) return this._dots;
    const poly = [[-124.7,48.4],[-124.1,46.2],[-124.5,42.8],[-124.2,40.4],[-123.7,38.9],[-122.4,37.2],[-120.6,34.6],[-117.1,32.5],[-114.7,32.7],[-111,31.3],[-108.2,31.3],[-106.5,31.8],[-104.5,29.6],[-103.2,29],[-101.4,29.8],[-99.5,27.5],[-97.2,25.9],[-97.4,27.8],[-94.8,29.3],[-93.8,29.7],[-91.5,29.3],[-89.6,29],[-89.2,30.3],[-87.5,30.3],[-85.3,29.7],[-84,30],[-82.8,28.9],[-82.6,27.5],[-81.7,25.9],[-80.4,25.2],[-80,26.8],[-80.6,28.4],[-81.4,30.7],[-81,31.9],[-79,33.5],[-77.9,34],[-75.5,35.3],[-76,37],[-75.2,38.1],[-74,39.6],[-73.9,40.6],[-72,41.1],[-70,41.6],[-70.6,42.6],[-70.2,43.7],[-67,44.8],[-67.8,47.1],[-69.2,47.4],[-70.9,45.3],[-74.9,45],[-76.5,44.2],[-79.2,43.4],[-79,42.8],[-82.5,41.7],[-83.5,42.1],[-82.4,43],[-82.5,45.3],[-84.5,45.8],[-84.7,46.5],[-88,48],[-89.6,48],[-95.2,49],[-123,49]].map((p) => this.W(p[0], p[1]));
    this._poly = poly;
    const out = [];
    for (let gy = 0; gy < 720; gy += 12) for (let gx = 0; gx < 1200; gx += 12) {
      const x = gx + 6, y = gy + 6; let c = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) c = !c; }
      if (c) out.push(x, y);
    }
    return (this._dots = out);
  }
  inUS(x, y) {
    const poly = this._poly; let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) c = !c; }
    return c;
  }
  /* procedural blocks around each address; Mapbox replaces all of this in production */
  city(i) {
    this._city = this._city || {};
    const L = this.locs()[i], key = L.city; if (this._city[key]) return this._city[key];
    const c = this.W(L.lng, L.lat); let s = L.seed;
    const rnd = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const U = 1 / 4400, ca = Math.cos(L.ang), sa = Math.sin(L.ang);
    const w = (x, y) => [c.x + (x * ca - y * sa) * U, c.y + (x * sa + y * ca) * U];
    const Bk = 110, St = 22, R = 12, E = R * Bk, roads = [], blds = [], labels = [];
    for (let k = -R; k <= R; k++) { const o = k * Bk - Bk / 2, main = k % 4 === 0; roads.push([w(o, -E), w(o, E), main]); roads.push([w(-E, o), w(E, o), main]); }
    for (let bx = -R; bx < R; bx++) for (let by = -R; by < R; by++) {
      const x0 = bx * Bk - Bk / 2 + St / 2, y0 = by * Bk - Bk / 2 + St / 2, Lb = Bk - St;
      if (Math.hypot(x0 + Lb / 2, y0 + Lb / 2) > E * .96 || rnd() < .07) continue;
      const n = rnd() < .5 ? 2 : 3, lot = Lb / n;
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
        if (rnd() < .14) continue;
        const bw = lot * (.55 + .35 * rnd()), bd = lot * (.55 + .35 * rnd()), lx = x0 + a * lot + (lot - bw) / 2, ly = y0 + b * lot + (lot - bd) / 2;
        blds.push({ g: [w(lx, ly), w(lx + bw, ly), w(lx + bw, ly + bd), w(lx, ly + bd)], h: (5 + Math.pow(rnd(), 2.4) * (L.hmax - 5)) * 1.6 * U });
      }
    }
    L.streets.forEach((t, k) => { const o = [-4, 0, 4, -8, 8][k % 5] * Bk - Bk / 2 + 14, along = [-380, 300, -260, 420, 200][k % 5]; labels.push({ p: k % 2 ? w(o, along) : w(along, o), t }); });
    return (this._city[key] = { roads, blds, labels, c });
  }

  /* ---------- camera ---------- */
  zc() { return 2300 * (this.cw || 1440) / 1440; }
  zu() { return (this.cw || 1440) / 1200 * .9; }
  cam0() {
    if (!this.cam) { const c = this.W(this.locs()[0].lng, this.locs()[0].lat); this.cam = { x: c.x, y: c.y, z: this.zu() * 1.3, b: 0 }; }
    return this.cam;
  }
  fly(to, intro) {
    const cam = this.cam0(), L = this.locs(), b = this.W(L[to].lng, L[to].lat), a = { x: cam.x, y: cam.y };
    const d = Math.hypot(b.x - a.x, b.y - a.y), zEnd = this.zc();
    let b0 = cam.b % (Math.PI * 2); if (b0 > Math.PI) b0 -= Math.PI * 2;
    this.F = { a, b, d, zA: cam.z, zEnd, zMid: Math.min(zEnd * .3, (this.cw || 1440) * .4 / Math.max(d, 1)), b0, t0: this.now(), dur: this.rm ? 1 : (intro ? 2600 : 3200), intro, from: this.shown, to };
    this.pinOn = false; this.bump();
  }
  go(i) {
    const L = this.locs(); if (i < 0 || i >= L.length || i === this.idx || this.F) return;
    this.idx = i; this.fly(i, false);
  }
  tick(now, dt) {
    const cam = this.cam0(), F = this.F;
    if (F) {
      const t = Math.min(1, (now - F.t0) / F.dur), e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const lzA = Math.log(F.zA), lzE = Math.log(F.zEnd);
      if (F.intro) { cam.x = F.b.x; cam.y = F.b.y; cam.z = Math.exp(lzA + (lzE - lzA) * e); }
      else {
        cam.x = F.a.x + (F.b.x - F.a.x) * e; cam.y = F.a.y + (F.b.y - F.a.y) * e;
        const base = lzA + (lzE - lzA) * e; cam.z = Math.exp(base + (Math.log(F.zMid) - base) * Math.pow(Math.sin(Math.PI * t), .8));
      }
      cam.b = F.b0 * (1 - Math.min(1, t / .45));
      if (t >= 1) { this.F = null; this.shown = F.to; this.pinOn = true; this.pinG = !this.pinG; this.bump(); }
    } else if (this.pinOn && !this.rm) cam.b += dt * .000016;
  }
  loop() {
    this.raf = requestAnimationFrame(() => this.loop());
    if (!this.inView || (typeof document !== 'undefined' && document.hidden)) { this.last = 0; return; }
    const now = this.now(), dt = this.last ? Math.min(64, now - this.last) : 16; this.last = now;
    this.tick(now, dt); if (!this.props.mapbox) this.draw(now);
  }

  /* ---------- render ---------- */
  draw(now) {
    const cv = this.cv, ctx = this.ctx; if (!cv || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1), Wc = cv.clientWidth, Hc = cv.clientHeight; if (!Wc || !Hc) return;
    if (cv.width !== Math.round(Wc * dpr) || cv.height !== Math.round(Hc * dpr)) { cv.width = Math.round(Wc * dpr); cv.height = Math.round(Hc * dpr); }
    this.cw = Wc;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#151513'; ctx.fillRect(0, 0, Wc, Hc);
    const cam = this.cam0(), z = cam.z, zc = this.zc(), zu = this.zu();
    const k = Math.max(0, Math.min(1, (Math.log(z) - Math.log(zu)) / (Math.log(zc) - Math.log(zu))));
    const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const cityA = sm(.6, .86, k);
    const pit = (16 + 44 * k) * Math.PI / 180, ox = Wc / 2, oy = Hc * .5, Dp = Hc * 1.7;
    const cb = Math.cos(cam.b), sb = Math.sin(cam.b), cp = Math.cos(pit), sp = Math.sin(pit);
    const P = (wx, wy, u) => {
      const dx = (wx - cam.x) * z, dy = (wy - cam.y) * z, rx = dx * cb - dy * sb, ry = dx * sb + dy * cb, e = (u || 0) * z;
      const Y = ry * cp - e * sp, dep = -ry * sp - e * cp, den = Dp + dep; if (den < 60) return null;
      const f = Dp / den; return [ox + rx * f, oy + Y * f, dep, f];
    };
    const L = this.locs();

    /* the home page dot field, repeated at finer scales so the zoom never goes empty */
    const D = this.dots(), fade = 1 - cityA * .9;
    [12, 4, 4 / 3, 4 / 9, 4 / 27, 4 / 81].forEach((g) => {
      const spx = g * z, a = (g === 12 ? 1 : sm(12, 22, spx)) * (1 - sm(46, 96, spx)) * fade; if (a < .01) return;
      ctx.fillStyle = 'rgba(232,228,218,' + ((g === 12 ? .42 : .5) * a).toFixed(3) + ')';
      const dot = (x, y) => { const p = P(x, y, 0); if (!p || p[0] < -6 || p[0] > Wc + 6 || p[1] < -6 || p[1] > Hc + 6) return; const r = Math.min(3.2, Math.max(1.2, 1.9 * p[3])); ctx.fillRect(p[0] - r / 2, p[1] - r / 2, r, r); };
      if (g === 12) { for (let i = 0; i < D.length; i += 2) dot(D[i], D[i + 1]); return; }
      const hx = Wc / z * .85, hy = Hc / z * 1.7, x0 = Math.floor((cam.x - hx) / g), x1 = Math.ceil((cam.x + hx) / g), y0 = Math.floor((cam.y - hy) / g), y1 = Math.ceil((cam.y + hy) / g);
      if ((x1 - x0) * (y1 - y0) > 26000) return;
      for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) { const x = (gx + .5) * g, y = (gy + .5) * g; if (g < 1 || this.inUS(x, y)) dot(x, y); }
    });
    const pa = 1 - cityA;
    if (pa > .01) {
      ctx.fillStyle = 'rgba(232,228,218,' + pa.toFixed(3) + ')';
      L.forEach((l) => { const w = this.W(l.lng, l.lat), p = P(w.x, w.y, 0); if (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, 6.2832); ctx.fill(); } });
    }

    /* street layer */
    if (cityA > .01) {
      ctx.globalAlpha = cityA; ctx.lineCap = 'butt';
      L.forEach((l, i) => {
        const C = this.city(i), cc = P(C.c.x, C.c.y, 0);
        if (Math.hypot(C.c.x - cam.x, C.c.y - cam.y) * z > Wc * 2.2) return;
        C.roads.forEach((r) => { const a = P(r[0][0], r[0][1], 0), b = P(r[1][0], r[1][1], 0); if (!a || !b) return; ctx.strokeStyle = r[2] ? 'rgba(232,228,218,.11)' : 'rgba(232,228,218,.05)'; ctx.lineWidth = r[2] ? 2 : 1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
        const list = [];
        for (const bd of C.blds) {
          const q = []; let ok = true, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, ds = 0;
          for (let j = 0; j < 4; j++) {
            const g = P(bd.g[j][0], bd.g[j][1], 0), t = P(bd.g[j][0], bd.g[j][1], bd.h); if (!g || !t) { ok = false; break; }
            q.push(g, t); ds += g[2]; x0 = Math.min(x0, g[0], t[0]); x1 = Math.max(x1, g[0], t[0]); y0 = Math.min(y0, t[1]); y1 = Math.max(y1, g[1]);
          }
          if (ok && x1 > -10 && x0 < Wc + 10 && y1 > -10 && y0 < Hc + 10) list.push({ q, d: ds / 4 });
        }
        list.sort((a, b) => b.d - a.d);
        const mix = (v, fog) => Math.round(v * (1 - fog) + 21 * fog);
        for (const it of list) {
          const q = it.q, fog = Math.max(0, Math.min(.88, (it.d + Hc * .3) / (Hc * 2)));
          for (let j = 0; j < 4; j++) {
            const g = q[2 * j], t = q[2 * j + 1], g2 = q[2 * ((j + 1) % 4)], t2 = q[2 * ((j + 1) % 4) + 1];
            const ex = g2[0] - g[0], ey = g2[1] - g[1]; if (ex * (t[1] - g[1]) - ey * (t[0] - g[0]) <= 0) continue;
            const lum = .5 + .5 * Math.cos(Math.atan2(ey, ex) - .7), v = mix(24 + 30 * lum, fog);
            ctx.fillStyle = 'rgb(' + v + ',' + (v - 1) + ',' + (v - 3) + ')';
            ctx.beginPath(); ctx.moveTo(g[0], g[1]); ctx.lineTo(g2[0], g2[1]); ctx.lineTo(t2[0], t2[1]); ctx.lineTo(t[0], t[1]); ctx.closePath(); ctx.fill();
          }
          const v = mix(54, fog);
          ctx.fillStyle = 'rgb(' + v + ',' + (v - 1) + ',' + (v - 4) + ')'; ctx.strokeStyle = 'rgba(232,228,218,' + (.07 * (1 - fog)).toFixed(3) + ')'; ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(q[1][0], q[1][1]); ctx.lineTo(q[3][0], q[3][1]); ctx.lineTo(q[5][0], q[5][1]); ctx.lineTo(q[7][0], q[7][1]); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        ctx.font = '10px "Diatype Mono", ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(232,228,218,.42)';
        C.labels.forEach((lb) => { const p = P(lb.p[0], lb.p[1], 0); if (p && p[2] < Hc * 1.2) ctx.fillText(lb.t, p[0], p[1]); });
      });
      ctx.globalAlpha = 1;
    }

    /* the flight line, lifted off the ground like the network arcs */
    const F = this.F;
    if (F && !F.intro) {
      const t = (now - F.t0) / F.dur, pr = Math.max(0, Math.min(1, (t - .1) / .55)), fade = 1 - Math.max(0, (t - .82) / .18);
      if (pr > 0 && fade > 0) {
        ctx.strokeStyle = 'rgba(232,228,218,' + (.9 * fade).toFixed(3) + ')'; ctx.lineWidth = 1.4; ctx.beginPath(); let last = null;
        for (let s = 0; s <= 48; s++) {
          const u = pr * s / 48, p = P(F.a.x + (F.b.x - F.a.x) * u, F.a.y + (F.b.y - F.a.y) * u, Math.sin(Math.PI * u) * F.d * .22);
          if (!p) continue; if (last) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); last = p;
        }
        ctx.stroke();
        if (last && pr < 1) { ctx.fillStyle = '#E8E4DA'; ctx.beginPath(); ctx.arc(last[0], last[1], 3, 0, 6.2832); ctx.fill(); }
      }
    }
  }

  
  renderVals() {
    const B = this.brand(), L = this.locs(), idx = Math.min(this.idx || 0, L.length - 1), F = this.F;
    const st = (this.state || {});
    const mi = (a, b) => { const r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lng - a.lng) * r, h = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2; return Math.round(3958.8 * 2 * Math.asin(Math.sqrt(h))); };
    const route = F && !F.intro && F.from != null ? { from: L[F.from].city, to: L[F.to].city, mi: mi(L[F.from], L[F.to]).toLocaleString() + ' mi' } : (this._route || { from: '', to: '', mi: '' });
    if (F && !F.intro) this._route = route;
    return {
      b: { ...B, sinceLine: B.since ? 'Partner since ' + B.since : '' },
      metaLine: [[B.founder, B.cred].filter(Boolean).join(', '), B.services.join(' ')].filter(Boolean).join(' / '),
      hasVideo: !!B.heroVideo, posterOnly: !B.heroVideo && !!B.heroPoster, noMedia: !B.heroVideo && !B.heroPoster,
      founderHref: B.founderSlug ? '/founders/' + B.founderSlug : '/founders',
      // Film plays in place. Nothing loads until the click; then the rendition fits the screen and connection.
      playFilm: (e) => {
        const f = B.film || {};
        if (!f.src) { if (B.filmUrl) window.open(B.filmUrl, '_blank', 'noopener'); return; }
        const box = e && e.currentTarget && e.currentTarget.closest('.film');
        if (!box || box.querySelector('video')) return;
        const w = window.innerWidth, px = w * (window.devicePixelRatio || 1), c = navigator.connection;
        const slow = !!(c && (c.saveData || /(^|-)(2g|3g)$/.test(c.effectiveType || '')));
        const fast = !c || (c.downlink || 0) >= 10;
        const src = !slow && fast && f.uhd && px >= 2880 && w >= 1200 ? f.uhd : !slow && w > 820 ? f.src : (f.small || f.src);
        const v = document.createElement('video');
        v.className = 'film_vid'; v.src = src; v.controls = true; v.playsInline = true; v.preload = 'auto';
        if (B.filmPoster) v.poster = B.filmPoster;
        box.appendChild(v); box.classList.add('is-playing');
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      },
      heroH: this.tall ? '820px' : 'calc(100svh - 126px)',
      vidRef: (el) => {
        if (!el || el === this._vid) return;
        this._vid = el; el.muted = true;
        if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { el.removeAttribute('autoplay'); el.pause(); return; }
        const p = el.play && el.play(); if (p && p.catch) p.catch(() => {});
      },
      addrs: L.map((l) => [l.a1, l.a2].filter(Boolean).join(', ')),
      founderLine: [B.founder, B.cred].filter(Boolean).join(', '),
      servicesLine: B.services.slice(0, 4).join(', '),
      // flagship only, so 3+ location brands stay one tidy line
      metaLine: [[L[0].a1, L[0].a2].filter(Boolean).join(', '), [B.founder, B.cred].filter(Boolean).join(', '), B.services.slice(0, 4).join(', ')].filter(Boolean).join(' / '),
      setCanvas: (el) => { if (el && el !== this.cv) { this.cv = el; this.ctx = el.getContext('2d'); if (!this.raf && typeof requestAnimationFrame !== 'undefined') this.loop(); } },
      setMap: (el) => {
        if (!el || this.io || typeof IntersectionObserver === 'undefined') return;
        this.io = new IntersectionObserver((es) => { this.inView = es[0].isIntersecting; if (this.inView && !this.started) { this.started = true; this.cam0(); this.fly(this.idx || 0, true); } }, { threshold: .2 });
        this.io.observe(el);
      },
      routeCls: 'route' + (F && !F.intro ? ' is-on' : ''), route,
      pinCls: 'pin' + (this.pinOn ? ' is-on' : '') + (this.pinG ? ' gA' : ' gB'),
      pinDotCls: 'pin_dot' + (this.pinOn ? ' is-on' : ''),
      idx, multi: L.length > 1,
      count: String(idx + 1).padStart(2, '0') + ' / ' + String(L.length).padStart(2, '0'),
      prevCls: 'arw' + (idx === 0 ? ' is-off' : ''), nextCls: 'arw' + (idx === L.length - 1 ? ' is-off' : ''),
      prev: () => this.go(idx - 1), next: () => this.go(idx + 1),
      lxCls: 'lx_list' + (this.lxIn === false ? ' is-pre' : ''), setLx: (el) => this.watchLx(el),
      locHead: 'Visit ' + B.short, locCount: L.length + ' locations',
      locRows: L.map((l, i) => ({ n: String(i + 1).padStart(2, '0'), city: l.city + ', ' + l.st, addr: l.a1 ? [l.a1, l.a2].filter(Boolean).join(', ') : '', d: (.06 + i * .07).toFixed(2) + 's', d2: (.35 + i * .07).toFixed(2) + 's', href: l.slug ? '/locations/' + l.slug : '#location', bg: l.img ? 'center / cover no-repeat url(' + l.img + ')' : l.tone })),
      cards: L.map((l, i) => ({ img: l.img, noImg: !l.img, cls: 'card' + (i === idx ? ' is-on' : ''), go: () => this.go(i), aria: B.name + ', ' + l.city, cur: i === idx ? 'true' : 'false', tone: l.tone, city: l.city, name: B.name, a1: l.a1, a2: l.a2, st: l.st, est: B.est })),
      setStats: (el) => this.watchStats(el),
      stats: this.counted(B.stats), hasStats: B.stats.length > 0,
      _n: st.n
    };
  }
}
