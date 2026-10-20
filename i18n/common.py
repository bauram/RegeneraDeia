"""Utilidades compartidas para extraer y sustituir textos (EN -> CA)."""
import re, html, glob, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Titulares animados de Framer: cada letra en un <span>, cada palabra en un <span nowrap>.
LETTER = r'<span style="display: inline-block;[^"]*">[^<]{1,8}</span>'
WORD = r'<span style="white-space: (?:nowrap|unset);">(?:' + LETTER + r')+</span>'
RUN = re.compile(WORD + r'(?:\s+' + WORD + r')*')
LETTER_RE = re.compile(r'<span style="(display: inline-block;[^"]*)">([^<]{1,8})</span>')
SPLIT_RE = re.compile(r'<span data-i18n-split="([^"]*)">([^<]*)</span>')

def collapse(m):
    words = re.findall(WORD, m.group(0))
    style = LETTER_RE.search(m.group(0)).group(1)
    text = ' '.join(''.join(l for _, l in LETTER_RE.findall(w)) for w in words)
    return '<span data-i18n-split="%s">%s</span>' % (style, text)

# Frases animadas palabra a palabra: <span>Made</span> <span>from</span> ...
WS = '<span style="display: inline-block;">'
WRUN = re.compile(WS + r'[^<\s]+</span>(?: ' + WS + r'[^<\s]+</span>){2,}')
WORDS_RE = re.compile(r'<span data-i18n-words="">([^<]*)</span>')

def normalize(s):
    s = RUN.sub(collapse, s)
    return WRUN.sub(lambda m: '<span data-i18n-words="">%s</span>' % ' '.join(re.findall(r'">([^<]+)</span>', m.group(0))), s)

def expand(s):
    def ex(m):
        style, text = m.group(1), m.group(2)
        letters = lambda w: ''.join('<span style="%s">%s</span>' % (style, html.escape(ch, quote=False)) for ch in html.unescape(w))
        return ' '.join('<span style="white-space: nowrap;">%s</span>' % letters(w) for w in text.split())
    s = SPLIT_RE.sub(ex, s)
    return WORDS_RE.sub(lambda m: ' '.join(WS + '%s</span>' % w for w in m.group(1).split()), s)

# Bloques sin texto visible traducible
PROTECT = re.compile(r'<(script|style|svg|noscript)\b.*?</\1>', re.S | re.I)
TEXT = re.compile(r'>([^<]+)<')
ATTR = re.compile(r'''(\s(?:alt|placeholder|aria-label|title)=)(["'])(.*?)\2''')
META = re.compile(r'''(<meta\s[^>]*(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]*content=)(["'])(.*?)\2''')
TITLE = re.compile(r'(<title>)(.*?)(</title>)', re.S)

def pages():
    return sorted(glob.glob(os.path.join(ROOT, '*.html'))) + sorted(glob.glob(os.path.join(ROOT, 'blog', '*.html')))

def translatable(t):
    return any(c.isalpha() for c in t)

def process(s, fn):
    """Aplica fn(texto_plano) -> texto_plano a cada texto traducible del HTML ya normalizado."""
    # <title> lo cubre el paso de textos (>...<)
    s = META.sub(lambda m: m.group(1) + m.group(2) + html.escape(fn(html.unescape(m.group(3)))) + m.group(2), s)
    parts, out, last = PROTECT.finditer(s), [], 0
    chunks = []
    for m in parts:
        chunks.append((s[last:m.start()], True)); chunks.append((m.group(0), False)); last = m.end()
    chunks.append((s[last:], True))
    for c, ok in chunks:
        if not ok:
            out.append(c); continue
        def tx(m):
            raw = m.group(1); t = html.unescape(raw).strip()
            if not t or not translatable(t): return m.group(0)
            lead = raw[:len(raw) - len(raw.lstrip())]; trail = raw[len(raw.rstrip()):]
            return '>' + lead + html.escape(fn(t), quote=False) + trail + '<'
        def ta(m):
            t = html.unescape(m.group(3)).strip()
            if not t or not translatable(t): return m.group(0)
            return m.group(1) + m.group(2) + html.escape(fn(t)) + m.group(2)
        c = ATTR.sub(ta, c)
        c = TEXT.sub(tx, c)
        out.append(c)
    return ''.join(out)
