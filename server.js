const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const requestedPath = req.url === '/' ? '/index.html' : req.url;
  const safePath = path.normalize(requestedPath).replace(/^\.\.(\/|\\|$)/, '');
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
      return;
    }

    const extension = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
    });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Fraction app running at http://localhost:${port}`);
});
