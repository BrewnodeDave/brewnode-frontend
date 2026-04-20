#!/usr/bin/env node

const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');
const path = require('path');

const app = express();
const proxy = httpProxy.createProxyServer({});

const FRONTEND_PORT = 3000;
const BACKEND_URL = 'http://localhost:8080';
const DIST_DIR = path.join(__dirname, 'dist');

// Proxy specific backend endpoints
const backendEndpoints = [
  '/sensorStatus',
  '/systemStatus',
  '/brewing',
  '/brewdata',
  '/brewname',
  '/equipment',
  '/mysql',
  '/i2c',
  '/restart',
  '/deleteLogs',
  '/docs',
  '/api-docs',
  '/batches',
  '/recipes',
  '/inventory',
  '/stream',
  '/fan',
  '/pumps',
  '/pump',
  '/valve',
  '/valves',
  '/boil',
  '/chill',
  '/ferment',
  '/fill',
  '/k2f',
  '/k2m',
  '/m2k',
  '/mash',
  '/kettleTemp',
  '/heat',
  '/glycol',
  '/kettleVolume',
  '/speedFactor',
  '/recirculate',
  '/activeFermenter',
  '/logs',
  '/streamLog'
];

// Serve static files from dist
app.use(express.static(DIST_DIR));

// Proxy API requests to backend - any request starting with these paths
app.use((req, res, next) => {
  const shouldProxy = backendEndpoints.some(endpoint => req.url.startsWith(endpoint));
  if (shouldProxy) {
    proxy.web(req, res, { target: BACKEND_URL });
  } else {
    next();
  }
});

// Fallback to index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Error handling for proxy
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Bad Gateway - Backend server not available');
});

const server = app.listen(FRONTEND_PORT, () => {
  console.log(`✅ BrewNode Frontend server running on http://localhost:${FRONTEND_PORT}`);
  console.log(`📡 Proxying API requests to ${BACKEND_URL}`);
  console.log(`📁 Serving static files from ${DIST_DIR}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
