import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export function previewServer() {
  const root = fileURLToPath(new URL('../', import.meta.url));
  return createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const target = path.resolve(root, '.' + (pathname === '/' ? '/preview/index.html' : pathname));
      if (!target.startsWith(root)) { res.writeHead(403).end(); return; }
      const data = await readFile(target);
      res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.png': 'image/png' })[path.extname(target)] ?? 'text/plain; charset=utf-8');
      res.end(data);
    } catch { res.writeHead(404).end(); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  previewServer().listen(8766, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:8766'));
}
