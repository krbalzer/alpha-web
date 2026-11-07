// @ts-nocheck
/* Generated from design/boards/Legal.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class LegalEngine extends DCLogic {
  
  renderVals() {
    const d = this.props.doc, docs = this.props.docs || [];
    return {
      doc: { t: d.title }, updated: d.updated,
      tabs: docs.map((x) => ({ t: x.title, href: '/legal/' + x.slug, cls: 'chipb' + (x.slug === d.slug ? ' is-on' : '') })),
      toc: d.sections.map((s, i) => ({ n: String(i + 1).padStart(2, '0'), t: s.t, id: 's' + (i + 1), href: '#s' + (i + 1), html: s.html, cls: '' }))
    };
  }
}
