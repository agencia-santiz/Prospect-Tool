import assert from 'node:assert/strict';
import { resolveSyncConflict, resolveSyncConflictSet } from '../src/utils/syncConflict.js';

const local = { id: 'deal-1', updatedAt: '2026-05-21T01:00:00.000Z', title: 'Local' };
const newerRemote = { id: 'deal-1', updatedAt: '2026-05-21T01:05:00.000Z', title: 'Remote' };
const sameTimeRemote = { id: 'deal-1', updatedAt: '2026-05-21T01:00:00.000Z', title: 'Remote tie' };

const remoteWins = resolveSyncConflict({
  entityName: 'deal',
  localRecord: local,
  remoteRecord: newerRemote,
});

assert.equal(remoteWins.resolution, 'remote-newer-wins');
assert.equal(remoteWins.winner.title, 'Remote');
assert.equal(remoteWins.conflict, true);

const localWinsOnTie = resolveSyncConflict({
  entityName: 'deal',
  localRecord: local,
  remoteRecord: sameTimeRemote,
});

assert.equal(localWinsOnTie.resolution, 'local-wins-on-tie');
assert.equal(localWinsOnTie.winner.title, 'Local');

const localOnly = resolveSyncConflict({
  entityName: 'deal',
  localRecord: local,
  remoteRecord: null,
});

assert.equal(localOnly.resolution, 'local-only');
assert.equal(localOnly.conflict, false);

const resolvedSet = resolveSyncConflictSet([
  { entityName: 'deal', localRecord: local, remoteRecord: newerRemote },
  { entityName: 'workspace', localRecord: null, remoteRecord: { id: 'workspace-1', updatedAt: '2026-05-21T00:00:00.000Z' } },
]);

assert.equal(resolvedSet.length, 2);
assert.equal(resolvedSet[0].winner.title, 'Remote');
assert.equal(resolvedSet[1].resolution, 'remote-only');
