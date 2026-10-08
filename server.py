"""Local web server for the choir game, including persistent lyric storage."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
LYRICS_FILE = ROOT / "testi.json"


class GameHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path == "/api/lyrics":
            try:
                lyrics = json.loads(LYRICS_FILE.read_text(encoding="utf-8"))
                if not isinstance(lyrics, dict):
                    lyrics = {}
            except (OSError, json.JSONDecodeError):
                lyrics = {}
            payload = json.dumps(lyrics, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/api/lyrics":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length < 1 or length > 1_000_000:
                self.send_error(413)
                return
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict) or not all(
                isinstance(key, str) and isinstance(value, str)
                for key, value in data.items()
            ):
                self.send_error(400, "Expected an object of song titles and lyrics")
                return
            LYRICS_FILE.write_text(
                json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
        except (ValueError, json.JSONDecodeError):
            self.send_error(400, "Invalid JSON")
            return
        except OSError:
            self.send_error(500, "Could not save lyrics")
            return
        self.send_response(204)
        self.end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8001), GameHandler)
    print("Server coro disponibile su http://127.0.0.1:8001")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
