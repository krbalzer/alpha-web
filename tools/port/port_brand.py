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
b = sub(r'<div class="hero_media" aria-hidden="true"></div>\s*<div class="hero_shade" aria-hidden="true"></div>\s*<span class="hero_ph ph">.*?</span>',
        '<sc-if value="{{ hasVideo }}"><video class="hero_vid" src="{{ b.heroVideo }}" poster="{{ b.heroPoster }}" autoplay muted loop playsinline aria-hidden="true"></video></sc-if>'
        '<sc-if value="{{ noVideo }}"><div class="hero_media" aria-hidden="true"></div></sc-if>\n<div class="hero_shade" aria-hidden="true"></div>', b)
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
# stats only when filled
b = sub(r'(<!-- ============ STATS ============ -->\s*)(<section.*?</section>)', r'\1<sc-if value="{{ hasStats }}">\2</sc-if>', b)
# founder
b = b.replace('<img src="/_blob/661a270e1aad64eb71378028e78df048" alt="{{ b.founder }}">', '<sc-if value="{{ b.founderImg }}"><img src="{{ b.founderImg }}" alt="{{ b.founder }}" loading="lazy"></sc-if>')
b = sub(r'(<p class="founder_cred">\{\{ b.cred \}\}</p>\s*)<div class="body">.*?</div>', r'\1<x-rich class="body" html="{{ b.founderHtml }}"></x-rich>', b)
b = b.replace('<a class="btn" href="#founder" style="margin-top: 10px">Learn more</a>', '<x-link class="btn" href="{{ founderHref }}" style="margin-top: 10px">Learn more</x-link>')
b = sub(r'(<!-- ============ FOUNDER ============ -->\s*)(<section.*?</section>)', r'\1<sc-if value="{{ b.founder }}">\2</sc-if>', b)
# quote
b = sub(r'<blockquote>“.*?”</blockquote>', '<blockquote>“{{ b.quote }}”</blockquote>', b)
b = sub(r'(<!-- ============ QUOTE ============ -->\s*)(<section.*?</section>)', r'\1<sc-if value="{{ b.quote }}">\2</sc-if>', b)
# why alpha
b = b.replace('<h2 class="h3">[Why she chose Alpha, in her words.]</h2>', '<h2 class="h3">{{ b.whyHeadline }}</h2>')
b = sub(r'<div class="body"><p>\[Two short paragraphs.*?</div>', '<x-rich class="body" html="{{ b.whyHtml }}"></x-rich>', b)
b = sub(r'<div class="img ph" style="aspect-ratio: 4 / 5.2">.*?</div>',
        '<div class="img ph" style="aspect-ratio: 4 / 5.2"><sc-if value="{{ b.whyImg }}"><img class="fill" src="{{ b.whyImg }}" alt="" loading="lazy"></sc-if></div>', b)
b = sub(r'(<!-- ============ WHY ALPHA ============ -->\s*)(<section.*?</section>)', r'\1<sc-if value="{{ b.whyHeadline }}">\2</sc-if>', b)
# links
b = b.replace('<a class="btn hero_cta" href="#talk">Let\'s talk</a>', '<x-link class="btn hero_cta" href="/talk">Let\'s talk</x-link>')
b = b.replace('<a class="map_link" href="#network">See partner map</a>', '<x-link class="map_link" href="/locations">See partner map</x-link>')
b = b.replace('<a class="btn" href="#talk" style="margin-top: 10px">Let\'s talk</a>', '<x-link class="btn" href="/talk" style="margin-top: 10px">Let\'s talk</x-link>')
assert '#talk' not in b and '/_blob/' not in b, re.findall(r'href="#\w+"|/_blob/\w+', b)

b = b.replace('{{ founderLine }} / {{ servicesLine }}', '{{ metaLine }}')
jsx = convert(b)

# ---------- css ----------
c = css
c = re.sub(r'@font-face\{[^}]*\}', '', c)
c = c[:c.index('/* site menu (shared')] if '/* site menu (shared' in c else c
c = re.sub(r'/\* CTA background.*?(?=\.closer_media>h2)', '', c, flags=re.S)
c += '\n.hero_vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}\n.logo_img{height:26px;width:auto;display:block}\n.card_img img,.fill{width:100%;height:100%;object-fit:cover;display:block}\n.img{position:relative;overflow:hidden}\n.film{overflow:hidden}\n.film .fill{position:absolute;inset:0}\n'
scss = scope_css(c, 'pg-brand')

# ---------- logic ----------
e = strip_injected(js)
e = sub(r'  brand\(\) \{.*?\n  \}\n', '  brand() { return this.props.brand; }\n', e)
e = sub(r"      stats: \[.*?\n      \],\n", '      stats: B.stats, hasStats: B.stats.length > 0,\n', e)
e = e.replace("      b: B,\n", "      b: { ...B, sinceLine: B.since ? 'Partner since ' + B.since : '' },\n      metaLine: [[B.founder, B.cred].filter(Boolean).join(', '), B.services.join(' ')].filter(Boolean).join(' / '),\n      hasVideo: !!B.heroVideo, noVideo: !B.heroVideo,\n      founderHref: B.founderSlug ? '/founders/' + B.founderSlug : '/founders',\n      playFilm: () => { if (B.filmUrl) window.open(B.filmUrl, '_blank', 'noopener'); },\n", 1)
e = e.replace("cards: L.map((l, i) => ({ cls:", "cards: L.map((l, i) => ({ img: l.img, noImg: !l.img, cls:", 1)
e = e.replace("addrLine: L.map((l) => l.a1 + ', ' + l.a2).join(' / '),", "addrLine: L.map((l) => [l.a1, l.a2].filter(Boolean).join(', ')).join(' / '),", 1)
e = e.replace("founderLine: B.founder + ', ' + B.cred,", "founderLine: [B.founder, B.cred].filter(Boolean).join(', '),", 1)
assert "filter(Boolean).join(', ')).join" in e and "[B.founder, B.cred]" in e
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
import './brand.css'

export default function BrandView({ brand }: { brand: BrandData }) {
  const v = useDC(BrandEngine, { brand, singleLocation: false })
  return (
    <div className="pg-brand">
""" + jsx + """
    </div>
  )
}
"""
engine = "// @ts-nocheck\n/* Map engine + template logic from the Brand board. Production swap: Mapbox GL for the canvas map. */\nimport { DCLogic } from '@/lib/dc'\n\n" + e.strip() + "\n"

os.makedirs(APP, exist_ok=True)
open(APP + 'BrandView.tsx', 'w').write(view)
open(APP + 'brand.css', 'w').write(scss)
open(APP + 'engine.ts', 'w').write(engine)
print('ok', len(view), len(scss), len(engine))
