"""Extrae los textos traducibles de todas las páginas EN -> i18n/en-strings.json"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, pages, normalize, process

seen = {}
for f in pages():
    rel = os.path.relpath(f, ROOT)
    process(normalize(open(f, encoding='utf-8').read()), lambda t: (seen.setdefault(t, rel), t)[1])
json.dump(list(seen.items()), open(os.path.join(ROOT, 'i18n', 'en-strings.json'), 'w'), ensure_ascii=False, indent=0)
print(len(seen), sum(len(k.split()) for k in seen))
