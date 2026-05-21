import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createDesktopPersistentStorage } from '../desktop/persistence.js';

const tempDir = await mkdtemp(path.join(os.tmpdir(), 'bloom-persistence-'));
const storePath = path.join(tempDir, 'persistent-state.json');

const store = createDesktopPersistentStorage(storePath);

assert.equal(store.getItem('missing'), null);

store.setItem('alpha', '1');
store.setItem('beta', JSON.stringify({ ok: true }));

assert.equal(store.getItem('alpha'), '1');
assert.equal(store.getItem('beta'), '{"ok":true}');

const persisted = JSON.parse(await readFile(storePath, 'utf8'));
assert.equal(persisted.alpha, '1');
assert.equal(persisted.beta, '{"ok":true}');

store.removeItem('alpha');
assert.equal(store.getItem('alpha'), null);

store.clear();
assert.equal(store.getItem('beta'), null);
