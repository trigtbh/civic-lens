from __future__ import annotations
import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)

LOG_DIR = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, 'texts.log')
FILE_LOCK = threading.Lock()


@app.route('/collect-texts', methods=['POST'])
def collect_texts():
    try:
        payload = request.get_json(force=True)
        texts = payload.get('texts') if isinstance(payload, dict) else None
        source = payload.get('source') if isinstance(payload, dict) else None

        if not texts or not isinstance(texts, list):
            return jsonify({'error': 'invalid payload, expected {"texts": [..]}'}), 400

        # Write only the message strings themselves to the log, one per line.
        # Normalize newlines inside messages to spaces so each message stays on a single line.
        

        # Lock file writes to avoid concurrent append collisions.
        with FILE_LOCK:
            with open(LOG_FILE, 'a', encoding='utf-8') as f:
                for t in texts:
                    if not isinstance(t, str):
                        try:
                            t = str(t)
                        except Exception:
                            continue
                    line = t.replace('\n', ' ').replace('\r', ' ').strip()
                    if line:
                        f.write(line + '\n')

        return jsonify({'status': 'ok', 'count': len(texts)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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


if __name__ == '__main__':
    # Run single-threaded and disable the reloader to avoid multiple processes
    # which can also cause concurrent writes.
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=False, use_reloader=False)
