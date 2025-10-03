from __future__ import annotations
import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import requests

app = Flask(__name__)
CORS(app)


import json
base = os.path.dirname(os.path.abspath(__file__))

@app.route('/api/languages', methods=['GET'])
def get_languages():
    try:
        lang_path = os.path.join(os.path.dirname(__file__), 'languages.json')
        with open(lang_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'languages.json not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route("/api/translate", methods=["POST"])
def translate(): 
    # should match schema {source: str, target: str, text: str}
    data = request.json
    # Helper: split leading non-alphanumeric characters (prefix) from the rest (core).
    def _split_leading_prefix(s: str) -> tuple[str, str]:
        if not s:
            return "", ""
        for i, ch in enumerate(s):
            # isalnum covers Unicode letters and numbers
            if ch.isalnum():
                return s[:i], s[i:]
        # no alnum found -> everything is prefix
        return s, ""

    orig_text = data.get("text", "")
    prefix, core_text = _split_leading_prefix(orig_text)
    # Languages that are written RTL where we want the prefix appended on the right
    rtl_langs = {"ar", "fa", "he", "ur"}
    # If there's nothing left to translate, just return the prefix (original text)
    if core_text == "":
        return jsonify({"translation": prefix}), 200
    with open(os.path.join(base, "cached_translations.json"), "r", encoding="utf-8") as f:
        cached = json.load(f)
    pipeline = "en-" + data["target"]
    if pipeline in cached:
        if core_text in cached[pipeline]:
            # reattach prefix before returning
            cached_translation = cached[pipeline][core_text]
            if data.get("target") in rtl_langs and prefix:
                # append reversed prefix on the right for RTL targets
                return jsonify({"translation": cached_translation + prefix[::-1]}), 200
            return jsonify({"translation": prefix + cached_translation}), 200
    else:
        cached[pipeline] = {}

    payload = {
        "q": core_text,
        "source": "en",
        "target": data["target"],
        "alternatives": 1
    }

    resp = requests.post("https://translate.civiclens.app/translate", json=payload, timeout=10)

    if resp.status_code == 200:
        if len(resp.json().get("alternatives", [])) > 0:
            translation = resp.json()["alternatives"][0]
        else:
            translation = resp.json().get("translatedText")
        if translation:
            # store translation for the stripped/core text
            cached[pipeline][core_text] = translation
            with open(os.path.join(base, "cached_translations.json"), "w", encoding="utf-8") as f:
                json.dump(cached, f, ensure_ascii=False, indent=4)
            # reattach the original prefix when returning
            if data.get("target") in rtl_langs and prefix:
                return jsonify({"translation": translation + prefix[::-1]}), 200
            return jsonify({"translation": prefix + translation}), 200
    return jsonify({"error": "Translation failed"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=11111, debug=False, threaded=False, use_reloader=False)
