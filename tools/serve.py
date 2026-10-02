#!/usr/bin/env python3
"""Local preview server that behaves like GitHub Pages.

    python3 tools/serve.py          # then open http://localhost:8000/

Unlike `python3 -m http.server`, this serves /about from about.html
(URLs without .html) and shows 404.html for pages that do not exist.
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        path = self.translate_path(self.path)

        if not os.path.exists(path) and os.path.isfile(path + '.html'):
            self.path = self.path.split('?')[0].split('#')[0] + '.html'
        elif not os.path.exists(path):
            return self.not_found()

        return super().send_head()

    def not_found(self):
        page = os.path.join(ROOT, '404.html')
        if not os.path.isfile(page):
            self.send_error(404)
            return None

        body = open(page, 'rb')
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(os.fstat(body.fileno()).st_size))
        self.end_headers()
        return body


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print('Serving MARC website at http://localhost:%d/' % port)
    ThreadingHTTPServer(('', port), Handler).serve_forever()
