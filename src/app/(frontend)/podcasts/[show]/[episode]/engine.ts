// @ts-nocheck
/* Generated from design/boards/Episode.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class EpisodeEngine extends DCLogic {
  st() { return this.state || {}; }
  sec(a) { return String(a || '0').split(':').reduce((v, n) => v * 60 + +n, 0); }
  renderVals() {
    const D = this.props.data, s = this.st(), ep = D.ep.player;
    const playAt = (at) => { const x = Object.assign({}, ep); if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('alpha:play', { detail: x })); if (at && typeof window !== 'undefined') setTimeout(() => { const a = document.querySelector('audio'); if (a) a.currentTime = at; }, 400); };
    return {
      show: D.show, ep: D.ep, plats: D.plats, pq: D.pq, share: D.share,
      play: () => playAt(0), playQuote: () => playAt(this.sec(D.pq.at)),
      hasChapters: D.chapters.length > 0, chapters: D.chapters.map((c) => ({ at: c.at, t: c.t, go: () => playAt(this.sec(c.at)) })),
      trHtml: D.trHtml, trOpen: !!s.tr, trOpenS: s.tr ? 'true' : 'false', trLabel: s.tr ? 'Hide transcript' : 'Read the full transcript', toggleTr: () => this.setState({ tr: !s.tr }),
      copy: () => { try { navigator.clipboard.writeText(location.href); } catch (err) {} this.setState({ copied: true }); setTimeout(() => this.setState({ copied: false }), 1600); },
      copyLabel: s.copied ? 'Copied' : 'Copy link',
      hasMore: D.more.length > 0, more: D.more.map((m) => Object.assign({}, m, { play: () => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('alpha:play', { detail: m.ep })); } })),
      shows: D.shows
    };
  }
}
