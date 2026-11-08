import re, sys
import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
sys.path.insert(0, os.path.dirname(__file__))
from dc2jsx import parse, convert, scope_css, strip_injected

APP = ROOT + '/src/app/(frontend)/brands/[slug]/'
css, body, js = parse(ROOT + '/design/boards/Brand.dc.html')


def sub(pat, rep, s, n=1, flags=re.S):
    r, k = re.subn(pat, rep, s, count=0 if n == 0 else n, flags=flags)
    assert k >= 1, pat
    return r


# ---------- markup ----------
b = body
b = b[b.index('<header class="b_top">'):b.index('<!-- ============ CLOSER')]
# nav is global; keep the brand crumb under it
b = sub(r'<header class="b_top">.*?(<div class="crumb">.*?</div></div>)\s*</header>', r'<x-nav>\1</x-nav>', b)
b = b.replace('Partner since {{ b.since }}', '{{ b.sinceLine }}')
# hero: real video when the CMS has one, prototype gradient otherwise
b = sub(r'<sc-if value="\{\{ b\.heroVideo \}\}"[^>]*><video .*?</sc-if><sc-if value="\{\{ b\.noVideo \}\}"[^>]*><div class="hero_media" aria-hidden="true"></div></sc-if>\s*<div class="hero_shade" aria-hidden="true"></div>',
        '<sc-if value="{{ hasVideo }}"><video class="hero_vid" ref="{{ vidRef }}" src="{{ b.heroVideo }}" poster="{{ b.heroPoster }}" autoplay muted loop playsinline aria-hidden="true"></video></sc-if>'
        '<sc-if value="{{ posterOnly }}"><img class="hero_vid" src="{{ b.heroPoster }}" alt="" aria-hidden="true" fetchPriority="high"></sc-if>'
        '<sc-if value="{{ noMedia }}"><div class="hero_media" aria-hidden="true"></div></sc-if>\n<div class="hero_shade" aria-hidden="true"></div>', b)
b = b.replace('<span class="logo_slot">Brand mark</span>', '<sc-if value="{{ b.logo }}"><img class="logo_img" src="{{ b.logo }}" alt="{{ b.name }}"></sc-if>')
b = b.replace('<span class="card_img ph" style="background: {{ c.tone }}">{{ c.city }}<br>photo</span>',
              '<span class="card_img ph" style="background: {{ c.tone }}"><sc-if value="{{ c.img }}"><img src="{{ c.img }}" alt="" loading="lazy"></sc-if><sc-if value="{{ c.noImg }}">{{ c.city }}</sc-if></span>')
b = sub(r'<span class="map_note ph">.*?</span>\s*', '', b)
# practice
b = b.replace('<p class="eyebrow">The practice she built</p>', '<p class="eyebrow">{{ b.practiceEyebrow }}</p>')
b = sub(r'<h2 class="h3" style="width: 508px; height: 258px">.*?</h2>\s*<div class="body">.*?</div>',
        '<h2 class="h3">{{ b.practiceHeadline }}</h2>\n<x-rich class="body" html="{{ b.practiceHtml }}"></x-rich>', b)
b = sub(r'<div class="img ph" style="aspect-ratio: 1.1 / 1">.*?</div>',
        '<div class="img ph" style="aspect-ratio: 1.1 / 1"><sc-if value="{{ b.practiceImg }}"><img class="fill" src="{{ b.practiceImg }}" alt="" loading="lazy"></sc-if></div>', b)
# film
b = sub(r'<span class="ph">Brand film / Vimeo, loads on play</span>',
        '<sc-if value="{{ b.filmPoster }}"><img class="fill" src="{{ b.filmPoster }}" alt="" loading="lazy"></sc-if>', b)
b = b.replace('<button class="play" aria-label="Play the {{ b.short }} story">', '<button class="play" onClick="{{ playFilm }}" aria-label="Play the {{ b.short }} story">')
b = sub(r'<div class="body" style="margin-top: clamp\(28px, 3vw, 44px\)"><p>\[Film caption.*?</div>',
        '<sc-if value="{{ b.filmCaption }}"><div class="body" style="margin-top: clamp(28px, 3vw, 44px)"><p>{{ b.filmCaption }}</p></div></sc-if>', b)
