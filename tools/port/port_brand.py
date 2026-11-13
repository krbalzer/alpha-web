import re, sys
import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
sys.path.insert(0, os.path.dirname(__file__))
from dc2jsx import parse, convert, scope_css, strip_injected

APP = ROOT + '/src/app/(frontend)/brands/[slug]/'
css, body, js = parse(ROOT + '/design/boards/Brand.dc.html')


def rep_once(s, old, new):
    assert s.count(old) == 1, old[:60]
    return s.replace(old, new)


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
# location cards are links: the card in focus opens its location page, a card off to the side brings it into focus first
b = sub(r'<button class="\{\{ c\.cls \}\}" onClick="\{\{ c\.go \}\}" aria-label="\{\{ c\.aria \}\}" aria-current="\{\{ c\.cur \}\}">(.*?)</button>',
        r'<a class="{{ c.cls }}" href="{{ c.href }}" onClick="{{ c.go }}" aria-label="{{ c.aria }}" aria-current="{{ c.cur }}">\1</a>', b)
# practice
b = b.replace('<p class="eyebrow">The practice she built</p>', '<p class="eyebrow">The Practice</p>')
# section eyebrows (Kevin, Nov 2026): The Practice / The Experience / The Locations / The Treatments / The Founder / Why Alpha / Since Partnering
b = rep_once(b, '<div class="lx_head"><h2 class="h3">{{ locHead }}</h2><span class="eyebrow" style="margin: 0">{{ locCount }}</span></div>', '<div class="lx_head"><p class="eyebrow" style="margin: 0">The Locations</p><span class="eyebrow" style="margin: 0">{{ locCount }}</span></div>')
b = rep_once(b, '<p class="eyebrow">Founder</p>', '<p class="eyebrow">The Founder</p>')
b = sub(r'<h2 class="h3" style="width: 508px; height: 258px">.*?</h2>\s*<div class="body">.*?</div>',
        '<h2 class="h3">{{ b.practiceHeadline }}</h2>\n<x-rich class="body" html="{{ b.practiceHtml }}"></x-rich>', b)
b = sub(r'<div class="img ph" style="aspect-ratio: 1.1 / 1">.*?</div>',
        '<div class="img ph" style="aspect-ratio: 1.1 / 1"><sc-if value="{{ b.practiceImg }}"><img class="fill" src="{{ b.practiceImg }}" alt="" loading="lazy"></sc-if></div>', b)
# film
b = sub(r'<span class="ph">Brand film / Vimeo, loads on play</span>',
        '<sc-if value="{{ b.filmPoster }}"><img class="fill" src="{{ b.filmPoster }}" alt="" loading="lazy"></sc-if>', b)
# film: a cinema moment, not a second hero. Centered credit title, the whole frame plays, the page dims around it (FILM_CSS, brand_film.js)
b = sub(r'<button class="play" aria-label="Play the \{\{ b.short \}\} story">(<svg.*?</svg>)</button>',
        r'<div class="film_card" aria-hidden="true"><span class="film_mark"><span class="amark"></span></span><i class="film_rule"></i><span class="film_name">The {{ b.story }} Story</span></div>'
        r'<button class="play" onClick="{{ playFilm }}" onMouseMove="{{ filmMove }}" aria-label="Play the {{ b.story }} story"><span class="film_cur">\1<span>Play</span></span></button>', b)
b = sub(r'<hr class="rule">\s*<div class="bar"><span>\{\{ b.ptr \}\}</span><span>\{\{ b.short \}\} story</span></div>\s*', '', b)
b = rep_once(b, '<!-- ============ STORY FILM ============ -->\n<section style="padding-bottom: clamp(80px, 9vw, 140px)">', '<!-- ============ STORY FILM ============ -->\n<section class="film_sec" ref="{{ filmSec }}" style="padding-bottom: clamp(80px, 9vw, 140px)">')
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
CR = '<div className="crumb"><div className="wrap"><span>{v.b.ptr}</span><span>{v.b.name}</span>'
assert CR in jsx
jsx = jsx.replace(CR, '<div className="crumb"><div className="wrap"><span>{v.b.ptr}</span><BrandDock name={v.b.name} current={brand.slug} brands={brands} />')
CV = '<canvas className="map_cv" ref={v.setCanvas} aria-hidden="true"></canvas>'
assert CV in jsx
jsx = jsx.replace(CV, '{hasRealMap ? <MapStage locs={brand.locations} idx={v.idx} /> : null}' + CV)

