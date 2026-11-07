// @ts-nocheck
/* Generated from design/boards/Article.dc.html by tools/port/port_pages.py. */
import { DCLogic } from '@/lib/dc'

export class ArticleEngine extends DCLogic {
  
  renderVals() {
    const s = this.state || {};
    const D = this.props.data;
    return { a: D.a, brand: D.brand, more: D.more, share: D.share, copy: () => { try { navigator.clipboard.writeText(location.href); } catch (e) {} this.setState({ c: 1 }); }, copyLabel: s.c ? 'Copied' : 'Copy link' };
  }
}
