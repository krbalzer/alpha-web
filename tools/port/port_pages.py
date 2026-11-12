"""Port design boards (design/boards/*.dc.html) into Next routes.

    python3 tools/port/port_pages.py            # every page in PAGES
    python3 tools/port/port_pages.py About Team  # just these

Each page becomes <dir>/<Name>View.tsx (client, markup from the board), engine.ts (the board's logic class)
and page.css (board CSS scoped under .pg-<slug>). Site chrome is stripped and replaced by the real thing:
nav -> <Nav>, menu/footer/player -> layout, CTA closer -> <Closer> in page.tsx.
Data: a board's data() method is swapped for `return this.props.data` when the page config says so, and the
page.tsx passes the same shape from src/lib/pages.ts. Edit the board or this file, not the generated files.
Brand is ported by port_brand.py.
"""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
sys.path.insert(0, os.path.dirname(__file__))
from dc2jsx import convert, scope_css, strip_injected  # noqa: E402

APP = ROOT + '/src/app/(frontend)/'
ASSETS = json.load(open(os.path.join(os.path.dirname(__file__), 'assets.json')))

# board anchors -> routes
HREF = {
    '#home': '/', '#top': '#top', '#talk': '/talk', '#about': '/about', '#how': '/how-it-works', '#pathway': '/how-it-works',
    '#network': '/locations', '#locations': '/locations', '#map': '/locations', '#brands': '/locations#brands', '#founders': '/locations#founders',
    '#team': '/team', '#podcasts': '/podcasts', '#newswire': '/newswire', '#news': '/newswire', '#resources': '/resources',
    '#privacy': '/legal/privacy', '#terms': '/legal/terms', '#a11y': '/legal/accessibility', '#join': '/how-it-works#join',
    '#ig': 'https://www.instagram.com/', '#li': 'https://www.linkedin.com/',
    # template links that data wiring replaces with real slugs; until then they land on the index
    '#dept': '/team', '#profile': '/team', '#show': '/podcasts', '#episode': '/podcasts', '#speaker': '/podcasts',
    '#brand': '/locations#brands', '#founder': '/locations#founders', '#location': '/locations', '#article': '/newswire',
    '#portal': '/talk', '#qualify': '/talk', '#apply': '/talk', '#contact': '/talk',
}

def sub(pat, rep, s, flags=re.S):
    r, k = re.subn(pat, rep, s, flags=flags)
    assert k >= 1, 'no match: ' + pat[:80]
    return r


def gate(b, marker, cond):
    """Wrap the section that starts at the board comment containing `marker` (up to the next section comment) in sc-if."""
    m = re.search(r'<!-- =+ [^>]*' + re.escape(marker) + r'[^>]*-->', b)
    assert m, 'no section ' + marker
    n = re.search(r'<!-- =+ ', b[m.end():])
    end = m.end() + n.start() if n else len(b)
    return b[:m.end()] + '<sc-if value="{{ ' + cond + ' }}">' + b[m.end():end] + '</sc-if>\n' + b[end:]


def rep(s, old, new):
    assert old in s, 'missing: ' + old[:80]
    return s.replace(old, new)


# ---------- per-page patches (markup runs on board markup before JSX conversion; engine on the logic class) ----------
def legal_markup(b):
    b = rep(b, 'Last updated [date]. One template serves Privacy, Terms and Accessibility.', 'Last updated {{ updated }}.')
    b = rep(b, '<button class="{{ t.cls }}" onClick="{{ t.go }}">{{ t.t }}</button>', '<a class="{{ t.cls }}" href="{{ t.href }}">{{ t.t }}</a>')
    b = rep(b, '<button class="{{ s.cls }}" onClick="{{ s.go }}">{{ s.n }} {{ s.t }}</button>', '<a class="{{ s.cls }}" href="{{ s.href }}">{{ s.n }} {{ s.t }}</a>')
    b = rep(b, '<h2>{{ s.n }} {{ s.t }}</h2><p>[Legal copy for this section, pasted from counsel. Rich text field in the CMS.]</p>',
            '<h2 id="{{ s.id }}">{{ s.n }} {{ s.t }}</h2><x-rich class="lg_sec" html="{{ s.html }}"></x-rich>')
    return b


def legal_engine(e):
    i, j = e.index('  renderVals() {'), e.rindex('}')
    return e[:i] + '''  renderVals() {
    const d = this.props.doc, docs = this.props.docs || [];
    return {
      doc: { t: d.title }, updated: d.updated,
      tabs: docs.map((x) => ({ t: x.title, href: '/legal/' + x.slug, cls: 'chipb' + (x.slug === d.slug ? ' is-on' : '') })),
      toc: d.sections.map((s, i) => ({ n: String(i + 1).padStart(2, '0'), t: s.t, id: 's' + (i + 1), href: '#s' + (i + 1), html: s.html, cls: '' }))
    };
  }
''' + e[j:]


def talk_markup(b):
    b = rep(b, '<div class="form_nav"><span></span><button class="btn btn-fill">Send</button></div>',
            '<div class="form_nav"><span class="form_hint" style="margin: 0">{{ otherNote }}</span><button class="btn btn-fill" onClick="{{ sendOther }}" disabled="{{ otherBusy }}">{{ otherLabel }}</button></div>')
    return qualifier_markup(b)


SEND = """  send(kind, answers, ids, done) {
    const v = {}; ids.forEach((id) => { const el = document.getElementById(id); v[id] = el ? el.value.trim() : ''; });
    const email = v['f-email'] || v['o-e'];
    if (!email || !/.+@.+\\..+/.test(email)) { this.setState({ err: 'Add an email so we can reply.' }); return; }
    this.setState({ busy: true, err: '' });
    fetch('/talk/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind, answers, fields: v, page: location.pathname }) })
      .then((r) => { if (!r.ok) throw new Error(); this.setState({ busy: false }); done(); })
      .catch(() => this.setState({ busy: false, err: 'That did not send. Please try again.' }));
  }
"""


def qualifier_engine(e):
    """The five-question qualifier (Talk, Dept, Home): the contact step posts to the Leads collection."""
    e = sub(r"qNext: \(\) => \{ if \(answered\) set\(\{ q: qs \+ 1 \}\); \},",
            "qNext: () => { if (!answered) return; if (isContact) return this.send('partner', ans, ['f-name', 'f-practice', 'f-email', 'f-phone'], () => set({ q: qs + 1 })); set({ q: qs + 1 }); },", e)
    e = sub(r"nextDisabled: !answered,", "nextDisabled: !answered || !!s.busy,", e)
    e = sub(r"nextLabel: isContact \? 'Submit' : 'Next',", "nextLabel: isContact ? (s.busy ? 'Sending…' : 'Submit') : 'Next', contactHint: s.err || 'A real person replies within [one business day].',", e)
    return e.replace('  renderVals() {', SEND + '  renderVals() {', 1) if 'send(kind' not in e else e


def qualifier_markup(b):
    return b.replace('<p class="form_hint">A real person replies within [one business day].</p>', '<p class="form_hint">{{ contactHint }}</p>')


def talk_engine(e):
    e = qualifier_engine(e)
    e = rep(e, "isOwn: path === 'own', isOther: path === 'other',",
            "isOwn: path === 'own', isOther: path === 'other',\n      sendOther: () => this.send('other', {}, ['o-r', 'o-n', 'o-e', 'o-m'], () => set({ sent: true })), otherBusy: !!s.busy || !!s.sent,\n      otherLabel: s.sent ? 'Sent' : s.busy ? 'Sending…' : 'Send', otherNote: s.sent ? 'Thanks. We will reply by email.' : (s.err || ''),")
    return e


IMG_CSS = """
.ph_img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.tp_i,.tm_img,.o2_img,.face,.ph_cut{position:relative;overflow:hidden}
"""


def ph_img(field, cond_text):
    """Show a CMS image over an initials placeholder: <img> when set, the initials otherwise."""
    return '<sc-if value="{{ ' + field + ' }}"><img class="ph_img" src="{{ ' + field + ' }}" alt="" loading="lazy"></sc-if>' + cond_text


def team_markup(b):
    b = rep(b, '<a href="/team">Department page →</a>', '<a href="{{ d.href }}">Department page →</a>')
    b = rep(b, '<a class="{{ p.cls }}" href="/team"><span class="tp_i">{{ p.i }}<em>Ask about: {{ p.ask }}</em></span>',
            '<a class="{{ p.cls }}" href="{{ p.href }}"><span class="tp_i">' + ph_img('p.img', '{{ p.iOnly }}') + '<sc-if value="{{ p.ask }}"><em>Ask about: {{ p.ask }}</em></sc-if></span>')
    return b


def team_engine(e):
    e = rep(e, "people: T.filter((x) => x[0] === d.k).map((x) => ({ n: x[1], t: x[2], ask: x[3],",
            "href: d.href, people: T.filter((x) => x[0] === d.k).map((x) => ({ n: x[1], t: x[2], ask: x[3], href: x[4], img: x[5], iOnly: x[5] ? '' : x[1].split(' ').map((w) => w[0]).join(''),")
    return e


def dept_markup(b):
    b = rep(b, '<sc-for list="{{ team }}" as="p" hint-placeholder-count="4"><span class="face">{{ p.init }}</span></sc-for>',
            '<sc-for list="{{ team }}" as="p" hint-placeholder-count="4"><span class="face">' + ph_img('p.img', '{{ p.iOnly }}') + '</span></sc-for>')
    b = rep(b, '<div class="tm"><div class="tm_img ph">Portrait</div><b>{{ p.name }}</b><span class="mono">{{ p.role }}</span><span class="tm_ask">Ask about: {{ p.ask }}</span></div>',
            '<a class="tm" href="{{ p.href }}" style="text-decoration: none"><div class="tm_img">' + ph_img('p.img', '{{ p.iOnly }}') + '</div><b>{{ p.name }}</b><span class="mono">{{ p.role }}</span><sc-if value="{{ p.ask }}"><span class="tm_ask">Ask about: {{ p.ask }}</span></sc-if></a>')
    b = rep(b, '<a href="/team">Visit {{ focusName }} →</a>', '<a href="{{ focusHref }}">Visit {{ focusName }} →</a>')
    b = rep(b, '<a class="other" href="/team">', '<a class="other" href="{{ o.href }}">')
    b = rep(b, '<h1 class="dh_t">{{ d.h1a }}<br>{{ d.h1b }}<br>{{ d.h1c }}</h1>', '<h1 class="dh_t">{{ d.h1a }}<sc-if value="{{ d.h1b }}"><br>{{ d.h1b }}<br>{{ d.h1c }}</sc-if></h1>')
    for sec, cond in (('WHAT COMES OFF YOUR PLATE', 'hasPlate'), ('WHAT WE RUN', 'hasScope'), ('FIRST 90 DAYS', 'hasNinety'), ('EVERY BRAND', 'hasGrid'), ('FAQ', 'hasFaq')):
        b = gate(b, sec, cond)
    b = rep(b, '<a class="btn" href="#work">See the work</a>', '<sc-if value="{{ hasGrid }}"><a class="btn" href="#work">See the work</a></sc-if>')
    return qualifier_markup(b)


def dept_engine(e):
    e = qualifier_engine(e)
    e = rep(e, "const sel = D.partners[s.sel == null ? 1 : s.sel]", "const sel = D.partners[s.sel == null ? 1 : s.sel] || ['', '', 'k']")
    e = rep(e, "d: Object.assign({}, d, {", "hasPlate: d.plate.length > 0, hasScope: d.scope.length > 0, hasNinety: d.ninety.length > 0, hasGrid: D.partners.length > 0, hasFaq: D.faq.length > 0,\n      focusHref: '/team/' + focus,\n      d: Object.assign({}, d, {")
    e = rep(e, "team: D.team,", "team: D.team.map((p) => Object.assign({}, p, { iOnly: p.img ? '' : p.init })),")
    e = rep(e, "others: D.depts.filter((x) => x.slug !== d.slug).map((x, i) => ({ k: String(i + 1).padStart(2, '0'), name: x.name, line: x.line })),",
            "others: D.depts.filter((x) => x.slug !== d.slug).map((x, i) => ({ k: String(i + 1).padStart(2, '0'), name: x.name, line: x.line, href: '/team/' + x.slug })),")
    return e


def profile_markup(b):
    b = rep(b, '<a class="mono ph_dept" href="/team">', '<a class="mono ph_dept" href="{{ deptHref }}">')
    b = rep(b, '<div class="ph_cut" style="background: {{ p.tone }}"><span class="ph_init">{{ p.init }}</span></div>',
            '<div class="ph_cut" style="background: {{ p.tone }}">' + ph_img('p.img', '<sc-if value="{{ p.noImg }}"><span class="ph_init">{{ p.init }}</span></sc-if>') + '</div>')
    b = sub(r'<span class="ph ph_note">.*?</span>\s*', '', b)
    b = rep(b, '<sc-if value="{{ p.line }}">', '<sc-if value="{{ p.line }}">') if '{{ p.line }}</p>' not in b else b.replace('<p class="ph_line mono">{{ p.line }}</p>', '<sc-if value="{{ p.line }}"><p class="ph_line mono">{{ p.line }}</p></sc-if>')
    b = rep(b, '<h2 class="lead">{{ p.owns }}</h2>', '<sc-if value="{{ p.owns }}"><h2 class="lead">{{ p.owns }}</h2></sc-if>')
    b = rep(b, '<div class="body cols"><sc-for list="{{ p.bio }}" as="b" hint-placeholder-count="2"><p>{{ b }}</p></sc-for></div>', '<x-rich class="body cols" html="{{ p.bioHtml }}"></x-rich>')
    b = sub(r'(<div class="attrs">.*?</div>\s*<p class="attr_d">\{\{ attrLine \}\}</p>)', r'<sc-if value="{{ hasAttrs }}">\1</sc-if>', b)
    b = gate(b, 'TRACK RECORD', 'hasRecord')
    b = sub(r'(<div>\s*<h3 class="rec_h">At Alpha.*?</div>\s*</div>)', r'<sc-if value="{{ hasWork }}">\1</sc-if>', b)
    b = gate(b, 'WHAT PEOPLE SAY', 'hasQuotes')
    b = gate(b, 'OFF THE CLOCK', 'hasYb')
    b = rep(b, '<button class="o2" onClick="{{ o.go }}"><span class="o2_img">{{ o.init }}</span><b>{{ o.name }}</b><span class="mono">{{ o.title }}</span><span class="mono o2_d">{{ o.dept }}</span></button>',
            '<a class="o2" href="{{ o.href }}" style="text-decoration: none"><span class="o2_img">' + ph_img('o.img', '{{ o.iOnly }}') + '</span><b>{{ o.name }}</b><span class="mono">{{ o.title }}</span><span class="mono o2_d">{{ o.dept }}</span></a>')
    return b


