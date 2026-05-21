import assert from 'node:assert/strict';
import { resolveWorkspaceSyncState } from '../src/utils/workspaceSyncState.js';

const remoteSynced = resolveWorkspaceSyncState({
  isAuthenticated: true,
  workspaceOrigin: 'remote',
  isOnline: true,
  pendingMutationCount: 0,
  workspaceId: 'workspace-1',
  workspaceSlug: 'acme',
});

assert.equal(remoteSynced.status, 'synced');
assert.equal(remoteSynced.variant, 'success');
assert.equal(remoteSynced.label, 'Sincronizado');

const pending = resolveWorkspaceSyncState({
  isAuthenticated: true,
  workspaceOrigin: 'remote',
  isOnline: true,
  pendingMutationCount: 3,
});

assert.equal(pending.status, 'pending');
assert.equal(pending.label, '3 pendentes');

const offline = resolveWorkspaceSyncState({
  isAuthenticated: true,
  workspaceOrigin: 'remote',
  isOnline: false,
  pendingMutationCount: 0,
});

assert.equal(offline.status, 'offline');
assert.equal(offline.variant, 'warning');

const local = resolveWorkspaceSyncState({
  isAuthenticated: true,
  workspaceOrigin: 'local',
  isOnline: true,
  pendingMutationCount: 0,
});

assert.equal(local.status, 'local');
assert.equal(local.detail, 'Sessão amarrada ao workspace local do desktop');
