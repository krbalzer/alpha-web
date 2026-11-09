"""Convert a .dc.html board (markup + CSS + logic) into pieces for the Next app.
- markup -> JSX that reads from `v` (renderVals output), loops via .map, ifs via ternary
- css    -> scoped under a page class
- logic  -> the Component class, menu/cta injections stripped
"""
import re, json, sys, html

COMPS = {'x-nav': 'Nav', 'x-link': 'Link', 'x-queue': 'QueueBtn', 'x-epbar': 'EpisodeBar', 'x-homereel': 'HomeReel'}
VOID = {'img', 'hr', 'br', 'input', 'meta', 'link', 'source'}
ATTR_MAP = {'class': 'className', 'for': 'htmlFor', 'tabindex': 'tabIndex', 'stroke-width': 'strokeWidth',
            'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin', 'fill-rule': 'fillRule',
            'clip-rule': 'clipRule', 'viewbox': 'viewBox', 'autoplay': 'autoPlay', 'playsinline': 'playsInline',
            'srcset': 'srcSet', 'crossorigin': 'crossOrigin', 'maxlength': 'maxLength', 'readonly': 'readOnly',
            'colspan': 'colSpan', 'autocomplete': 'autoComplete', 'inputmode': 'inputMode', 'enterkeyhint': 'enterKeyHint', 'autofocus': 'autoFocus', 'novalidate': 'noValidate', 'frameborder': 'frameBorder', 'allowfullscreen': 'allowFullScreen', 'fetchpriority': 'fetchPriority', 'referrerpolicy': 'referrerPolicy', 'datetime': 'dateTime', 'rowspan': 'rowSpan', 'xlink:href': 'xlinkHref', 'stroke-dasharray': 'strokeDasharray',
            'stop-color': 'stopColor', 'stop-opacity': 'stopOpacity', 'font-size': 'fontSize', 'text-anchor': 'textAnchor',
            'onclick': 'onClick', 'oninput': 'onInput', 'onchange': 'onChange', 'onsubmit': 'onSubmit',
            'onmouseenter': 'onMouseEnter', 'onmouseleave': 'onMouseLeave', 'onkeydown': 'onKeyDown',
            'onpointerdown': 'onPointerDown', 'onpointermove': 'onPointerMove', 'onpointerup': 'onPointerUp', 'onscroll': 'onScroll'}
HOLE = re.compile(r'\{\{\s*([\w.$]+)\s*\}\}')


def expr(path, scope):
    root = path.split('.')[0]
    return path if root in scope else 'v.' + path


def attr_value(name, val, scope):
    holes = HOLE.findall(val)
    if not holes:
        if name == 'style':
            return '{' + style_obj(val, scope) + '}'
        return json.dumps(html.unescape(val))
    if name == 'style':
        return '{' + style_obj(val, scope) + '}'
    m = HOLE.fullmatch(val.strip())
    if m:
        return '{' + expr(m.group(1), scope) + '}'
    tpl = HOLE.sub(lambda m: '${' + expr(m.group(1), scope) + '}', html.unescape(val).replace('`', '\\`'))
    return '{`' + tpl + '`}'


def style_obj(s, scope):
    out = []
    for decl in re.split(r';(?![^(]*\))', s):
        if ':' not in decl:
            continue
        k, val = decl.split(':', 1)
        k, val = k.strip(), val.strip()
        key = k if k.startswith('--') else re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
        if HOLE.search(val):
            tpl = HOLE.sub(lambda m: '${' + expr(m.group(1), scope) + '}', val.replace('`', '\\`'))
            out.append(json.dumps(key) + ': `' + tpl + '`')
        else:
            out.append(json.dumps(key) + ': ' + json.dumps(html.unescape(val)))
    return '{' + ', '.join(out) + '} as React.CSSProperties'


TAG = re.compile(r'<!--.*?-->|</?[a-zA-Z][\w:-]*(?:\s+[^<>]*?)?/?>', re.S)
ATTR = re.compile(r'([\w:@.-]+)(?:\s*=\s*("([^"]*)"|\'([^\']*)\'))?')


