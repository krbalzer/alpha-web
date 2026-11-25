// @ts-nocheck
/* Generated from design/boards/Portal.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'
import { REPORTS as PORTAL_REPORTS, STAGES as PORTAL_STAGES } from '@/lib/portal'

export class PortalEngine extends DCLogic {
  
  renderVals() {
    const s = this.state || {}, set = (o) => this.setState(o), d = this.props.d;
    const view = s.view || 'dash';
    const ST = PORTAL_STAGES, CUR = d.stageIx, fin = 2;
    const ginfo = d.guide || { name: 'Tyler', role: 'New Partnerships' };
    const first = ginfo.name;
    /* financials: one row per report, status from the latest upload */
    const MAP = { review: 'rev', ok: 'ok', fix: 'fix', todo: 'todo' };
    const items = PORTAL_REPORTS.map((r, i) => {
      const x = d.reports.find((y) => y.key === r.key) || { status: 'todo' };
      const st = (s.up || {})[r.key] ? 'up' : MAP[x.status] || 'todo';
      return { r, i, st, note: st === 'fix' ? x.feedback || 'This one needs another pass.' : '', file: x.file || '', err: (s.err || {})[r.key] || '' };
    });
    const upload = (it) => {
      if (typeof document === 'undefined') return;
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = it.r.pdf ? '.xlsx,.xls,.csv,.pdf' : '.xlsx,.xls,.csv';
      inp.onchange = () => {
        const f = inp.files && inp.files[0]; if (!f) return;
        const st0 = this.state || {};
        this.setState({ up: Object.assign({}, st0.up, { [it.r.key]: 1 }), err: Object.assign({}, st0.err, { [it.r.key]: '' }) });
        const fd = new FormData(); fd.append('report', it.r.key); fd.append('file', f);
        fetch('/portal/' + d.token + '/upload', { method: 'POST', body: fd })
          .then((res) => res.json().catch(() => ({})).then((j) => { if (!res.ok || !j.ok) throw new Error(j.error || 'That upload did not go through. Try again.'); window.location.reload(); }))
          .catch((e) => { const st1 = this.state || {}; this.setState({ up: Object.assign({}, st1.up, { [it.r.key]: 0 }), err: Object.assign({}, st1.err, { [it.r.key]: e.message || 'That upload did not go through. Try again.' }) }); });
      };
      inp.click();
    };
    const n = (k) => items.filter((x) => x.st === k).length;
    const nOk = n('ok'), nRev = n('rev') + n('up'), nFix = n('fix'), nTodo = n('todo'), total = items.length, recv = total - nTodo - nFix;
    const ready = nTodo === 0 && nFix === 0 && n('up') === 0;
    const submitted = (d.sent || !!s.sent) && ready, canSubmit = !submitted && ready;
    const submit = () => {
      set({ sending: true });
      fetch('/portal/' + d.token + '/submit', { method: 'POST' }).then((r) => { if (!r.ok) throw new Error(); set({ sent: true, sending: false }); }).catch(() => set({ sending: false }));
    };
    const LAB = { ok: 'Approved', rev: 'In review', fix: 'Needs changes', todo: 'To do', up: 'Uploading' };
    const ACT = { todo: 'Upload', fix: 'Replace file', rev: 'Replace', ok: '', up: '' };
    const groups = [];
    items.forEach((it) => {
      let g = groups.find((x) => x.t === it.r.g);
      if (!g) { g = { t: it.r.g, items: [] }; groups.push(g); }
      g.items.push({ t: it.r.t, sub: it.r.sub, note: it.note, err: it.err, fmt: (it.r.pdf ? 'Excel or PDF' : 'Excel') + (it.file ? ' / ' + it.file : ''), chk: '', tips: it.r.tips, tipOn: s.tip === it.i, tipL: s.tip === it.i ? 'Hide steps' : 'How do I pull this?', tipGo: () => set({ tip: s.tip === it.i ? null : it.i }), up: it.st === 'up', cls: 'cl_i is-' + it.st, dot: 'dot' + ({ ok: ' is-ok', rev: ' is-rev', fix: ' is-fix', up: ' is-up' }[it.st] || ''), label: LAB[it.st], act: ACT[it.st], go: () => { if (it.st !== 'up' && it.st !== 'ok') upload(it); } });
    });
    groups.forEach((g) => { const done = g.items.filter((x) => x.cls.indexOf('is-ok') > -1).length; g.c = done + ' / ' + g.items.length + ' approved'; });
    const pct = Math.round(recv / total * 100);
    const attnFin = items.filter((x) => x.st === 'fix' || x.st === 'todo').slice(0, 4).map((x) => ({ t: x.r.t, n: x.st === 'fix' ? 'Needs changes: ' + x.note : 'To do / ' + x.r.sub, dot: x.st === 'fix' ? 'dot is-fix' : 'dot' }));
    const SVC = ['Injectables', 'Lasers', 'Facials', 'Skincare', 'Wellness', 'Weight loss', 'Hormone therapy', 'Body'];
    const svcOn = s.svc || [];
    const go = (v) => () => { set({ view: v }); if (typeof window !== 'undefined') window.scrollTo && window.scrollTo(0, 0); };
    const noop = () => {};
    /* per-stage dashboard card (everything but financials) */
    const R = (t, v, k) => ({ t, s: v, cls: k ? 'is-' + k : '', dot: 'dot' + (k === 'ok' ? ' is-ok' : k === 'on' ? ' is-rev' : '') });
    const CARDS = {
      0: { k: 'Next', h: 'Your intro call', s: 'Thirty minutes with ' + first + ' about what you have built and what you want next.', rows: [R('Intro call', 'Next', 'on'), R('NDA', 'After the call', ''), R('Financials', 'After the NDA', '')] },
      1: { k: 'NDA', h: 'Sign the mutual NDA', s: 'It comes by email to sign electronically. Your financials checklist opens here the moment it is signed.', rows: [R('Intro call', 'Done', 'ok'), R('NDA', 'To sign', 'on'), R('Financials', 'Next', '')] },
      3: { k: 'Next', h: 'Pro forma call with Preston', s: 'About an hour on Zoom. Bring whoever knows your books. We will send a time.', rows: [R('Financials', 'Approved', 'ok'), R('Pro forma', 'In progress', 'on'), R('Walkthrough call', 'Next', '')] },
      4: { k: 'With Alpha leadership', h: 'Your valuation is in review', s: 'Nothing to do on your side. We will call you as soon as there is news.', rows: [R('Pro forma call', 'Done', 'ok'), R('Leadership review', 'In progress', 'on'), R('Offer call', 'Next', '')] },
      5: { k: 'Offer', h: 'Your offer call', s: 'With ' + first + ' and Preston. We walk through the offer together, on the call.', rows: [R('Valuation', 'Done', 'ok'), R('Offer call', 'Next', 'on'), R('Letter of intent', 'After the call', '')] },
      6: { k: 'Diligence', h: 'Three workstreams, one tracker', s: 'Quality of earnings first, then legal, then insurance. Details below.', rows: [R('Letter of intent', 'Signed', 'ok'), R('Diligence', 'In progress', 'on'), R('Close', 'Next', '')] },
      7: { k: 'Close', h: 'Signing day', s: 'Closing documents come to sign electronically. Your integration plan starts the week after.', rows: [R('Diligence', 'Complete', 'ok'), R('Closing documents', 'To sign', 'on'), R('Integration kickoff', 'Week after', '')] }
    };
    const card = CARDS[CUR] || null;
    const ATTN = {
      0: [{ t: 'Intro call', n: first + ' will reach out to set a time.', dot: 'dot' }],
      1: [{ t: 'Sign the NDA', n: 'Check your email', dot: 'dot is-rev' }],
      3: [{ t: 'Pro forma call', n: 'Preston / about an hour / time to come', dot: 'dot' }],
      4: [{ t: 'Nothing needs you right now', n: 'We will reach out when leadership is done.', dot: 'dot is-ok' }],
      5: [{ t: 'Offer call', n: 'With ' + first + ' and Preston', dot: 'dot' }],
      6: [{ t: 'Diligence requests', n: 'They show up here as they come in.', dot: 'dot' }],
      7: [{ t: 'Closing documents', n: 'To sign electronically', dot: 'dot is-rev' }]
    };
    const attnL = CUR === fin ? attnFin : ATTN[CUR] || [];
    const NOTES = {
      0: 'Looking forward to the call. Come with questions; there is no prep needed.',
      1: 'Once the NDA is signed, your financials checklist opens right here.',
      2: 'Most practices take two passes on financials, and that is normal. Start with the P&L. It unlocks everything else.',
      3: 'A pro forma is your P&L as it would look inside Alpha. Nothing on the call is final, and changes happen live.',
      4: 'Leadership reviews every model closely. A quiet week is normal.',
      5: 'The offer is a starting point. Tell us how it really lands.',
      6: 'Diligence is the longest stretch. Your attorney and accountant can work alongside our advisors.',
      7: 'Almost there. We will walk you through signing day before it happens.'
    };
    const PRESTON = CUR === 3;
    const gName = PRESTON ? 'Preston' : first, gRole = PRESTON ? 'Finance' : ginfo.role || 'New Partnerships';
    const DIL = [
      ['3A', 'Quality of earnings', 'Cherry Bekaert / your accountant', 'Trailing earnings, add-backs, working capital', CUR > 6 ? 100 : 30, CUR > 6 ? 'Complete' : 'In progress', 'Milestone 3a'],
      ['3B', 'Legal', 'Alston & Bird / your attorney', 'Entity, contracts, leases, licensure', CUR > 6 ? 100 : 0, CUR > 6 ? 'Complete' : 'Next', 'Milestone 3b'],
      ['03', 'Insurance', 'Gallagher', 'Coverage, malpractice, tail', CUR > 6 ? 100 : 0, CUR > 6 ? 'Complete' : 'Starts after legal', 'Before close']
    ];
    /* milestone moment: once per milestone, per browser */
    const MS = {
      m1: { n: '01', k: 'Milestone 1', t: 'Your financials are in.', s: 'All six approved. Preston starts your pro forma next.' },
      m2: { n: '02', k: 'Milestone 2', t: 'Letter of intent signed.', s: 'Diligence starts now.' },
      m4: { n: '04', k: 'Closed', t: 'Welcome to Alpha.', s: 'Signed. Your integration plan starts next week.' }
    };
    const MSO = ['m1', 'm2', 'm3a', 'm3b', 'm4'];
    const msAt = CUR >= 7 ? 'm4' : CUR >= 6 ? 'm2' : CUR >= 3 ? 'm1' : null;
    const msKey = 'alpha-portal-ms-' + d.token;
    if (msAt && !this._msChecked && typeof window !== 'undefined') {
      this._msChecked = true;
      setTimeout(() => { let seen = ''; try { seen = localStorage.getItem(msKey) || ''; } catch (e) { seen = msAt; } if (seen !== msAt) this.setState({ ms: msAt }); }, 400);
    }
    const msK = s.ms && MS[s.ms] ? s.ms : null;
    const onFin = CUR === fin;
    const words = (d.name || '').trim().split(/\s+/).filter(Boolean);
    const ini = ((d.practice || '').replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('') || 'A').toUpperCase();
    const navT = [['dash', 'Overview']].concat(CUR >= fin ? [['stage', 'Financials']] : []).concat([['profile', 'Profile']]);
    return {
      isTest: !!d.test, vApp: true,
      who: { ini, practice: d.practice, name: d.name || words.join(' ') },
      msOn: !!msK, ms: msK ? MS[msK] : MS.m1, msClose: () => { try { localStorage.setItem(msKey, msK || ''); } catch (e) { /* private mode */ } set({ ms: null }); },
      msRays: Array.from({ length: 24 }, (_, i) => ({ r: (i * 15) + 'deg', d: ((i % 6) * 45) + 'ms' })),
      msPips: MSO.map((k, i) => ({ cls: msK && i <= MSO.indexOf(msK) ? 'is-on' : '' })),
      vRing: onFin, vList: !onFin && !!card, vDil: CUR >= 6,
      cardRows: card ? card.rows : [], vCardCta: false, cardCta: '', cardGo: noop,
      vResp: false, respQ: '', respBtns: [],
      dil: DIL.map((x) => ({ n: x[0], t: x[1], who: x[2], what: x[3], pct: x[4] + '%', s: x[5], ms: x[6], cls: 'dil_r' + (x[4] === 100 ? ' is-ok' : x[4] > 0 ? ' is-on' : '') })),
      g: { ini: gName.slice(0, 2).toUpperCase(), name: gName, role: gRole, first, msg: d.note || NOTES[CUR] || '', book: PRESTON ? '' : ginfo.book || '', email: PRESTON ? '' : ginfo.email || '', mail: ginfo.email ? 'mailto:' + ginfo.email : '' },
      fin: { num: fin + 1, t: ST[fin].t, d: ST[fin].d },
      vDash: view === 'dash', vStage: view === 'stage', vProfile: view === 'profile',
      goDash: go('dash'), goStage: go('stage'), goProfile: go('profile'),
      navItems: navT.map((t) => ({ label: t[1], cls: view === t[0] ? 'is-on' : '', go: go(t[0]) })),
      stages: ST.map((x, i) => ({ n: String(i + 1).padStart(3, '0'), t: x.t, x: (i / (ST.length - 1) * 100).toFixed(3) + '%', cls: 'trk_st' + (i < CUR ? ' is-done' : i === CUR ? ' is-cur' : ''), cur: i === CUR ? 'step' : 'false' })),
      fillW: ((CUR + (onFin ? (submitted ? .9 : pct / 100 * .9) : .5)) / (ST.length - 1) * 100).toFixed(2) + '%',
      etaLine: 'Stage ' + (CUR + 1) + ' of ' + ST.length,
      cur: { num: CUR + 1, t: ST[CUR].t, d: ST[CUR].d },
      ctaLabel: onFin ? (submitted ? 'View financials' : nTodo + nFix > 0 ? 'Continue financials' : 'Review and send') : CUR > fin ? 'View financials' : 'Your Alpha profile',
      ctaGo: onFin || CUR > fin ? go('stage') : go('profile'),
      pct, pct100: pct + '%', recv, total, nOk, nRev, nFix, nTodo,
      cardK: onFin ? (submitted ? 'With ' + first : 'Financials') : card ? card.k : '',
      cardH: onFin ? (submitted ? 'Sent for review' : nFix ? nFix + (nFix === 1 ? ' file needs' : ' files need') + ' changes' : nTodo ? nTodo + ' to go' : 'Ready to send') : card ? card.h : '',
      cardS: onFin ? 'Stage 4, your pro forma call with Preston, unlocks when all six are approved.' : card ? card.s : '',
      attn: attnL, attnCount: attnL.filter((a) => a.dot !== 'dot is-ok').length + ' open',
      feed: d.feed || [],
      profPct: '0%',
      groups, canSubmit: canSubmit && !s.sending, cantSubmit: !canSubmit && !submitted || !!s.sending, submitted, submit,
      submitHint: s.sending ? 'Sending...' : nFix ? 'Fix ' + nFix + (nFix === 1 ? ' file' : ' files') + ' first.' : nTodo ? nTodo + ' still to upload.' : 'Finishing uploads.',
      svc: SVC.map((c) => ({ t: c, cls: svcOn.indexOf(c) > -1 ? 'is-on' : '', go: () => set({ svc: svcOn.indexOf(c) > -1 ? svcOn.filter((x) => x !== c) : svcOn.concat([c]) }) })),
      svcLine: svcOn.length ? svcOn.join(' ') : 'Services',
      locs: []
    };
  }
}
