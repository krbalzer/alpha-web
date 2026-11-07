// @ts-nocheck
/* Generated from design/boards/Talk.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class TalkEngine extends DCLogic {
  
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
    const s = this.state || {}, set = (o) => this.setState(o), path = s.path || 'own';
    const Q = [
      { title: 'How many locations do you run?', hint: 'Count every location operating under your brand today.', key: 'locs', opts: ['1', '2 to 3', '4 or more'] },
      { title: 'How long have you been open?', hint: 'From your first patient at your first location.', key: 'years', opts: ['Under [2] years', '[2] to [5] years', '[5]+ years'] },
      { title: 'Roughly, what is your annual revenue?', hint: 'A range is fine. This stays between us.', key: 'rev', opts: ['Under $[X]M', '$[X]M to $[Y]M', '$[Y]M+'] },
      { title: 'What is your role?', hint: 'We want to talk with the person who makes the call.', key: 'role', opts: ['Owner / founder', 'Medical director', 'Partner / investor'] }
    ];
    const qs = s.q || 0, ans = s.ans || {}, isDone = qs >= 5, isContact = qs === 4, qq = Q[Math.min(qs, 3)], answered = isContact || !!ans[qq.key];
    return {
      pOwn: 'tkp' + (path === 'own' ? ' is-on' : ''), pOther: 'tkp' + (path === 'other' ? ' is-on' : ''), goOwn: () => set({ path: 'own' }), goOther: () => set({ path: 'other' }),
      isOwn: path === 'own', isOther: path === 'other',
      sendOther: () => this.send('other', {}, ['o-r', 'o-n', 'o-e', 'o-m'], () => set({ sent: true })), otherBusy: !!s.busy || !!s.sent,
      otherLabel: s.sent ? 'Sent' : s.busy ? 'Sending…' : 'Send', otherNote: s.sent ? 'Thanks. We will reply by email.' : (s.err || ''),
      notDone: !isDone, isDone, isChoice: !isContact && !isDone, isContact,
      q: { title: qq.title, hint: qq.hint, opts: qq.opts.map((o) => ({ label: o, on: ans[qq.key] === o ? 'true' : 'false', cls: ans[qq.key] === o ? 'opt is-on' : 'opt', pick: () => set({ ans: Object.assign({}, ans, { [qq.key]: o }) }) })) },
      qBars: [0, 1, 2, 3, 4].map((i) => ({ cls: i <= qs ? 'is-on' : '' })), qLabel: isContact ? 'Contact' : 'Your practice', qCount: String(Math.min(qs + 1, 5)).padStart(2, '0') + ' / 05',
      backVis: qs > 0 ? 'visible' : 'hidden', qBack: () => set({ q: Math.max(0, qs - 1) }), qNext: () => { if (!answered) return; if (isContact) return this.send('partner', ans, ['f-name', 'f-practice', 'f-email', 'f-phone'], () => set({ q: qs + 1 })); set({ q: qs + 1 }); },
      nextDisabled: !answered || !!s.busy, nextOpacity: answered ? 1 : .4, nextLabel: isContact ? (s.busy ? 'Sending…' : 'Submit') : 'Next', contactHint: s.err || 'A real person replies within [one business day].', qReset: () => set({ q: 0, ans: {} })
    };
  }
}