b = b.replace('<sc-if value="{{ c.noImg }}" hint-placeholder-val="{{ true }}">{{ c.city }}<br>photo</sc-if>', '<sc-if value="{{ c.noImg }}">{{ c.city }}</sc-if>')
b = b.replace('<img class="fill" src="{{ b.filmPoster }}" alt="" loading="lazy">', '<img class="fill" src="{{ b.filmPoster }}" alt="" loading="lazy" decoding="async">')
# quote caption: no board timecode
b = sub(r'<figcaption>\{\{ b.founder \}\} / \{\{ b.short \}\} founder[^<]*</figcaption>', '<figcaption>{{ b.founder }} / {{ b.short }} founder</figcaption>', b)
# EST only when the CMS has the year
b = b.replace('<span class="est"><small>EST</small>{{ b.est }}</span>', '<sc-if value="{{ b.est }}"><span class="est"><small>EST</small>{{ b.est }}</span></sc-if>')
b = b.replace('<span class="est"><small>EST</small>{{ c.est }}</span>', '<sc-if value="{{ c.est }}"><span class="est"><small>EST</small>{{ c.est }}</span></sc-if>')
assert b.count('sc-if value="{{ b.est }}"') == 1 and b.count('sc-if value="{{ c.est }}"') == 1
# stats only when filled
b = sub(r'(<!-- ============ STATS ============ -->\s*)(<section.*?</section>)', r'\1<sc-if value="{{ hasStats }}">\2</sc-if>', b)
# reviews: left out until the Google Business Profile sync writes them (same rule as Location)
b = sub(r'<!-- ============ IN THEIR WORDS.*?-->\s*<section.*?</section>\s*', '', b)
# founder
b = sub(r'<img src="/_blob/\w+" alt="\{\{ b.founder \}\}"[^>]*>', '<sc-if value="{{ b.founderImg }}"><img src="{{ b.founderImg }}" alt="{{ b.founder }}" style="object-position: 50% 20%" loading="lazy"></sc-if>', b)
b = sub(r'(<p class="founder_cred">\{\{ b.cred \}\}</p>\s*)<div class="body">.*?</div>', r'\1<x-rich class="body" html="{{ b.founderHtml }}"></x-rich>', b)
b = b.replace('<a class="btn" href="#founder" style="margin-top: 10px">Learn more</a>', '<x-link class="btn" href="{{ founderHref }}" style="margin-top: 10px">Learn more</x-link>')
b = sub(r'(<!-- ============ FOUNDER ============ -->\s*)(<section.*?</section>)', r'\1<sc-if value="{{ b.founder }}">\2</sc-if>', b)
# quote
b = sub(r'<blockquote>“.*?”</blockquote>', '<blockquote>“{{ b.quote }}”</blockquote>', b)
b = sub(r'(<!-- ============ QUOTE ============ -->\s*)(<section.*?</section>)', r'\1<sc-if value="{{ b.quote }}">\2</sc-if>', b)
# why alpha
b = sub(r'(<p class="eyebrow">Why Alpha</p>\s*)<h2 class="h3">.*?</h2>\s*<div class="body">.*?</div>', r'\1<h2 class="h3">{{ b.whyHeadline }}</h2>\n<x-rich class="body" html="{{ b.whyHtml }}"></x-rich>', b)
b = sub(r'<div class="img ph" style="aspect-ratio: 4 / 5.2">.*?</div>',
        '<div class="img ph" style="aspect-ratio: 4 / 5.2"><sc-if value="{{ b.whyImg }}"><img class="fill" src="{{ b.whyImg }}" alt="" loading="lazy"></sc-if></div>', b)
b = sub(r'(<!-- ============ WHY ALPHA ============ -->\s*)(<section.*?</section>)', r'\1<sc-if value="{{ b.whyHeadline }}">\2</sc-if>', b)
# links
b = sub(r'<a class="btn" href="#talk">Partner with Alpha</a>', '<x-link class="btn" href="/talk">Partner with Alpha</x-link>', b)
b = b.replace('<a class="map_link" href="#network">See partner map</a>', '<x-link class="map_link" href="/locations">See partner map</x-link>')
b = b.replace('<a class="btn" href="#talk" style="margin-top: 10px">Let\'s talk</a>', '<x-link class="btn" href="/talk" style="margin-top: 10px">Let\'s talk</x-link>')
assert '#talk' not in b and '/_blob/' not in b, re.findall(r'href="#\w+"|/_blob/\w+', b)

b = b.replace('{{ founderLine }} / {{ servicesLine }}', '{{ metaLine }}')
jsx = convert(b)
CV = '<canvas className="map_cv" ref={v.setCanvas} aria-hidden="true"></canvas>'
assert CV in jsx
jsx = jsx.replace(CV, '{hasMapbox ? <MapboxStage locs={brand.locations} idx={v.idx} /> : null}' + CV)

# ---------- css ----------
c = css
c = re.sub(r'@font-face\{[^}]*\}', '', c)
c = re.sub(r'/\* motion \(shared.*?/\* /motion \*/\n', '', c, flags=re.S)  # lives in global.css
if '/* site menu (shared' in c:  # drop only the injected menu block; keep page styles added after it
    i = c.index('/* site menu (shared')
    j = c.index('\n', c.index('@media (prefers-reduced-motion:reduce){.mn,', i))
    c = c[:i] + c[j + 1:]
