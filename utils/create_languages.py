import json
import os

base = os.path.dirname(os.path.abspath(__file__))

endonyms_path = os.path.join(base, 'endonyms.json')
out_path = os.path.join(base, 'languages.json')

with open(endonyms_path, 'r', encoding='utf-8') as f:
    endonyms = json.load(f)

languages = endonyms.get('languages', [])

result = {}
missing = []

for item in languages:
    iso = item.get('iso')
    if not iso:
        missing.append(item.get('language'))
        continue
    # copy other data except iso
    data = {k: v for k, v in item.items() if k != 'iso'}
    result[iso] = data

with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f'Wrote {len(result)} languages to {out_path}')
if missing:
    print('Skipped entries without iso:', missing)