def profile_engine(e):
    e = rep(e, "this.setState({ i: 0, g: 0 });", "this.setState({ g: 0 });")
    e = rep(e, "const N = D.team.length, i = s.i || 0,", "const N = D.team.length, i = s.i == null ? (D.start || 0) : s.i,")
    e = rep(e, "set({ i: j, dx: dir * 60, g: (s.g || 0) + 1, focus: null, qi: 0, attr: null }); };",
            "set({ i: j, dx: dir * 60, g: (s.g || 0) + 1, focus: null, qi: 0, attr: null }); if (typeof history !== 'undefined' && D.team[j].href) history.replaceState(history.state, '', D.team[j].href); };")
    e = rep(e, "const qi = (s.qi || 0) % p.quotes.length, q = p.quotes[qi];", "const qi = p.quotes.length ? (s.qi || 0) % p.quotes.length : 0, q = p.quotes[qi] || { q: '', who: '', role: '' };")
    e = rep(e, "p: Object.assign({}, p, { first: p.first, partnerCount: p.partnerCount }), deptName: dept.name,",
            "p: Object.assign({}, p, { noImg: !p.img }), deptName: dept ? dept.name : '', deptHref: D.deptHref,\n      hasAttrs: p.attrs.length > 0, hasRecord: p.before.length > 0 || p.work.length > 0, hasWork: p.work.length > 0, hasQuotes: p.quotes.length > 0, hasYb: !!p.yb,")
    e = rep(e, "others: D.everyone.filter((o) => o !== p && (flt === 'all' || o.dept === flt)).map((o) => ({ name: o.first + ' ' + o.last, init: o.init, title: o.title, dept: dn(o.dept),",
            "others: D.everyone.filter((o) => o.slug !== p.slug && (flt === 'all' || o.dept === flt)).map((o) => ({ name: o.first + ' ' + o.last, init: o.init, iOnly: o.img ? '' : o.init, img: o.img, href: o.href, title: o.title, dept: dn(o.dept),")
    e = rep(e, "const ai = s.attr == null ? -1 : s.attr;", "const ai = s.attr == null ? -1 : s.attr;\n    if (!dept) return {};")
    return e


def about_markup(b):
    b = rep(b, '<a class="ex" href="/team"><span class="ex_i">{{ e.i }}</span>', '<a class="ex" href="{{ e.href }}"><span class="ex_i">' + ph_img('e.img', '{{ e.iOnly }}') + '</span>')
    return b


def about_engine(e):
    # leadership comes from the Team collection (leaders, CMS order); falls back to the board list
    e = rep(e, "execs: [['John Wheeler'", "execs: (this.props.execs && this.props.execs.length) ? this.props.execs : [['John Wheeler'")
    e = rep(e, ".map((e) => ({ n: e[0], t: e[1], i: e[0].split(' ').map((w) => w[0]).join('') }))",
            ".map((e) => ({ n: e[0], t: e[1], i: e[0].split(' ').map((w) => w[0]).join(''), iOnly: e[0].split(' ').map((w) => w[0]).join(''), href: '/team', img: '' }))")
    return e


def newswire_markup(b):
    b = rep(b, '<a class="feat" href="/newswire"><div class="feat_img ph" style="background: {{ top.tone }}">Release image / partner team photo</div>',
            '<a class="feat" href="{{ top.href }}"><div class="feat_img" style="background: {{ top.tone }}; position: relative; overflow: hidden"><sc-if value="{{ top.img }}"><img class="ph_img" src="{{ top.img }}" alt="" fetchpriority="high"></sc-if></div>')
    b = rep(b, '<a class="nw_r" href="/newswire">', '<a class="nw_r" href="{{ r.href }}">')
    return b


def newswire_engine(e):
    e = rep(e, "top: { date: this.fd(top.date) + ', ' + top.date.slice(0, 4), tag: top.tag, t: top.t, tone: '#8C7350', sum: '[One-line summary pulled from the release.]' },",
            "top: { date: this.fd(top.date) + ', ' + top.date.slice(0, 4), tag: top.tag, t: top.t, tone: '#8C7350', sum: top.sum, href: top.href, img: top.img },")
    e = rep(e, "items: res.filter((r) => r.date.slice(0, 4) === y).map((r) => ({ d: this.fd(r.date), t: r.t, tag: r.tag,", "items: res.filter((r) => r.date.slice(0, 4) === y).map((r) => ({ href: r.href, d: this.fd(r.date), t: r.t, tag: r.tag,")
    return e


def article_markup(b):
    i, j = b.index('<article>'), b.index('</article>') + len('</article>')
    art = '''<article>
<header class="ar_h"><div class="wrap">
<div class="ar_meta"><a class="lnk k" href="/newswire">← Newswire</a><span class="k">Released {{ a.date }}</span><span class="nw_tag">{{ a.tag }}</span><sc-if value="{{ a.ptr }}"><span class="k">{{ a.ptr }}</span></sc-if></div>
<h1 class="ar_t">{{ a.t }}</h1>
<sc-if value="{{ a.img }}"><div class="ar_img" style="position: relative; overflow: hidden"><img class="ph_img" src="{{ a.img }}" alt="" fetchpriority="high"></div></sc-if>
</div></header>
<div class="wrap ar_grid">
<aside class="ar_side"><div class="ar_share"><span class="k" style="margin-bottom: 6px">Share</span><a href="{{ share.li }}" target="_blank" rel="noopener">LinkedIn</a><a href="{{ share.x }}" target="_blank" rel="noopener">X</a><a href="{{ share.fb }}" target="_blank" rel="noopener">Facebook</a><button onClick="{{ copy }}">{{ copyLabel }}</button></div></aside>
<x-rich class="ar_body" html="{{ a.html }}"></x-rich>
<aside class="ar_side"><sc-if value="{{ brand }}"><span class="k">In this release</span><a class="pcard" href="{{ brand.href }}"><span class="pcard_img" style="background: #5A5A55; position: relative; overflow: hidden"><sc-if value="{{ brand.img }}"><img class="ph_img" src="{{ brand.img }}" alt="" loading="lazy"></sc-if></span><span class="pcard_t"><span class="mono">PTR {{ brand.n }} · {{ brand.where }}</span><b>{{ brand.name }}</b><span class="mono">View brand →</span></span></a><a class="lnk k" href="/locations">See it on the map →</a></sc-if></aside>
</div>
<section style="padding-bottom: clamp(90px, 10vw, 150px)"><div class="wrap"><h2 class="h3" style="margin-bottom: 18px">More releases</h2><div class="rel"><sc-for list="{{ more }}" as="m"><a href="{{ m.href }}"><span class="mono">{{ m.d }}</span><b>{{ m.t }}</b><span class="mono">→</span></a></sc-for></div></div></section>
</article>'''
    return b[:i] + art + b[j:]


def article_engine(e):
    return rep(e, "return { copy:", "const D = this.props.data;\n    return { a: D.a, brand: D.brand, more: D.more, share: D.share, copy:")


def locations_markup(b):
    b = rep(b, '<a class="lc_img ph" href="/locations" style="background: {{ c.tone }}"><sc-if value="{{ c.photo }}" hint-placeholder-val="{{ true }}">{{ c.city }}</sc-if>',
            '<a class="lc_img ph" href="{{ c.href }}" style="background: {{ c.tone }}; position: relative; overflow: hidden"><sc-if value="{{ c.img }}"><img class="ph_img" src="{{ c.img }}" alt="" loading="lazy"></sc-if><sc-if value="{{ c.noPhoto }}">{{ c.city }}</sc-if>')
    b = rep(b, '<a class="lc_b mono" href="/locations">{{ c.brand }}</a><a class="lc_go mono" href="/locations"', '<a class="lc_b mono" href="{{ c.brandHref }}">{{ c.brand }}</a><a class="lc_go mono" href="{{ c.href }}"')
    b = rep(b, '<div class="pan_img ph" style="background: {{ sel.tone }}">{{ sel.city }} photo</div>', '<div class="pan_img ph" style="background: {{ sel.tone }}; position: relative; overflow: hidden"><sc-if value="{{ sel.img }}"><img class="ph_img" src="{{ sel.img }}" alt=""></sc-if></div>')
    b = rep(b, '<div><dt class="mono">Google</dt><dd>{{ sel.rating }}</dd></div>', '<sc-if value="{{ sel.rating }}"><div><dt class="mono">Google</dt><dd>{{ sel.rating }}</dd></div></sc-if>')
    b = rep(b, '<div class="pan_ctas"><a class="btn" href="/locations">Location page</a><a class="btn" href="/locations#brands">Brand</a></div>',
            '<div class="pan_ctas"><a class="btn" href="{{ sel.href }}">Location page</a><a class="btn" href="{{ sel.brandHref }}">Brand</a></div>')
    b = rep(b, '<a class="{{ f.cls }}" href="/locations#founders">', '<a class="{{ f.cls }}" href="{{ f.href }}">')
    b = rep(b, '<a class="{{ b.cls }}" href="/locations#brands"', '<a class="{{ b.cls }}" href="{{ b.href }}"')
    b = sub(r'<span class="map_note ph">.*?</span>\s*', '', b)
    b = rep(b, '<select onChange="{{ onBrand }}" aria-label="Brand">', '<select onChange="{{ onBrand }}" value="{{ brandVal }}" aria-label="Brand">')
    b = rep(b, '<option value="{{ o.v }}" selected="{{ o.sel }}">', '<option value="{{ o.v }}">')
    return b


def locations_engine(e):
    # the US view is sized to the canvas: tick() can run before the first draw (canvas width unknown -> desktop zoom),
    # so whenever the canvas width changes and nothing is selected, re-fit the whole map (phones were stuck zoomed in)
    e = rep(e, "    this.cw = Wc; this.ch = Hc;\n", "    this.cw = Wc; this.ch = Hc;\n    if (this._fitW !== Wc) { this._fitW = Wc; if (this.cam && !this.selLoc && !this.F) { this.cam.x = 600; this.cam.y = 340; this.cam.z = this.zu(); } }\n")
    # real streets fade in under the canvas as it zooms to a location (FocusMap); the canvas keeps the US dot field and pins
    e = rep(e, "ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#151513'; ctx.fillRect(0, 0, Wc, Hc);", "ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, Wc, Hc);")
    e = rep(e, "    this._k = k;\n", "    this._k = k;\n    const real = !!this.rmap && this.rmap.dataset.ready === '1';\n    if (this.rmap) this.rmap.style.opacity = String(cityA);\n    ctx.fillStyle = 'rgba(21,21,19,' + (real ? 1 - cityA : 1).toFixed(3) + ')'; ctx.fillRect(0, 0, Wc, Hc);\n")
    e = rep(e, "    if (cityA > .01) {\n      ctx.globalAlpha = cityA; ctx.lineCap = 'butt';", "    if (cityA > .01 && !real) {\n      ctx.globalAlpha = cityA; ctx.lineCap = 'butt';")
    e = rep(e, "hasSel: !!sel,", "setRealMap: (el) => { this.rmap = el; }, realFocus: this.selLoc || (this.F && this.F.toLoc) || null, hasSel: !!sel,")
    e = rep(e, "const card = (l) => ({ cls:", "const card = (l) => ({ href: l.href, brandHref: l.brandHref, img: l.img, noPhoto: !l.noMedia && !l.img, cls:")
    e = rep(e, "rating: sel.rating.toFixed(1) + ' (' + sel.reviews.toLocaleString('en-US') + ')',", "rating: sel.rating ? sel.rating.toFixed(1) + ' (' + sel.reviews.toLocaleString('en-US') + ')' : '', href: sel.href, brandHref: sel.brandHref, img: sel.img,")
    e = rep(e, "{ k: 'Providers', v: hasF ? '[n]' : '145' }", "{ k: 'Providers', v: hasF ? '–' : '145' }")
    e = rep(e, "{ k: 'Annual practice visits', v: '[n]' }, ", "")
    e = rep(e, "l: '[Label: per year?]',", "l: '[Label]',")
    e = rep(e, "founders: D.F.map((f) => ({ name: f[0],", "founders: D.F.map((f) => ({ href: f[4], name: f[0],")
    e = rep(e, "onBrand: (e) => set({ brand: e.target.value }),", "onBrand: (e) => set({ brand: e.target.value }), brandVal: fb || '',")
    e = rep(e, "return { n, name: D.B[n].name, tone: D.B[n].tone,", "return { n, href: D.B[n].href, name: D.B[n].name, tone: D.B[n].tone,")
    return e


