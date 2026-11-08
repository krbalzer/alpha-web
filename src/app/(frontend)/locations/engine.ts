// @ts-nocheck
/* Generated from design/boards/Locations.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class LocationsEngine extends DCLogic {
  componentDidMount() { this.rm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches; this.setState({ ok: 1 }); }
  componentWillUnmount() { if (this.raf) cancelAnimationFrame(this.raf); if (this.io) this.io.disconnect(); }
  bump() { this.setState({ n: ((this.state || {}).n || 0) + 1 }); }
  st() { return this.state || {}; }
  now() { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }
  W(lng, lat) { return { x: (lng + 125.5) * 20.338, y: (50 - lat) * 25.81 + 20 }; }

  /* CMS: Locations (lat/lng) referencing Brands and Founders. [Brackets] mark values still to confirm. */
  data() { return this.props.data; }
  /* Map still for locations with no photos: same street-grid language as the fly-in map, rendered once as SVG. */
  still(l) {
    this._still = this._still || {}; if (this._still[l.i]) return this._still[l.i];
    let s = l.seed; const rnd = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const deg = l.ang * 57.3, B = 22, o = (rnd() * B) | 0; let g = '';
    for (let y = -B * 3 + o; y < 220; y += B) for (let x = -B * 3 + o; x < 220; x += B) if (rnd() > .18) g += '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="' + (B - 6) + '" height="' + (B - 6) + '" fill="rgba(232,228,218,' + (.04 + rnd() * .07).toFixed(3) + ')"/>';
    for (let k = -B * 3 + o, n = 0; k < 220; k += B, n++) { const m = n % 4 === 0, c = m ? 'rgba(232,228,218,.22)' : 'rgba(232,228,218,.09)', w = m ? 1.6 : .8; g += '<path d="M' + k + ' -60V280M-60 ' + k + 'H280" stroke="' + c + '" stroke-width="' + w + '"/>'; }
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#151513"/><g transform="rotate(' + deg.toFixed(1) + ' 80 80) translate(-30 -30)">' + g + '</g><ellipse cx="80" cy="86" rx="9" ry="3" fill="rgba(232,228,218,.25)"/><path d="M80 52c-6.6 0-12 5.2-12 11.9C68 72.7 80 85 80 85s12-12.3 12-21.1C92 57.2 86.6 52 80 52z" fill="#E8E4DA"/><circle cx="80" cy="64" r="4.5" fill="#151513"/></svg>';
    return (this._still[l.i] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  }
  locs() { return this.data().L; }
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
  city(L) {
    this._city = this._city || {};
    const key = L.city; if (this._city[key]) return this._city[key];
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
  zu() { return Math.min((this.cw || 1440) / 1250, (this.ch || 720) / 640); }
  cam0() { if (!this.cam) this.cam = { x: 600, y: 340, z: this.zu(), b: 0 }; return this.cam; }

  /* one fly() for everything: to a location, into a cluster, or back out */
  fly(o) {
    const cam = this.cam0(), a = { x: cam.x, y: cam.y }, d = Math.hypot(o.x - a.x, o.y - a.y);
    let b0 = cam.b % (Math.PI * 2); if (b0 > Math.PI) b0 -= Math.PI * 2;
    const zMid = o.arc ? Math.min(o.z * .3, cam.z, (this.cw || 1440) * .4 / Math.max(d, 1)) : null;
    this.F = { a, b: { x: o.x, y: o.y }, d, zA: cam.z, zEnd: o.z, zMid, arc: !!o.arc && d > 3, b0, t0: this.now(), dur: this.rm ? 1 : (o.dur || 2600), toLoc: o.loc || null, fromLoc: this.selLoc || null, done: o.done };
    this.bump();
  }
  flyTo(i) {
    const l = this.data().L[i], w = this.W(l.lng, l.lat), far = !this.selLoc;
    this.hov = null; this.selLoc = null; this.landed = false;
    this.fly({ x: w.x, y: w.y, z: this.zc(), arc: !far, loc: l, dur: far ? 2400 : 3000, done: () => { this.selLoc = l; this.landed = true; this.pinG = !this.pinG; this.bump(); } });
    this.setState({ sel: i });
  }
  home() { this.selLoc = null; this.landed = false; this.fly({ x: 600, y: 340, z: this.zu(), dur: 2000 }); this.setState({ sel: null }); }
  tick(now, dt) {
    const cam = this.cam0(), F = this.F;
    if (F) {
      const t = Math.min(1, (now - F.t0) / F.dur), e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, lzA = Math.log(F.zA), lzE = Math.log(F.zEnd);
      cam.x = F.a.x + (F.b.x - F.a.x) * e; cam.y = F.a.y + (F.b.y - F.a.y) * e;
      const base = lzA + (lzE - lzA) * e; cam.z = Math.exp(F.zMid ? base + (Math.log(F.zMid) - base) * Math.pow(Math.sin(Math.PI * t), .8) : base);
      cam.b = F.b0 * (1 - Math.min(1, t / .45));
      if (t >= 1) { this.F = null; if (F.done) F.done(); else this.bump(); }
    } else if (this.landed && !this.rm) cam.b += dt * .000016;
  }
  loop() {
    this.raf = requestAnimationFrame(() => this.loop());
    if (!this.inView || (typeof document !== 'undefined' && document.hidden)) { this.last = 0; return; }
    const now = this.now(), dt = this.last ? Math.min(64, now - this.last) : 16; this.last = now;
    this.tick(now, dt); this.draw(now);
  }
  draw(now) {
    const cv = this.cv, ctx = this.ctx; if (!cv || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1), Wc = cv.clientWidth, Hc = cv.clientHeight; if (!Wc || !Hc) return;
    if (cv.width !== Math.round(Wc * dpr) || cv.height !== Math.round(Hc * dpr)) { cv.width = Math.round(Wc * dpr); cv.height = Math.round(Hc * dpr); }
    this.cw = Wc; this.ch = Hc;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, Wc, Hc);
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
    this._k = k;
    const real = !!this.rmap && this.rmap.dataset.ready === '1';
    if (this.rmap) this.rmap.style.opacity = String(cityA);
    ctx.fillStyle = 'rgba(21,21,19,' + (real ? 1 - cityA : 1).toFixed(3) + ')'; ctx.fillRect(0, 0, Wc, Hc);

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
    /* street layer */
    if (cityA > .01 && !real) {
      ctx.globalAlpha = cityA; ctx.lineCap = 'butt';
      [this.selLoc, this.F && this.F.toLoc, this.F && this.F.fromLoc].filter((l, i, a) => l && a.indexOf(l) === i).forEach((l) => {
        const C = this.city(l);
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

    /* pins, clustered on screen distance */
    const pa = 1 - cityA, cl = [];
    if (pa > .01) {
      const M = this._match;
      L.forEach((l, i) => { const w = this.W(l.lng, l.lat), p = P(w.x, w.y, 0); if (!p) return;
        const c = cl.find((c) => Math.hypot(c.x - p[0], c.y - p[1]) < 16); if (c) { c.m.push(i); c.x = (c.x * (c.m.length - 1) + p[0]) / c.m.length; c.y = (c.y * (c.m.length - 1) + p[1]) / c.m.length; } else cl.push({ x: p[0], y: p[1], m: [i] }); });
      cl.forEach((c, ci) => {
        const on = !M || c.m.some((i) => M.has(i)), hov = this.hov === ci, n = c.m.filter((i) => !M || M.has(i)).length;
        ctx.globalAlpha = pa * (on ? 1 : .22);
        if (c.m.length > 1) {
          const r = 9 + Math.min(8, c.m.length * 1.4) + (hov ? 2 : 0);
          ctx.fillStyle = hov ? '#E8E4DA' : 'rgba(232,228,218,.16)'; ctx.strokeStyle = '#E8E4DA'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.2832); ctx.fill(); ctx.stroke();
          ctx.fillStyle = hov ? '#151513' : '#E8E4DA'; ctx.font = '700 10px "Diatype Mono", ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(String(M ? n : c.m.length), c.x, c.y + .5);
        } else {
          ctx.fillStyle = '#E8E4DA'; ctx.beginPath(); ctx.arc(c.x, c.y, hov ? 6.5 : 4.5, 0, 6.2832); ctx.fill();
          ctx.strokeStyle = 'rgba(232,228,218,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(c.x, c.y, hov ? 12 : 9, 0, 6.2832); ctx.stroke();
        }
      });
      ctx.globalAlpha = 1; ctx.textBaseline = 'alphabetic';
    }
    this._cl = cl;

    /* the flight line, lifted off the ground like the network arcs */
    const F = this.F;
    if (F && F.arc) {
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
    const D = this.data(), s = this.st(), set = (o) => this.setState(o), L = D.L;
    const q = (s.q || '').trim().toLowerCase(), fb = s.brand || '', fs = s.states || [], sort = s.sort || 'state';
    const match = (l, skipState) => (!fb || l.n === fb) && (skipState || !fs.length || fs.indexOf(l.st) >= 0) && (!q || (l.brand + ' ' + l.city + ' ' + l.st + ' ' + l.a2).toLowerCase().indexOf(q) >= 0);
    const res = L.filter((l) => match(l));
    const hasF = !!(q || fb || fs.length);
    this._match = hasF ? new Set(res.map((l) => l.i)) : null;
    const uniq = (a) => a.filter((v, i) => a.indexOf(v) === i);
    const states = uniq(L.map((l) => l.st)).sort();
    const card = (l) => ({ href: l.href, brandHref: l.brandHref, img: l.img, noPhoto: !l.noMedia && !l.img, cls: 'lc' + (s.sel === l.i ? ' is-on' : ''), tone: l.tone, still: l.noMedia ? this.still(l) : '', photo: !l.noMedia, origin: l.origin, city: l.city.replace(/[\[\]]/g, ''), brand: l.brand, a1: l.a1, a2: l.a2, st: l.st, est: l.est,
      map: () => { this.flyTo(l.i); if (this.mapEl && typeof window !== 'undefined') window.scrollTo({ top: this.mapEl.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' }); } });
    let groups;
    if (sort === 'state') groups = uniq(res.map((l) => l.st)).sort().map((st) => { const it = res.filter((l) => l.st === st); return { hasHead: true, t: st, n: it.length, items: it.map(card) }; });
    else if (sort === 'brand') groups = uniq(res.map((l) => l.n)).sort().map((n) => { const it = res.filter((l) => l.n === n); return { hasHead: true, t: 'PTR ' + n + ' · ' + D.B[n].name, n: it.length, items: it.map(card) }; });
    else groups = [{ hasHead: false, t: '', n: 0, items: res.slice().sort((a, b) => a.city.localeCompare(b.city)).map(card) }];
    const sel = s.sel != null ? L[s.sel] : null, sibs = sel ? L.filter((l) => l.n === sel.n) : [];
    const cl = this._cl || [], hv = this.hov != null ? cl[this.hov] : null;
    let tip = null;
    if (hv) { if (hv.m.length === 1) { const l = L[hv.m[0]]; tip = { x: hv.x, y: hv.y, t: l.brand, s: l.city.replace(/[\[\]]/g, '') + ', ' + l.st, cta: 'Click to fly in' }; }
      else { const bs = uniq(hv.m.map((i) => L[i].brand)); tip = { x: hv.x, y: hv.y, t: hv.m.length + ' locations', s: bs.slice(0, 3).join(', ') + (bs.length > 3 ? ' +' + (bs.length - 3) : ''), cta: 'Click to zoom in' }; } }
    const nStates = uniq(res.map((l) => l.st)).length, nBrands = uniq(res.map((l) => l.n)).length;
    const k = this._k || 0;
    return {
      setCanvas: (el) => { if (el && el !== this.cv) { this.cv = el; this.ctx = el.getContext('2d'); if (!this.raf && typeof requestAnimationFrame !== 'undefined') this.loop(); } },
      setMap: (el) => { if (!el) return; this.mapEl = el; if (this.io || typeof IntersectionObserver === 'undefined') return; this.io = new IntersectionObserver((es) => { this.inView = es[0].isIntersecting; }, { threshold: .05 }); this.io.observe(el); },
      onMove: (e) => {
        if (this.F || this.landed) return; const r = e.currentTarget.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        let best = null, bd = 18; (this._cl || []).forEach((c, ci) => { const d = Math.hypot(c.x - x, c.y - y); if (d < bd) { bd = d; best = ci; } });
        if (best !== this.hov) { this.hov = best; this.bump(); }
      },
      onLeave: () => { if (this.hov != null) { this.hov = null; this.bump(); } },
      onClick: () => {
        const c = this.hov != null ? (this._cl || [])[this.hov] : null; if (!c) return;
        if (c.m.length === 1) this.flyTo(c.m[0]);
        else { const pts = c.m.map((i) => this.W(L[i].lng, L[i].lat)), cx = pts.reduce((a, p) => a + p.x, 0) / pts.length, cy = pts.reduce((a, p) => a + p.y, 0) / pts.length;
          const sp = Math.max(.02, ...pts.map((p) => Math.hypot(p.x - cx, p.y - cy))); this.hov = null; this.fly({ x: cx, y: cy, z: Math.min(this.zc() * .25, (this.ch || 600) * .28 / sp), dur: 1800 }); }
      },
      cursor: this.hov != null ? 'pointer' : 'default',
      hint: this.landed ? 'Drag the page to keep browsing' : (k > .2 && !this.F ? 'Click a pin to fly in' : 'Hover a pin. Click to fly in.'),
      hasTip: !!tip && !this.F, tip: tip || { x: 0, y: 0, t: '', s: '', cta: '' },
      pinCls: 'pin' + (this.landed ? ' is-on' : '') + (this.pinG ? ' gA' : ' gB'),
      routeCls: 'route' + (this.F && this.F.arc ? ' is-on' : ''), route: this.F && this.F.arc && this.F.fromLoc && this.F.toLoc ? this.F.fromLoc.city.replace(/[\[\]]/g, '') + ' → ' + this.F.toLoc.city.replace(/[\[\]]/g, '') : '',
      setRealMap: (el) => { this.rmap = el; }, realFocus: this.selLoc || (this.F && this.F.toLoc) || null, hasSel: !!sel, panelCls: 'pan' + (this.landed ? ' is-on' : ''), home: () => this.home(),
      sel: sel ? { n: sel.n, st: sel.st, city: sel.city.replace(/[\[\]]/g, ''), brand: sel.brand, brandShort: sel.brand.split(' ')[0], a1: sel.a1, a2: sel.a2, tone: sel.tone, founder: sel.founder, photo: !sel.noMedia, rating: sel.rating ? sel.rating.toFixed(1) + ' (' + sel.reviews.toLocaleString('en-US') + ')' : '', href: sel.href, brandHref: sel.brandHref, img: sel.img, since: sel.since, est: sel.est, locs: String(sibs.length),
        hasSib: sibs.length > 1, nextSib: () => { const j = sibs.indexOf(sel); this.flyTo(sibs[(j + 1) % sibs.length].i); } } : {},
      stats: [
        { k: 'Reach', n: String(res.length), l: res.length === 1 ? 'Location' : 'Locations', rows: [{ k: 'States', v: String(nStates) }, { k: 'Brands', v: String(nBrands) }, { k: 'Providers', v: hasF ? '–' : '145' }] },
        { k: 'Demand', n: '10.7K', l: 'Social followers', rows: [{ k: 'Followers per weekly visit', v: '21' }, { k: 'Google rating', v: (() => { const t = res.reduce((a, l) => a + l.reviews, 0); return t ? (res.reduce((a, l) => a + l.rating * l.reviews, 0) / t).toFixed(1) + ' / ' + t.toLocaleString('en-US') : '–'; })() }] },
        { k: 'Depth', n: '235K', l: '[Label]', rows: [{ k: 'Filler syringes / year', v: '2,500' }, { k: 'Skincare items / year', v: '14,000' }, { k: 'Retail attach rate', v: '1 in 2 visits' }] }
      ],
      statsNote: hasF ? 'Reach reflects your filters' : 'Network totals. Filter the directory to narrow them.',
      q: s.q || '', onQ: (e) => set({ q: e.target.value }),
      brandOpts: [{ v: '', t: 'All brands', sel: !fb }].concat(Object.keys(D.B).map((n) => ({ v: n, t: 'PTR ' + n + ' · ' + D.B[n].name, sel: fb === n }))),
      onBrand: (e) => set({ brand: e.target.value }), brandVal: fb || '',
      sorts: [['state', 'State'], ['brand', 'Brand'], ['city', 'A–Z']].map((o) => ({ t: o[1], cls: 'sb' + (sort === o[0] ? ' is-on' : ''), go: () => set({ sort: o[0] }) })),
      stateChips: states.map((st) => { const on = fs.indexOf(st) >= 0, n = L.filter((l) => l.st === st && match(l, true)).length;
        return { t: st, n: String(n), cls: 'sc' + (on ? ' is-on' : '') + (!on && !n ? ' is-off' : ''), go: () => set({ states: on ? fs.filter((x) => x !== st) : fs.concat([st]) }) }; }),
      nRes: res.length, hasF, empty: res.length === 0, groups,
      clear: () => set({ q: '', brand: '', states: [] }),
      share: () => { const p = []; if (fs.length) p.push('state=' + fs.join(',')); if (fb) p.push('brand=' + fb); if (q) p.push('q=' + encodeURIComponent(s.q)); try { navigator.clipboard.writeText(location.origin + '/locations?' + p.join('&')); } catch (err) {} set({ shared: Date.now() }); },
      shareLabel: s.shared && Date.now() - s.shared < 2000 ? 'Link copied' : 'Share this view',
      founders: D.F.map((f) => ({ href: f[4], name: f[0], cred: f[1], brand: f[2] ? D.B[f[2]].name : '[Brand]', city: f[2] ? L.find((l) => l.n === f[2]).city.replace(/[\[\]]/g, '') : '[City]', img: f[3] || '', hasImg: !!f[3], noImg: !f[3],
        init: f[0].split(' ').map((w) => w[0]).join('').slice(0, 2), cls: 'fc' + (fb && f[2] !== fb ? ' dim' : '') })),
      brands: Object.keys(D.B).map((n) => { const ls = L.filter((l) => l.n === n), sts = uniq(ls.map((l) => l.st));
        return { n, href: D.B[n].href, name: D.B[n].name, tone: D.B[n].tone, locs: ls.length + (ls.length === 1 ? ' location' : ' locations'), states: sts.join(' / '), cls: 'bt' + (fb && fb !== n ? ' dim' : '') }; })
    };
  }
}
