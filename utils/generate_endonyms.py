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