# ---------- css ----------
FILM_CSS = '''
.film{width:100vw;margin-left:calc(50% - 50vw);aspect-ratio:2.39/1;max-height:88vh;background:#0E0E0D;display:block}
.film .fill{transform:scale(1.05);transition:transform 2.6s cubic-bezier(.2,.7,.2,1),filter .8s ease;filter:brightness(.72)}
.film:hover .fill{transform:scale(1.01);filter:brightness(.8)}
.film::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(14,14,13,.12) 0%,rgba(14,14,13,.55) 100%)}
.film_card{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#EDEAE2;pointer-events:none;text-align:center}
.film_name{font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase}\n.film_mark{display:flex;align-items:center;height:34px;color:#EDEAE2}\n.film_mark .amark{height:30px}
.film_rule{display:block;width:44px;height:1px;background:currentColor;opacity:.6}
.film_k{font-family:var(--mono);font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;opacity:.72;padding-left:.24em}
.film .play{position:absolute;inset:0;z-index:3;width:auto;height:auto;border-radius:0;background:none;cursor:none;transform:none!important}
.film_cur{position:absolute;left:var(--cx,50%);top:var(--cy,72%);transform:translate(-50%,-50%);display:inline-flex;align-items:center;gap:9px;height:38px;padding:0 16px 0 13px;border-radius:999px;background:rgba(237,234,226,.94);color:#0E0E0D;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;opacity:0;transition:opacity .25s ease;pointer-events:none}
.film .play:hover .film_cur,.film .play:focus-visible .film_cur{opacity:1}
.film_cur svg{width:9px;height:11px}
@media (hover:none){.film_cur{opacity:1;left:50%;top:auto;bottom:22px;transform:translateX(-50%)}.film .play{cursor:pointer}}
.film.is-playing{aspect-ratio:16/9;max-height:none}
.film.is-playing .film_card,.film.is-playing::after{display:none}
.film_sec .bar{transition:color .9s ease}
@media (max-width:820px){.film{aspect-ratio:16/10}}
@media (prefers-reduced-motion:reduce){.film .fill{transition:none;transform:none}}
'''

CARD_CSS = '''
a.card{color:inherit;text-decoration:none;transition:opacity .6s var(--ease),border-color .3s ease,transform .45s var(--ease)}
.card.is-on{cursor:pointer}
.card .card_img{overflow:hidden}
.card .card_img img{transition:transform .9s var(--ease)}
.card.is-on:hover{border-color:rgba(232,228,218,.5);transform:translateY(-3px)}
.card.is-on:hover .card_img img{transform:scale(1.06)}
.card:not(.is-on):hover{opacity:.6}
.card.is-on .card_txt b::after{content:"\\2192";display:inline-block;margin-left:10px;opacity:0;transform:translateX(-6px);transition:opacity .3s ease,transform .45s var(--ease)}
.card.is-on:hover .card_txt b::after{opacity:1;transform:none}
'''

