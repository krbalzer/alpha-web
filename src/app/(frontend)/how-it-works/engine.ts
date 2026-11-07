// @ts-nocheck
/* Generated from design/boards/Pathway.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class PathwayEngine extends DCLogic {
  
  renderVals() {
    const s = this.state || {}, set = (o) => this.setState(o), t = s.track || 'join';
    return {
      tPartner: 'pw_t' + (t === 'partner' ? ' is-on' : ''), tJoin: 'pw_t' + (t === 'join' ? ' is-on' : ''),
      selPartner: t === 'partner' ? 'true' : 'false', selJoin: t === 'join' ? 'true' : 'false',
      goPartner: () => set({ track: 'partner' }), goJoin: () => set({ track: 'join' }),
      isPartner: t === 'partner', isJoin: t === 'join'
    };
  }
}
