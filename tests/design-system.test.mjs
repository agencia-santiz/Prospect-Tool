import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const source = await readFile(join(repoRoot, 'docs', 'DESIGN_SYSTEM.md'), 'utf8');

assert.ok(source.includes('# Bloom Leads Design System'));
assert.ok(source.includes('color.brand.primary'));
assert.ok(source.includes('font.family.display'));
assert.ok(source.includes('space.4'));
assert.ok(source.includes('PricingModal'));
assert.ok(source.includes('SettingsModal'));
assert.ok(source.includes('Common anatomy'));
assert.ok(source.includes('Open items [aberto]'));
