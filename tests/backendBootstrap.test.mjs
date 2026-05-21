import assert from 'node:assert/strict';
import { startBackend } from '../server/app.js';

const server = await startBackend({
  host: '127.0.0.1',
  port: 0,
  env: {
    ...process.env,
  },
});

try {
  const address = server.address();
  assert.ok(address && typeof address === 'object', 'server should expose an address');
  const port = address.port;
  assert.ok(port > 0, 'server should listen on a real port');

  const response = await fetch(`http://127.0.0.1:${port}/health`);
  assert.equal(response.status, 200);

  const payload = await response.json();
  assert.equal(payload.status, 'ok');
  assert.equal(payload.service, 'bloom-leads-api');
} finally {
  await new Promise((resolve) => {
    server.close(() => resolve());
  });
}

