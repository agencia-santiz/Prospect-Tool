import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const source = await readFile(join(repoRoot, 'src/domainContracts.ts'), 'utf8');
const doc = await readFile(join(repoRoot, 'docs/DOMAIN_CONTRACTS.md'), 'utf8');

assert.ok(source.includes("export const DOMAIN_CONTRACT_VERSION = '2026-05-05'"));
assert.ok(source.includes('export const DOMAIN_NAMES = ['));
assert.ok(source.includes("'search'"));
assert.ok(source.includes("'company'"));
assert.ok(source.includes("'lead'"));
assert.ok(source.includes("'contact'"));
assert.ok(source.includes("'deal'"));
assert.ok(source.includes("'pipeline'"));
assert.ok(source.includes("'workspace'"));
assert.ok(source.includes('export interface SearchContract'));
assert.ok(source.includes('export interface CompanyContract'));
assert.ok(source.includes('export interface LeadContract'));
assert.ok(source.includes('export interface ContactContract'));
assert.ok(source.includes('export interface DealContract'));
assert.ok(source.includes('export interface PipelineContract'));
assert.ok(source.includes('export interface WorkspaceContract'));
assert.ok(source.includes('export const DOMAIN_CONTRACTS'));

assert.ok(doc.includes('Domain Contracts'));
assert.ok(doc.includes('2026-05-05'));
assert.ok(doc.includes('src/domainContracts.ts'));
assert.ok(doc.includes('search'));
assert.ok(doc.includes('workspace'));