def founder_markup(b):
    b = rep(b, '<a href="/locations#brands" style="text-decoration: none">{{ b.name }}</a>', '<a href="{{ b.href }}" style="text-decoration: none">{{ b.name }}</a>')
    b = rep(b, '<span class="bmark b-016" aria-hidden="true"></span>', '<span class="bmark b-{{ b.n }}" aria-hidden="true"></span>')
    b = rep(b, '<p class="fmeta">Founder, {{ b.name }}<br>{{ f.markets }} · Practicing since {{ f.since }}</p>', '<p class="fmeta">{{ f.role }}, {{ b.name }}<br>{{ f.markets }}</p>')
    b = rep(b, '<a class="btn" href="{{ b.book }}" target="_blank" rel="noopener">', '<sc-if value="{{ b.book }}"><a class="btn" href="{{ b.book }}" target="_blank" rel="noopener">')
    b = rep(b, '<span class="ext" aria-hidden="true">↗</span></a>', '<span class="ext" aria-hidden="true">↗</span></a></sc-if>')
    b = rep(b, '<p class="eyebrow">01 / Who she is</p>', '<p class="eyebrow">01 / Who {{ f.first }} is</p>')
    b = sub(r'<h2 class="lead">She was trained for four days\. Her injectors train for months\.</h2>\s*<div class="body cols">.*?</div>',
            '<sc-if value="{{ f.headline }}"><h2 class="lead">{{ f.headline }}</h2></sc-if><x-rich class="body cols" html="{{ f.bioHtml }}"></x-rich>', b)
    b = sub(r'(<div class="figs">.*?</sc-for>\s*</div>)', r'<sc-if value="{{ hasFigs }}">\1</sc-if>', b)
    b = rep(b, '<h2 class="h3">From the ICU to PTR 016.</h2>', '<h2 class="h3">The road to {{ b.ptr }}.</h2>')
    b = gate(b, 'THE PATH', 'hasPath')
    b = rep(b, '<p class="eyebrow">03 / How she practices</p>', '<p class="eyebrow">03 / How {{ f.first }} practices</p>')
    b = gate(b, 'HOW SHE PRACTICES', 'hasRules')
    b = gate(b, 'ON THE RECORD', 'hasRecord')
    b = rep(b, '05 / Why she partnered', '04 / In {{ f.first }}&#39;s words')
    b = sub(r'<div class="film why_film">.*?</button></div>\s*', '', b)
    b = rep(b, '<figure class="why_q"><blockquote>“I felt like they had a firm direction. They had very high standards, and it matched ours.”</blockquote><figcaption class="mono">{{ f.name }} / Interview / 00:13:16</figcaption></figure>',
            '<sc-for list="{{ quotes }}" as="q"><figure class="why_q"><blockquote>“{{ q.text }}”</blockquote><figcaption class="mono">{{ f.name }} / {{ q.source }}</figcaption></figure></sc-for>')
    b, n = cut(b, r'<div class="ba">', 'div')
    assert n == 1
    b = gate(b, 'WHY SHE PARTNERED', 'hasQuotes')
    b = rep(b, "06 / The room she's in", '05 / The room {{ f.first }} is in')
    b = rep(b, 'These are the people Michelle calls.', 'These are the people {{ f.first }} calls.')
    b = rep(b, '<a class="peer" href="/locations#founders">', '<a class="peer" href="{{ p.href }}">')
    b = rep(b, '07 / Her practice', '06 / {{ f.first }}&#39;s practice')
    b = rep(b, '<a class="prac_brand" href="/locations#brands">', '<a class="prac_brand" href="{{ b.href }}">')
    b = rep(b, '<span class="mono" style="font-size: 10.5px; opacity: .75">{{ f.markets }} · Est {{ b.est }}</span>', '<span class="mono" style="font-size: 10.5px; opacity: .75">{{ f.markets }}<sc-if value="{{ b.est }}"> · Est {{ b.est }}</sc-if></span>')
    b = rep(b, '<a class="prac_loc" href="/locations">', '<a class="prac_loc" href="{{ l.href }}">')
    b = rep(b, '<sc-if value="{{ l.noImg }}" hint-placeholder-val="{{ true }}">{{ l.city }} photo</sc-if>', '<sc-if value="{{ l.noImg }}" hint-placeholder-val="{{ true }}">{{ l.city }}</sc-if>')
    return b


def founder_engine(e):
    i, j = e.index('  renderVals() {'), e.rindex('}')
    return e[:i] + '''  renderVals() {
    const { b, f, path, rules, quotes, peers } = this.data(), on = !!(this.state || {}).pathOn || this.rm;
    return {
      b, f, quotes,
      heroH: this.tall ? '820px' : 'calc(100svh - 126px)',
      figs: [], hasFigs: false, hasRecord: false, record: [],
      hasPath: path.length > 1, hasRules: rules.length > 0, hasQuotes: quotes.length > 0,
      setPath: (el) => {
        if (!el || this.io || typeof IntersectionObserver === 'undefined') return;
        this.io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { this.setState({ pathOn: true }); this.io.disconnect(); } }, { threshold: .25 });
        this.io.observe(el);
      },
      tlCls: 'tl' + (on ? ' is-on' : ''),
      path: path.map((p, i) => ({ y: p.y, t: p.t, d: p.d, cls: 'step' + (p.alpha ? ' alpha' : (i === path.length - 2 ? ' now' : '')), delay: 200 + i * 140 })),
      rules: rules.map((r, i) => ({ n: String(i + 1).padStart(2, '0'), t: r.t, d: r.d })),
      peers: peers.map((p) => Object.assign({}, p, { hasImg: !!p.img, noImg: !p.img, init: p.name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('').slice(0, 2) }))
    };
  }
''' + e[j:]


HERO_VIDEO = ('<video class="hero_vid" ref="{{ vidRef }}" poster="{{ loc.heroPoster }}" autoplay muted loop playsinline preload="auto" aria-hidden="true">'
              '<sc-if value="{{ loc.heroAv1 }}"><source src="{{ loc.heroAv1 }}" type="video/mp4; codecs=av01.0.08M.08"></sc-if>'
              '<sc-if value="{{ loc.heroSmall }}"><source src="{{ loc.heroSmall }}" type="video/mp4" media="(max-width: 820px)"></sc-if>'
              '<source src="{{ loc.heroVideo }}" type="video/mp4"></video>')


JOINED = """<!-- ============ JOINED: tuck-in chapter (tuck-ins.chapter). Shows once the tuck-in has a headline. ============ -->
<section class="sec" style="padding-bottom: clamp(60px, 7vw, 110px)">
<div class="wrap">
<hr class="rule" style="margin-bottom: clamp(36px, 4vw, 60px)">
<div class="split" style="align-items: end">
<div><p class="eyebrow">{{ jn.eyebrow }}</p><h2 class="h3" style="max-width: 16ch; margin: 0">{{ jn.h }}</h2></div>
<div><sc-if value="{{ jn.intro }}"><p class="body" style="margin: 0">{{ jn.intro }}</p></sc-if></div>
</div>
<sc-if value="{{ jn.hasPair }}"><div class="tk_pair">
<figure class="tk_f">
<div class="tk_who"><span class="tk_av"><sc-if value="{{ jn.a.img }}"><img src="{{ jn.a.img }}" alt="{{ jn.a.name }}" loading="lazy"></sc-if><sc-if value="{{ jn.a.noImg }}">{{ jn.a.init }}</sc-if></span><div><span class="tk_n">{{ jn.a.name }}</span><span class="tk_o">{{ jn.a.line }}</span></div></div>
<sc-if value="{{ jn.a.q }}"><blockquote>&ldquo;{{ jn.a.q }}&rdquo;</blockquote><figcaption>{{ jn.a.s }}</figcaption></sc-if>
</figure>
<div class="tk_join" aria-hidden="true"><b>+</b><sc-if value="{{ jn.yr }}"><span>{{ jn.yr }}</span></sc-if></div>
<figure class="tk_f">
<div class="tk_who"><span class="tk_av"><sc-if value="{{ jn.b.img }}"><img src="{{ jn.b.img }}" alt="{{ jn.b.name }}" loading="lazy"></sc-if><sc-if value="{{ jn.b.noImg }}">{{ jn.b.init }}</sc-if></span><div><span class="tk_n">{{ jn.b.name }}</span><span class="tk_o">{{ jn.b.line }}</span></div></div>
<sc-if value="{{ jn.b.q }}"><blockquote>&ldquo;{{ jn.b.q }}&rdquo;</blockquote><figcaption>{{ jn.b.s }}</figcaption></sc-if>
</figure>
</div></sc-if>
<sc-if value="{{ jn.hasKept }}"><dl class="tk_kept"><sc-for list="{{ jn.kept }}" as="k"><div><dt>{{ k.k }}</dt><dd><b>{{ k.t }}</b>{{ k.line }}<sc-if value="{{ k.q }}"><q>&ldquo;{{ k.q }}&rdquo;</q><small>{{ k.s }}</small></sc-if></dd></div></sc-for></dl></sc-if>
<sc-if value="{{ jn.hasFilms }}"><div class="tk_films">
<div class="tk_films_h"><p class="eyebrow">{{ jn.filmsH }}</p></div>
<div class="tk_fr"><sc-for list="{{ jn.films }}" as="f"><figure class="tk_v"><div class="tk_vf"><video src="{{ f.src }}" poster="{{ f.poster }}" controls preload="none" playsinline></video></div><figcaption><b>{{ f.t }}</b>{{ f.line }}<sc-if value="{{ f.q }}"><q>&ldquo;{{ f.q }}&rdquo;</q></sc-if></figcaption></figure></sc-for></div>
</div></sc-if>
</div>
</section>
"""

JOINED_CSS = """.formerly{display:inline-flex;align-items:center;height:28px;padding:0 13px;border:1px dashed rgba(232,228,218,.55);border-radius:999px;font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;margin-left:8px}
.tk_pair{display:grid;grid-template-columns:minmax(0,1fr) 112px minmax(0,1fr);align-items:stretch;margin-top:clamp(28px,3vw,44px)}
.tk_f{margin:0;display:flex;flex-direction:column;gap:20px;min-width:0}
.tk_who{display:grid;grid-template-columns:64px minmax(0,1fr);gap:16px;align-items:center}
.tk_av{width:64px;height:64px;border-radius:50%;overflow:hidden;background:#C9C3B8;display:grid;place-items:center;font-family:var(--disp);font-weight:900;font-size:18px;color:rgba(14,14,13,.4)}
.tk_av img{width:100%;height:100%;object-fit:cover}
.tk_n{display:block;font-family:var(--h3);font-weight:700;font-size:18px;line-height:1.2}
.tk_o{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-top:4px}
.tk_f blockquote{margin:0;font-family:var(--h3);font-weight:700;font-size:clamp(20px,1.8vw,26px);line-height:1.22;letter-spacing:-.01em}
.tk_f figcaption{font-family:var(--mono);font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-top:auto}
.tk_join{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
.tk_join::before{content:"";position:absolute;top:0;bottom:0;left:50%;width:1px;background:var(--line)}
.tk_join b{position:relative;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--bone);font-family:var(--disp);font-weight:900;font-size:20px}
.tk_join span{position:relative;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;background:var(--bone);padding:4px 6px}
.tk_kept{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,2vw,28px);margin:clamp(40px,4vw,64px) 0 0}
.tk_kept div{border-top:1px solid var(--ink);padding-top:14px}
.tk_kept dt{font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.tk_kept dd{margin:10px 0 0;font-size:14.5px;line-height:1.5;color:#2E2C28}
.tk_kept dd b{display:block;font-family:var(--h3);font-size:19px;color:var(--ink);margin-bottom:4px}
.tk_kept dd q{display:block;quotes:none;font-family:var(--h3);font-weight:700;font-size:15px;color:var(--ink);margin-top:10px}
.tk_kept dd small{display:block;font-family:var(--mono);font-size:9.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-top:4px}
.tk_films{margin-top:clamp(48px,5vw,80px);border-top:1px solid var(--line);padding-top:clamp(28px,3vw,40px)}
.tk_films_h{display:flex;justify-content:space-between;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:22px}
.tk_films_h .eyebrow{margin:0}
.tk_fr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.4vw,20px)}
.tk_v{margin:0}
.tk_vf{position:relative;aspect-ratio:9/16;border-radius:16px;overflow:hidden;background:linear-gradient(170deg,#3A342C,#1B1916 70%)}
.tk_vf video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tk_v figcaption{margin-top:12px;font-size:13.5px;line-height:1.45;color:var(--muted)}
.tk_v figcaption b{display:block;font-family:var(--h3);font-size:16px;color:var(--ink);margin-bottom:2px}
.tk_v figcaption q{display:block;quotes:none;font-family:var(--h3);font-weight:700;color:var(--ink);margin-top:8px}
@media (max-width:820px){.tk_pair{grid-template-columns:1fr}.tk_join{flex-direction:row;padding:22px 0}.tk_join::before{top:50%;bottom:auto;left:0;right:0;width:auto;height:1px}.tk_kept{grid-template-columns:1fr}.tk_fr{grid-template-columns:repeat(3,72vw);overflow-x:auto;scroll-snap-type:x mandatory}.tk_v{scroll-snap-align:start}}
"""


