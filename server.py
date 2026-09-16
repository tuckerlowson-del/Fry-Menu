#!/usr/bin/env python3
"""
Fry Menu shared server — all users on this link share the same data.
Run:  python server.py
Then open http://127.0.0.1:8080
"""

import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

# Railway/Render set PORT; local default 8080
PORT = int(os.environ.get("PORT", "8080"))
ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(ROOT, "shared_data.json")
LOCK = threading.Lock()

DEFAULT_DATA = {
    "members": [
        {
            "id": 1,
            "name": "Ford",
            "username": "ford",
            "password": "2580",
            "role": "owner",
            "fridayTakeout": 0,
            "budget": 0,
            "joined": "2024-01-01",
            "email": "owner@frymenu.com",
        }
    ],
    "debts": [],
    "chat": [],
    "orders": [],
    "warnings": [],
    "rules": [],
    "settings": {
        "shopOpen": True,
        "loansOpen": True,
        "chatOpen": True,
        "siteName": "Fry Menu",
        "welcomeMsg": "Welcome to Fry Menu",
    },
}


def load_data():
    with LOCK:
        if not os.path.exists(DATA_FILE):
            save_data_unlocked(DEFAULT_DATA)
            return json.loads(json.dumps(DEFAULT_DATA))
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return json.loads(json.dumps(DEFAULT_DATA))


def save_data_unlocked(data):
    tmp = DATA_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, DATA_FILE)


def save_data(data):
    with LOCK:
        save_data_unlocked(data)


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **getattr(SimpleHTTPRequestHandler, "extensions_map", {}),
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".svg": "image/svg+xml",
        ".json": "application/json",
        ".js": "application/javascript",
        ".css": "text/css",
        ".html": "text/html",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".ico": "image/x-icon",
        ".woff2": "font/woff2",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")

    def _json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._cors()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/health":
            self._json(200, {
                "ok": True,
                "shared": True,
                "root": ROOT,
                "has_css": os.path.isfile(os.path.join(ROOT, "css", "style.css")),
                "has_js": os.path.isfile(os.path.join(ROOT, "js", "app.js")),
                "has_index": os.path.isfile(os.path.join(ROOT, "index.html")),
                "bundled": True,
            })
            return
        if path == "/api/data":
            self._json(200, load_data())
            return
        if path == "/api/members":
            data = load_data()
            self._json(200, data.get("members", []))
            return
        if path == "/api/files":
            files = []
            for dirpath, _, filenames in os.walk(ROOT):
                for fn in filenames:
                    full = os.path.join(dirpath, fn)
                    rel = os.path.relpath(full, ROOT).replace("\\", "/")
                    if "shared_data" not in rel:
                        files.append(rel)
            self._json(200, {"root": ROOT, "files": sorted(files)})
            return
        # Digital Asset Links — required for PWABuilder APK to hide URL bar
        if path in ("/.well-known/assetlinks.json", "/assetlinks.json"):
            asset_path = os.path.join(ROOT, ".well-known", "assetlinks.json")
            if os.path.isfile(asset_path):
                with open(asset_path, "rb") as f:
                    body = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self._cors()
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
        return super().do_GET()

    def end_headers(self):
        # Avoid stale CSS/JS on mobile browsers after redeploy
        if self.path.endswith((".css", ".js", ".html")):
            self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def do_POST(self):
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw.decode("utf-8") or "{}")
        except Exception:
            self._json(400, {"error": "invalid json"})
            return

        if path == "/api/data":
            # Full replace of shared store (from client sync)
            if not isinstance(payload, dict):
                self._json(400, {"error": "expected object"})
                return
            data = load_data()
            for key in ("members", "debts", "chat", "orders", "warnings", "rules", "settings", "announcements"):
                if key in payload:
                    data[key] = payload[key]
            save_data(data)
            self._json(200, {"ok": True, "data": data})
            return

        if path == "/api/members":
            # Add or update one member
            data = load_data()
            members = data.get("members", [])
            name = str(payload.get("name", "")).strip()
            if not name:
                self._json(400, {"error": "name required"})
                return
            existing = next((m for m in members if m.get("name", "").lower() == name.lower()), None)
            if existing:
                # update fields but keep id/role unless provided
                for k, v in payload.items():
                    if k != "id":
                        existing[k] = v
                member = existing
            else:
                new_id = max([m.get("id", 0) for m in members] + [0]) + 1
                member = {
                    "id": new_id,
                    "name": name,
                    "username": payload.get("username") or name.lower().replace(" ", ""),
                    "password": payload.get("password") or "1234",
                    "role": payload.get("role") or "pending",
                    "fridayTakeout": payload.get("fridayTakeout") or 0,
                    "budget": payload.get("budget") or 0,
                    "joined": payload.get("joined") or __import__("datetime").date.today().isoformat(),
                    "email": payload.get("email") or "",
                }
                members.append(member)
            data["members"] = members
            save_data(data)
            self._json(200, {"ok": True, "member": member, "members": members})
            return

        self._json(404, {"error": "not found"})

    def log_message(self, fmt, *args):
        print("[fry-menu]", fmt % args)


def main():
    os.chdir(ROOT)
    if not os.path.exists(DATA_FILE):
        save_data(DEFAULT_DATA)
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print("=" * 50)
    print(" Fry Menu SHARED server")
    print(f" Listening on 0.0.0.0:{PORT}")
    print(" Data: shared_data.json (everyone on this link shares it)")
    print("=" * 50)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
