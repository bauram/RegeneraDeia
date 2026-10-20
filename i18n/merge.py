"""Pasa un lote de traducciones por índice (ca-N.json) a ca.json (inglés -> catalán)."""
import json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
en = json.load(open(os.path.join(D, 'en-strings.json')))
path = os.path.join(D, 'ca.json')
ca = json.load(open(path)) if os.path.exists(path) else {}
for f in sys.argv[1:]:
    for i, t in json.load(open(f)).items():
        ca[en[int(i)][0]] = t
    os.remove(f)
json.dump(ca, open(path, 'w'), ensure_ascii=False, indent=1)
print(len(ca), 'de', len(en), 'traducidos')
