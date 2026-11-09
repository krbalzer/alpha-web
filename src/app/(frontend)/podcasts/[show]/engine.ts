// @ts-nocheck
/* Generated from design/boards/Show.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class ShowEngine extends DCLogic {
  st() { return this.state || {}; }
  renderVals() {
    const D = this.props.data, s = this.st(), E = D.eps, shown = s.shown || 20;
    const play = (ep) => { if (typeof window !== 'undefined' && ep) window.dispatchEvent(new CustomEvent('alpha:play', { detail: ep })); };
    return {
      show: D.show, plats: D.plats, count: String(E.length), since: D.since, hasEps: E.length > 0,
      hosts: D.hosts || [], hasHosts: (D.hosts || []).length > 0, hostsLabel: (D.hosts || []).length > 1 ? 'Your hosts' : 'Your host', guests: D.guests, hasGuests: Number(D.guests) > 0,
      lat: E[0] || {}, playLatest: () => E[0] && play(E[0].ep),
      nRes: E.length, rows: E.slice(0, shown).map((x) => Object.assign({}, x, { cls: 'row', play: () => play(x.ep), bg: D.show.bg, fg: D.show.fg, art: D.show.art })),
      hasMore: E.length > shown, loadMore: () => this.setState({ shown: shown + 20 }),
      shows: D.shows
    };
  }
}
