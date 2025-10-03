import json
import os
base = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(base, "translations.json"), "r", encoding="utf-8") as f:
    translations = json.load(f)


valid_languages = set(translations["agriculture"].keys())

with open(os.path.join(base, "iso codes.txt"), "r", encoding="utf-8") as f:
    iso_codes = f.read().splitlines()


codepairs = {}


for code in iso_codes:
    two_letter, name = code.split("\t")
    if two_letter and name and two_letter in valid_languages:
        name = name.split(";")[0].split(",")[0].split("(")[0].strip()
        codepairs[two_letter] = name


# for k, v in codepairs.items():
#     print(v)

with open(os.path.join(base, "endonyms.json"), "r", encoding="utf-8") as f:
    endonyms = json.load(f)


print(set(codepairs.values()) - set([item["language"] for item in endonyms["languages"]]))

assert len(endonyms["languages"]) == 47

# Build reverse mapping: language name -> two-letter code
name_to_code = {name: code for code, name in codepairs.items()}

missing = []
for item in endonyms["languages"]:
    lang_name = item.get("language")
    iso = None
    if lang_name in name_to_code:
        iso = name_to_code[lang_name]
    else:
        # Fallback: try case-insensitive exact match
        for name, code in name_to_code.items():
            if name.lower() == (lang_name or '').lower():
                iso = code
                break
        # Fallback: try substring matches (e.g., 'Bokmål' vs 'Norwegian Bokmål')
        if not iso:
            for name, code in name_to_code.items():
                if (lang_name or '').lower() in name.lower() or name.lower() in (lang_name or '').lower():
                    iso = code
                    break

    if iso:
        item["iso"] = iso
    else:
        item["iso"] = None
        missing.append(lang_name)

if missing:
    print("Missing ISO for:", missing)
else:
    print("All languages matched to 2-letter ISO codes")

# Write updated endonyms back to file (overwrites the file)
# Normalize endonyms: run .title() on every endonym string
for item in endonyms["languages"]:
    end = item.get("endonym")
    if isinstance(end, str):
        try:
            item["endonym"] = end.title()
        except Exception:
            # If title() fails for any reason, leave original
            pass

with open(os.path.join(base, "endonyms.json"), "w", encoding="utf-8") as f:
    json.dump(endonyms, f, ensure_ascii=False, indent=2)