def location_markup(b):
    b = rep(b, '<a href="/locations#brands" style="text-decoration: none">{{ b.name }}</a>', '<a href="{{ b.href }}" style="text-decoration: none">{{ b.name }}</a>')
    b = rep(b, '<video class="hero_vid" ref="{{ vidRef }}" src="{{ loc.heroVideo }}" poster="{{ loc.heroPoster }}" autoplay muted loop playsinline aria-hidden="true"></video>', HERO_VIDEO)
    book = '<a class="btn" href="{{ b.book }}" target="_blank" rel="noopener">Book at {{ b.short }}<span class="ext" aria-hidden="true">↗</span></a>'
    assert book in b
    b = b.replace(book, '<sc-if value="{{ b.book }}">' + book + '</sc-if>')
    b = rep(b, '<sc-if value="{{ loc.noImg }}" hint-placeholder-val="{{ true }}">{{ loc.city }}<br>photo</sc-if>', '<sc-if value="{{ loc.noImg }}" hint-placeholder-val="{{ true }}">{{ loc.city }}</sc-if>')
    b = sub(r'<span class="ph map_hph">.*?</span>\s*', '', b)
    b = sub(r'<span class="map_note ph">.*?</span>\s*', '', b)
    b = rep(b, '<div class="v_col"><p class="eyebrow">Hours</p>', '<sc-if value="{{ visit.hasHours }}"><div class="v_col"><p class="eyebrow">Hours</p>')
    b = rep(b, '<div><span>{{ h.d }}</span><b>{{ h.t }}</b></div></sc-for></div></div>', '<div><span>{{ h.d }}</span><b>{{ h.t }}</b></div></sc-for></div></div></sc-if>')
    b = rep(b, '<div class="v_col"><p class="eyebrow">Phone</p><p class="v_t"><a href="{{ visit.tel }}">{{ visit.phone }}</a></p></div>', '<sc-if value="{{ visit.phone }}"><div class="v_col"><p class="eyebrow">Phone</p><p class="v_t"><a href="{{ visit.tel }}">{{ visit.phone }}</a></p></div></sc-if>')
    b = rep(b, '<div class="v_col"><p class="eyebrow">Arriving</p><p class="v_t">{{ visit.arrive }}</p></div>', '<sc-if value="{{ visit.arrive }}"><div class="v_col"><p class="eyebrow">Arriving</p><p class="v_t">{{ visit.arrive }}</p></div></sc-if>')
    b = rep(b, '<p class="sub">{{ loc.facts }}</p>', '<sc-if value="{{ loc.facts }}"><p class="sub">{{ loc.facts }}</p></sc-if>')
    b = rep(b, '<div class="body inside_story"><span class="draft">Draft copy</span><sc-for list="{{ story }}" as="p" hint-placeholder-count="2"><p>{{ p.t }}</p></sc-for></div>', '<x-rich class="body inside_story" html="{{ storyHtml }}"></x-rich>')
    b = rep(b, '<x-rich class="body inside_story" html="{{ storyHtml }}"></x-rich>', '<sc-if value="{{ hasStory }}"><x-rich class="body inside_story" html="{{ storyHtml }}"></x-rich></sc-if>')
    # gallery (locations.gallery): real photos, first two large, the rest in threes
    for k in ('gal2', 'gal3'):
        b = rep(b, '<sc-for list="{{ ' + k + ' }}" as="g" hint-placeholder-count="' + ('2' if k == 'gal2' else '3') + '"><figure><div class="img ph">{{ g.ph }}</div><figcaption class="cap"><b>{{ g.k }}</b>{{ g.t }}</figcaption></figure></sc-for>',
                '<sc-for list="{{ ' + k + ' }}" as="g"><figure><div class="img"><img class="ph_img" src="{{ g.src }}" alt="{{ g.alt }}" loading="lazy" decoding="async"></div><figcaption class="cap"><b>{{ g.k }}</b>{{ g.t }}</figcaption></figure></sc-for>')
    b = gate(b, 'INSIDE', 'hasInside')
    # location name (Refined at Blossom) and the tuck-in chapter
    pill = '<span class="pill">{{ b.ptr }} location</span>'
    assert b.count(pill) == 2
    b = b.replace(pill, pill + '<sc-if value="{{ former }}"><span class="formerly">Formerly {{ former }}</span></sc-if>')
    b = rep(b, '<h2 class="h3">Inside {{ b.name }} {{ loc.city }}</h2>', '<h2 class="h3">Inside {{ loc.insideT }}</h2>')
    b = rep(b, 'From patients of {{ b.short }} {{ loc.city }}, on Google.', 'From patients of {{ loc.label }}, on Google.')
    b = rep(b, 'Also {{ b.short }} {{ sib.city }}</h2>', 'Also {{ sib.label }}</h2>')
    ins = re.search(r'<!-- =+ INSIDE =+ -->', b)
    b = b[:ins.start()] + JOINED + b[ins.start():]
    b = gate(b, 'JOINED', 'hasJoined')
    b = rep(b, '<span class="card_txt"><b>{{ b.name }}</b>', '<span class="card_txt"><b>{{ loc.cardT }}</b>')
    b = rep(b, '<p class="sub">{{ provLine }}</p>', '<sc-if value="{{ provLine }}"><p class="sub">{{ provLine }}</p></sc-if>')
    b = gate(b, 'IN THEIR WORDS', 'hasReviews')
    # live Google reviews (src/lib/reviews.ts): aggregate, up to 6 cards, author linked to their Google profile
    b = sub(r'<div class="rv_agg">.*?</div>\n<div class="rv">.*?</div>\n<span class="rv_note">.*?</span>',
            '<div class="rv_agg"><span class="rv_n">{{ rv.rating }}</span><span class="rv_st" role="img" aria-label="{{ rv.rating }} out of 5 stars"><i style="width: {{ rv.pct }}%"></i></span><span class="rv_c">{{ rv.count }} Google reviews</span><a class="rv_all" href="{{ rv.uri }}" target="_blank" rel="noopener">Read all on Google<span class="ext" aria-hidden="true">↗</span></a></div>\n</div>\n'
            '<div class="rv"><sc-for list="{{ rv.items }}" as="r"><figure class="{{ r.cls }}"><sc-if value="{{ r.tag }}"><span class="rv_tag">{{ r.tag }}</span></sc-if><blockquote>{{ r.t }}</blockquote>'
            '<sc-if value="{{ r.long }}"><label class="rv_more"><input type="checkbox" class="rv_x"><span class="rv_m">Read more</span><span class="rv_l">Show less</span></label></sc-if>'
            '<figcaption class="rv_f"><span><a class="rv_who" href="{{ r.whoUri }}" target="_blank" rel="noopener nofollow"><b>{{ r.who }}</b></a> / {{ r.when }}</span><span>via Google</span></figcaption></figure></sc-for></div>', b)
    b = rep(b, '<p class="sub">Partner since {{ b.since }}</p><span class="draft">Draft copy</span>', '<p class="sub">Partner since {{ b.since }}</p>')
    b = gate(b, 'SINCE ALPHA', 'hasSince')
    b = gate(b, 'STATS', 'hasStats')
    b = gate(b, 'OPEN ROLES', 'hasRoles')
    b = rep(b, '<a href="#sibling" style="display: block; text-decoration: none"><div class="img ph" style="background: {{ sib.tone }}; color: rgba(232,228,218,.6)">{{ sib.city }} interior</div></a>',
            '<a href="{{ sib.href }}" style="display: block; text-decoration: none"><div class="img ph" style="background: {{ sib.tone }}; color: rgba(232,228,218,.6); position: relative; overflow: hidden"><sc-if value="{{ sib.img }}"><img class="ph_img" src="{{ sib.img }}" alt="" loading="lazy"></sc-if></div></a>')
    b = rep(b, '<a href="#sibling">View {{ b.short }} {{ sib.city }} →</a>', '<a href="{{ sib.href }}">View {{ sib.label }} →</a>')
    return b


def location_engine(e):
    e = sub(r'\n  brand\(\) \{.*?\n  \}\n', '\n  brand() { return this.props.data.b; }\n', e)
    e = rep(e, '  li() { return this.props.denver ? 1 : 0; }', '  li() { return this.props.data.li; }')
    e = rep(e, "sb = B.locations[1 - li];", "sb = B.locations[(li + 1) % B.locations.length];")
    e = rep(e, "galOn: !loc.noGallery,", "galOn: (loc.gal || []).length > 0, hasInside: !!loc.storyHtml || (loc.gal || []).length > 0, hasStory: !!loc.storyHtml, storyHtml: loc.storyHtml, hasReviews: !!(loc.rv && loc.rv.items.length >= 3), rv: loc.rv || { items: [] }, hasStats: false, hasRoles: false, hasSince: (loc.ms || []).length > 0 || !!(loc.quote && loc.quote.t),")
    e = rep(e, "sib: Object.assign({}, sb, { place: sb.city + ', ' + sb.st }),", "sib: Object.assign({}, sb, { place: sb.city + ', ' + sb.st }),")
    e = sub(r"visit: \{ hours: .*?arrive: loc\.arrive \|\| '\[Parking and entrance note\.\]' \},",
            "visit: { hours: (loc.hours || []).map((h) => ({ d: h[0], t: h[1] })), hasHours: (loc.hours || []).length > 0, phone: loc.phone || '', tel: 'tel:' + String(loc.phone || '').replace(/[^0-9+]/g, ''), arrive: loc.arrive || '' },", e)
    e = rep(e, "ms: (loc.ms || [['[Year]', '[Milestone at this address.]']]).map((m) => ({ y: m[0], t: m[1] })),", "ms: (loc.ms || []).map((m) => ({ y: m[0], t: m[1] })),")
    e = rep(e, "const n = m.reduce((a, x) => a + x[1], 0) || loc.providers; return n + ' providers'", "const n = m.reduce((a, x) => a + x[1], 0) || loc.providers; if (!n) return ''; return n + ' providers'")
    e = sub(r"leads: \[.*?\]\.map\(\(p\) => \(\{ \.\.\.p,", "leads: B.leads(loc).map((p) => ({ ...p,", e) if False else e
    e = sub(r"leads: \[\s*\{ name: B\.founder.*?\n      \]\.map",
            "leads: [B.founder ? { name: B.founder, role: 'Founder', cred: B.cred, img: B.founderImg || '', href: B.founderHref } : null, loc.lead && loc.lead.name ? Object.assign({ role: 'Lead provider, ' + loc.city }, loc.lead) : null].filter(Boolean).map", e)
    GK = "{ arrival: 'Arrival', 'front-desk': 'Front desk', 'treatment-room': 'Treatment room', consult: 'Consult', retail: 'Retail', detail: 'Detail' }"
    gal = "(loc.gal || []).map((g) => ({ src: g.src, alt: g.alt || '', k: " + GK + "[g.kind] || '', t: g.caption || '' }))"
    e = rep(e, "gal2: [{ k: 'Arrival', t: '[Caption about the arrival]', ph: 'Place image / exterior or entry' }, { k: 'Front desk', t: '[Caption]', ph: 'Place image / reception' }],", "gal2: " + gal + ".slice(0, 2),")
    e = rep(e, "gal3: [{ k: 'Treatment room', t: '[Caption]', ph: 'Place image' }, { k: 'Consult', t: '[Caption]', ph: 'Place image' }, { k: 'Retail', t: '[Caption]', ph: 'Place image' }],", "gal3: " + gal + ".slice(2),")
    e = rep(e, "mapAria: mapHero ? B.short + ' / ' + loc.place : 'Location',", "mapAria: mapHero ? (loc.name || B.short + ' / ' + loc.place) : 'Location',")
    e = rep(e, "b: B, loc, title: B.short + ' / ' + loc.place,", "b: B, loc: Object.assign(loc, { insideT: loc.name || B.name + ' ' + loc.city, cardT: loc.name || B.name }), title: loc.name || B.short + ' / ' + loc.place, former: this.props.data.former || '', hasJoined: !!this.props.data.joined, jn: this.joinedVals(),")
    e = rep(e, '  renderVals() {', '''  joinedVals() {
    const J = this.props.data.joined;
    if (!J) return { pair: [], kept: [], films: [], a: {}, b: {} };
    const who = (p) => Object.assign({}, p || {}, { noImg: !(p && p.img) });
    return Object.assign({}, J, { hasPair: J.pair.length === 2, a: who(J.pair[0]), b: who(J.pair[1]), hasKept: J.kept.length > 0, hasFilms: J.films.length > 0,
      filmsH: J.films.length === 1 ? 'The story on film' : 'The story in ' + ['', 'one', 'two', 'three'][J.films.length] + ' films' });
  }
  renderVals() {''')
    e = rep(e, 'this.tick(now, dt); this.draw(now);', 'this.tick(now, dt); // the real map (MapStage) renders the scene; draw() stays as the fallback reference')
    return e


MAP_CSS = ('.map_gl{position:absolute;inset:0}\n.map_gl .maplibregl-ctrl-attrib{background:rgba(14,14,13,.5);color:rgba(232,228,218,.5)}\n'
           '.map_gl .maplibregl-ctrl-attrib a{color:rgba(232,228,218,.6)}\n.map_gl .maplibregl-ctrl-attrib-button{filter:invert(1);opacity:.5}\n')
MAP_IMPORT = "import { MapStage } from '@/components/site/MapStage'\n"


def locations_jsx(j):
    i = j.index('<canvas className="map_cv"')
    return j[:i] + '<FocusMap loc={v.realFocus} setRef={v.setRealMap} />' + j[i:]


def location_jsx(j):
    cv = '<canvas className="map_cv" ref={v.setCanvas} aria-hidden="true"></canvas>'
    assert j.count(cv) == 1
    return j.replace(cv, '<MapStage locs={[props.data.b.locations[props.data.li]]} idx={0} />' + cv)


REEL_CSS = """
.reel_v{width:100%;height:min(56.25vw,92svh);background:#0E0E0D}
.reel_video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.reel_v .reel_unmute{z-index:2;opacity:.85;transition:opacity .3s}
.reel_v .reel_unmute:hover{opacity:1}
@media (max-width:720px){.reel_v{height:min(177.78vw,88svh)}}
"""


