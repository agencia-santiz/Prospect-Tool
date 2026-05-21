import assert from 'node:assert/strict';
import { migrateLegacyBrowserStorage } from '../src/utils/legacyStorageMigration.js';

const makeStorage = (entries = {}) => {
  const store = new Map(Object.entries(entries));

  return {
    length: store.size,
    key: (index) => Array.from(store.keys())[index] || null,
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value));
      this.length = store.size;
    },
    dump: () => Object.fromEntries(store.entries()),
  };
};

const source = {
  length: 5,
  key: (index) => ['bloom_workspace_state_v1:workspace-1', 'nexus_card_visibility_config', 'nexus_whatsapp_status_overrides', 'ignored_key', 'bloom_auth_token'][index] || null,
  getItem: (key) => ({
    'bloom_workspace_state_v1:workspace-1': JSON.stringify({ savedLists: [{ id: 'list-1' }], contacts: [], pipelines: [], deals: [] }),
    nexus_card_visibility_config: JSON.stringify({ showId: false }),
    nexus_whatsapp_status_overrides: JSON.stringify({ lead_1: 'CONFIRMED' }),
    ignored_key: 'should-skip',
    bloom_auth_token: 'token-123',
  })[key] ?? null,
};

const targetEntries = {
  nexus_card_visibility_config: JSON.stringify({ showId: true }),
};

const target = {
  ...makeStorage(targetEntries),
  setItem(key, value) {
    this._store = this._store || new Map(Object.entries(targetEntries));
    this._store.set(key, String(value));
    this.length = this._store.size;
  },
  getItem(key) {
    this._store = this._store || new Map(Object.entries(targetEntries));
    return this._store.has(key) ? this._store.get(key) : null;
  },
  key(index) {
    this._store = this._store || new Map(Object.entries(targetEntries));
    return Array.from(this._store.keys())[index] || null;
  },
  dump() {
    this._store = this._store || new Map(Object.entries(targetEntries));
    return Object.fromEntries(this._store.entries());
  },
  length: Object.keys(targetEntries).length,
};

const report = migrateLegacyBrowserStorage({ sourceStorage: source, targetStorage: target });

assert.equal(report.migrated, true);
assert.ok(report.copiedKeys.includes('bloom_workspace_state_v1:workspace-1'));
assert.ok(report.copiedKeys.includes('nexus_whatsapp_status_overrides'));
assert.ok(report.copiedKeys.includes('bloom_auth_token'));
assert.equal(report.conflicts.length, 1);
assert.equal(report.conflicts[0].key, 'nexus_card_visibility_config');
assert.equal(target.getItem('bloom_workspace_state_v1:workspace-1') !== null, true);
assert.equal(target.getItem('nexus_whatsapp_status_overrides') !== null, true);
assert.equal(target.getItem('bloom_auth_token'), 'token-123');
assert.equal(target.getItem('nexus_card_visibility_config'), JSON.stringify({ showId: true }));
