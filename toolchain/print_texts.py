import os
import json
import re
import requests
import sys


def load_languages():
    try:
        return requests.get('http://localhost:5000/languages', timeout=5).json()
    except Exception:
        base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        with open(os.path.join(base, 'backend', 'languages.json'), 'r', encoding='utf-8') as f:
            return json.load(f)


def extract_translated_text(orig, resp_json):
    if resp_json is None:
        return ''
    if isinstance(resp_json, str):
        return resp_json
    if isinstance(resp_json, dict):
        if "alternatives" in resp_json and resp_json["translatedText"] == orig:
            alternatives = resp_json.get("alternatives")
            if isinstance(alternatives, list) and alternatives:
                return alternatives[0]
        for key in ('translatedText', 'translation', 'text', 'translated'):
            val = resp_json.get(key)
            if isinstance(val, str):
                return val
        data = resp_json.get('data') if isinstance(resp_json.get('data'), dict) else None
        if data:
            translations = data.get('translations')
            if isinstance(translations, list) and translations:
                first = translations[0]
                if isinstance(first, dict) and 'translatedText' in first:
                    return first['translatedText']
        
        # fallback: return first string value
        for v in resp_json.values():
            if isinstance(v, str):
                return v
        return json.dumps(resp_json, ensure_ascii=False)
    return str(resp_json)


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    log_path = os.path.join(base, 'backend', 'logs', 'texts.log')

    languages = load_languages()
    iso_codes = list(languages.keys())

    try:
        with open(log_path, 'r', encoding='utf-8') as f:
            lines = [ln for ln in f.read().split('\n') if ln is not None]
    except FileNotFoundError:
        print('Log file not found:', log_path, file=sys.stderr)
        return

    # match leading characters that are NOT ASCII printable (space through ~)
    leading_non_ascii_re = re.compile(r'^[^\x20-\x7E]+')
    rtl_codes = {'ar', 'he', 'fa', 'ur'}

    for target in iso_codes:
        for line in lines:
            if not line:
                continue

            prefix = ''
            rest = line
            if target in rtl_codes:
                m = leading_non_ascii_re.match(line)
                if m:
                    prefix = m.group(0)
                    rest = line[len(prefix):]

            payload = {'q': rest, 'source': 'en', 'target': target, 'alternatives': 3}

            try:
                r = requests.post('https://translate.civiclens.app/translate', json=payload, timeout=10)
                resp_json = r.json()
                # input(resp_json)
            except Exception as e:
                print('translate request failed for', target, e, file=sys.stderr)
                continue

            translated = extract_translated_text(rest, resp_json)

            if prefix:
                translated = translated + prefix[::-1]

            print(translated)
        input()


if __name__ == '__main__':
    main()