DOCK_CSS = '''
.dock_btn{display:inline-flex;align-items:center;gap:8px;border:0;background:none;padding:0;margin:0;font:inherit;letter-spacing:inherit;text-transform:inherit;color:inherit;cursor:pointer;min-height:34px}
.dock_btn:hover,.dock_btn.is-open{color:var(--ink,#151513)}
.dock_btn svg{transition:transform .2s ease}
.dock_btn.is-open svg{transform:rotate(180deg)}
.dock{position:absolute;left:0;right:0;top:100%;z-index:20;background:#ECEAE3;border-bottom:1px solid var(--line);box-shadow:0 24px 48px -32px rgba(21,21,19,.35);animation:dockIn .22s cubic-bezier(.2,.7,.2,1) both}
.dock[hidden]{display:none}
@keyframes dockIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.dock_grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1px;max-width:var(--max,1280px);margin:0 auto;padding:20px var(--gut,clamp(16px,4.5vw,64px)) 24px;height:auto;box-sizing:border-box}
.dock_i{display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:16px 14px 14px;text-decoration:none;color:var(--ink,#151513);text-transform:none;letter-spacing:0;transition:background .15s ease}
.dock_i:hover{background:#E3E0D8}
.dock_i.is-on{background:#E3E0D8}
.dock_mark{height:30px;display:flex;align-items:center;margin-bottom:8px;--m:linear-gradient(#0000,#0000)}
.pair{--m:linear-gradient(#0000,#0000)}
.dock_mark .bmark{height:26px;max-width:120px}
.dock_n{font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.dock_name{font-family:var(--mono);font-size:11px;letter-spacing:.04em;text-transform:uppercase;line-height:1.35}
@media (prefers-reduced-motion:reduce){.dock{animation:none}}
'''

c = css
c = re.sub(r'@font-face\{[^}]*\}', '', c)
c = re.sub(r'/\* motion \(shared.*?/\* /motion \*/\n', '', c, flags=re.S)  # lives in global.css
if '/* site menu (shared' in c:  # drop only the injected menu block; keep page styles added after it
    i = c.index('/* site menu (shared')
    j = c.index('\n', c.index('@media (prefers-reduced-motion:reduce){.mn,', i))
    c = c[:i] + c[j + 1:]
c = re.sub(r'/\* CTA background.*?(?=\.closer_media>h2)', '', c, flags=re.S)
c += '\n.map_gl{position:absolute;inset:0}\n.map_gl .maplibregl-ctrl-attrib{background:rgba(14,14,13,.5);color:rgba(232,228,218,.5)}\n.map_gl .maplibregl-ctrl-attrib a{color:rgba(232,228,218,.6)}\n.map_gl .maplibregl-ctrl-attrib-button{filter:invert(1);opacity:.5}\n.hero_vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}\n.logo_img{height:26px;width:auto;display:block}\n.card_img img,.fill{width:100%;height:100%;object-fit:cover;display:block}\n.img{position:relative;overflow:hidden}\n.film{overflow:hidden}\n.film .fill{position:absolute;inset:0}\n.film.is-playing{aspect-ratio:16/9;background:#000}\n.film.is-playing .play,.film.is-playing .fill{display:none}\n.film_vid{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}\n' + DOCK_CSS + FILM_CSS + CARD_CSS
import json
ASSETS = json.load(open(os.path.join(os.path.dirname(__file__), 'assets.json')))
c = re.sub(r'/_blob/([0-9a-f]{32})', lambda m: ASSETS.get(m.group(1), m.group(0)), c)
missing = set(re.findall(r'/_blob/([0-9a-f]{32})', c))
c += '.b_top,.crumb{background:var(--bone)}\n'  # nav bar matches the page, as on the homepage
scss = scope_css(c, 'pg-brand')