def main_markup(b):
    b, n = cut(b, r'<header class="wrap">', 'header', '<x-nav></x-nav>'); assert n == 1
    i = b.find('<!-- ============ PLAYER'); assert i > 0
    b = b[:i]  # board audio player: episodes play in the site player
    # theater: the real brand film (renditions from the CMS); no simulated timeline or captions
    b = sub(r'<div class="th_cap" style="opacity: \{\{ th.capOp \}\}">\{\{ th.cap \}\}</div>\s*', '', b)
    b = sub(r'<div class="th_ctrl">.*?<span class="th_time">.*?</span>\s*</div>\s*', '', b)
    b = rep(b, '<div class="th_screen">', '<div class="th_screen"><sc-if value="{{ th.src }}"><video class="th_vid" src="{{ th.src }}" poster="{{ th.poster }}" ref="{{ thVid }}" autoplay controls playsinline></video></sc-if>')
    b = rep(b, '<span>{{ th.founder }} · {{ th.role }}</span>', '<sc-if value="{{ th.founder }}"><span>{{ th.founder }} · {{ th.role }}</span></sc-if>')
    b = rep(b, '<span>Film {{ th.idx }} of 15</span>', '<span>Film {{ th.idx }} of {{ th.total }}</span>')
    b = rep(b, '<a class="btn btn-light" href="#partner" style="color: #F3F0E9">Open partner page</a>', '<a class="btn btn-light" href="{{ cur.href }}" onClick="{{ thClose }}" style="color: #F3F0E9">Open partner page</a>')
    # hero numbers from the CMS
    for k, lab in (('15', 'Brands'), ('36', 'Locations'), ('12', 'States')):
        b = rep(b, '<div class="stat_num">' + k + '<svg', '<div class="stat_num">{{ net.' + lab.lower() + ' }}<svg')
    b = rep(b, '<a class="ulink" href="#how">How partnership works</a>', '<a class="ulink" href="/how-it-works">How partnership works</a>')
    # reel: brand hero posters in join order until the network reel is cut
    b = sub(r'<div class="reel_spec ph">.*?</div>', '<sc-for list="{{ reel }}" as="r"><img class="{{ r.cls }}" src="{{ r.src }}" alt="" loading="lazy"></sc-for>', b)
    b = sub(r'<button class="btn btn-light reel_unmute".*?</button>', '', b)
    # reel is now the Alpha 2025 film: desktop and mobile cuts, muted loop, Sound on (src/components/site/HomeReel.tsx)
    b = sub(r'<section class="reel" aria-label="Network reel">.*?</section>', '<x-homereel desktop="{{ reelVid.d }}" mobile="{{ reelVid.m }}"></x-homereel>', b)
    # partners: rows and frame link to the brand page
    b = rep(b, '<button class="{{ p.cls }}" onMouseEnter="{{ p.hover }}" onFocus="{{ p.focus }}" onClick="{{ p.open }}" role="listitem"><span>{{ p.n }}</span><span class="nm">{{ p.name }}</span><span class="ct">{{ p.city }}</span><span class="yr">{{ p.yr }}</span></button>',
            '<a class="{{ p.cls }}" href="{{ p.href }}" onMouseEnter="{{ p.hover }}" onFocus="{{ p.focus }}" role="listitem" style="text-decoration: none"><span>{{ p.n }}</span><span class="nm">{{ p.name }}</span><span class="ct">{{ p.city }}</span><span class="yr">{{ p.yr }}</span></a>')
    b = rep(b, '<button class="{{ frameCls }}" onClick="{{ openCur }}" aria-label="Play {{ cur.name }} film">', '<button class="{{ frameCls }}" onClick="{{ openCur }}" aria-label="{{ cur.frameLabel }}">')
    b = sub(r'<span class="p_dur">1:30</span>\s*</button>', '</button>', b)
    # the cover is the brand page's film moment: its poster frame, the A mark, a rule, "The [Brand] Story", a Play label on the cursor
    b = sub(r'<span class="p_pv"><i></i>Preview</span>\s*<span class="p_play" aria-hidden="true">.*?</span>\s*',
            '<sc-if value="{{ cur.film }}"><div class="film_card" aria-hidden="true"><span class="film_mark"><span class="amark"></span></span><i class="film_rule"></i><span class="film_name">The {{ cur.story }} Story</span></div>'
            '<span class="film_cur" aria-hidden="true"><svg width="12" height="14" viewBox="0 0 12 14"><path d="M1 1l10 6-10 6z" fill="#0E0E0D"></path></svg><span>Play</span></span></sc-if>\n', b)
    b = rep(b, '<button class="{{ frameCls }}" onClick="{{ openCur }}" aria-label="{{ cur.frameLabel }}">', '<button class="{{ frameCls }}" onClick="{{ openCur }}" onMouseMove="{{ frameMove }}" aria-label="{{ cur.frameLabel }}">')
    b = rep(b, '<span>Partnered [Mo YYYY]</span>', '<span>{{ cur.since }}</span>')
    b = rep(b, '<a class="p_who" href="/locations#founders">', '<a class="p_who" href="{{ cur.founderHref }}">')
    b = rep(b, '<div class="p_pile" aria-label="Team"><i></i><i></i><i></i><i></i></div>', '')
    b = rep(b, '<a class="btn" href="#partner">Open partner page</a>', '<a class="btn" href="{{ cur.href }}">Open partner page</a>')
    # people: CMS departments with real faces
    # the whole card opens the department (stretched link on the button); every face opens that person's profile
    b = rep(b, '<a class="btn" href="/team" style="align-self: flex-start; height: 28px; padding: 0 12px; font-size: 10px">Meet department</a>', '<a class="btn dept_go" href="{{ d.href }}" style="align-self: flex-start; height: 28px; padding: 0 12px; font-size: 10px">Meet department</a>')
    b = rep(b, '<div class="dept_avs"><span class="av">··</span><span class="av">··</span><span class="av">··</span><span class="av">··</span></div> <span class="dept_count">[N] people</span>'.replace(' <', '\n<') if False else '<div class="dept_avs"><span class="av">··</span><span class="av">··</span><span class="av">··</span><span class="av">··</span></div>',
            '<div class="dept_avs"><sc-for list="{{ d.avs }}" as="a"><a class="av" href="{{ a.href }}" title="{{ a.name }}" aria-label="{{ a.name }}" style="overflow: hidden; position: relative">' + ph_img('a.img', '{{ a.iOnly }}') + '</a></sc-for></div>')
    b = rep(b, '<span class="dept_count">[N] people</span>', '')
    b = rep(b, '<a class="btn" href="#team-all">Meet the whole team</a>', '<a class="btn" href="/team">Meet the whole team</a>')
    # stories
    b = sub(r'<span class="story_ph ph">.*?</span>\s*', '', b)
    b = sub(r'<div style="display: flex; justify-content: flex-end; margin-top: 36px"><a class="btn" href="#stories-all">See more stories</a></div>', '', b)
    # practice
    b = sub(r'<span class="practice_ph ph">.*?</span>', '', b)
    b = sub(r'<a class="btn btn-light" href="#classes"[^>]*>See classes</a>', '', b)
    # podcasts: CMS shows and covers
    b = sub(r'<div class="stat"><div class="stat_num">7</div><div class="stat_label">Shows</div></div>\s*<div class="stat"><div class="stat_num">\[#\]</div><div class="stat_label">Episodes</div></div>\s*<div class="stat"><div class="stat_num">\[#\]</div><div class="stat_label">Listens</div></div>',
            '<div class="stat"><div class="stat_num">{{ nShows }}</div><div class="stat_label">Shows</div></div>', b)
    i = b.index('<div class="track" style="gap: 8px; transform: translateX({{ podShift }})">'); j = b.index('</div>\n</div>\n<p class="ph"', i) if '</div>\n</div>\n<p class="ph"' in b[i:] else None
    k = b.index('<p class="ph" style="margin: 18px 0 0; color: #5C5952">[Typographic stand-ins / swap for real cover art]</p>')
    seg = b[i:k]
    close = seg.rindex('</div>', 0, seg.rindex('</div>'))  # track closes before rail closes
    b = b[:i] + '<div class="track" style="gap: 8px; transform: translateX({{ podShift }})"><sc-for list="{{ shows }}" as="c"><a class="cover" href="{{ c.href }}" style="text-decoration: none"><div class="cover_art" style="background: {{ c.bg }}; padding: 0; overflow: hidden; position: relative"><sc-if value="{{ c.art }}"><img class="ph_img" src="{{ c.art }}" alt="{{ c.name }}" loading="lazy"></sc-if></div><div class="cover_meta"><span class="mono" style="font-size: 10px">{{ c.name }}</span></div></a></sc-for></div>\n</div>\n' + b[k:]
    b = sub(r'<p class="ph" style="margin: 18px 0 0; color: #5C5952">\[Typographic stand-ins / swap for real cover art\]</p>', '', b)
    b = rep(b, '<div id="how" class="start">', '<sc-if value="{{ hasEps }}"><div id="how" class="start">')
    b = rep(b, '<a class="btn" href="#episodes">All shows and episodes</a></div> </div> </div>'.replace(' <', '\n<') if False else '<a class="btn" href="#episodes">All shows and episodes</a></div>', '<a class="btn" href="/podcasts">All shows and episodes</a></div>')
    m = re.search(r'(<a class="btn" href="/podcasts">All shows and episodes</a></div>\s*</div>\s*</div>)', b); assert m
    b = b[:m.end()] + '</sc-if>' + b[m.end():]
    # qualifier
    b = sub(r'<p class="ph" style="color: #9B978E; margin-top: 28px">Routes to GHL.*?</p>', '', b)
    b = rep(b, '<span class="ep_len">{{ e.len }}</span>', '<span class="ep_end"><x-queue ep="{{ e.ep }}"></x-queue><span class="ep_len">{{ e.len }}</span></span>')
    return qualifier_markup(b)


def main_engine(e):
    e = qualifier_engine(e)
    D = "(this.props.data || {})"
    e = rep(e, "const P = [\n", "const P = " + D + ".P || [\n")
    e = rep(e, "const P = D.P;", "const P = D.P, X = " + D + ";")
    e = rep(e, "const partners = P.map((p, i) => ({ n: p.n, name: p.name, city: p.city, yr: '[yr]',", "const partners = P.map((p, i) => ({ href: p.href, n: p.n, name: p.name, city: p.city, yr: p.yr || '',")
    e = rep(e, "const cur = { n: c.n,", "const cur = { href: c.href, since: c.since ? 'Partnered ' + c.since : '', founderHref: c.founderHref || '/locations#founders', n: c.n,")
    e = rep(e, "  thLoad(i) { const S = this.S; const n = this.D.P.length; S.pi = (i + n) % n;",
            "  thLoad(i) { const S = this.S; const n = this.D.P.length, dir = i < S.pi ? -1 : 1; let j = S.pi; for (let k = 0; k < n; k++) { j = (j + dir + n) % n; if (this.D.P[j].film && this.D.P[j].film.src) break; } S.pi = j;")
    e = rep(e, "openCur: () => this.thOpen(this.S.pi),", "openCur: () => { const c = P[this.S.pi]; if (c.film && c.film.src) this.thOpen(this.S.pi); else if (typeof window !== 'undefined') window.location.assign(c.href); },")
    e = rep(e, "else if (e.key === ' ') { e.preventDefault(); this.S.thPlay = !this.S.thPlay; this.bump(); }",
            "else if (e.key === ' ' && e.target === e.currentTarget) { e.preventDefault(); const vd = this._th && this._th.querySelector('video'); if (vd) { if (vd.paused) vd.play(); else vd.pause(); } }")
    e = rep(e, "thClose: () => this.thClose(),", "thClose: () => this.thClose(), thVid: (el) => { if (el && el !== this._tv) { this._tv = el; const p = el.play(); if (p && p.catch) p.catch(() => {}); } },")
    e = rep(e, "const th = { idx: pi + 1,", "const FL = P.filter((p) => p.film && p.film.src), cf = c.film || {}, wide = typeof window === 'undefined' || window.innerWidth > 820;\n    const th = { total: FL.length, src: cf.src ? (wide ? cf.src : (cf.small || cf.src)) : '', poster: c.filmPoster || c.img || '', idx: Math.max(1, FL.indexOf(c) + 1),")
    e = rep(e, "const cur = { href: c.href,", "const cur = { film: !!(c.film && c.film.src), frameLabel: c.film && c.film.src ? 'Play the ' + c.name + ' film' : 'Open ' + c.name, href: c.href,")
    e = sub(r"const depts = \[.*?\n    \];", "const depts = X.depts || [];", e)
    e = rep(e, "const di = s.dept ?? 0, dMax = 2;", "const di = s.dept ?? 0, dMax = Math.max(0, depts.length - 3);")
    e = sub(r"(const stories = \[.*?\n    \])", r"\1.filter((x) => x.quote.indexOf('[') < 0).map((x) => Object.assign({}, x, { brand: x.brand.charAt(0) === '[' ? '' : x.brand }))", e)
    e = rep(e, "const si = s.story ?? 0, sMax = 3,", "const si = s.story ?? 0, sMax = Math.max(0, stories.length - 4),")
    e = sub(r"const EP = \[.*?\n    \];", "const EP = X.eps || [];", e)
    e = rep(e, "const eps = EP.map((e, i) => ({ ...e, btnCls: i === playing ? 'ep_play is-on' : 'ep_play', play: () => set({ playing: i }) }));",
            "const eps = EP.map((e, i) => ({ ...e, btnCls: i === playing ? 'ep_play is-on' : 'ep_play', play: () => { set({ playing: i }); if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('alpha:play', { detail: e.ep })); } }));")
    e = rep(e, "return {\n      openMenu:", "return {\n      reelVid: X.reel || { d: null, m: null },\n      net: X.net || { brands: '15', locations: '36', states: '12' }, shows: X.shows || [], nShows: String((X.shows || []).length), hasEps: EP.length > 0,\n      reel: P.map((p, i) => ({ src: p.poster || p.img, cls: 'reel_img' + (i === cut ? ' is-on' : '') })).filter((r) => r.src),\n      openMenu:")
    e = rep(e, "const posters = P.map((p, i) => ({ cls: 'p_poster' + (i === pi ? ' is-on' : ''), tone: p.tone, hasImg: !!p.img, noImg: !p.img, img: p.img || '',",
            "const posters = P.map((p, i) => { const im = (p.film && p.film.src && p.cover) || p.img || ''; return { cls: 'p_poster' + (i === pi ? ' is-on' : '') + (p.film && p.film.src ? ' is-film' : ''), tone: p.tone, hasImg: !!im, noImg: !im, img: im,")
    e = rep(e, "cityLong: p.city }));", "cityLong: p.city }; });")
    e = rep(e, "const cur = { film: !!(c.film && c.film.src),", "const cur = { story: c.story || c.name, film: !!(c.film && c.film.src),")
    e = rep(e, "partners, posters, cur, frameCls:", "frameMove: (ev) => { const r = ev.currentTarget.getBoundingClientRect(); ev.currentTarget.style.setProperty('--cx', (ev.clientX - r.left) + 'px'); ev.currentTarget.style.setProperty('--cy', (ev.clientY - r.top) + 'px'); },\n      partners, posters, cur, frameCls:")
    return e


MAIN_CSS = IMG_CSS + """
.reel{position:relative;overflow:hidden}
.reel_img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 1.2s var(--ease)}
.reel_img.is-on{opacity:1}
.reel_hud{z-index:2}
a.p_row{display:grid;color:inherit}
.th_vid{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;z-index:2}
.ep_end{display:flex;align-items:center;gap:14px}
.p_poster.is-film img{transform:scale(1.04);filter:brightness(.62);transition:transform 2.6s cubic-bezier(.2,.7,.2,1),filter .8s ease}
.p_frame:hover .p_poster.is-film img{transform:scale(1.01);filter:brightness(.72)}
.p_frame:has(.film_card)::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(14,14,13,.1) 0%,rgba(14,14,13,.5) 100%)}
.p_frame .film_card{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#EDEAE2;pointer-events:none;text-align:center}
.p_frame .film_mark{display:flex;align-items:center;height:28px}
.p_frame .film_mark .amark{height:24px}
.p_frame .film_rule{display:block;width:40px;height:1px;background:currentColor;opacity:.6}
.p_frame .film_name{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase}
.p_frame:has(.film_card){cursor:none}
.p_frame .film_cur{position:absolute;z-index:3;left:var(--cx,50%);top:var(--cy,72%);transform:translate(-50%,-50%);display:inline-flex;align-items:center;gap:9px;height:36px;padding:0 15px 0 12px;border-radius:999px;background:rgba(237,234,226,.94);color:#0E0E0D;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:0;transition:opacity .25s ease;pointer-events:none}
.p_frame:hover .film_cur,.p_frame:focus-visible .film_cur{opacity:1}
.p_frame .film_cur svg{width:9px;height:11px}
@media (hover:none){.p_frame .film_cur{opacity:1;left:50%;top:auto;bottom:18px;transform:translateX(-50%)}.p_frame:has(.film_card){cursor:pointer}}
@media (prefers-reduced-motion:reduce){.p_poster.is-film img{transition:none;transform:none}}
/* department cards: whole card is the link, faces sit on top and link to people; all faces, centered, four to a row */
/* carousels bleed to both viewport edges: cards that advance off the left stay visible instead of clipping at the column */
.rail{margin-left:calc(50% - 50vw);padding-left:calc(50vw - 50%)}
.rail:has(.dept){padding-top:10px;padding-bottom:34px;margin-top:30px!important}
.dept{padding:22px 16px 22px;margin-bottom:0;transition:transform .45s var(--ease),border-color .3s,background-color .3s,box-shadow .45s var(--ease)}
.dept_go::after{content:"";position:absolute;inset:0;z-index:1}
.dept:hover{transform:translateY(-6px);border-color:var(--ink);background-color:rgba(255,255,255,.28);box-shadow:0 22px 40px -26px rgba(14,14,13,.4)}
.dept .dept_go{transition:background-color .3s,color .3s,border-color .3s}
.dept:hover .dept_go{background:var(--ink);color:var(--bone);border-color:var(--ink)}
.dept_avs{position:relative;left:auto;bottom:auto;z-index:2;margin:auto auto 0;padding-top:22px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:226px}
.dept_avs .av{width:52px;height:52px;color:inherit;text-decoration:none;transition:transform .35s var(--ease),border-color .25s}
.dept_avs .av:hover{transform:translateY(-3px) scale(1.08);border-color:var(--ink);z-index:1}
@media (prefers-reduced-motion:reduce){.dept,.dept_avs .av{transition:none}.dept:hover{transform:none}}
"""


