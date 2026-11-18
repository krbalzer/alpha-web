// @ts-nocheck
/* Site-wide reveal system. Same engine the design boards run (see tools/port/motion). Elements reveal once, on entry. */
export function moStart(root) {
  if (!root || typeof IntersectionObserver === 'undefined') return null;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { root.removeAttribute('data-mo'); return null; }
  var SEL = 'h1,h2,.h1,.h2,.h3,.display,.tv_t,.pg_h,blockquote,.eyebrow,.pill,.lede,.body,.sub,.addr,.marks,.hero_ctas,.hero_cta,.stat,.chiprow,.field,.qual,.role,.ms li,.lead,.v_col,.v_cta,.foot_links,.foot_meta,figcaption,.closer_media>.btn,.cta_cr,.img,.founder_img,.film,.card_img,figure>img,.rule,.lock';
  var TRIG = '.closer_media';
  var SKIP = '.b_top,.mn,.pp,.mpp,.map,.lx_list,.closer_tags,.demo_bar,.crumb';
  root.setAttribute('data-mo', '');
  var done = function (el) { el.setAttribute('data-mo-in', '2'); el.style.removeProperty('--mo-d'); };
  var pending = new Set();
  var reveal = function (vis) {
    vis.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
    vis.forEach(function (el, i) {
      if (!pending.has(el)) return;
      pending.delete(el);
      io.unobserve(el);
      el.style.setProperty('--mo-d', Math.min(i, 6) * 55 + 'ms');
      el.setAttribute('data-mo-in', '1');
      setTimeout(function () { done(el); }, 1100 + Math.min(i, 6) * 55);
    });
  };
  var io = new IntersectionObserver(function (es) {
    reveal(es.filter(function (e) { return e.isIntersecting; }).map(function (e) { return e.target; }));
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
  /* Failsafe: if the observer misses an element (seen on clip-path-hidden hero headings), check boxes directly on load, scroll and resize. */
  var raf = 0;
  var check = function () {
    raf = 0;
    if (!pending.size) return;
    var h = window.innerHeight * 0.94, vis = [];
    pending.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < h && (r.width || r.height)) vis.push(el); });
    if (vis.length) reveal(vis);
  };
  var queue = function () { if (!raf) raf = requestAnimationFrame(check); };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  var t1 = setTimeout(queue, 300), t2 = setTimeout(queue, 1200);
  var add = function (n) {
    if (n.nodeType !== 1) return;
    var ALL = SEL + ',' + TRIG;
    var list = n.matches(ALL) ? [n] : [];
    n.querySelectorAll(ALL).forEach(function (x) { list.push(x); });
    list.forEach(function (x) {
      if (x.hasAttribute('data-mo-in') || x.closest(SKIP)) return;
      var up = x.parentElement && x.parentElement.closest(SEL);
      if (up && up !== root && root.contains(up)) { x.setAttribute('data-mo-in', '2'); return; }
      pending.add(x);
      io.observe(x);
    });
    queue();
  };
  add(root);
  var mo = new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(add); }); });
  mo.observe(root, { childList: true, subtree: true });
  return function () { io.disconnect(); mo.disconnect(); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); clearTimeout(t1); clearTimeout(t2); if (raf) cancelAnimationFrame(raf); };
}
