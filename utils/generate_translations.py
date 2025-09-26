labels = {
"agriculture": "🌱",
"budget": "🏦",
"economy": "💵",
"crime": "👮",
"education": "🎓",
"environment": "🌍",
"health": "🏥",
"housing": "🏠",
"infrastructure": "🏗",
"judiciary": "⚖️",
"labor": "👷",
"safety": "🛡️",
"transportation": "🚗"
}


import json
import os

base = os.path.dirname(os.path.abspath(__file__))

translations = {}

import json
import os

base = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(base, "translations.json"), "r", encoding="utf-8") as f:
    translations = json.load(f)


for item in labels:
    # translations[item] = {
    #     "emoji": labels[item],
    #     "en": item.capitalize()
    # }

    if "en" not in translations.get(item, {}):
        translations[item] = {
            "emoji": labels[item],
            "en": item.capitalize()
        }
    else:
        translations[item]["emoji"] = labels[item]
        translations[item]["en"] = item.capitalize()

lbl = "\n".join([translations[item]["en"] for item in translations])

import argostranslate.package

import glob

os.chdir(base)

for path in glob.glob("*.argosmodel"):
    argostranslate.package.install_from_path(os.path.join(base, path))


targets = [
      "ar",
      "az",
      "bg",
      "bn",
      "ca",
      "cs",
      "da",
      "de",
      "el",
      "en",
      "eo",
      "es",
      "et",
      "eu",
      "fa",
      "fi",
      "fr",
      "ga",
      "gl",
      "he",
      "hi",
      "hu",
      "id",
      "it",
      "ja",
      "ko",
      "ky",
      "lt",
      "lv",
      "ms",
      "nb",
      "nl",
      "pt-BR",
      "pl",
      "pt",
      "ro",
      "ru",
      "sk",
      "sl",
      "sq",
      "sr",
      "sv",
      "th",
      "tl",
      "tr",
      "uk",
      "ur",
      "vi",
      "zh-Hans",
      "zh-Hant"
]

loaded = translations["agriculture"].keys()
targets = [x for x in targets if x not in loaded]

print(targets, loaded)

import requests
for target in targets:
    x = requests.post("http://localhost:5000/translate", json={"q": lbl, "source": "en", "target": target})
    if x.status_code == 200:
        resp = x.json()
        lines = resp["translatedText"].split("\n")
        for i, item in enumerate(translations):
            translations[item][target] = lines[i]
        print(f"success with {target}")
    else:
        print(f"error with {target}: {x.text}")


with open(os.path.join(base, "translations.json"), "w", encoding="utf-8") as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)