QUEUE_IMPORT = "import { QueueBtn } from '@/components/site/QueueBtn'\n"
QUEUE_ROW_CSS = """
.row{grid-template-columns:64px minmax(0,1fr) 84px minmax(0,190px) 132px}
.r_end{display:flex;align-items:center;justify-content:flex-end;gap:12px;min-width:0}
@media (max-width:1100px){.row{grid-template-columns:56px minmax(0,1fr) 70px 124px}}
@media (max-width:620px){.row{grid-template-columns:56px minmax(0,1fr) auto}}
"""


PLAY_EVENT = "if (typeof window !== 'undefined' && ep) window.dispatchEvent(new CustomEvent('alpha:play', { detail: ep }))"


def podcasts_markup(b):
    # hero photography behind the slide; title and shelf cards become show logos when a show has one
    b = rep(b, '<p class="mono tv_k">{{ hs.sched }}</p>\n<h1 class="tv_t">{{ hs.name }}</h1>', '<p class="mono tv_k">{{ hs.sched }}</p>\n<h1 class="tv_t"><sc-if value="{{ hs.logo }}"><span class="tv_logo" role="img" aria-label="{{ hs.name }}" style="--logo: url({{ hs.logo }}); --ar: {{ hs.ar }}"></span></sc-if><sc-if value="{{ hs.noLogo }}">{{ hs.name }}</sc-if></h1>')
    b = rep(b, '<span class="sh_t">{{ s.short }}</span>', '<sc-if value="{{ s.logo }}"><span class="sh_logo" role="img" aria-label="{{ s.short }}" style="--logo: url({{ s.logo }}); --ar: {{ s.ar }}"></span></sc-if><sc-if value="{{ s.noLogo }}"><span class="sh_t">{{ s.short }}</span></sc-if>')
    b = rep(b, '<span class="tv_art" style="color: {{ s.fg }}">{{ s.short }}</span>', '<sc-if value="{{ s.hero }}"><img class="tv_bg" src="{{ s.hero }}" alt=""></sc-if><sc-if value="{{ s.art }}"><img class="tv_img" src="{{ s.art }}" alt=""></sc-if><sc-if value="{{ s.noArt }}"><span class="tv_art" style="color: {{ s.fg }}">{{ s.short }}</span></sc-if>')
    b = sub(r'<span class="ph tv_ph">.*?</span>\s*', '', b)
    b = rep(b, '<p class="mono tv_latest"><span>Latest</span>EP {{ hs.ep.n }} / {{ hs.ep.title }}</p>', '<sc-if value="{{ hs.ep.title }}"><p class="mono tv_latest"><span>Latest</span>{{ hs.ep.label }}</p></sc-if>')
    b = rep(b, '<a class="btn" href="/podcasts">All episodes</a>', '<a class="btn" href="{{ hs.href }}">All episodes</a>')
    b = rep(b, '<div class="paths">', '<sc-if value="{{ hasPaths }}"><div class="paths">')
    b = rep(b, '<button class="{{ p.cls }}" onClick="{{ p.go }}">{{ p.t }}</button></sc-for></div>', '<button class="{{ p.cls }}" onClick="{{ p.go }}">{{ p.t }}</button></sc-for></div></sc-if>')
    b = rep(b, '<a class="r_main" href="/podcasts"><b>{{ e.title }}</b><span class="mono">{{ e.show }} · EP {{ e.n }} · {{ e.date }}</span></a>', '<a class="r_main" href="{{ e.href }}"><b>{{ e.title }}</b><span class="mono">{{ e.meta }}</span></a>')
    b = rep(b, '<span class="r_art">{{ e.short }}</span>', '<sc-if value="{{ e.art }}"><img class="ph_img" src="{{ e.art }}" alt="" loading="lazy"></sc-if><span class="r_art">{{ e.artText }}</span>')
    b = sub(r'<p class="ph" style="color: #9B978E; margin-top: 18px">Sample data\..*?</p>', '', b)
    b = sub(r'<!-- mini player.*?-->\s*<sc-if value="\{\{ hasNow \}\}".*?</sc-if>', '', b)
    # speaker faces: real headshots in the rows and the Speakers filter, initials when there is no photo
    b = rep(b, '<button class="face" onClick="{{ p.go }}" title="{{ p.name }}">{{ p.init }}</button>', '<button class="face" onClick="{{ p.go }}" title="{{ p.name }}"><sc-if value="{{ p.img }}"><img src="{{ p.img }}" alt="" loading="lazy"></sc-if>{{ p.init }}</button>')
    b = rep(b, '<span class="{{ o.faceCls }}">{{ o.init }}</span>', '<span class="{{ o.faceCls }}"><sc-if value="{{ o.img }}"><img src="{{ o.img }}" alt="" loading="lazy"></sc-if>{{ o.init }}</span>')
    # + Queue on every row (Player board)
    b = rep(b, '<span class="mono r_len">{{ e.len }}</span>', '<span class="r_end"><x-queue ep="{{ e.ep }}"></x-queue><span class="mono r_len">{{ e.len }}</span></span>')
    return b


def podcasts_engine(e):
    e = rep(e, "lat = D.E.filter((e) => e.show === hk)[0];", "lat = D.E.filter((e) => e.show === hk)[0] || { title: '', n: '', label: '' };")
    e = rep(e, "const play = (id) => { if (s.now === id) set({ playing: !s.playing }); else set({ now: id, t: 0, playing: true }); };",
            "const play = (id) => { const ep = (D.E.find((x) => x.id === id) || {}).ep; " + PLAY_EVENT + "; };")
    e = rep(e, "hs: Object.assign({}, hs, { ep: lat, play: () => play(lat.id) }),", "hs: Object.assign({}, hs, { ep: lat, play: () => play(lat.id) }), hasPaths: D.paths.length > 0,")
    e = rep(e, "slides: D.feat.map((k, i) => ({ cls: 'tv_slide' + (i === hi ? ' is-on' : ''), bg: D.S[k].bg, fg: D.S[k].fg, short: D.S[k].short,",
            "slides: D.feat.map((k, i) => ({ art: D.S[k].art, noArt: !D.S[k].art, cls: 'tv_slide' + (i === hi ? ' is-on' : ''), bg: D.S[k].bg, fg: D.S[k].fg, short: D.S[k].short,")
    e = rep(e, "epCount: '130+',", "epCount: String(D.E.length),")
    e = rep(e, "return { title: e.title, n: e.n, show: sh.name, short: sh.short, bg: sh.bg, fg: sh.fg, date: this.dfmt(e.date), len: e.len,",
            "return { href: e.href, art: sh.art, artText: sh.art ? '' : sh.short, meta: sh.name + (e.n ? ' · EP ' + e.n : '') + ' · ' + this.dfmt(e.date), title: e.title, n: e.n, show: sh.name, short: sh.short, bg: sh.bg, fg: sh.fg, date: this.dfmt(e.date), len: e.len,")
    e = rep(e, "hasNow: !!now,", "hasNow: false,")
    e = rep(e, "if (this.props.autoplay !== false && !s.paused && !this.rm) { const he = (s.he || 0) + 100; if (he >= 7000) { o.hi = ((s.hi || 0) + 1) % 4;",
            "if (this.props.autoplay !== false && !s.paused && !this.rm) { const he = (s.he || 0) + 100; if (he >= 7000) { o.hi = ((s.hi || 0) + 1) % this.data().feat.length;")
    e = rep(e, "if (s.playing && s.now != null) { const e = this.data().E[s.now]; o.t = Math.min(e.sec, (s.t || 0) + .1); dirty = true; }", "")
    e = rep(e, "slides: D.feat.map((k, i) => ({ art: D.S[k].art, noArt: !D.S[k].art, cls: 'tv_slide' + (i === hi ? ' is-on' : ''),", "slides: D.feat.map((k, i) => ({ hero: D.S[k].hero || '', art: D.S[k].art, noArt: !D.S[k].art, cls: 'tv_slide' + (D.S[k].hero ? ' has-hero' : '') + (i === hi ? ' is-on' : ''),")
    e = rep(e, "return { short: D.S[k].short, sched: D.S[k].sched,", "return { logo: D.S[k].logo || '', noLogo: !D.S[k].logo, ar: D.S[k].ar, short: D.S[k].short, sched: D.S[k].sched,")
    e = rep(e, "spk: e.spk.map((p) => ({ name: D.P[p], init: this.init(D.P[p]), go: () => setF('spk', p) })),",
            "spk: e.spk.slice(0, 3).map((p) => { const img = (D.PI || {})[p] || ''; return { name: D.P[p], img, init: img ? '' : this.init(D.P[p]), go: () => setF('spk', p) }; }),")
    e = rep(e, "faceCls: g.face ? 'of' : 'nf', init: g.face ? this.init(o.t) : '' };",
            "faceCls: g.face ? 'of' : 'nf', img: g.face ? (D.PI || {})[o.v] || '' : '', init: g.face && !(D.PI || {})[o.v] ? this.init(o.t) : '' };")
    e = rep(e, "return { href: e.href, art: sh.art,", "return { ep: e.ep, href: e.href, art: sh.art,")
    return e


PODCAST_CSS = IMG_CSS + """
.tv_img{position:absolute;right:clamp(16px,6vw,96px);top:50%;transform:translateY(-50%);height:min(70%,440px);aspect-ratio:1;object-fit:cover;box-shadow:0 30px 80px rgba(0,0,0,.35)}
.r_play{position:relative;overflow:hidden}
.r_play .r_pi{position:relative;z-index:1}
@media (max-width:820px){.tv_img{opacity:.25;height:60%}}
.tv_bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:70% 30%}
.tv_slide.has-hero{background:#0E0E0D!important}
.tv_slide.has-hero .tv_img{top:auto;right:calc((100vw - min(100vw, var(--max, 1280px))) / 2 + var(--gut, 64px));bottom:clamp(150px,13vw,200px);transform:none;height:clamp(120px,11vw,176px);box-shadow:0 18px 40px rgba(0,0,0,.45);opacity:1}
.tv_logo{display:block;height:clamp(110px,11vw,190px);max-width:100%;aspect-ratio:var(--ar,2.2);background:currentColor;-webkit-mask:var(--logo) left bottom/contain no-repeat;mask:var(--logo) left bottom/contain no-repeat}
.sh_logo{display:block;width:78%;height:56%;background:currentColor;-webkit-mask:var(--logo) left top/contain no-repeat;mask:var(--logo) left top/contain no-repeat}
@media (max-width:820px){.tv_slide.has-hero .tv_img{display:none}}
.of{position:relative;overflow:hidden;flex:0 0 auto}
.face img,.of img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%;display:block}
"""


def after_nav(b, content):
    i = b.index('</x-nav>') + len('</x-nav>')
    return b[:i] + '\n' + content + '\n'


SHOW_BODY = """
<section class="sh_h"><div class="wrap sh_grid">
<div class="sh_art" style="background: {{ show.bg }}; color: {{ show.fg }}; position: relative; overflow: hidden"><sc-if value="{{ show.art }}"><img class="ph_img" src="{{ show.art }}" alt="{{ show.name }}"></sc-if><sc-if value="{{ show.noArt }}"><span>{{ show.name }}</span><em>ALPHA®</em></sc-if></div>
<div>
<span class="mono sh_k">Alpha podcast network<sc-if value="{{ show.sched }}"> · {{ show.sched }}</sc-if></span>
<h1 class="sh_t">{{ show.name }}</h1>
<sc-if value="{{ show.tag }}"><p class="sh_d">{{ show.tag }}</p></sc-if>
<div class="sh_row"><sc-if value="{{ hasEps }}"><button class="tv_play" onClick="{{ playLatest }}"><svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true"><path d="M0 0l11 6.5L0 13z" fill="currentColor"></path></svg>Play latest</button></sc-if><sc-for list="{{ plats }}" as="p"><a class="plat light" href="{{ p.href }}" target="_blank" rel="noopener">{{ p.t }}<span aria-hidden="true">↗</span></a></sc-for></div>
<div class="sh_stats"><div><b>{{ count }}</b><span>Episodes</span></div><sc-if value="{{ since }}"><div><b>{{ since }}</b><span>Since</span></div></sc-if><sc-if value="{{ hasGuests }}"><div><b>{{ guests }}</b><span>Guests</span></div></sc-if></div>
</div></div></section>
<sc-if value="{{ hasEps }}">
<section class="sec"><div class="wrap"><div class="latest" style="grid-template-columns: 1fr">
<div><span class="k">Latest · {{ lat.label }} · {{ lat.date }}</span><h3>{{ lat.title }}</h3><sc-if value="{{ lat.sum }}"><p>{{ lat.sum }}</p></sc-if><div style="display: flex; gap: 8px"><button class="btn" onClick="{{ playLatest }}">Play</button><a class="btn" href="{{ lat.href }}">Episode page</a></div></div>
</div></div></section>
<sc-if value="{{ hasHosts }}"><section style="padding-bottom: clamp(70px, 8vw, 120px)"><div class="wrap">
<hr class="rule" style="margin-bottom: clamp(30px, 3vw, 44px)">
<p class="eyebrow">{{ hostsLabel }}</p>
<div class="hosts"><sc-for list="{{ hosts }}" as="p"><div class="hostc"><span class="person_av"><sc-if value="{{ p.img }}"><img src="{{ p.img }}" alt="" loading="lazy"></sc-if><sc-if value="{{ p.iOnly }}">{{ p.init }}</sc-if></span><div><h3 class="person_n" style="margin-top: 0">{{ p.name }}</h3><sc-if value="{{ p.role }}"><p class="person_t mono">{{ p.role }}</p></sc-if><sc-if value="{{ p.bio }}"><p class="person_b">{{ p.bio }}</p></sc-if><sc-if value="{{ p.hasHref }}"><a class="btn" href="{{ p.href }}">Profile</a></sc-if></div></div></sc-for></div>
</div></section></sc-if>
<section style="padding-bottom: clamp(90px, 10vw, 150px)"><div class="wrap">
<div class="split_head"><h2 class="display h2">Every episode</h2></div>
<div class="res_bar" style="padding-bottom: 10px"><p class="res_n"><b>{{ nRes }}</b> <span class="mono">episodes</span></p><a class="lnk k" href="/podcasts">Search the whole network →</a></div>
<div class="rows"><sc-for list="{{ rows }}" as="e"><div class="{{ e.cls }}">
<button class="r_play" onClick="{{ e.play }}" aria-label="Play {{ e.title }}" style="background: {{ e.bg }}; color: {{ e.fg }}; position: relative; overflow: hidden"><sc-if value="{{ e.art }}"><img class="ph_img" src="{{ e.art }}" alt="" loading="lazy"></sc-if><i class="r_pi" aria-hidden="true" style="position: relative">▶</i></button>
<a class="r_main" href="{{ e.href }}"><b>{{ e.title }}</b><span class="mono">{{ e.meta }}</span></a><span class="r_spk"><sc-for list="{{ e.spk }}" as="p"><span class="face" title="{{ p.name }}"><sc-if value="{{ p.img }}"><img src="{{ p.img }}" alt="" loading="lazy"></sc-if>{{ p.init }}</span></sc-for></span><span class="r_end"><x-queue ep="{{ e.ep }}"></x-queue><span class="mono r_len">{{ e.len }}</span></span>
</div></sc-for></div>
<sc-if value="{{ hasMore }}"><div class="more" style="display: flex; justify-content: center; margin-top: 28px"><button class="btn" onClick="{{ loadMore }}">Load more</button></div></sc-if>
</div></section>
</sc-if>
<section style="padding-bottom: clamp(90px, 10vw, 150px)"><div class="wrap">
<div class="nw_h"><h2 class="h3">More from the network</h2><a class="lnk mono" href="/podcasts" style="font-size: 10.5px; text-transform: uppercase; letter-spacing: .05em">All shows</a></div>
<hr class="rule" style="margin: 20px 0 24px">
<div class="nw"><sc-for list="{{ shows }}" as="s"><a class="nw_c" href="{{ s.href }}"><div class="nw_art" style="background: {{ s.bg }}; color: {{ s.fg }}; position: relative; overflow: hidden"><sc-if value="{{ s.art }}"><img class="ph_img" src="{{ s.art }}" alt="{{ s.name }}" loading="lazy"></sc-if></div><div class="nw_cap"><span>{{ s.name }}</span><span>{{ s.count }}</span></div></a></sc-for></div>
</div></section>
"""


