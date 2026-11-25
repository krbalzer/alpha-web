// @ts-nocheck
/* Generated from design/boards/Portal.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class PortalEngine extends DCLogic {
  
  renderVals() {
    const s = this.state || {}, set = (o) => this.setState(o);
    const view = s.view || 'dash';
    /* Stand-in stages until New Partnerships confirms the real list */
    const ST = [
      ['Intro call', 'A first conversation about your practice and what you want next.'],
      ['NDA', 'Mutual NDA so we can share real numbers both ways.'],
      ['Financials', 'Three years of financials, tax returns, payroll and leases. This is how we build an honest picture of your practice, and it is the stage that takes the longest. Upload as you go; Tyler reviews each file.'],
      ['Operations', 'How the practice runs day to day: team, systems, vendors, schedule.'],
      ['Meet the team', 'Site visit, and time with the Alpha leaders you would work with.'],
      ['Letter of intent', 'Terms in writing, walked through line by line.'],
      ['Diligence', 'Final confirmation of everything above, with our advisors.'],
      ['Close', 'Signing, then your integration plan starts.']
    ];
    const CUR = 2;
    const I0 = [
      ['Statements', 'P&L 2023', 'Monthly, by location', 'ok'],
      ['Statements', 'P&L 2024', 'Monthly, by location', 'fix', 'This one is annual. Can you export it monthly, by location?'],
      ['Statements', 'P&L 2025 year to date', 'Through last month', 'rev'],
      ['Statements', 'Balance sheet 2024', 'Year end', 'ok'],
      ['Statements', 'Balance sheet year to date', 'Through last month', 'todo'],
      ['Tax', 'Business tax return 2022', 'All schedules', 'ok'],
      ['Tax', 'Business tax return 2023', 'All schedules', 'ok'],
      ['Tax', 'Business tax return 2024', 'All schedules', 'rev'],
      ['Payroll', 'Payroll register 2025', 'Year to date, all staff', 'ok'],
      ['Payroll', 'Provider compensation plans', 'Commission, hourly or salary, per provider', 'todo'],
      ['Revenue', 'Revenue by service 2024', 'From your EMR or POS', 'todo'],
      ['Revenue', 'Revenue by provider 2024', 'From your EMR or POS', 'todo'],
      ['Revenue', 'Membership roster and monthly recurring revenue', 'Current', 'todo'],
      ['Obligations', 'Leases, all locations', 'Including amendments', 'rev'],
      ['Obligations', 'Equipment loans and financing', 'Lender, balance, term', 'todo'],
      ['Obligations', 'Accounts receivable and payable aging', 'Current', 'todo']
    ];
    const st = s.items || I0.map((x) => x[3]);
    const items = I0.map((x, i) => ({ g: x[0], t: x[1], sub: x[2], st: st[i], note: st[i] === 'fix' ? (x[4] || '') : '' }));
    const setItem = (i, v) => { const n = (this.state.items || I0.map((x) => x[3])).slice(); n[i] = v; set({ items: n }); };
    const upload = (i) => { setItem(i, 'up'); setTimeout(() => setItem(i, 'rev'), 1300); };
    const n = (k) => items.filter((x) => x.st === k).length;
    const nOk = n('ok'), nRev = n('rev') + n('up'), nFix = n('fix'), nTodo = n('todo'), total = items.length, recv = total - nTodo - nFix;
    const submitted = !!s.sent, canSubmit = !submitted && nTodo === 0 && nFix === 0 && n('up') === 0;
    const LAB = { ok: 'Approved', rev: 'In review', fix: 'Needs changes', todo: 'To do', up: 'Uploading' };
    const ACT = { todo: 'Upload', fix: 'Replace file', rev: 'View', ok: 'View', up: '' };
    const groups = [];
    items.forEach((it, i) => {
      let g = groups.find((x) => x.t === it.g);
      if (!g) { g = { t: it.g, items: [] }; groups.push(g); }
      g.items.push({ t: it.t, sub: it.sub, note: it.note, up: it.st === 'up', cls: 'cl_i is-' + it.st, dot: 'dot' + ({ ok: ' is-ok', rev: ' is-rev', fix: ' is-fix', up: ' is-up' }[it.st] || ''), label: LAB[it.st], act: ACT[it.st], go: () => { if (it.st === 'todo' || it.st === 'fix') upload(i); } });
    });
    groups.forEach((g) => { const done = g.items.filter((x) => x.cls.indexOf('is-ok') > -1).length; g.c = done + ' / ' + g.items.length + ' approved'; });
    const pct = Math.round(recv / total * 100);
    const attn = items.filter((x) => x.st === 'fix' || x.st === 'todo').slice(0, 4).map((x) => ({ t: x.t, n: x.st === 'fix' ? 'Needs changes: ' + x.note : 'To do / ' + x.sub, dot: x.st === 'fix' ? 'dot is-fix' : 'dot' }));
    const SVC = ['Injectables', 'Lasers', 'Facials', 'Skincare', 'Wellness', 'Weight loss', 'Hormone therapy', 'Body'];
    const svcOn = s.svc || ['Injectables', 'Lasers', 'Skincare'];
    const go = (v) => () => { set({ view: v }); if (typeof window !== 'undefined') window.scrollTo && window.scrollTo(0, 0); };
    return {
      tabs: [['signin', 'Sign in'], ['dash', 'Dashboard'], ['stage', 'Stage 3 checklist'], ['profile', 'Profile']].map((t) => ({ label: t[1], cls: view === t[0] ? 'is-on' : '', go: go(t[0]) })),
      fillAll: () => set({ items: I0.map((x) => (x[3] === 'ok' ? 'ok' : 'rev')), sent: false, view: view === 'signin' ? 'stage' : view }),
      resetAll: () => set({ items: null, sent: false, siSent: false }),
      vSignin: view === 'signin', vApp: view !== 'signin', vDash: view === 'dash', vStage: view === 'stage', vProfile: view === 'profile',
      siForm: !s.siSent, siSent: !!s.siSent, siSend: () => set({ siSent: true }), siOpen: () => set({ siSent: false, view: 'dash' }), signOut: () => set({ view: 'signin', siSent: false }),
      goDash: go('dash'), goStage: go('stage'), goProfile: go('profile'),
      navItems: [['dash', 'Overview'], ['stage', 'Stage 3'], ['profile', 'Profile']].map((t) => ({ label: t[1], cls: view === t[0] ? 'is-on' : '', go: go(t[0]) })),
      stages: ST.map((x, i) => ({ n: String(i + 1).padStart(3, '0'), t: x[0], x: (i / (ST.length - 1) * 100).toFixed(3) + '%', cls: 'trk_st' + (i < CUR ? ' is-done' : i === CUR ? ' is-cur' : ''), cur: i === CUR ? 'step' : 'false' })),
      fillW: ((CUR + (submitted ? .9 : pct / 100 * .9)) / (ST.length - 1) * 100).toFixed(2) + '%',
      etaLine: 'Stage 3 of 8 / started [Oct 14]',
      cur: { num: CUR + 1, t: ST[CUR][0], d: ST[CUR][1] },
      ctaLabel: submitted ? 'View stage 3' : nTodo + nFix > 0 ? 'Continue stage 3' : 'Review and send',
      pct, pct100: pct + '%', recv, total, nOk, nRev, nFix, nTodo,
      cardK: submitted ? 'With Tyler' : 'Stage 3 progress',
      cardH: submitted ? 'Sent for review' : nFix ? nFix + ' file needs changes' : nTodo ? nTodo + ' items to go' : 'Ready to send',
      cardS: submitted ? 'Stage 4, Operations, unlocks when Tyler approves.' : 'Stage 4, Operations, unlocks when this stage is approved.',
      attn, attnCount: (nTodo + nFix) + ' open',
      feed: [['Today', 'Tyler approved Payroll register 2025'], ['Today', 'Tyler asked for changes on P&L 2024'], ['Yesterday', 'You uploaded Leases, all locations'], ['Oct 21', 'Stage 2, NDA, complete'], ['Oct 14', 'Welcome to the portal']].map((f) => ({ w: f[0], t: f[1] })),
      profPct: '40%',
      groups, canSubmit, cantSubmit: !canSubmit && !submitted, submitted, submit: () => set({ sent: true }),
      submitHint: nFix ? 'Fix ' + nFix + ' file first.' : nTodo ? nTodo + ' items still to upload.' : 'Finishing uploads.',
      svc: SVC.map((c) => ({ t: c, cls: svcOn.indexOf(c) > -1 ? 'is-on' : '', go: () => set({ svc: svcOn.indexOf(c) > -1 ? svcOn.filter((x) => x !== c) : svcOn.concat([c]) }) })),
      svcLine: svcOn.join(' '),
      locs: [{ city: 'Newport Beach', a: '[Street address]', ph: '0 of 6 photos', cls: '' }, { city: 'Laguna Niguel', a: '[Street address]', ph: '0 of 6 photos', cls: '' }]
    };
  }
}