c = re.sub(r'/\* CTA background.*?(?=\.closer_media>h2)', '', c, flags=re.S)
c += '\n.map_gl{position:absolute;inset:0}\n.map_gl .mapboxgl-ctrl-attrib{background:rgba(14,14,13,.5)}\n.map_gl .mapboxgl-ctrl-attrib a{color:rgba(232,228,218,.6)}\n.hero_vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}\n.logo_img{height:26px;width:auto;display:block}\n.card_img img,.fill{width:100%;height:100%;object-fit:cover;display:block}\n.img{position:relative;overflow:hidden}\n.film{overflow:hidden}\n.film .fill{position:absolute;inset:0}\n'
import json
ASSETS = json.load(open(os.path.join(os.path.dirname(__file__), 'assets.json')))
c = re.sub(r'/_blob/([0-9a-f]{32})', lambda m: ASSETS.get(m.group(1), m.group(0)), c)
missing = set(re.findall(r'/_blob/([0-9a-f]{32})', c))
scss = scope_css(c, 'pg-brand')

# ---------- logic ----------
e = strip_injected(js)
e = sub(r'  brand\(\) \{.*?\n  \}\n', '  brand() { return this.props.brand; }\n', e)
e = sub(r"      stats: this\.counted\(\[.*?\n      \]\),\n", '      stats: this.counted(B.stats), hasStats: B.stats.length > 0,\n', e)
e = e.replace("      b: B,\n", "      b: { ...B, sinceLine: B.since ? 'Partner since ' + B.since : '' },\n      metaLine: [[B.founder, B.cred].filter(Boolean).join(', '), B.services.join(' ')].filter(Boolean).join(' / '),\n      hasVideo: !!B.heroVideo, posterOnly: !B.heroVideo && !!B.heroPoster, noMedia: !B.heroVideo && !B.heroPoster,\n      founderHref: B.founderSlug ? '/founders/' + B.founderSlug : '/founders',\n      playFilm: () => { if (B.filmUrl) window.open(B.filmUrl, '_blank', 'noopener'); },\n", 1)
e = e.replace("cards: L.map((l, i) => ({ cls:", "cards: L.map((l, i) => ({ img: l.img, noImg: !l.img, cls:", 1)
assert "metaLine: [[L[0].a1" in e
assert e.count('this.tick(now, dt); this.draw(now);') == 1
e = e.replace('this.tick(now, dt); this.draw(now);', 'this.tick(now, dt); if (!this.props.mapbox) this.draw(now);')
VR = "      vidRef: (el) => { if (el && el !== this._vid) { this._vid = el; el.muted = true; const p = el.play && el.play(); if (p && p.catch) p.catch(() => {}); } },\n"
assert VR in e
e = e.replace(VR, """      vidRef: (el) => {
        if (!el || el === this._vid) return;
        this._vid = el; el.muted = true;
        if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { el.removeAttribute('autoplay'); el.pause(); return; }
        const p = el.play && el.play(); if (p && p.catch) p.catch(() => {});
      },
""")
e = e.replace('class Component extends DCLogic {', 'export class BrandEngine extends DCLogic {', 1)
assert 'mnVals' not in e and 'ctaVals' not in e

view = """'use client'
/* Ported from the Brand board (Brand.dc.html). Markup and engine are generated; edit design/boards/Brand.dc.html or tools/port/port_brand.py, not this file. */
import Link from 'next/link'
import React from 'react'
import { Nav } from '@/components/site/Nav'
import { useDC } from '@/lib/dc'
import type { BrandData } from '@/lib/data'
import { BrandEngine } from './engine'
import { MapboxStage, hasMapbox } from './MapboxStage'
import './brand.css'

export default function BrandView({ brand }: { brand: BrandData }) {
  const v = useDC(BrandEngine, { brand, singleLocation: false, mapbox: hasMapbox })
  return (
    <div className="pg-brand">
""" + jsx + """
    </div>
  )
}
"""
engine = "// @ts-nocheck\n/* Map engine + template logic from the Brand board. Production swap: Mapbox GL for the canvas map. */\nimport { DCLogic } from '@/lib/dc'\n\n" + e.strip() + "\n"

# self-hosted video (renditions + in-place film), kept in step with src/lib/data.ts
view = view.replace('<video className="hero_vid" ref={v.vidRef} src={v.b.heroVideo} poster={v.b.heroPoster} autoPlay muted loop playsInline aria-hidden="true"></video>',
    '<video className="hero_vid" ref={v.vidRef} poster={v.b.heroPoster || undefined} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true">{v.b.hero.av1 ? <source src={v.b.hero.av1} type={\'video/mp4; codecs="av01.0.08M.08"\'} /> : null}{v.b.hero.small ? <source src={v.b.hero.small} type="video/mp4" media="(max-width: 820px)" /> : null}<source src={v.b.hero.src || v.b.heroVideo} type="video/mp4" /></video>')
assert 'v.b.hero.av1' in view
engine = engine.replace("      playFilm: () => { if (B.filmUrl) window.open(B.filmUrl, '_blank', 'noopener'); },\n", open(os.path.join(os.path.dirname(__file__), 'brand_film.js')).read())
assert 'film_vid' in engine
os.makedirs(APP, exist_ok=True)
open(APP + 'BrandView.tsx', 'w').write(view)
open(APP + 'brand.css', 'w').write(scss)
open(APP + 'engine.ts', 'w').write(engine)
print('missing assets', sorted(missing)); print('ok', len(view), len(scss), len(engine))
