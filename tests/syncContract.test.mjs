import assert from 'node:assert/strict';
import { buildSyncContract, getLocalOnlyEntityContracts, getSyncEntityContract, getSyncableEntityContracts } from '../src/utils/syncContract.js';

const contract = buildSyncContract();

assert.equal(contract.version, '2026-05-21');
assert.deepEqual(contract.pushOrder, ['workspace', 'pipeline', 'savedList', 'contact', 'deal']);
assert.deepEqual(contract.pullOrder, ['workspace', 'pipeline', 'savedList', 'contact', 'deal']);
assert.ok(contract.sharedEntities.every((entity) => entity.syncable));
assert.ok(contract.localOnlyEntities.every((entity) => !entity.syncable));
assert.equal(getSyncEntityContract('deal')?.storageKey, 'deals');
assert.equal(getSyncEntityContract('cardConfig')?.direction, 'local-only');
assert.equal(getSyncableEntityContracts().length, 5);
assert.equal(getLocalOnlyEntityContracts().length, 4);
