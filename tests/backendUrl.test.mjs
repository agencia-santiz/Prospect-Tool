import assert from 'node:assert/strict';
import { getBackendBaseUrl, resolveBackendBaseUrl } from '../src/utils/backendUrl.js';

assert.equal(resolveBackendBaseUrl('localhost'), 'http://127.0.0.1:8787');
assert.equal(resolveBackendBaseUrl('127.0.0.1'), 'http://127.0.0.1:8787');
assert.equal(resolveBackendBaseUrl('example.com'), '/api');

const originalWindow = globalThis.window;
globalThis.window = {
  location: { hostname: 'example.com' },
  bloomDesktop: { backendUrl: 'http://127.0.0.1:9999' },
};

try {
  assert.equal(resolveBackendBaseUrl('example.com'), 'http://127.0.0.1:9999');
} finally {
  globalThis.window = originalWindow;
}

assert.equal(typeof getBackendBaseUrl(), 'string');
