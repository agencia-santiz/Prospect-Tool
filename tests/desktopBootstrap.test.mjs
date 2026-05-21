import assert from 'node:assert/strict';
import { createDesktopRuntimeEnv, resolveDesktopFrontendTarget, resolveDesktopRuntime } from '../desktop/runtime.js';

const runtime = resolveDesktopRuntime({
  frontendHost: 'localhost',
  frontendPort: '3001',
  backendHost: '127.0.0.1',
  backendPort: '8788',
});

assert.equal(runtime.frontendUrl, 'http://localhost:3001');
assert.equal(runtime.backendUrl, 'http://127.0.0.1:8788');
assert.equal(runtime.openDevTools, false);

const env = createDesktopRuntimeEnv(runtime, {});
assert.equal(env.BLOOM_DESKTOP_RUNTIME, '1');
assert.equal(env.BLOOM_FRONTEND_URL, 'http://localhost:3001');
assert.equal(env.BLOOM_BACKEND_URL, 'http://127.0.0.1:8788');
assert.equal(env.BLOOM_DESKTOP_OPEN_DEVTOOLS, '0');

const enabledRuntime = resolveDesktopRuntime({ openDevTools: true });
assert.equal(enabledRuntime.openDevTools, true);
const enabledEnv = createDesktopRuntimeEnv(enabledRuntime, {});
assert.equal(enabledEnv.BLOOM_DESKTOP_OPEN_DEVTOOLS, '1');

const urlTarget = resolveDesktopFrontendTarget({ frontendUrl: 'http://localhost:3001' });
assert.equal(urlTarget.type, 'url');
assert.equal(urlTarget.value, 'http://localhost:3001');

const fileTarget = resolveDesktopFrontendTarget({ frontendFile: 'dist/index.html' });
assert.equal(fileTarget.type, 'file');
assert.equal(fileTarget.value, 'dist/index.html');
