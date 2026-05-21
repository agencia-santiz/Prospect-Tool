import assert from 'node:assert/strict';
import { appendWorkspaceOutboxRecords, buildWorkspaceMutationRecords, readWorkspaceOutbox, writeWorkspaceOutbox } from '../src/utils/mutationOutbox.js';

const makeStorage = () => {
  const store = new Map();

  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    dump: () => Object.fromEntries(store.entries()),
  };
};

const originalWindow = globalThis.window;
globalThis.window = { localStorage: makeStorage() };

try {
  const previousState = {
    savedLists: [{ id: 'list-1', name: 'Lista 1' }],
    contacts: [{ id: 'contact-1', name: 'Contato 1' }],
    pipelines: [{ id: 'pipeline-1', name: 'Pipeline 1' }],
    deals: [{ id: 'deal-1', companyName: 'Empresa 1' }],
  };
  const nextState = {
    savedLists: [{ id: 'list-1', name: 'Lista 1 atualizada' }, { id: 'list-2', name: 'Lista 2' }],
    contacts: [],
    pipelines: [{ id: 'pipeline-1', name: 'Pipeline 1' }],
    deals: [{ id: 'deal-1', companyName: 'Empresa 1' }],
  };

  const records = buildWorkspaceMutationRecords('workspace-1', previousState, nextState);

  assert.ok(records.some((record) => record.entity === 'savedList' && record.operation === 'update'));
  assert.ok(records.some((record) => record.entity === 'savedList' && record.operation === 'create'));
  assert.ok(records.some((record) => record.entity === 'contact' && record.operation === 'delete'));

  const queued = appendWorkspaceOutboxRecords('workspace-1', records);
  assert.equal(queued.length, records.length);

  const persisted = readWorkspaceOutbox('workspace-1');
  assert.equal(persisted.length, records.length);
  assert.ok(persisted.every((record) => record.status === 'pending'));

  writeWorkspaceOutbox('workspace-2', records.slice(0, 1));
  assert.equal(readWorkspaceOutbox('workspace-2').length, 1);
} finally {
  globalThis.window = originalWindow;
}
