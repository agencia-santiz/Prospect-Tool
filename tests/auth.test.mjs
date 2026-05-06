import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { startBackend } from '../server/app.js';
import { createLogger } from '../server/logger.js';

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json();
  return { response, payload };
};

const tempDir = await mkdtemp(join(tmpdir(), 'bloom-auth-'));
const storePath = join(tempDir, 'auth-store.json');

const logger = createLogger({
  sink: () => {},
});

const startServer = async () => startBackend({
  host: '127.0.0.1',
  port: 0,
  env: {
    AUTH_STORE_PATH: storePath,
  },
  logger,
});

let server = await startServer();
let address = server.address();
assert.ok(address && typeof address === 'object', 'the auth backend should expose a bound address');

const baseUrl = `http://127.0.0.1:${address.port}`;

try {
  const adminLogin = await fetchJson(`${baseUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@admin.com',
      password: 'admin123',
    }),
  });

  assert.equal(adminLogin.response.status, 200);
  assert.equal(adminLogin.payload.user.email, 'admin@admin.com');
  assert.equal(adminLogin.payload.user.name, 'Admin');
  assert.equal(adminLogin.payload.user.plan, 'ENTERPRISE');
  assert.equal(adminLogin.payload.user.limit, 1000000);
  assert.equal(typeof adminLogin.payload.sessionToken, 'string');
  assert.equal(adminLogin.payload.workspace.name, 'Admin Workspace');
  assert.equal(adminLogin.payload.membership.role, 'owner');
  assert.equal(Array.isArray(adminLogin.payload.members), true);
  assert.equal(adminLogin.payload.members.length, 1);

  const adminWorkspace = await fetchJson(`${baseUrl}/workspaces/current`, {
    headers: {
      Authorization: `Bearer ${adminLogin.payload.sessionToken}`,
    },
  });

  assert.equal(adminWorkspace.response.status, 200);
  assert.equal(adminWorkspace.payload.workspace.name, 'Admin Workspace');
  assert.equal(adminWorkspace.payload.membership.role, 'owner');
  assert.equal(adminWorkspace.payload.members.length, 1);

  const adminLogout = await fetchJson(`${baseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminLogin.payload.sessionToken}`,
    },
  });

  assert.equal(adminLogout.response.status, 200);
  assert.equal(adminLogout.payload.ok, true);

  const register = await fetchJson(`${baseUrl}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'alice@example.com',
      password: 'StrongPass123!',
      name: 'Alice Bloom',
    }),
  });

  assert.equal(register.response.status, 201);
  assert.equal(register.payload.user.email, 'alice@example.com');
  assert.equal(register.payload.user.name, 'Alice Bloom');
  assert.equal(register.payload.user.plan, 'FREE');
  assert.equal(register.payload.user.usage, 0);
  assert.equal(register.payload.user.limit, 100);
  assert.ok(register.payload.workspace);
  assert.equal(register.payload.workspace.memberCount, 1);
  assert.equal(register.payload.membership.role, 'owner');
  assert.equal(register.payload.members.length, 1);
  assert.equal(typeof register.payload.sessionToken, 'string');
  assert.equal(register.payload.expiresAt.length > 0, true);

  const sessionToken = register.payload.sessionToken;

  server.close();
  await once(server, 'close');

  const persistedStore = JSON.parse(await readFile(storePath, 'utf8'));
  assert.ok(persistedStore.users.some((user) => user.email === 'admin@admin.com'));
  assert.ok(persistedStore.users.some((user) => user.email === 'alice@example.com'));
  assert.ok(persistedStore.workspaces.length >= 2);
  assert.ok(persistedStore.workspaceMembers.length >= 2);
  assert.equal(persistedStore.sessions.length, 1);

  server = await startServer();
  address = server.address();
  assert.ok(address && typeof address === 'object', 'the restarted auth backend should expose a bound address');
  const restartedBaseUrl = `http://127.0.0.1:${address.port}`;

  const session = await fetchJson(`${restartedBaseUrl}/auth/session`, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  assert.equal(session.response.status, 200);
  assert.equal(session.payload.user.email, 'alice@example.com');
  assert.equal(session.payload.user.name, 'Alice Bloom');
  assert.equal(session.payload.workspace.memberCount, 1);
  assert.equal(session.payload.membership.role, 'owner');

  const login = await fetchJson(`${restartedBaseUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'alice@example.com',
      password: 'StrongPass123!',
    }),
  });

  assert.equal(login.response.status, 200);
  assert.equal(login.payload.user.email, 'alice@example.com');
  assert.notEqual(login.payload.sessionToken, sessionToken);
  assert.equal(login.payload.workspace.memberCount, 1);
  assert.equal(login.payload.members.length, 1);

  const logout = await fetchJson(`${restartedBaseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${login.payload.sessionToken}`,
    },
  });

  assert.equal(logout.response.status, 200);
  assert.equal(logout.payload.ok, true);

  const afterLogout = await fetchJson(`${restartedBaseUrl}/auth/session`, {
    headers: {
      Authorization: `Bearer ${login.payload.sessionToken}`,
    },
  });

  assert.equal(afterLogout.response.status, 401);
  assert.equal(afterLogout.payload.error, 'SESSION_NOT_FOUND');

  const invalidLogin = await fetchJson(`${restartedBaseUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'alice@example.com',
      password: 'wrong-password',
    }),
  });

  assert.equal(invalidLogin.response.status, 401);
  assert.equal(invalidLogin.payload.error, 'INVALID_CREDENTIALS');
} finally {
  server.close();
  await once(server, 'close');
}