# ---------- logic ----------
e = strip_injected(js)
e = sub(r'  brand\(\) \{.*?\n  \}\n', '  brand() { return this.props.brand; }\n', e)
e = sub(r"      stats: this\.counted\(\[.*?\n      \]\),\n", '      stats: this.counted(B.stats), hasStats: B.stats.length > 0,\n', e)
e = e.replace("      b: B,\n", "      b: { ...B, sinceLine: B.since ? 'Partner since ' + B.since : '' },\n      metaLine: [[B.founder, B.cred].filter(Boolean).join(', '), B.services.join(' ')].filter(Boolean).join(' / '),\n      hasVideo: !!B.heroVideo, posterOnly: !B.heroVideo && !!B.heroPoster, noMedia: !B.heroVideo && !B.heroPoster,\n      founderHref: B.founderSlug ? '/founders/' + B.founderSlug : '/founders',\n      playFilm: () => { if (B.filmUrl) window.open(B.filmUrl, '_blank', 'noopener'); },\n", 1)
e = e.replace("cards: L.map((l, i) => ({ cls:", "cards: L.map((l, i) => ({ img: l.img, noImg: !l.img, cls:", 1)
assert e.count("go: () => this.go(i), aria: B.name + ', ' + l.city,") == 1
e = e.replace("go: () => this.go(i), aria: B.name + ', ' + l.city,", "href: l.slug ? '/locations/' + l.slug : '#', go: (ev) => { if (i !== idx || !l.slug) { ev.preventDefault(); this.go(i); } }, aria: (i === idx ? 'Open ' : '') + B.name + ', ' + l.city,", 1)
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
import type { BrandData, BrandIndex } from '@/lib/data'
import { BrandDock } from './BrandDock'
import { BrandEngine } from './engine'
import { MapStage, hasRealMap } from '@/components/site/MapStage'
import { Inside } from '@/components/site/Inside'
import { Treatments } from '@/components/site/Treatments'
import './brand.css'

export default function BrandView({ brand, brands }: { brand: BrandData; brands: BrandIndex }) {
  const v = useDC(BrandEngine, { brand, singleLocation: false, mapbox: hasRealMap })
  return (
    <div className="pg-brand">
""" + jsx + """
    </div>
  )
}
"""
engine = "// @ts-nocheck\n/* Map engine + template logic from the Brand board. Real map: MapStage (MapLibre); the canvas map is the fallback. */\nimport { DCLogic } from '@/lib/dc'\n\n" + e.strip() + "\n"

# self-hosted video (renditions + in-place film), kept in step with src/lib/data.ts
view = view.replace('<video className="hero_vid" ref={v.vidRef} src={v.b.heroVideo} poster={v.b.heroPoster} autoPlay muted loop playsInline aria-hidden="true"></video>',
    '<video className="hero_vid" ref={v.vidRef} poster={v.b.heroPoster || undefined} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true">{v.b.hero.av1 ? <source src={v.b.hero.av1} type={\'video/mp4; codecs="av01.0.08M.08"\'} /> : null}{v.b.hero.small ? <source src={v.b.hero.small} type="video/mp4" media="(max-width: 820px)" /> : null}<source src={v.b.hero.src || v.b.heroVideo} type="video/mp4" /></video>')
assert 'v.b.hero.av1' in view
engine = engine.replace("      playFilm: () => { if (B.filmUrl) window.open(B.filmUrl, '_blank', 'noopener'); },\n", open(os.path.join(os.path.dirname(__file__), 'brand_film.js')).read())
assert 'film_vid' in engine
# a location with its own name (Refined at Blossom) shows it on the map card and in the locations index
for a, b in (("city: l.city + ', ' + l.st,", "city: l.name || (l.city + ', ' + l.st),"), ("name: B.name, a1: l.a1", "name: l.name || B.name, a1: l.a1")):
    assert engine.count(a) == 1, a
    engine = engine.replace(a, b)
os.makedirs(APP, exist_ok=True)
FILM = '{/* ============ LOCATIONS INDEX: only for multi-location brands ============ */}'  # Inside sits right after the stats
assert view.count(FILM) == 1
view = view.replace(FILM, '<Inside items={brand.inside} title={brand.insideTitle} where="The Experience" />\n\n' + FILM)
FOUNDER = '{/* ============ FOUNDER ============ */}'  # treatments index sits right before the founder
assert view.count(FOUNDER) == 1
view = view.replace(FOUNDER, '<Treatments groups={brand.treatments} where={brand.short} />\n\n' + FOUNDER)
open(APP + 'BrandView.tsx', 'w').write(view)
open(APP + 'brand.css', 'w').write(scss)
open(APP + 'engine.ts', 'w').write(engine)
print('missing assets', sorted(missing)); print('ok', len(view), len(scss), len(engine))
