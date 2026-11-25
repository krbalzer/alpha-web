// @ts-nocheck
/* Generated from design/boards/PortalAdmin.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'
import { REPORTS as PORTAL_REPORTS, STAGES as PORTAL_STAGES } from '@/lib/portal'

export class PortalAdminEngine extends DCLogic {
  
  renderVals() {
    const s = this.state || {}, set = (o) => this.setState(o), d = this.props.d;
    const ST = PORTAL_STAGES, R = PORTAL_REPORTS, fin = 2;
    const view = s.view || d.start.view || 'pipe';
    const leads = d.leads, files = d.files;
    const selId = s.lead != null ? s.lead : d.start.lead != null ? d.start.lead : leads[0] && leads[0].id;
    const sync = (v, id) => { try { const u = new URL(window.location.href); u.searchParams.set('view', v); if (id != null) u.searchParams.set('lead', String(id)); else u.searchParams.delete('lead'); window.history.replaceState(null, '', u.toString()); } catch (e) { /* no-op */ } };
    const go = (v, id) => () => { const o = { view: v }; if (id != null) o.lead = id; set(o); sync(v, id != null ? id : v === 'lead' ? selId : null); if (typeof window !== 'undefined') window.scrollTo(0, 0); };
    const act = (body) => { set({ busy: true }); return fetch('/partnerships/act', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then((r) => { if (!r.ok) throw new Error(); window.location.reload(); }).catch(() => set({ busy: false, err: 'That did not save. Try again.' })); };
    const latest = (leadId) => R.map((r) => files.find((f) => f.lead === leadId && f.report === r.key) || null);
    const MAP = { review: 'rev', ok: 'ok', fix: 'fix' };
    const first = (n) => (n || '').trim().split(/\s+/)[0] || 'the lead';
    const ini = (n) => (n || '').replace(/[^A-Za-z ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
    const fx = (key, fileId, lead) => ({
      editing: s.fx === key, fxId: 'fx-' + key, first: first(lead.name),
      cancel: () => set({ fx: null }),
      send: () => { const el = document.getElementById('fx-' + key); const t = el ? el.value.trim() : ''; if (!t) { el && el.focus(); return; } act({ op: 'file', id: fileId, status: 'fix', feedback: t }); }
    });
    /* pipeline */
    const L = leads.map((l) => {
      const fs = latest(l.id).map((f) => (f ? MAP[f.status] || 'rev' : 'todo'));
      const ok = fs.filter((x) => x === 'ok').length, rev = fs.filter((x) => x === 'rev').length, fix = fs.filter((x) => x === 'fix').length;
      const flag = rev ? 'rev' : fix ? 'fix' : l.days >= 30 ? 'stall' : '';  /* waiting on us beats waiting on them */
      return Object.assign({}, l, { ok, rev, fix, flag });
    });
    const ownerF = s.owner || 'all', focus = s.focus || '';
    const match = (x) => (ownerF === 'all' || x.guide === ownerF) && (!focus || (focus === 'rev' && x.flag === 'rev') || (focus === 'stall' && x.flag === 'stall') || (focus === 'late' && x.stageIx >= 5) || (focus === 'lead' && !x.flag && x.stageIx >= fin));
    const FL = { rev: ['Ready for review', 'flag is-rev'], stall: ['Stalled', 'flag is-stall'], fix: ['Changes requested', 'flag is-fix'] };
    const guides = Array.from(new Set(L.map((x) => x.guide).filter(Boolean)));
    /* review queue: every file waiting on a person, oldest first */
    const Q = files.filter((f) => f.status === 'review').slice().reverse();
    const queue = Q.map((f) => {
      const l = leads.find((x) => x.id === f.lead) || {}, r = R.find((x) => x.key === f.report) || { t: f.report };
      return Object.assign({ lead: l.practice + (l.test ? ' (test)' : ''), owner: l.guide || '', stage: (ST[l.stageIx] || {}).t || '', item: r.t, when: f.when, ai: f.filename, aiCls: 'ai', href: f.url,
        cls: 'q_r', open: true, done: false, okLabel: 'Approve', doneLabel: '', goLead: go('lead', l.id),
        ok: () => act({ op: 'file', id: f.id, status: 'ok' }), fix: () => set({ fx: 'q' + f.id }) }, fx('q' + f.id, f.id, l));
    });
    /* lead detail */
    const lead = L.find((x) => x.id === selId) || null;
    const cur = lead ? lead.stageIx : 0;
    const lf = lead ? latest(lead.id) : [];
    const st = lf.map((f) => (f ? MAP[f.status] || 'rev' : 'todo'));
    const cnt = (k) => st.filter((x) => x === k).length;
    const nOk = cnt('ok'), nRev = cnt('rev'), nFix = cnt('fix'), nTodo = cnt('todo'), total = R.length, recv = total - nTodo - nFix;
    const LAB = { ok: 'Approved', rev: 'In review', fix: 'Changes requested', todo: 'Waiting on lead' };
    const groups = [];
    if (lead && cur >= fin) R.forEach((r, i) => {
      let g = groups.find((y) => y.t === r.g); if (!g) { g = { t: r.g, items: [], ok: 0 }; groups.push(g); }
      const v = st[i], f = lf[i]; if (v === 'ok') g.ok++;
      g.items.push(Object.assign({
        t: r.t, sub: r.sub, label: LAB[v], cls: 'cl_i is-' + v, dot: 'dot' + ({ ok: ' is-ok', rev: ' is-rev', fix: ' is-fix' }[v] || ''),
        ai: '', aiCls: 'cl_ai', note: v === 'fix' ? f.feedback || '' : '', href: f ? f.url : '', file: f ? f.filename : '',
        canReview: v === 'rev', canNudge: false,
        ok: () => act({ op: 'file', id: f.id, status: 'ok' }), fix: () => set({ fx: 'l' + f.id })
      }, f ? fx('l' + f.id, f.id, lead) : { editing: false }));
    });
    groups.forEach((g) => { g.c = g.ok + ' / ' + g.items.length + ' approved'; });
    const onFin = cur === fin, allOk = nOk === total, last = cur >= ST.length - 1;
    const canAdvance = !!lead && !last && (!onFin || allOk);
    const approveAllShow = !!lead && onFin && nTodo + nFix === 0 && nRev > 0;
    const who = lead ? lead.practice : '';
    const gateT = !lead ? '' : last ? 'Closed' : onFin ? (allOk ? 'Everything approved' : nTodo + nFix ? 'Waiting on ' + who : 'Ready for your review') : 'Stage ' + (cur + 1) + ' in progress';
    const gateS = !lead ? '' : onFin
      ? (allOk ? 'Approving moves ' + first(lead.name) + ' to the pro forma call and shows Milestone 1 in their portal.' : nTodo + nFix ? nTodo + ' to upload, ' + nFix + ' with changes requested, ' + nRev + ' waiting on you.' : nRev + ' waiting on you.')
      : last ? 'Signed. Their portal shows the welcome milestone.' : 'Moving them on updates their tracker the next time they open the portal.';
    const feed = lead ? lead.feed : [];
    return {
      me: { ini: ini(d.me.name), name: d.me.name },
      panels: [],
      navItems: [['pipe', 'Pipeline', ''], ['queue', 'Review', queue.length ? String(queue.length) : ''], ['lead', 'Lead', '']].map((t) => ({ label: t[1], badge: t[2], cls: view === t[0] ? 'is-on' : '', go: go(t[0]) })),
      vPipe: view === 'pipe', vQueue: view === 'queue', vLead: view === 'lead' && !!lead, goPipe: go('pipe'),
      sums: [['', L.length, 'Active leads', ''], ['rev', L.filter((x) => x.flag === 'rev').length, 'Ready for review', ' is-gold'], ['lead', L.filter((x) => !x.flag && x.stageIx >= fin).length, 'Waiting on lead', ''], ['stall', L.filter((x) => x.flag === 'stall').length, 'Stalled 30+ days', ' is-warn'], ['late', L.filter((x) => x.stageIx >= 5).length, 'Offer and beyond', '']]
        .map((x) => ({ n: x[1], l: x[2], cls: 'sumb' + x[3] + (focus === x[0] && x[0] ? ' is-on' : ''), go: () => set({ focus: focus === x[0] ? '' : x[0] }) })),
      owners: [['all', 'All']].concat(guides.map((g) => [g, g])).map((o) => ({ l: o[1], cls: ownerF === o[0] ? 'is-on' : '', go: () => set({ owner: o[0] }) })),
      cols: ST.map((c, ci) => {
        const ds = L.filter((x) => x.stageIx === ci);
        return { n: String(ci + 1).padStart(3, '0'), t: c.t, count: ds.length, cards: ds.map((x) => ({
          name: x.practice, sub: (x.name || x.email) + (x.test ? ' / test' : ''), owner: ini(x.guide),
          pct: ci === fin ? Math.round(x.ok / total * 100) + '%' : ci > fin ? '100%' : '0%', prog: ci === fin ? x.ok + ' / ' + total + ' approved' : '', days: x.daysL,
          flag: x.flag ? (x.flag === 'stall' ? 'Stalled ' + x.days + 'd' : FL[x.flag][0]) : '', flagCls: x.flag ? FL[x.flag][1] : '',
          cls: 'cd' + (match(x) ? '' : ' is-dim') + (lead && x.id === lead.id && view === 'lead' ? ' is-sel' : ''), go: go('lead', x.id)
        })) };
      }),
      queue, queueSub: queue.length ? queue.length + ' waiting on New Partnerships. A person approves every file.' : 'Nothing waiting. New uploads land here.',
      ld: lead ? { practice: lead.practice + (lead.test ? ' (test)' : ''), sub: [lead.name, lead.email, lead.phone, 'Guide: ' + (lead.guide || 'unassigned')].filter(Boolean).join(' / '), portal: '/portal/' + lead.token, edit: '/admin/collections/leads/' + lead.id } : { practice: '', sub: '', portal: '#', edit: '#' },
      stages: ST.map((x, i) => ({ n: String(i + 1).padStart(3, '0'), t: x.t, x: (i / (ST.length - 1) * 100).toFixed(3) + '%', cls: 'trk_st' + (i < cur ? ' is-done' : i === cur ? ' is-cur' : '') })),
      fillW: ((cur + (onFin ? recv / total * .9 : last ? 0 : .5)) / (ST.length - 1) * 100).toFixed(2) + '%',
      curNum: cur + 1, curName: (ST[cur] || {}).t, nextNum: cur + 2, gateT, gateS,
      canAdvance: canAdvance && !s.busy, cantAdvance: !canAdvance && !approveAllShow && !last,
      approveAllShow, nRevTxt: String(nRev),
      advance: () => lead && act({ op: 'stage', lead: lead.id, stage: ST[cur + 1].key }),
      approveAll: () => lead && act({ op: 'approveAll', lead: lead.id }),
      groups, msgs: [], feed, inputHint: '', tabAll: '', tabInt: '', showAll: () => {}, showInt: () => {}
    };
  }
}
