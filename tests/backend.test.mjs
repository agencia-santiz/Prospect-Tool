import assert from 'node:assert/strict';
import { once } from 'node:events';
import { startBackend } from '../server/app.js';
import { createLogger } from '../server/logger.js';

const logLines = [];
const logger = createLogger({
  sink: (line) => {
    logLines.push(line);
  },
});

const server = await startBackend({
  host: '127.0.0.1',
  port: 0,
  env: {},
  logger,
  services: {
    searchOrchestrator: {
      runSearch: async () => {
        const error = new Error('GEMINI_API_KEY is not configured on the backend');
        error.code = 'MISSING_GEMINI_API_KEY';
        throw error;
      },
    },
  },
});
const address = server.address();
assert.ok(address && typeof address === 'object', 'the backend should expose a bound address');

const baseUrl = `http://127.0.0.1:${address.port}`;

try {
  const healthResponse = await fetch(`${baseUrl}/health`);
  assert.equal(healthResponse.status, 200);
  assert.ok(healthResponse.headers.get('x-request-id'));
  const healthJson = await healthResponse.json();
  assert.equal(healthJson.status, 'ok');
  assert.equal(healthJson.service, 'bloom-leads-api');
  assert.equal(healthJson.version, '2026-05-05');
  assert.equal(typeof healthJson.uptimeMs, 'number');

  const versionResponse = await fetch(`${baseUrl}/version`);
  assert.equal(versionResponse.status, 200);
  const versionJson = await versionResponse.json();
  assert.equal(versionJson.service, 'bloom-leads-api');
  assert.equal(versionJson.version, '2026-05-05');
  assert.ok(Array.isArray(versionJson.modules));
  assert.ok(versionJson.modules.some((module) => module.name === 'auth' && module.status === 'active'));
  assert.ok(versionJson.modules.some((module) => module.name === 'workspace' && module.status === 'active'));
  assert.ok(versionJson.modules.some((module) => module.name === 'search' && module.status === 'active'));

  const rootResponse = await fetch(`${baseUrl}/`);
  assert.equal(rootResponse.status, 200);
  const rootJson = await rootResponse.json();
  assert.equal(rootJson.service, 'bloom-leads-api');
  assert.equal(rootJson.status, 'ok');
  assert.ok(rootJson.modules.some((module) => module.name === 'health'));
  assert.ok(rootJson.modules.some((module) => module.name === 'auth' && module.status === 'active'));
  assert.ok(rootJson.modules.some((module) => module.name === 'workspace' && module.status === 'active'));

  const missingResponse = await fetch(`${baseUrl}/missing`);
  assert.equal(missingResponse.status, 404);
  assert.ok(missingResponse.headers.get('x-request-id'));
  const missingJson = await missingResponse.json();
  assert.equal(missingJson.error, 'NOT_FOUND');
  assert.equal(missingJson.path, '/missing');
  assert.equal(typeof missingJson.requestId, 'string');

  const enrichResponse = await fetch(`${baseUrl}/search/enrich`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: 'Marilia - SP',
      segment: 'Papelaria',
      excludeNames: [],
      quantity: 2,
    }),
  });
  assert.equal(enrichResponse.status, 503);
  assert.ok(enrichResponse.headers.get('x-request-id'));
  const enrichJson = await enrichResponse.json();
  assert.equal(enrichJson.error, 'GEMINI_API_KEY_NOT_CONFIGURED');
  assert.equal(typeof enrichJson.requestId, 'string');

  const invalidJsonResponse = await fetch(`${baseUrl}/search/enrich`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '{invalid-json',
  });
  assert.equal(invalidJsonResponse.status, 400);
  assert.ok(invalidJsonResponse.headers.get('x-request-id'));
  const invalidJson = await invalidJsonResponse.json();
  assert.equal(invalidJson.error, 'INVALID_JSON');
  assert.equal(typeof invalidJson.requestId, 'string');

  const parsedLogs = logLines.map((line) => JSON.parse(line));
  assert.ok(parsedLogs.some((entry) => entry.event === 'request_started' && entry.level === 'info'));
  assert.ok(parsedLogs.some((entry) => entry.event === 'request_completed' && entry.statusCode === 200));
  assert.ok(parsedLogs.some((entry) => entry.event === 'request_not_found' && entry.level === 'warn'));
  assert.ok(parsedLogs.some((entry) => entry.event === 'request_invalid_json' && entry.statusCode === 400));
} finally {
  server.close();
  await once(server, 'close');
}
