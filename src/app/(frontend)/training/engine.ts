// @ts-nocheck
/* Generated from design/boards/University.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class UniversityEngine extends DCLogic {
  renderVals() {
    const s = this.state || {}, set = (o) => this.setState(o);
    const D = this.props.data;
    const season = s.season || D.season;
    const S = D.aim;
    const RANGE = D.range;
    const seasons = [1, 2, 3].map((n) => ({ label: 'Season ' + n + RANGE[n], cls: 'tab' + (n === season ? ' is-on' : ''), sel: n === season ? 'true' : 'false', go: () => set({ season: n }) }));
    const sessions = S[season].map((r) => ({ d: r[0], n: r[1], t: r[2], c: r[3], hasC: !!r[3], noC: !r[3], s: 'Closed door' }));
    const pins = D.pins;
    const LG = {'Injector': '/university/loop-injector.svg', 'Esthie': '/university/loop-esthie.svg', 'Manager': '/university/loop-manager.svg', 'Surgery': '/university/loop-surgery.svg', 'Marketing': '/university/loop-marketing.svg'};
    const loops = ['Injector', 'Marketing', 'Surgery', 'Manager', 'Body', 'Esthie'].map((l) => ({ c: l + ' Loop', logo: LG[l] || '', noLogo: !LG[l] }));
    const R = {
      injector: { label: 'Injector', loop: 'Injector Loop', logo: '/university/loop-injector.svg', loopFor: 'Technique, product, complications and second opinions, answered by injectors across the network.', labFit: 'Injector Labs are hands-on technique days.', hasLearn: true, hasPath: true, pods: [{ s: 'HTB', t: 'Holding Time Back' }, { s: 'WCE', t: 'White Coat Entrepreneur' }] },
      esthie: { label: 'Esthetician', loop: 'Esthie Loop', logo: '/university/loop-esthie.svg', loopFor: 'Facials, devices, skincare protocols and product questions, shared between estheticians in every clinic.', labFit: 'Skincare Labs cover devices, facials and protocols.', hasLearn: false, hasPath: false, pods: [{ s: 'BF', t: 'The Beauty Filter' }] },
      manager: { label: 'Manager', loop: 'Manager Loop', logo: '/university/loop-manager.svg', loopFor: 'Scheduling, staffing, systems and the day-to-day of running a clinic, with managers who have solved it before.', labFit: '', hasLearn: false, hasPath: false, pods: [{ s: 'OMS', t: 'Operation Med Spa' }, { s: 'MSM', t: 'Med Spa Marketing Group Chat' }] }
    };
    const rk = s.role || 'injector';
    const roles = Object.keys(R).map((k, i) => ({ n: 'No. 0' + (i + 1), label: R[k].label, cls: k === rk ? 'is-on' : '', sel: k === rk ? 'true' : 'false', go: () => set({ role: k }) }));
    const P = {
      loops: { name: 'Loops', ic: '/university/icon-loops.png', w: '/university/loops-word.png', line: 'Every day, in Slack. One for every role.', stats: [{ n: '6', l: 'Loops, by role' }, { n: '[N]', l: 'Members, live from Slack' }, { n: '[N]', l: 'Conversations this week' }, { n: '[N] min', l: 'Typical time to first answer' }] },
      labs: { name: 'Labs', ic: '/university/icon-labs.png', w: '/university/labs-word.png', line: 'In person, all over, all the time. Open to every provider.', stats: D.labStats },
      learn: { name: 'Learn', ic: '/university/icon-learn.png', w: '/university/learn-word.png', line: 'AIM sessions and the podcast network, on demand.', stats: D.learnStats }
    };
    const pk = s.prog || 'loops';
    const progs = Object.keys(P).map((k) => ({ name: P[k].name, ic: P[k].ic, w: P[k].w, line: P[k].line, cls: k === pk ? 'is-on' : '', sel: k === pk ? 'true' : 'false', go: () => set({ prog: k }) }));
    const prog = Object.assign({}, P[pk], { isLoops: pk === 'loops', isLabs: pk === 'labs', isLearn: pk === 'learn' });
    const LABS = D.labs;
    const li = s.lab || 0, L0 = LABS[li];
    const lab = { track: L0.track, city: L0.city, date: L0.date, tiles: L0.tiles.map((l, i) => ({ l: '[Photo] ' + l, cls: 'tile ' + (L0.layout[i] || '') })) };
    const labsw = LABS.map((x, i) => ({ l: x.track.split(' ')[0] + ' / ' + (i + 1), cls: i === li ? 'is-on' : '', sel: i === li ? 'true' : 'false', go: () => set({ lab: i }) }));
    return { d: D, seasons, sessions, pins, loops, roles, role: R[rk], progs, prog, lab, labsw };
  }
}
