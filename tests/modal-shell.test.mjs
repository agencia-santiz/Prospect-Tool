import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const readSource = async (relativePath) => {
  return readFile(join(repoRoot, relativePath), 'utf8');
};

const shellSource = await readSource('src/components/ModalShell.tsx');
assert.ok(shellSource.includes('document.body.style.overflow = \'hidden\''));
assert.ok(shellSource.includes('Escape'));
assert.ok(shellSource.includes('role="dialog"'));
assert.ok(shellSource.includes('aria-modal="true"'));
assert.ok(shellSource.includes('tabIndex={-1}'));

const pricingSource = await readSource('src/components/PricingModal.tsx');
assert.ok(pricingSource.includes("import ModalShell from './ModalShell'"));
assert.ok(pricingSource.includes('<ModalShell'));
assert.ok(pricingSource.includes('upgrade-btn'));

const settingsSource = await readSource('src/components/SettingsModal.tsx');
assert.ok(settingsSource.includes("import ModalShell from './ModalShell'"));
assert.ok(settingsSource.includes('<ModalShell'));
assert.ok(settingsSource.includes('Concluir'));