def convert(markup):
    out, scope, pos = [], [], 0
    for m in TAG.finditer(markup):
        text = markup[pos:m.start()]
        pos = m.end()
        if text:
            t = text.replace('{', '&#123;').replace('}', '&#125;')
            t = re.sub(r'&#123;&#123;\s*([\w.$]+)\s*&#125;&#125;', lambda h: '{' + expr(h.group(1), scope) + '}', t)
            out.append(t)
        tag = m.group(0)
        if tag.startswith('<!--'):
            c = tag[4:-3].strip()
            out.append('{/* ' + c.replace('*/', '* /') + ' */}')
            continue
        closing = tag.startswith('</')
        name = re.match(r'</?([a-zA-Z][\w:-]*)', tag).group(1)
        if name == 'sc-for':
            if closing:
                scope.pop()
                out.append('</React.Fragment>))}')
            else:
                a = dict((k, (v1 or v2)) for k, _, v1, v2 in ATTR.findall(tag[len('<sc-for'):-1]))
                lst = HOLE.fullmatch(a['list']).group(1)
                alias = a['as']
                out.append('{(' + expr(lst, scope) + ' || []).map((' + alias + ': any, ' + alias + '_i: number) => (<React.Fragment key={' + alias + '_i}>')
                scope.append(alias)
            continue
        if name == 'sc-if':
            if closing:
                out.append('</>) : null}')
            else:
                a = dict((k, (v1 or v2)) for k, _, v1, v2 in ATTR.findall(tag[len('<sc-if'):-1]))
                val = HOLE.fullmatch(a['value']).group(1)
                out.append('{' + expr(val, scope) + ' ? (<>')
            continue
        if name == 'x-rich':
            if not closing:
                a = dict((k, (v1 or v2)) for k, _, v1, v2 in ATTR.findall(tag[len('<x-rich'):-1]))
                h = HOLE.fullmatch(a['html']).group(1)
                out.append('<div className=' + json.dumps(a.get('class', '')) + ' dangerouslySetInnerHTML={{ __html: ' + expr(h, scope) + ' }} />')
            continue
        orig = name
        name = COMPS.get(name, name)
        if closing:
            out.append('</' + name + '>')
            continue
        body = tag[len(orig) + 1:].rstrip('>').rstrip('/').strip()
        attrs = []
        for k, raw, v1, v2 in ATTR.findall(body):
            if k.startswith('hint-'):
                continue
            val = v1 if v1 or raw.startswith('"') else v2
            key = ATTR_MAP.get(k.lower(), k)
            if raw == '':
                attrs.append(key)
                continue
            if key == 'tabIndex' and re.fullmatch(r'-?\d+', val or ''):
                attrs.append(key + '={' + val + '}')
                continue
            attrs.append(key + '=' + attr_value(key, val or '', scope))
        selfclose = orig in VOID or tag.endswith('/>')
        out.append('<' + name + (' ' + ' '.join(attrs) if attrs else '') + (' />' if selfclose else '>'))
    out.append(markup[pos:])
    return ''.join(out)


def scope_css(css, cls):
    """Prefix every selector with .cls (skips @font-face, @keyframes, :root/body -> .cls)."""
    out, i, n = [], 0, len(css)

    def pref(sel):
        parts = []
        for s in sel.split(','):
            s = s.strip()
            if not s:
                continue
            if s in (':root', 'html', 'body'):
                parts.append('.' + cls)
            elif s.startswith(':root') or s.startswith('body'):
                parts.append('.' + cls + s[5 if s.startswith(':root') else 4:])
            else:
                parts.append('.' + cls + ' ' + s)
        return ','.join(parts)

    def block(css):
        res, i = [], 0
        while i < len(css):
            j = css.find('{', i)
            if j < 0:
                res.append(css[i:]); break
            head = css[i:j].strip()
            depth, k = 1, j + 1
            while depth and k < len(css):
                depth += {'{': 1, '}': -1}.get(css[k], 0); k += 1
            inner = css[j + 1:k - 1]
            if head.startswith('@media') or head.startswith('@supports') or head.startswith('@container'):
                res.append(head + '{' + block(inner) + '}')
            elif head.startswith('@'):
                res.append(head + '{' + inner + '}')
            else:
                res.append(pref(head) + '{' + inner + '}')
            i = k
        return '\n'.join(res)
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    return block(css)


def parse(path):
    t = open(path).read()
    css = re.search(r'<style>(.*?)</style>', t, re.S).group(1)
    body = t[t.index('</helmet>') + 9:t.rindex('</x-dc>')]
    js = re.search(r'data-dc-script[^>]*>(.*?)</script>', t, re.S).group(1)
    return css, body, js


def strip_injected(js):
    js = js.replace(', this.moVals())', ')')
    js = js.replace('renderVals() { return Object.assign(this._rv(), this.mnVals(), this.ctaVals()); }', '')
    js = js.replace('renderVals() { return Object.assign(this._rv(), this.mnVals()); }', '')
    for fn in ('ctaVals', 'mnVals', 'moVals'):
        m = re.search(r'\n  ' + fn + r'\(\) \{', js)
        if m:
            k, depth = js.index('{', m.start()) + 1, 1
            while depth:
                depth += {'{': 1, '}': -1}.get(js[k], 0); k += 1
            js = js[:m.start()] + js[k:]
    return js.replace('  _rv() {', '  renderVals() {', 1)
