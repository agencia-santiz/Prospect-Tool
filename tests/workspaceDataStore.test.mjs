import assert from 'node:assert/strict';
import { readWorkspaceData, writeWorkspaceData, clearWorkspaceData } from '../src/utils/workspaceDataStore.js';

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
    clear: () => {
      store.clear();
    },
    dump: () => new Map(store),
  };
};

const originalWindow = globalThis.window;
const localStorage = makeStorage();

globalThis.window = { localStorage };

try {
  const workspaceId = 'workspace-1';
  const payload = {
    savedLists: [
      {
        id: 'list-1',
        name: 'Lista 1',
        createdAt: '2026-05-09T12:00:00.000Z',
        leads: [{ id: 'lead-1', nome_fantasia: 'ACME', cidade: 'São Paulo' }],
        params: { city: 'São Paulo', segment: 'Software' },
      },
    ],
    contacts: [
      { id: 'lead-1', nome_fantasia: 'ACME', cidade: 'São Paulo' },
    ],
    pipelines: [
      { id: 'pipeline-1', name: 'Funil', stages: [{ id: 'stage-1', name: 'Novo', color: '#000' }] },
    ],
    deals: [
      { id: 'deal-1', companyName: 'ACME', pipelineId: 'pipeline-1', stageId: 'stage-1', tasks: [] },
    ],
  };

  writeWorkspaceData(workspaceId, payload);

  const storedValue = localStorage.getItem('bloom_workspace_state_v1:workspace-1');
  assert.ok(storedValue, 'workspace state should be stored');

  const roundTrip = readWorkspaceData(workspaceId);
  assert.equal(roundTrip?.savedLists.length, 1);
  assert.equal(roundTrip?.contacts.length, 1);
  assert.equal(roundTrip?.pipelines.length, 1);
  assert.equal(roundTrip?.deals.length, 1);
  assert.equal(roundTrip?.savedLists[0].name, 'Lista 1');

  clearWorkspaceData(workspaceId);
  assert.equal(localStorage.getItem('bloom_workspace_state_v1:workspace-1'), null);
} finally {
  globalThis.window = originalWindow;
}
