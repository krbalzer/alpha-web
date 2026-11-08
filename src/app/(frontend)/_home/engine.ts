// @ts-nocheck
/* Generated from design/boards/Main.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class MainEngine extends DCLogic {
  componentDidMount() {
    this.rm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.timer = setInterval(() => this.step(), 200);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.io) this.io.disconnect();
  }
  bump() { this.setState({ n: ((this.state || {}).n || 0) + 1 }); }

  /* ---------- static data ---------- */
  data() {
    if (this.D) return this.D;
    const NODES = [
      ['Esthetics Center','Sacramento',81.6,314.8,3],['Laser Center of Marin','Corte Madera',60.4,331.5,2],
      ['Holden Timeless Beauty','San Diego',169.6,466,4],['Preva Aesthetics','Encinitas',167,457.7,2],
      ['Flawless','Albuquerque',383.4,405.1,2],['Preva Aesthetics','Denver',417.2,284.8,3],
      ['Privé Med Spa','Lexington',833.9,328.7,2],['Anne Therese Aesthetics','Columbus',864.6,279.1,2],
      ['CAMI Aesthetics','Huntersville',908.3,396.6,3],['Refined Aesthetics','Leesburg',975.1,300.8,4],
      ['Dontage','Fairfax',986,316,2],['Mint + Needle','Middletown',1012.5,292.3,2],
      ['Williams Center','Latham',1052.3,207.1,3],['RN Esthetics','Salem',1110.5,213.1,3],
      ['InBloom','Londonderry',1100.9,204.3,2],['LexRx','Boston',1107.3,217.2,3]
    ].map((a) => ({ brand: a[0], city: a[1], x: a[2], y: a[3], w: a[4] }));
    /* the standing web: minimum spanning tree + two nearest neighbours per practice */
    const E = [], seen = {}, add = (i, j) => { const k = i < j ? i + '-' + j : j + '-' + i; if (!seen[k]) { seen[k] = 1; E.push([i, j]); } };
    const dist = (i, j) => Math.hypot(NODES[i].x - NODES[j].x, NODES[i].y - NODES[j].y);
    const inT = [0];
    while (inT.length < NODES.length) { let best = null; inT.forEach((i) => NODES.forEach((_, j) => { if (inT.indexOf(j) < 0 && (!best || dist(i, j) < best[2])) best = [i, j, dist(i, j)]; })); add(best[0], best[1]); inT.push(best[1]); }
    NODES.forEach((_, i) => NODES.map((__, j) => j).filter((j) => j !== i).sort((a, b) => dist(i, a) - dist(i, b)).slice(0, 2).forEach((j) => add(i, j)));
    const ADJ = NODES.map(() => []); E.forEach(([i, j]) => { ADJ[i].push(j); ADJ[j].push(i); });
    const P = (this.props.data || {}).P || [
      { n: '001', name: 'Esthetics Center', city: 'Sacramento, CA', locs: 4, area: 'Sacramento', founder: '[Founder]', tone: '#3B3A35' },
      { n: '002', name: 'Holden Timeless Beauty', city: 'San Diego, CA', locs: 3, area: 'North County San Diego', founder: 'Amanda Holden, MD', tone: '#61788A' },
      { n: '003', name: 'Refined Aesthetics', city: 'Leesburg, VA', locs: 2, area: 'Northern Virginia', founder: 'Sarah Safa', tone: '#4C5949' },
      { n: '005', name: 'Laser Center of Marin', city: 'Corte Madera, CA', locs: 1, area: 'Marin County', founder: '[Founder]', tone: '#2F4550' },
      { n: '006', name: 'Williams Center', city: 'Latham, NY', locs: 2, area: 'Capital Region', founder: '[Founder]', tone: '#4B4038' },
      { n: '007', name: 'Anne Therese Aesthetics', city: 'Columbus, OH', locs: 4, area: 'Columbus', founder: '[Founder]', tone: '#6B5A55' },
      { n: '008', name: 'RN Esthetics', city: 'Salem, MA', locs: 4, area: 'North Shore', founder: 'Michelle Doran', tone: '#52606B' },
      { n: '009', name: 'Dontage', city: 'Fairfax, VA', locs: 1, area: 'Fairfax', founder: '[Founder]', tone: '#3D3D45' },
      { n: '010', name: 'CAMI Aesthetics', city: 'Huntersville, NC', locs: 2, area: 'Charlotte area', founder: '[Founder]', tone: '#5B4E44' },
      { n: '011', name: 'InBloom Health + Medispa', city: 'Londonderry, NH', locs: 1, area: 'Southern New Hampshire', founder: 'Dr. Tanya Lawson, ND', tone: '#7A2A1E', img: '/img/p-inbloom.webp', head: '/img/h-tanya.webp' },
      { n: '012', name: 'Flawless', city: 'Albuquerque, NM', locs: 2, area: 'Albuquerque', founder: 'Heather Badal', tone: '#7B3C26', img: '/img/p-flawless.webp', head: '/img/h-heather.webp' },
      { n: '013', name: 'Mint + Needle', city: 'Middletown, DE', locs: 2, area: 'Delaware', founder: 'Brandi Gregge, MSN, FNP-BC', tone: '#8A8A76', img: '/img/p-mint.webp', head: '/img/h-brandi.webp' },
      { n: '014', name: 'Privé Med Spa', city: 'Lexington, KY', locs: 1, area: 'Lexington', founder: 'Brandice Harrison, PA-C', role: 'Co-founder', tone: '#5A5A55', img: '/img/p-prive.webp' },
      { n: '015', name: 'LexRx', city: 'Boston, MA', locs: 4, area: 'Boston and Nantucket', founder: 'Alexa Nicholls Costa, NP', tone: '#56646E', img: '/img/p-lexrx.webp', head: '/img/h-alexa.webp' },
      { n: '016', name: 'Preva Aesthetics', city: 'Denver, CO', locs: 2, area: 'Denver and Encinitas', founder: 'Michelle Paty', tone: '#8C7350', img: '/img/p-preva.webp', head: '/img/h-michelle.webp' }
    ];
    this.D = { NODES, EDGES: E, ADJ, P,
      FIRST: ['Dana','Priya','Mara','Jess','Lauren','Nina','Tessa','Kelsey','Andrea','Carmen','Brooke','Leah','Sofia','Rachel','Maya','Elena','Claire','Jade'],
      TEAMFIRST: ['Reggie','Janelle','Chris','Morgan','Sam'],
      ROLES: ['Front desk lead','Practice manager','Lead injector','Founder','Aesthetician','Operations lead','Nurse injector'],
      PROPS: ['Props to the {to} front desk for the smoothest shadow day we have ever had.','Huge thanks to {to} for sharing their consent flow. Live here on Monday.','Congrats {to} on a fully booked November.','Shoutout to the {to} team for covering a provider on two days’ notice.','Used the {to} rebooking script all week. It works.','Welcome to the new hires in {to}. Great first week.'],
      QS: ['Anyone switched EMRs this year? Worth the pain?','Hiring a laser tech. Who has someone they would hire again?','What are you all doing for no-show deposits?','Best way you have found to train a new front desk in week one?','Anyone running memberships yet? How did you price the first tier?','Who has a good checklist for opening a second location?','How are you scheduling consults vs. treatments on the same day?'],
      AS: ['We did in March. Worth it, happy to walk you through.','Sending you our checklist now.','Call me after 5, happy to share what worked.','We tested three. DMing you the winner.','Our script is in the shared drive, tagging you.','Two names coming your way.'],
      TEAM: ['Three hiring candidates sent to {to} today.','New campaign assets delivered to {to}.','Payroll question from {to}, solved before lunch.','Vendor rep visit booked for {to} next week.'],
      TEAM_ALL: ['New vendor pricing is live for every practice.','Next Practice cohort opens Monday. Six seats per brand.','Spring campaign kit is ready for everyone.','Benefits enrollment opens today, every practice.'],
      MOMENTS: [
        { day: 0, hour: 11, type: 'Launch', line: 'A new laser, launched to a full room in Marin.', at: 1, from: [0] },
        { day: 1, hour: 15, type: 'Shadow day', line: 'Dr. Holden spends the day learning from Michelle Paty’s team.', at: 2, from: [3] },
        { day: 2, hour: 10, type: 'Team day', line: 'New hires, first week, one very good photo.', at: 9, from: [] },
        { day: 3, hour: 14, type: 'On the podium', line: 'A partner surgeon teaching fat transfer at AAFPRS.', pt: [770, 230], from: [7, 12, 5] },
        { day: 4, hour: 12, type: 'Team day', line: 'The whole CAMI team, together for once.', at: 8, from: [] },
        { day: 5, hour: 12, type: 'Founders dinner', line: 'Four founders, one table, nobody talking about the weather.', at: 5, from: [0, 7] },
        { day: 6, hour: 13, type: 'All hands', line: 'Sunday reset before a big week.', at: 12, from: [] }
      ],
      SNAPS: [['Front desk · Encinitas',3],['Launch night · Marin',1],['The door · San Diego',2],['New hires · Leesburg',9],['Team hats · Huntersville',8],['Dinner · Denver',5],['Lobby · Boston',15],['Treatment room · Albuquerque',4]],
      DAYS: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      HUES: [18,28,34,40,22,12,30,26],
      CAPS: ['[Caption line from the film]','[Burned-in captions run along the bottom]','[The founder, in their own words]']
    };
    return this.D;
  }

  /* ---------- network simulation ---------- */
  sim0() {
    if (this.S) return this.S;
    const S = { tk: 0, min: 9 * 60, c1: 0, ans: 0, rt: [], fired: {}, lines: [], rings: [], sso: {}, chips: [], snaps: [], moment: { on: false, until: 0 }, flash: {}, jobs: [], feed: [], lastSnap: [], inView: true,
      pi: 1, pvFrom: -99, th: false, thPlay: false, tt: 0, thG: 0 };
    for (let i = 0; i < 3; i++) S.chips.push({ on: false, until: 0, d: null, rect: null });
    for (let i = 0; i < 2; i++) S.snaps.push({ on: false, until: 0, label: '', bg: '', rect: null });
    this.S = S;
    return S;
  }
  rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  pick(ex) {
    const N = this.data().NODES; const t = N.reduce((s, n) => s + n.w, 0);
    for (let k = 0; k < 20; k++) { let r = Math.random() * t, i = 0; for (; i < N.length; i++) { r -= N[i].w; if (r <= 0) break; } if (ex.indexOf(i) < 0) return i; }
    return (ex[0] + 3) % N.length;
  }
  now() { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }
  /* partner to partner: a curved line that draws from dot to dot. web: Alpha travelling the standing web. */
  arc(a, b, kind, delay) {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
    let px = -dy / d, py = dx / d; if (py > 0) { px = -px; py = -py; }
    const bend = kind === 'web' ? 0 : .28;
    this.S.lines.push({ a, b, c: { x: mx + px * d * bend, y: my + py * d * bend }, kind, t0: this.now() + (delay || 0) });
  }
  ring(p, q, gold, delay) { this.S.rings.push({ x: p.x, y: p.y, q: !!q, gold: !!gold, t0: this.now() + (delay || 0) }); }
  goldAt(i, delay) { const S = this.S; S.jobs.push({ at: S.tk + Math.ceil((delay || 0) / 200), run: () => { S.sso[i] = S.tk + 6; } }); }
  tree(o) {
    const A = this.data().ADJ, par = { [o]: -1 }, dep = { [o]: 0 }, q = [o];
    while (q.length) { const i = q.shift(); A[i].forEach((j) => { if (!(j in par)) { par[j] = i; dep[j] = dep[i] + 1; q.push(j); } }); }
    return { par, dep };
  }
  route(o, t, delay) {
    const N = this.data().NODES, T = this.tree(o), hops = [], HOP = 340, d0 = delay || 0;
    for (let j = t; j !== o; j = T.par[j]) hops.unshift([T.par[j], j]);
    this.goldAt(o, d0);
    hops.forEach(([i, j], k) => { this.arc(N[i], N[j], 'web', d0 + k * HOP); this.goldAt(j, d0 + (k + 1) * HOP); });
  }
  broadcast(o) {
    const N = this.data().NODES, T = this.tree(o), HOP = 340;
    this.goldAt(o, 0); this.ring(N[o], false, true);
    Object.keys(T.par).forEach((k) => { const j = +k, i = T.par[j]; if (i < 0) return; this.arc(N[i], N[j], 'web', (T.dep[j] - 1) * HOP); this.goldAt(j, T.dep[j] * HOP); });
  }
  loop() {
    this.raf = requestAnimationFrame(() => this.loop());
    const S = this.S; if (!S || !S.inView || (typeof document !== 'undefined' && document.hidden)) return;
    this.draw();
  }
  draw() {
    const cv = this.cv, ctx = this.ctx, S = this.S; if (!cv || !ctx || !S) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
    if (!W || !H) return;
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const k = W / 1200, px = dpr / k, t = this.now(), D = this.data(), N = D.NODES;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); ctx.setTransform(k, 0, 0, H / 720, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    /* the standing web: always there, quiet */
    ctx.strokeStyle = 'rgba(201,162,107,.14)'; ctx.lineWidth = .7 * px; ctx.beginPath();
    D.EDGES.forEach(([i, j]) => { ctx.moveTo(N[i].x, N[i].y); ctx.lineTo(N[j].x, N[j].y); }); ctx.stroke();
    /* [r, g, b, alpha, width, draw ms, life ms] */
    const K = { hum: [232, 228, 218, .3, .8, 1100, 4200], msg: [232, 228, 218, .85, 1.2, 1200, 5500], big: [232, 228, 218, 1, 1.5, 1400, 7000], web: [201, 162, 107, .95, 1.5, 340, 2600] };
    S.lines = S.lines.filter((l) => t < l.t0 + K[l.kind][6]);
    S.lines.forEach((l) => {
      const [r, g, b, al, w, grow, life] = K[l.kind], e = t - l.t0; if (e < 0) return;
      const p = this.rm ? 1 : Math.min(1, e / grow), u1 = 1 - Math.pow(1 - p, 3), fade = e < grow ? 1 : Math.max(0, 1 - (e - grow) / (life - grow));
      ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (al * fade).toFixed(3) + ')'; ctx.lineWidth = w * px;
      ctx.beginPath(); let x = l.a.x, y = l.a.y; ctx.moveTo(x, y);
      for (let s = 1; s <= 28; s++) { const u = u1 * s / 28, v = 1 - u; x = v * v * l.a.x + 2 * v * u * l.c.x + u * u * l.b.x; y = v * v * l.a.y + 2 * v * u * l.c.y + u * u * l.b.y; ctx.lineTo(x, y); }
      ctx.stroke();
      if (p < 1) { ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'; ctx.beginPath(); ctx.arc(x, y, 2.3 * px, 0, 6.2832); ctx.fill(); }
      else if (!l.hit && (l.kind === 'msg' || l.kind === 'big')) { l.hit = 1; this.ring(l.b); }
    });
    S.rings = S.rings.filter((q) => t < q.t0 + 1900);
    S.rings.forEach((q) => {
      const e = t - q.t0; if (e < 0) return; const p = e / 1900, u = 1 - Math.pow(1 - p, 3);
      ctx.strokeStyle = (q.gold ? 'rgba(201,162,107,' : 'rgba(232,228,218,') + (.85 * (1 - p)).toFixed(3) + ')'; ctx.lineWidth = 1.1 * px;
      ctx.setLineDash(q.q ? [3 * px, 3 * px] : []); ctx.beginPath(); ctx.arc(q.x, q.y, 3 + u * 24, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
    });
  }
  flash(i) { this.S.flash[i] = this.S.tk + 5; }
  av(name, team) {
    const D = this.data(); const h = D.HUES[name.charCodeAt(0) % D.HUES.length];
    return { init: name.slice(0, 1), cls: 'mav' + (team ? ' team' : ''), bg: 'radial-gradient(70% 70% at 35% 30%, hsl(' + h + ',38%,82%), hsl(' + h + ',26%,58%))' };
  }
  rects() {
    const S = this.S, out = [];
    S.chips.forEach((c) => { if (c.on && c.rect) out.push(c.rect); });
    S.snaps.forEach((c) => { if (c.on && c.rect) out.push(c.rect); });
    if (S.moment.on && S.moment.rect) out.push(S.moment.rect);
    return out;
  }
  place(pt, w, h) {
    const x = pt.x / 12, y = pt.y / 7.2, act = this.rects();
    const C = [[x + 1.4, y - h - 2], [x + 1.4, y + 2], [x - w - 1.4, y - h - 2], [x - w - 1.4, y + 2], [x - w / 2, y - h - 3], [x - w / 2, y + 3]];
    for (const c of C) {
      const l = c[0], t = c[1];
      if (l < 0 || t < -2 || l + w > 100 || t + h > 102) continue;
      if (act.every((r) => l + w < r.l - .8 || l > r.l + r.w + .8 || t + h < r.t - 1 || t > r.t + r.h + 1)) return { l, t, w, h };
    }
    return null;
  }
  tlabel() { const m = this.S.min % 1440, h = Math.floor(m / 60), mm = Math.floor(m % 60), ap = h >= 12 ? 'PM' : 'AM', hh = h % 12 || 12; return hh + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap; }
  chip(d, node, h, life) {
    const S = this.S; const slot = S.chips.find((c) => !c.on);
    const fd = Object.assign({}, d); S.feed.unshift(fd); S.feed = S.feed.slice(0, 3);
    if (!slot) return fd;
    const r = this.place(node, 23, h); if (!r) return fd;
    slot.on = true; slot.until = S.tk + life; slot.d = fd; slot.rect = r;
    return fd;
  }
  spawnProps() {
    const D = this.data(), N = D.NODES, a = this.pick([]), b = this.pick([a]);
    this.arc(N[a], N[b], 'msg'); this.flash(a); this.flash(b);
    const f = this.rnd(D.FIRST);
    this.chip({ kind: 'props', mk: 'mk', label: 'Props', time: this.tlabel(), text: this.rnd(D.PROPS).replace('{to}', N[b].city), name: f, rest: this.rnd(D.ROLES) + ' · ' + N[a].city, avs: [this.av(f)] }, N[b], 18, 24);
  }
  spawnQuestion() {
    const D = this.data(), N = D.NODES, S = this.S, a = this.pick([]);
    this.ring(N[a], true); this.flash(a);
    const qf = this.rnd(D.FIRST);
    const fd = this.chip({ kind: 'question', mk: 'mk q', label: 'Question', time: this.tlabel(), text: this.rnd(D.QS), name: qf, rest: this.rnd(D.ROLES) + ' · ' + N[a].city, avs: [this.av(qf)] }, N[a], 32, 40);
    const n = Math.random() < .55 ? 2 : 1, who = [], ex = [a];
    for (let i = 0; i < n; i++) { const b = this.pick(ex); ex.push(b); who.push(b); }
    const mins = 4 + Math.floor(Math.random() * 22);
    S.jobs.push({ at: S.tk + 13, run: () => {
      who.forEach((b) => { this.arc(N[b], N[a], 'msg'); this.flash(b); });
      this.flash(a);
      const pool = D.FIRST.filter((x) => x !== qf).sort(() => Math.random() - .5), rf = who.map((_, i) => pool[i]);
      /* about a third of the time someone from Alpha jumps in too, arriving over the web */
      const sso = Math.random() < .35, tf = this.rnd(D.TEAMFIRST), dept = this.rnd(['Clinical','Operations','Marketing','People','Finance']), tot = n + (sso ? 1 : 0);
      if (sso) this.route(this.pick([a]), a, 0);
      Object.assign(fd, { hasThread: true, thLabel: tot > 1 ? tot + ' replies' : 'Reply', thTime: mins + ' min', thText: '“' + this.rnd(D.AS) + '”',
        thName: rf.concat(sso ? [tf] : []).join(' & '), thRest: who.map((b) => N[b].city).concat(sso ? ['Alpha ' + dept] : []).join(', '),
        thAvs: rf.map((x) => this.av(x)).concat(sso ? [this.av(tf, true)] : []) });
      S.ans++; S.rt.push(mins);
    } });
  }
  spawnTeam() {
    /* Alpha has no location. It starts wherever the work is and moves through the web. */
    const D = this.data(), N = D.NODES, o = this.pick([]), tf = this.rnd(D.TEAMFIRST);
    let text, at;
    if (Math.random() < .45) { this.broadcast(o); text = this.rnd(D.TEAM_ALL); at = N[o]; }
    else { const t = this.pick([o]); this.route(o, t, 0); text = this.rnd(D.TEAM).replace('{to}', N[t].city); at = N[t]; }
    this.chip({ kind: 'team', mk: 'mk t', label: 'Alpha team', time: this.tlabel(), text, name: tf, rest: 'Alpha ' + this.rnd(['Marketing','People','Finance','Clinical','Operations']), avs: [this.av(tf, true)] }, at, 18, 24);
  }
  snap() {
    const D = this.data(), S = this.S; const slot = S.snaps.find((s) => !s.on); if (!slot) return;
    const pool = D.SNAPS.filter((s) => S.lastSnap.indexOf(s[0]) < 0), sn = this.rnd(pool);
    S.lastSnap.push(sn[0]); if (S.lastSnap.length > 4) S.lastSnap.shift();
    const pt = D.NODES[sn[1]]; const r = this.place(pt, 10.5, 22); if (!r) return;
    this.ring(pt); this.flash(sn[1]);
    const h = D.HUES[sn[0].length % D.HUES.length];
    Object.assign(slot, { on: true, until: S.tk + 20, label: sn[0], rect: r, bg: 'linear-gradient(160deg, hsl(' + h + ',18%,34%), hsl(' + h + ',14%,18%))' });
  }
  showMoment(m) {
    const D = this.data(), S = this.S; const pt = m.pt ? { x: m.pt[0], y: m.pt[1] } : D.NODES[m.at];
    m.from.forEach((f) => { this.arc(D.NODES[f], pt, 'big'); this.flash(f); });
    this.ring(pt);
    const r = this.place(pt, 21, 40); if (!r) return;
    const h = D.HUES[m.type.length % D.HUES.length];
    Object.assign(S.moment, { on: true, until: S.tk + 34, rect: r, type: m.type, line: m.line, bg: 'linear-gradient(160deg, hsl(' + h + ',20%,38%), hsl(' + h + ',14%,16%))' });
  }
  rate(d, h) { const we = d >= 5; if (h < 7 || h >= 22) return we ? .02 : .05; if (h < 9 || h >= 19) return we ? .12 : .35; return we ? .28 : .9; }
  netTick() {
    const S = this.S, D = this.data(), N = D.NODES;
    S.min += 20;
    if (S.min >= 7 * 1440) { S.min = 9 * 60; S.c1 = 0; S.ans = 0; S.rt = []; S.fired = {}; }
    const d = Math.floor(S.min / 1440) % 7, h = Math.floor((S.min % 1440) / 60), r = this.rate(d, h);
    const n = Math.random() < r ? (Math.random() < r * .6 ? 2 : 1) : 0;
    for (let k = 0; k < n; k++) { const a = this.pick([]), b = this.pick([a]); this.arc(N[a], N[b], 'hum'); this.flash(a); this.flash(b); S.c1 += 1 + Math.floor(Math.random() * 4); }
    if (Math.random() < r * .16) { const roll = Math.random(), wk = d < 5 && h >= 9 && h < 18; if (roll < .4) this.spawnProps(); else if (roll < .78) this.spawnQuestion(); else if (wk) this.spawnTeam(); else this.spawnProps(); }
    if (h >= 8 && h < 21 && Math.random() < (d < 5 ? .07 : .035)) this.snap();
    D.MOMENTS.forEach((m, i) => { if (!S.fired[i] && d === m.day && h >= m.hour) { S.fired[i] = 1; this.showMoment(m); } });
  }
  step() {
    const S = this.sim0(); S.tk++;
    let dirty = false;
    const t = this.now(); S.lines = S.lines.filter((l) => t < l.t0 + 7000); S.rings = S.rings.filter((q) => t < q.t0 + 1900);
    const due = S.jobs.filter((j) => j.at <= S.tk); S.jobs = S.jobs.filter((j) => j.at > S.tk);
    due.forEach((j) => j.run()); if (due.length) dirty = true;
    if (Object.keys(S.sso).some((i) => S.sso[i] === S.tk)) dirty = true;
    S.chips.forEach((c) => { if (c.on && c.until <= S.tk) { c.on = false; c.rect = null; dirty = true; } });
    S.snaps.forEach((c) => { if (c.on && c.until <= S.tk) { c.on = false; c.rect = null; dirty = true; } });
    if (S.moment.on && S.moment.until <= S.tk) { S.moment.on = false; S.moment.rect = null; dirty = true; }
    const running = this.props.autoplay !== false && S.inView && !(typeof document !== 'undefined' && document.hidden) && !S.th;
    if (running) { this.netTick(); dirty = true; }
    if (S.th && S.thPlay) { S.tt = Math.min(90, S.tt + .2); if (S.tt >= 90) S.thPlay = false; dirty = true; }
    if (S.tk - S.pvFrom < 18) dirty = true;
    if (S.tk % 13 === 0) dirty = true;
    if (dirty) this.bump();
  }
  thOpen(i) { const S = this.sim0(); S.pi = i; S.th = true; S.thPlay = true; S.tt = 0; S.thG ^= 1; this._th = null; this.bump(); }
  thLoad(i) { const S = this.S; const n = this.D.P.length, dir = i < S.pi ? -1 : 1; let j = S.pi; for (let k = 0; k < n; k++) { j = (j + dir + n) % n; if (this.D.P[j].film && this.D.P[j].film.src) break; } S.pi = j; S.tt = 0; S.thPlay = true; S.thG ^= 1; this.bump(); }
  thClose() { const S = this.S; S.th = false; S.thPlay = false; this.bump(); }

  
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
    const s = this.state || {};
    const set = (o) => this.setState(o);
    const D = this.data(), S = this.sim0();
    const P = D.P, X = (this.props.data || {});

    /* reel */
    const cut = Math.floor(S.tk / 13) % this.D.P.length;

    /* network view */
    const d = Math.floor(S.min / 1440) % 7;
    const nodes = D.NODES.map((n, i) => ({ px: (n.x / 12).toFixed(2), py: (n.y / 7.2).toFixed(2), cls: (S.sso[i] || 0) > S.tk ? 'node sso' : ((S.flash[i] || 0) > S.tk ? 'node flash' : 'node') }));
    const chipView = (c, on) => Object.assign({ hasThread: false, thAvs: [] }, c.d || c, { cls: 'chip ' + ((c.d || c).kind || '') + (on ? ' is-on' : '') });
    const chips = S.chips.map((c) => Object.assign(chipView(c, c.on), { left: c.rect ? c.rect.l.toFixed(2) : 0, top: c.rect ? c.rect.t.toFixed(2) : 0, avs: (c.d && c.d.avs) || [], text: (c.d && c.d.text) || '' }));
    const snaps = S.snaps.map((c) => ({ cls: 'snap' + (c.on ? ' is-on' : ''), left: c.rect ? c.rect.l.toFixed(2) : 0, top: c.rect ? c.rect.t.toFixed(2) : 0, label: c.label, bg: c.bg || '#2a2824' }));
    const M = S.moment;
    const moment = { cls: 'moment' + (M.on ? ' is-on' : ''), left: M.rect ? M.rect.l.toFixed(2) : 0, top: M.rect ? M.rect.t.toFixed(2) : 0, type: M.type || '', line: M.line || '', bg: M.bg || '#2a2824' };
    const feed = S.feed.map((f) => chipView(f, true));
    const hh = Math.floor((S.min % 1440) / 60), mm = Math.floor((S.min % 60) / 10) * 10;
    const clock = D.DAYS[d] + ' ' + (hh % 12 || 12) + ':' + (mm < 10 ? '0' : '') + mm + ' ' + (hh >= 12 ? 'PM' : 'AM');
    const days = D.DAYS.map((_, i) => ({ cls: i < d ? 'on' : (i === d ? 'now' : '') }));
    const med = S.rt.length ? S.rt.slice().sort((a, b) => a - b)[Math.floor(S.rt.length / 2)] + ' min' : '—';

    /* partners */
    const pi = S.pi;
    const partners = P.map((p, i) => ({ href: p.href, n: p.n, name: p.name, city: p.city, yr: p.yr || '', cls: i === pi ? 'p_row is-on' : 'p_row',
      hover: () => { const T = this.S; if (T.pi !== i) { T.pi = i; T.pvFrom = T.tk + 2; this.bump(); } },
      focus: () => { this.S.pi = i; this.bump(); },
      open: () => this.thOpen(i) }));
    const posters = P.map((p, i) => ({ cls: 'p_poster' + (i === pi ? ' is-on' : ''), tone: p.tone, hasImg: !!p.img, noImg: !p.img, img: p.img || '', n: p.n, name: p.name, cityLong: p.city }));
    const c = P[pi];
    const init = c.founder.replace(/^(Dr\.|\[)/, '').split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    const cur = { film: !!(c.film && c.film.src), frameLabel: c.film && c.film.src ? 'Play the ' + c.name + ' film' : 'Open ' + c.name, href: c.href, since: c.since ? 'Partnered ' + c.since : '', founderHref: c.founderHref || '/locations#founders', n: c.n, name: c.name, founder: c.founder, role: c.role || 'Founder', hasHead: !!c.head, noHead: !c.head, head: c.head || '', init,
      locLine: (c.locs ? c.locs + (c.locs > 1 ? ' locations' : ' location') : '[N] locations') + ' · ' + c.area };
    const pv = S.tk >= S.pvFrom && S.tk < S.pvFrom + 16;
    const tsec = Math.floor(S.tt), capIdx = Math.floor(S.tt / 6) % 4;
    const FL = P.filter((p) => p.film && p.film.src), cf = c.film || {}, wide = typeof window === 'undefined' || window.innerWidth > 820;
    const th = { total: FL.length, src: cf.src ? (wide ? cf.src : (cf.small || cf.src)) : '', poster: c.filmPoster || c.img || '', idx: Math.max(1, FL.indexOf(c) + 1), n: c.n, name: c.name, founder: c.founder, role: c.role || 'Founder', cityLong: c.city, tone: c.tone, hasImg: !!c.img, noImg: !c.img, img: c.img || '',
      pcls: 'th_poster' + (S.thPlay ? (S.thG ? ' kbA' : ' kbB') : ''), pct: (S.tt / 90 * 100).toFixed(2), time: Math.floor(tsec / 60) + ':' + (tsec % 60 < 10 ? '0' : '') + (tsec % 60),
      cap: D.CAPS[capIdx % 3], capOp: capIdx < 3 && S.tt > 1.2 ? 1 : 0, ppIcon: S.thPlay ? '❚❚' : '▶', ppLabel: S.thPlay ? 'Pause' : 'Play' };

    /* carousels, episodes, qualifier */
    const depts = X.depts || [];
    const di = s.dept ?? 0, dMax = Math.max(0, depts.length - 3);
    const stories = [
      { name: 'Lauren Biscotti', role: 'RN injector', brand: '[Brand]', quote: '“Joining Alpha means never feeling alone.”' },
      { name: 'Allie Oxton', role: 'NP injector', brand: '[Brand]', quote: '“Join if you want to be the best provider you can be.”' },
      { name: 'Katie Martin', role: 'PA injector', brand: 'HTB', quote: '“We got things didn’t know were possible.”' },
      { name: 'Katie Wilson', role: 'RN injector', brand: 'CAMI', quote: '“Alpha changed my life.”' },
      { name: 'Riley Hadock', role: 'Director of ops', brand: '[Brand]', quote: '“I’ve never felt more welcomed into a team before.”' },
      { name: 'Mary Carter', role: 'PA injector', brand: '[Brand]', quote: '“[Verbatim line from transcript]”' },
      { name: 'Becky McDonald', role: 'Co-founder', brand: 'Privé', quote: '“[Verbatim line from transcript]”' }
    ].filter((x) => x.quote.indexOf('[') < 0).map((x) => Object.assign({}, x, { brand: x.brand.charAt(0) === '[' ? '' : x.brand }));
    const si = s.story ?? 0, sMax = Math.max(0, stories.length - 4), pdi = s.pod ?? 0, pMax = 3;
    const EP = X.eps || [];
    const playing = s.playing ?? -1;
    const eps = EP.map((e, i) => ({ ...e, btnCls: i === playing ? 'ep_play is-on' : 'ep_play', play: () => { set({ playing: i }); if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('alpha:play', { detail: e.ep })); } }));
    const Q = [
      { title: 'How many locations do you run?', hint: 'Count every location operating under your brand today.', key: 'locs', opts: ['1', '2 to 3', '4 or more'] },
      { title: 'How long have you been open?', hint: 'From your first patient at your first location.', key: 'years', opts: ['Under [2] years', '[2] to [5] years', '[5]+ years'] },
      { title: 'Roughly, what is your annual revenue?', hint: 'A range is fine. This stays between us.', key: 'rev', opts: ['Under $[X]M', '$[X]M to $[Y]M', '$[Y]M+'] },
      { title: 'What is your role?', hint: 'We want to talk with the person who makes the call.', key: 'role', opts: ['Owner / founder', 'Medical director', 'Partner / investor'] }
    ];
    const qs = s.q ?? 0, ans = s.ans || {}, isDone = qs >= 5, isContact = qs === 4, qq = Q[Math.min(qs, 3)];
    const q = { title: qq.title, hint: qq.hint, opts: qq.opts.map((o) => ({ label: o, on: ans[qq.key] === o ? 'true' : 'false', cls: ans[qq.key] === o ? 'opt is-on' : 'opt', pick: () => set({ ans: { ...((this.state || {}).ans || {}), [qq.key]: o } }) })) };
    const answered = isContact || !!ans[qq.key];

    return {
      net: X.net || { brands: '15', locations: '36', states: '12' }, shows: X.shows || [], nShows: String((X.shows || []).length), hasEps: EP.length > 0,
      reel: P.map((p, i) => ({ src: p.poster || p.img, cls: 'reel_img' + (i === cut ? ' is-on' : '') })).filter((r) => r.src),
      openMenu: () => set({ menu: true }), closeMenu: () => set({ menu: false }), menuOpen: !!s.menu,
      toggleMute: () => set({ unmuted: !s.unmuted }), muteLabel: s.unmuted ? 'Mute' : 'Unmute',
      cutNum: String(cut + 1).padStart(2, '0'), cutBrand: P[cut].name, cutCity: P[cut].city,
      ticks: P.map((_, i) => ({ cls: i === cut ? 'tick is-on' : (i < cut ? 'tick is-past' : 'tick') })),
      setStage: (el) => { if (el && !this.io && typeof IntersectionObserver !== 'undefined') { this.io = new IntersectionObserver((es) => { this.S.inView = es[0].isIntersecting; }, { threshold: .1 }); this.io.observe(el); } },
      nodes, chips,
      setCanvas: (el) => { if (el && el !== this.cv) { this.cv = el; this.ctx = el.getContext('2d'); if (!this.raf && typeof requestAnimationFrame !== 'undefined') this.loop(); } }, snaps, moment, feed, clock, days,
      c1: S.c1.toLocaleString(), c2: String(S.ans), c3: med,
      partners, posters, cur, frameCls: 'p_frame' + (pv ? ' is-preview' : ''), openCur: () => { const c = P[this.S.pi]; if (c.film && c.film.src) this.thOpen(this.S.pi); else if (typeof window !== 'undefined') window.location.assign(c.href); },
      thOpen: S.th, th,
      thRef: (el) => { if (el && el !== this._th) { this._th = el; el.focus(); } },
      thKey: (e) => { if (e.key === 'Escape') this.thClose(); else if (e.key === 'ArrowRight') this.thLoad(this.S.pi + 1); else if (e.key === 'ArrowLeft') this.thLoad(this.S.pi - 1); else if (e.key === ' ' && e.target === e.currentTarget) { e.preventDefault(); const vd = this._th && this._th.querySelector('video'); if (vd) { if (vd.paused) vd.play(); else vd.pause(); } } },
      thClose: () => this.thClose(), thVid: (el) => { if (el && el !== this._tv) { this._tv = el; const p = el.play(); if (p && p.catch) p.catch(() => {}); } }, thPrev: () => this.thLoad(this.S.pi - 1), thNext: () => this.thLoad(this.S.pi + 1),
      thToggle: () => { const T = this.S; if (T.tt >= 90) T.tt = 0; T.thPlay = !T.thPlay; this.bump(); },
      depts, deptShift: 'calc(' + (-di) + ' * (clamp(260px, 22vw, 300px) + 14px))', deptPrev: () => set({ dept: Math.max(0, di - 1) }), deptNext: () => set({ dept: Math.min(dMax, di + 1) }), deptAtStart: di === 0, deptAtEnd: di === dMax,
      stories, storyShift: 'calc(' + (-si) + ' * (clamp(200px, 15.5vw, 224px) + 10px))', storyPrev: () => set({ story: Math.max(0, si - 1) }), storyNext: () => set({ story: Math.min(sMax, si + 1) }), storyAtStart: si === 0, storyAtEnd: si === sMax,
      podShift: 'calc(' + (-pdi) + ' * (clamp(220px, 18.6vw, 262px) + 8px))', podPrev: () => set({ pod: Math.max(0, pdi - 1) }), podNext: () => set({ pod: Math.min(pMax, pdi + 1) }), podAtStart: pdi === 0, podAtEnd: pdi === pMax,
      eps, hasPlaying: playing >= 0, now: EP[Math.max(0, playing)], closePlayer: () => set({ playing: -1 }),
      notDone: !isDone, isDone, isChoice: !isContact && !isDone, isContact,
      q, qBars: [0, 1, 2, 3, 4].map((i) => ({ cls: i <= qs ? 'is-on' : '' })), qLabel: isContact ? 'Contact' : 'Your practice', qCount: String(Math.min(qs + 1, 5)).padStart(2, '0') + ' / 05',
      backVis: qs > 0 ? 'visible' : 'hidden', qBack: () => set({ q: Math.max(0, qs - 1) }),
      qNext: () => { if (!answered) return; if (isContact) return this.send('partner', ans, ['f-name', 'f-practice', 'f-email', 'f-phone'], () => set({ q: qs + 1 })); set({ q: qs + 1 }); }, nextDisabled: !answered || !!s.busy, nextOpacity: answered ? 1 : 0.4,
      nextLabel: isContact ? (s.busy ? 'Sending…' : 'Submit') : 'Next', contactHint: s.err || 'A real person replies within [one business day].', qReset: () => set({ q: 0, ans: {} })
    };
  }
}