SHOW_CSS = """
.plat{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid rgba(14,14,13,.55);border-radius:999px;font-family:var(--mono);font-size:11px;letter-spacing:.05em;text-transform:uppercase;text-decoration:none;color:inherit;transition:background .2s,color .2s,border-color .2s}
.plat:hover{opacity:1;background:var(--ink);color:var(--bone)}
.plat.light{border-color:rgba(232,228,218,.6);color:var(--paper)}
.plat.light:hover{background:var(--paper);border-color:var(--paper);color:var(--ink)}
.r_spk{display:flex;align-items:center}
.r_spk .face{cursor:default}
.r_spk .face img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.rows .row{grid-template-columns:64px minmax(0,1fr) minmax(0,150px) 132px}
@media (max-width:1100px){.rows .row{grid-template-columns:56px minmax(0,1fr) auto 124px}}
@media (max-width:620px){.rows .row{grid-template-columns:56px minmax(0,1fr) auto}.rows .r_spk{display:none}}
"""


def show_markup(b):
    return after_nav(b, SHOW_BODY)


def show_engine(e):
    i, j = e.index('  st() {'), e.rindex('}')
    return e[:i] + """  st() { return this.state || {}; }
  renderVals() {
    const D = this.props.data, s = this.st(), E = D.eps, shown = s.shown || 20;
    const play = (ep) => { """ + PLAY_EVENT + """; };
    return {
      show: D.show, plats: D.plats, count: String(E.length), since: D.since, hasEps: E.length > 0,
      hosts: D.hosts || [], hasHosts: (D.hosts || []).length > 0, hostsLabel: (D.hosts || []).length > 1 ? 'Your hosts' : 'Your host', guests: D.guests, hasGuests: Number(D.guests) > 0,
      lat: E[0] || {}, playLatest: () => E[0] && play(E[0].ep),
      nRes: E.length, rows: E.slice(0, shown).map((x) => Object.assign({}, x, { cls: 'row', play: () => play(x.ep), bg: D.show.bg, fg: D.show.fg, art: D.show.art,
        spk: ((x.ep && x.ep.speakers) || []).slice(0, 4).map((p) => ({ name: p.name, img: p.img || '', init: p.img ? '' : p.initials })) })),
      hasMore: E.length > shown, loadMore: () => this.setState({ shown: shown + 20 }),
      shows: D.shows
    };
  }
""" + e[j:]


EPISODE_BODY = """
<section class="eh"><div class="wrap eh_grid">
<div class="art eh_art" style="background: {{ show.bg }}; position: relative; overflow: hidden" aria-label="{{ show.name }} cover"><sc-if value="{{ show.art }}"><img class="ph_img" src="{{ show.art }}" alt=""></sc-if></div>
<div class="eh_info">
<h1 class="eh_t">{{ ep.title }}</h1>
<p class="eh_m mono"><a href="{{ show.href }}" style="color: inherit">{{ show.name }}</a><sc-if value="{{ ep.n }}"> // EP {{ ep.n }}</sc-if> <span>{{ ep.date }}<sc-if value="{{ ep.len }}"> · {{ ep.len }}</sc-if></span></p>
<sc-if value="{{ hasPeople }}"><div class="eh_spk" style="margin-top: 18px"><sc-for list="{{ people }}" as="p"><span class="spk" title="{{ p.name }}"><sc-if value="{{ p.img }}"><img src="{{ p.img }}" alt="" loading="lazy"></sc-if><sc-if value="{{ p.iOnly }}">{{ p.init }}</sc-if></span></sc-for></div></sc-if>
<div class="plats" style="margin-top: 18px"><button class="tv_play" onClick="{{ play }}"><svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true"><path d="M0 0l11 6.5L0 13z" fill="currentColor"></path></svg>Play episode</button><x-queue ep="{{ ep.player }}" class="btn qb_lg"></x-queue><sc-for list="{{ plats }}" as="p"><a class="plat" href="{{ p.href }}" target="_blank" rel="noopener">{{ p.t }}<span aria-hidden="true">↗</span></a></sc-for></div>
</div>
</div></section>
<x-epbar ep="{{ ep.player }}"></x-epbar>
<sc-if value="{{ ep.video }}"><section class="{{ vidCls }}" aria-label="Episode video"><sc-if value="{{ vidOn }}"><iframe class="vid_ifr" src="{{ vidSrc }}" title="{{ ep.title }}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></sc-if><sc-if value="{{ vidOff }}"><sc-if value="{{ ep.poster }}"><img class="vid_poster" src="{{ ep.poster }}" alt="" loading="lazy"></sc-if><button class="vid_btn" onClick="{{ watch }}"><svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M1 1l10 6-10 6z" fill="#0E0E0D"></path></svg><span>Watch the episode</span></button></sc-if></section></sc-if>
<section class="sec"><div class="wrap about">
<div class="about_l">
<sc-if value="{{ noPq }}"><h2 class="about_h">About this episode</h2></sc-if>
<sc-if value="{{ pq.text }}"><p class="eyebrow">About this episode</p><h2 class="pq">“{{ pq.text }}”</h2><sc-if value="{{ pq.at }}"><button class="pq_play mono" onClick="{{ playQuote }}"><span aria-hidden="true">▶</span> Hear it at {{ pq.at }}</button></sc-if></sc-if>
<div class="share mono"><span>Share</span><a href="{{ share.x }}" target="_blank" rel="noopener">X</a><a href="{{ share.li }}" target="_blank" rel="noopener">LinkedIn</a><a href="{{ share.fb }}" target="_blank" rel="noopener">Facebook</a><button onClick="{{ copy }}">{{ copyLabel }}</button></div>
</div>
<div class="about_r">
<div class="body ep_body"><p>{{ ep.sum }}</p></div>
<sc-if value="{{ hasChapters }}"><h2 class="list_h">In this episode</h2><ol class="chap"><sc-for list="{{ chapters }}" as="c"><li><button onClick="{{ c.go }}"><span class="mono">{{ c.at }}</span><span>{{ c.t }}</span><span class="chap_go" aria-hidden="true">▶</span></button></li></sc-for></ol></sc-if>
<sc-if value="{{ trHtml }}"><button class="tr_btn mono" onClick="{{ toggleTr }}" aria-expanded="{{ trOpenS }}">{{ trLabel }}</button><sc-if value="{{ trOpen }}"><x-rich class="tr" html="{{ trHtml }}"></x-rich></sc-if></sc-if>
</div>
</div></section>
<sc-if value="{{ hasPeople }}"><section style="padding-bottom: clamp(70px, 8vw, 120px)"><div class="wrap">
<hr class="rule" style="margin-bottom: clamp(36px, 4vw, 60px)">
<p class="eyebrow">In the room</p>
<div class="room2"><sc-for list="{{ people }}" as="p"><div class="person">
<span class="person_av"><sc-if value="{{ p.img }}"><img src="{{ p.img }}" alt="" loading="lazy"></sc-if><sc-if value="{{ p.iOnly }}">{{ p.init }}</sc-if></span>
<div><span class="person_k mono">{{ p.label }}</span><h3 class="person_n">{{ p.name }}</h3><sc-if value="{{ p.role }}"><p class="person_t mono">{{ p.role }}</p></sc-if><sc-if value="{{ p.bio }}"><p class="person_b">{{ p.bio }}</p></sc-if><sc-if value="{{ p.hasHref }}"><a class="btn" href="{{ p.href }}">Profile</a></sc-if></div>
</div></sc-for></div>
</div></section></sc-if>
<section class="show"><div class="wrap show_grid">
<div class="art" style="background: {{ show.bg }}; position: relative; overflow: hidden" aria-label="{{ show.name }} cover"><sc-if value="{{ show.art }}"><img class="ph_img" src="{{ show.art }}" alt="" loading="lazy"></sc-if></div>
<div><p class="eyebrow">About the show</p><h2 class="show_n">{{ show.name }}</h2></div>
<div><p class="body" style="margin-top: 0">{{ show.tag }}</p><p class="mono" style="font-size: 10.5px; color: #5C5952; margin: 18px 0 22px">{{ show.count }}<sc-if value="{{ show.sched }}"> · {{ show.sched }}</sc-if></p><a class="btn" href="{{ show.href }}">All episodes</a></div>
</div></section>
<sc-if value="{{ hasMore }}"><section class="sec"><div class="wrap">
<h2 class="h3" style="margin-bottom: clamp(24px, 2.4vw, 36px)">More from {{ show.name }}</h2>
<div class="eps"><sc-for list="{{ more }}" as="e"><div class="ep">
<div class="art art_sm" style="background: {{ show.bg }}; position: relative; overflow: hidden"><sc-if value="{{ show.art }}"><img class="ph_img" src="{{ show.art }}" alt="" loading="lazy"></sc-if></div>
<div class="ep_d"><b class="mono">{{ e.title }}</b><span class="mono">{{ show.name }}</span><span class="mono ep_date">{{ e.date }}<sc-if value="{{ e.len }}"> · {{ e.len }}</sc-if></span></div>
<span class="mono ep_no">{{ e.n }}</span><span></span><span></span>
<span class="ep_links"><a class="btn" href="{{ e.href }}">View episode</a><button class="btn" onClick="{{ e.play }}">Play</button><x-queue ep="{{ e.ep }}" class="btn"></x-queue></span>
</div></sc-for></div>
<div style="display: flex; justify-content: center; margin-top: clamp(28px, 3vw, 44px)"><a class="btn" href="{{ show.href }}">See show</a></div>
</div></section></sc-if>
<section style="padding-bottom: clamp(90px, 10vw, 150px)"><div class="wrap">
<h2 class="h3">Explore other shows</h2><hr class="rule" style="margin: clamp(20px, 2vw, 30px) 0 clamp(24px, 2.4vw, 36px)">
<div class="shows"><sc-for list="{{ shows }}" as="s"><a class="tile" href="{{ s.href }}" style="background: {{ s.bg }}; color: {{ s.fg }}; position: relative; overflow: hidden"><sc-if value="{{ s.art }}"><img class="ph_img" src="{{ s.art }}" alt="{{ s.name }}" loading="lazy"></sc-if><sc-if value="{{ s.noArt }}"><span class="tile_t">{{ s.name }}</span></sc-if></a></sc-for></div>
</div></section>
"""


EPBAR_CSS = """
.eh .plats{align-items:center;gap:8px}
.eh .plat{height:44px;padding:0 18px}
.eh .qb.is-now{display:none}
.about .pq{max-width:24ch;text-wrap:balance}
.about_h{font-family:var(--h3);font-weight:700;font-size:clamp(22px,1.9vw,28px);line-height:1.1;letter-spacing:-.012em;margin:0 0 clamp(18px,1.8vw,26px)}
.player .pl_grid{grid-template-columns:auto minmax(0,220px) auto minmax(0,1fr) auto auto}
.pl_ctl{display:flex;align-items:center;gap:6px}
.pl_sk{width:30px;height:30px;border:0;border-radius:50%;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer;padding:0;transition:background .2s}
.pl_sk:hover{background:rgba(14,14,13,.08)}
.pl_now b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl_tick{cursor:pointer}
.player{z-index:30}
.pl_ch{position:relative}
.pl_chb{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border:1px solid rgba(14,14,13,.4);border-radius:999px;background:transparent;font-size:10px;cursor:pointer;white-space:nowrap}
.pl_chb[aria-expanded="true"],.pl_chb:hover{background:var(--ink);border-color:var(--ink);color:var(--bone)}
.pl_menu{position:absolute;right:0;top:calc(100% + 12px);width:min(420px,calc(100vw - 32px));max-height:min(60vh,520px);overflow:auto;background:var(--bone);border:1px solid var(--line);box-shadow:0 18px 50px rgba(14,14,13,.18);padding:6px 0;z-index:40}
.pl_menu button{width:100%;display:grid;grid-template-columns:62px minmax(0,1fr);gap:12px;align-items:baseline;padding:11px 16px;border:0;background:transparent;text-align:left;font-size:14px;cursor:pointer}
.pl_menu button .mono{font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.pl_menu button:hover{background:rgba(14,14,13,.05)}
.pl_menu button.is-on{font-weight:600}
.pl_menu button.is-on .mono{color:var(--ink)}
.player .pl_grid{grid-template-columns:auto minmax(0,220px) auto minmax(0,1fr) auto auto auto}
@media (max-width: 760px){.player .pl_grid{grid-template-columns:auto auto minmax(0,1fr) auto auto}.pl_ch .lbl{display:none}}
"""


