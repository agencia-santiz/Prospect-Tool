import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const schemaPath = join(repoRoot, 'server/db/migrations/0001_initial.sql');
const schema = await readFile(schemaPath, 'utf8');

const requiredTables = [
  'users',
  'workspaces',
  'workspace_members',
  'searches',
  'companies',
  'company_sources',
  'leads',
  'saved_lists',
  'saved_list_items',
  'contacts',
  'pipelines',
  'pipeline_stages',
  'deals',
  'enrichment_jobs',
  'usage_events',
  'search_feedback',
];

assert.ok(schema.includes('CREATE EXTENSION IF NOT EXISTS pgcrypto'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS users'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS workspaces'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS searches'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS companies'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS leads'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS saved_lists'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS contacts'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS pipelines'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS deals'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS usage_events'));
assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS search_feedback'));

for (const tableName of requiredTables) {
  assert.ok(
    schema.includes(`CREATE TABLE IF NOT EXISTS ${tableName}`),
    `missing ${tableName} table`
  );
}

assert.ok(schema.includes("plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise'))"));
assert.ok(schema.includes("status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed'))"));
assert.ok(schema.includes("feedback_type text NOT NULL CHECK (feedback_type IN ('good_lead', 'duplicate', 'out_of_city', 'out_of_segment', 'no_contact'))"));
assert.ok(schema.includes('CREATE UNIQUE INDEX IF NOT EXISTS companies_workspace_place_id_idx'));
assert.ok(schema.includes('CREATE UNIQUE INDEX IF NOT EXISTS leads_workspace_company_idx'));
assert.ok(schema.includes('PRIMARY KEY (workspace_id, user_id)'));
