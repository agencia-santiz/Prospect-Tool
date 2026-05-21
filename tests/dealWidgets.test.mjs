import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const readSource = async (relativePath) => readFile(join(repoRoot, relativePath), 'utf8');

const widgetsSource = await readSource('src/components/dealWidgets.tsx');
assert.ok(widgetsSource.includes('export const StatusBadge'));
assert.ok(widgetsSource.includes('export const NextActionBlock'));
assert.ok(widgetsSource.includes('export const getDealAgeInfo'));
assert.ok(widgetsSource.includes('export const getDealPriorityInfo'));
assert.ok(widgetsSource.includes('Atualizado hoje'));
assert.ok(widgetsSource.includes('Há 1 dia'));
assert.ok(widgetsSource.includes('Sem atividade há'));
assert.ok(widgetsSource.includes('Prioridade alta'));
assert.ok(widgetsSource.includes('Prioridade média'));
assert.ok(widgetsSource.includes('tracking-[0.08em]'));

const leadCardSource = await readSource('src/components/LeadCard.tsx');
assert.ok(leadCardSource.includes('source_open_data'));
assert.ok(leadCardSource.includes('buildWhatsAppChatUrl'));
assert.ok(leadCardSource.includes('getWhatsAppStatus'));
assert.ok(!leadCardSource.includes('LeadCardVisibilityConfig'));

const modalSource = await readSource('src/components/DealDetailsModal.tsx');
assert.ok(modalSource.includes('NextActionBlock'));
assert.ok(modalSource.includes('const currentStageName'));
assert.ok(modalSource.includes('const dealAgeInfo'));
assert.ok(modalSource.includes('const dealPriorityInfo'));

console.log('Deal widgets checks passed.');
