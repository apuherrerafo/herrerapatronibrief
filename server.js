#!/usr/bin/env node
// Servidor estático mínimo (solo módulos de Node). Uso: node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8081;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
  let url = req.url === '/' ? '/index.html' : req.url;
  url = url.split('?')[0];
  const file = path.join(ROOT, url);
  const ext = path.extname(file);
  const type = MIME[ext] || 'application/octet-stream';

  fs.readFile(file, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      res.writeHead(500);
      res.end('Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('Serving!');
  console.log('Local: http://localhost:' + PORT + '/');
  console.log('Admin: http://localhost:' + PORT + '/admin');
});
