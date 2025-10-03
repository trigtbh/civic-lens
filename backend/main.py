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

@app.route('/languages', methods=['GET'])
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



@app.route("/translate", methods=["POST"])
def translate(): 
    # should match schema {source: str, target: str, text: str}
    data = request.json
    with open(os.path.join(base, "cached_translations.json"), "r", encoding="utf-8") as f:
        cached = json.load(f)
    pipeline = "en-" + data["target"]
    if pipeline in cached:
        if data["text"] in cached[pipeline]:
            return jsonify({"translation": cached[pipeline][data["text"]]}), 200
    else:
        cached[pipeline] = {}

    payload = {
        "q": data["text"],
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
            cached[pipeline][data["text"]] = translation
            with open(os.path.join(base, "cached_translations.json"), "w", encoding="utf-8") as f:
                json.dump(cached, f, ensure_ascii=False, indent=4)
            return jsonify({"translation": translation}), 200
    return jsonify({"error": "Translation failed"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=11111, debug=False, threaded=False, use_reloader=False)
