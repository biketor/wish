/* Minimal static file server with two custom endpoints:
   - POST /inform -> returns JSON {status: "ok"}
   - GET /.well-known/appspecific/com.chrome.devtools.json -> returns 204 (no content)

   Usage:
     node server.js 8080
   If no port is provided it uses 8080.
*/

const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const port = process.argv[2] ? Number(process.argv[2]) : 8080;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(filePath).pipe(res);
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Not found');
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const pathname = url.pathname;

  // Log requests concisely
  console.log(`${new Date().toISOString()} "${method} ${pathname}" "${req.headers['user-agent'] || ''}"`);

  // Custom endpoints to avoid 404 noise
  if (method === 'POST' && pathname === '/inform') {
    // Consume body (if any) and respond 200
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('POST /inform body:', body || '<empty>');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'ok' }));
    });
    return;
  }

  if (method === 'GET' && pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
    // Some clients probe this. Reply with 204 No Content to silence logs.
    res.writeHead(204);
    res.end();
    return;
  }

  // Map root and directory requests
  let filePath = pathname === '/' ? '/index.html' : pathname;

  // Prevent path traversal
  const safePath = path.normalize(path.join(root, filePath)).replace(/\\/g, '/');
  if (!safePath.startsWith(root.replace(/\\/g, '/'))) {
    notFound(res);
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err) {
      notFound(res);
      return;
    }
    if (stats.isDirectory()) {
      const index = path.join(safePath, 'index.html');
      fs.stat(index, (ie, istats) => {
        if (ie || !istats.isFile()) { notFound(res); return; }
        sendFile(res, index);
      });
      return;
    }
    if (stats.isFile()) {
      sendFile(res, safePath);
      return;
    }
    notFound(res);
  });
});

server.listen(port, () => {
  console.log(`Static server listening on http://localhost:${port}`);
});