def episode_markup(b):
    return after_nav(b, EPISODE_BODY)


def episode_engine(e):
    i, j = e.index('  componentDidMount() {'), e.rindex('}')
    return e[:i] + """  st() { return this.state || {}; }
  sec(a) { return String(a || '0').split(':').reduce((v, n) => v * 60 + +n, 0); }
  renderVals() {
    const D = this.props.data, s = this.st(), ep = D.ep.player;
    const playAt = (at) => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('alpha:play', { detail: Object.assign({}, ep, at ? { at } : {}) })); };
    return {
      show: D.show, ep: D.ep, plats: D.plats, pq: D.pq, noPq: !D.pq.text, share: D.share, people: D.people || [], hasPeople: (D.people || []).length > 0,
      play: () => playAt(0), playQuote: () => playAt(this.sec(D.pq.at)),
      hasChapters: D.chapters.length > 0, chapters: D.chapters.map((c) => ({ at: c.at, t: c.t, go: () => playAt(this.sec(c.at)) })),
      trHtml: D.trHtml, trOpen: !!s.tr, trOpenS: s.tr ? 'true' : 'false', trLabel: s.tr ? 'Hide transcript' : 'Read the full transcript', toggleTr: () => this.setState({ tr: !s.tr }),
      copy: () => { try { navigator.clipboard.writeText(location.href); } catch (err) {} this.setState({ copied: true }); setTimeout(() => this.setState({ copied: false }), 1600); },
      copyLabel: s.copied ? 'Copied' : 'Copy link',
      hasMore: D.more.length > 0, more: D.more.map((m) => Object.assign({}, m, { play: () => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('alpha:play', { detail: m.ep })); } })),
      shows: D.shows,
      vidOn: !!s.vid, vidOff: !s.vid, vidCls: 'vid' + (s.vid ? ' is-on' : ''),
      vidSrc: D.ep.yt ? 'https://www.youtube-nocookie.com/embed/' + D.ep.yt + '?autoplay=1&rel=0&modestbranding=1&playsinline=1' : '',
      watch: () => { if (typeof window === 'undefined') return; if (D.ep.yt) { window.dispatchEvent(new CustomEvent('alpha:pause')); this.setState({ vid: true }); } else window.open(D.ep.video, '_blank', 'noopener'); }
    };
  }
""" + e[j:]


PAGES = {
    # name: route dir, board, options
    'About': dict(dir='about', board='About', markup=about_markup, engine=about_engine, css=IMG_CSS + '.ex_i{position:relative;overflow:hidden}'),
    'Pathway': dict(dir='how-it-works', board='Pathway'),
    'Talk': dict(dir='talk', board='Talk', markup=talk_markup, engine=talk_engine),
    'Resources': dict(dir='resources', board='Resources'),
    # 'Landing': campaign template, ported when the first campaign exists
    'Legal': dict(dir='legal/[slug]', board='Legal', markup=legal_markup, engine=legal_engine),
    'NotFound': dict(dir='_notfound', board='NotFound'),
    'Team': dict(dir='team', board='Team', data=True, markup=team_markup, engine=team_engine, css=IMG_CSS),
    'Dept': dict(dir='team/[dept]', board='Dept', data=True, markup=dept_markup, engine=dept_engine, css=IMG_CSS),
    'Profile': dict(dir='team/[dept]/[person]', board='Profile', data=True, markup=profile_markup, engine=profile_engine, css=IMG_CSS),
    'Newswire': dict(dir='newswire', board='Newswire', data=True, markup=newswire_markup, engine=newswire_engine, css=IMG_CSS),
    'Article': dict(dir='newswire/[slug]', board='Article', markup=article_markup, engine=article_engine, css=IMG_CSS + '.ar_body img{max-width:100%;height:auto}'),
    'Founder': dict(dir='founders/[slug]', board='Founder', data=True, markup=founder_markup, engine=founder_engine),
    'Locations': dict(dir='locations', board='Locations', data=True, markup=locations_markup, engine=locations_engine, jsx=locations_jsx, imports="import { FocusMap } from '@/components/site/MapStage'\n",
                      css=IMG_CSS + MAP_CSS + '.map_focus{opacity:0;pointer-events:none}\n.map_focus .maplibregl-canvas-container{transition:opacity .7s}\n.map_focus:not([data-ready="1"]) .maplibregl-canvas-container{opacity:0;transition:opacity .2s}\n'),
    'Location': dict(dir='locations/[slug]', board='Location', markup=location_markup, engine=location_engine, jsx=location_jsx, imports=MAP_IMPORT, css=IMG_CSS + MAP_CSS + JOINED_CSS + '.rv_who{color:inherit;text-decoration:none}\n.rv_who:hover b{text-decoration:underline}\n.gal .img{position:relative;overflow:hidden;background:#D3CFC5}\n'),
    'Podcasts': dict(dir='podcasts', board='Podcasts', data=True, markup=podcasts_markup, engine=podcasts_engine, css=PODCAST_CSS + QUEUE_ROW_CSS, imports=QUEUE_IMPORT),
    'Show': dict(dir='podcasts/[show]', board='Show', markup=show_markup, engine=show_engine, imports=QUEUE_IMPORT, css=SHOW_CSS + QUEUE_ROW_CSS + IMG_CSS + '.spk,.person_av{position:relative;overflow:hidden}\n.spk img,.person_av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}\n'),
    'Episode': dict(dir='podcasts/[show]/[episode]', board='Episode', markup=episode_markup, engine=episode_engine, imports=QUEUE_IMPORT + "import { EpisodeBar } from '@/components/site/EpisodeBar'\n", css=EPBAR_CSS + '.qb_lg{height:44px;padding:0 18px}\n.btn.qb.is-q{background:var(--ink);border-color:var(--ink);color:var(--bone)}\n.btn.qb.is-now{opacity:.55;cursor:default}\n' + IMG_CSS + '.vid_poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.82)}\n.vid .vid_btn{position:relative;z-index:1;border:0;cursor:pointer}\n.vid.is-on{aspect-ratio:16/9;background:#000}\n.vid_ifr{position:absolute;inset:0;width:100%;height:100%;border:0}\n' + '.tv_play{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 22px 0 18px;border-radius:999px;border:0;background:var(--ink);color:#fff;font-family:var(--mono);font-size:11px;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:transform .3s var(--ease)}\n.tv_play:hover{transform:scale(1.04)}\n' + '.spk,.person_av{position:relative;overflow:hidden}\n.spk img,.person_av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}\n'),
    # 'Speaker': ported when the Speakers collection has people in it
    'Main': dict(dir='_home', board='Main', markup=main_markup, engine=main_engine, css=MAIN_CSS + REEL_CSS, imports=QUEUE_IMPORT + "import { HomeReel } from '@/components/site/HomeReel'\n"),
}


def find_block(s, start, tag):
    """Index just past the element that opens at `start` (balanced on `tag`)."""
    depth, i = 0, start
    pat = re.compile(r'<(/?)' + tag + r'\b[^>]*?(/?)>', re.S)
    for m in pat.finditer(s, start):
        if m.group(2):
            continue
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return m.end()
    raise ValueError('unbalanced ' + tag)


def cut(s, pattern, tag, repl=''):
    """Remove (or replace) every element whose opening tag matches `pattern`."""
    out = 0
    while True:
        m = re.search(pattern, s, re.S)
        if not m:
            return s, out
        end = find_block(s, m.start(), tag)
        r = repl(s[m.start():end]) if callable(repl) else repl
        s = s[:m.start()] + r + s[end:]
        out += 1


def markup(name, body):
    b = body
    # outer motion wrapper
    m = re.match(r'\s*<div ref="\{\{ moRoot \}\}"[^>]*>', b)
    assert m, name + ': no moRoot wrapper'
    b = b[m.end():]
    i = b.find('<!-- ============ SITE MENU')
    b = b[:i] if i >= 0 else b
    b = b[:b.rindex('</div>')]
    # nav -> <x-nav>, keeping anything under the nav row (crumbs)
    def nav(h):
        dark = ' dark' if 'dark_top' in h[:80] else ''
        inner = re.sub(r'^<header[^>]*>', '', h)[:-len('</header>')]
        inner = re.sub(r'\s*<div class="wrap"><nav class="nav".*?</nav></div>', '', inner, count=1, flags=re.S)
        return '<x-nav' + dark + '>' + inner.strip() + '</x-nav>'
    b, n = cut(b, r'<header class="b_top', 'header', nav)
    has_nav = n > 0
    b, _ = cut(b, r'<footer class="foot', 'footer')
    b, _ = cut(b, r'<footer class="closer', 'footer')
    b, closer = cut(b, r'<section class="closer', 'section')
    b, _ = cut(b, r'<section[^>]*aria-label="Let', 'section') if False else (b, 0)
    # links
    ids = set(re.findall(r'\bid="([\w-]+)"', b))
    def href(m):
        h = m.group(1)
        return 'href="' + (h if h[1:] in ids else HREF.get(h, h)) + '"'
    b = re.sub(r'href="(#[\w-]+)"', href, b)
    # board assets -> public files
    def blob(m):
        k = m.group(1)
        assert k in ASSETS, name + ': unmapped asset ' + k
        return ASSETS[k]
    b = re.sub(r'/_blob/([0-9a-f]{32})', blob, b)
    return b, has_nav, closer > 0


def css_for(name, css, cls):
    c = re.sub(r'@font-face\{[^}]*\}', '', css)
    c = re.sub(r'/\* motion \(shared.*?/\* /motion \*/\n?', '', c, flags=re.S)
    if '/* site menu (shared' in c:
        i = c.index('/* site menu (shared')
        m = re.search(r'/\* (overlay|motion|closer background|touch)', c[i + 10:])
        j = i + 10 + m.start() if m else len(c)
        c = c[:i] + c[j:]
    c = re.sub(r'/\* closer background waits.*?(?=/\*|$)', '', c, flags=re.S)
    c = re.sub(r'/_blob/([0-9a-f]{32})', lambda m: ASSETS.get(m.group(1), m.group(0)), c)
    return scope_css(c, cls)


def engine_for(name, js, cfg):
    e = strip_injected(js)
    e = e.replace('renderVals() { return Object.assign(this._rv(), this.mnVals(), this.moVals()); }', '')
    e = e.replace('renderVals() { return Object.assign(this._rv(), this.moVals()); }', '')
    for fn in ('moVals', 'mnVals', 'ctaVals'):
        m = re.search(r'\n  ' + fn + r'\(\) \{', e)
        if m:
            k, depth = e.index('{', m.start()) + 1, 1
            while depth:
                depth += {'{': 1, '}': -1}.get(e[k], 0); k += 1
            e = e[:m.start()] + e[k:]
    if '_rv() {' in e:
        e = e.replace('  _rv() {', '  renderVals() {', 1)
    if cfg.get('data'):
        m = re.search(r'\n  data\(\) \{', e)
        assert m, name + ': no data() to swap'
        k, depth = e.index('{', m.start()) + 1, 1
        while depth:
            depth += {'{': 1, '}': -1}.get(e[k], 0); k += 1
        e = e[:m.start()] + '\n  data() { return this.props.data; }' + e[k:]
    e = re.sub(r'/_blob/([0-9a-f]{32})', lambda m: ASSETS.get(m.group(1), m.group(0)), e)
    e = re.sub(r"(['\"])(#[\w-]+)\1", lambda m: m.group(1) + HREF.get(m.group(2), m.group(2)) + m.group(1), e)
    if cfg.get('engine'):
        e = cfg['engine'](e)
    cname = name + 'Engine'
    assert 'class Component extends DCLogic {' in e, name
    e = e.replace('class Component extends DCLogic {', 'export class ' + cname + ' extends DCLogic {', 1)
    for bad in ('mnVals', 'ctaVals', 'moVals', 'moRoot'):
        assert bad not in e, name + ': leftover ' + bad
    return "// @ts-nocheck\n/* Generated from design/boards/" + cfg['board'] + ".dc.html by tools/port/port_pages.py. */\nimport { DCLogic } from '@/lib/dc'\n\n" + e.strip() + '\n', cname


def port(name):
    cfg = PAGES[name]
    t = open(f"{ROOT}/design/boards/{cfg['board']}.dc.html").read()
    css = re.search(r'<style>(.*?)</style>', t, re.S).group(1)
    body = t[t.index('</helmet>') + 9:t.rindex('</x-dc>')]
    js = re.search(r'data-dc-script[^>]*>(.*?)</script>', t, re.S).group(1)
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower())
    cls = 'pg-' + slug
    b, has_nav, closer = markup(name, body)
    hook = cfg.get('markup')  # noqa
    if hook:
        b = hook(b)
    jsx = convert(b)
    if cfg.get('jsx'):
        jsx = cfg['jsx'](jsx)
    assert 'moRoot' not in jsx and 'mnOpen' not in jsx, name + ': chrome left in markup'
    scss = css_for(name, css + cfg.get('css', ''), cls)
    eng, cname = engine_for(name, js, cfg)
    d = APP + cfg['dir'] + ('/' if cfg['dir'] else '')
    os.makedirs(d, exist_ok=True)
    view = f"""'use client'
/* Generated from design/boards/{cfg['board']}.dc.html by tools/port/port_pages.py. Edit the board or the porter, not this file. */
import React from 'react'
import {{ Nav }} from '@/components/site/Nav'
import {{ useDC }} from '@/lib/dc'
import {{ {cname} }} from './engine'
{cfg.get('imports', '')}import './page.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function {name}View(props: any) {{
  const v = useDC({cname}, props)
  return (
    <div className="{cls}">
{jsx}
    </div>
  )
}}
"""
    open(d + name + 'View.tsx', 'w').write(view)
    open(d + 'page.css', 'w').write(scss)
    open(d + 'engine.ts', 'w').write(eng)
    return dict(name=name, dir=d, closer=closer, nav=has_nav, view=len(view), css=len(scss), engine=len(eng))


if __name__ == '__main__':
    names = sys.argv[1:] or list(PAGES)
    for n in names:
        r = port(n)
        print(f"{n:10} closer={r['closer']!s:5} nav={r['nav']!s:5} view={r['view']:>6} css={r['css']:>6} engine={r['engine']:>6}")
