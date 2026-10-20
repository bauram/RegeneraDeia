"""Genera la versión catalana en /ca/ a partir de las páginas en inglés y de i18n/ca.json.
Uso: python3 i18n/build.py   (volver a ejecutar tras cambiar una página EN o una traducción)"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, pages, normalize, expand, process

ca = json.load(open(os.path.join(ROOT, 'i18n', 'ca.json')))
missing = set()
def tr(t):
    if t not in ca: missing.add(t); return t
    return ca[t]

ASSETS = r'(?:images|css|fonts|js)/'
SCRIPTS = ('lang.js', 'menu.js', 'widgets.js')

def add_script(s, prefix):
    for name in SCRIPTS:
        if 'js/' + name not in s:
            s = s.replace('</body>', '<script src="%sjs/%s" defer></script></body>' % (prefix, name), 1)
    return s

for f in pages():
    rel = os.path.relpath(f, ROOT)
    depth = rel.count('/')                     # 0 = raíz, 1 = blog/
    src = open(f, encoding='utf-8').read()
    # 1) Página EN: enlazar el selector y declarar la alternativa catalana
    up = '../' * depth
    en = add_script(src, up)
    alt = '<link rel="alternate" hreflang="ca" href="/ca/%s">' % rel
    if 'hreflang="ca"' not in en: en = en.replace('</head>', alt + '</head>', 1)
    if en != src: open(f, 'w', encoding='utf-8').write(en)
    # 2) Página CA
    s = expand(process(normalize(src), tr))
    s = re.sub(r'<html([^>]*)lang="en"', r'<html\1lang="ca"', s, count=1)
    # rutas de recursos un nivel más arriba (las de páginas se quedan dentro de /ca/)
    s = re.sub(r'((?:src|href|srcset|poster)=["\']|,\s*|url\(["\']?)((?:\.\./)*)(' + ASSETS + ')',
               lambda m: m.group(1) + '../' + m.group(2) + m.group(3), s)
    s = s.replace('</head>', '<link rel="alternate" hreflang="en" href="/%s"></head>' % rel, 1)
    s = add_script(s, '../' + up)
    out = os.path.join(ROOT, 'ca', rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(s)

print('Generadas', len(pages()), 'páginas en /ca/')
if missing: print('SIN TRADUCIR:', len(missing), list(missing)[:10])
