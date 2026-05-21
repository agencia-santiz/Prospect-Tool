import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBackendEnvironment } from '../server/env.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const viteConfig = await readFile(join(repoRoot, 'vite.config.ts'), 'utf8');
assert.ok(!viteConfig.includes('GEMINI_API_KEY'));
assert.ok(!viteConfig.includes('process.env.API_KEY'));
assert.ok(!viteConfig.includes('loadEnv('));

const frontendGeminiService = await readFile(join(repoRoot, 'src/services/geminiService.ts'), 'utf8');
assert.ok(!frontendGeminiService.includes('GoogleGenAI'));
assert.ok(!frontendGeminiService.includes('process.env.API_KEY'));
assert.ok(frontendGeminiService.includes('/search/enrich'));
assert.ok(!frontendGeminiService.includes('VITE_BACKEND_URL'));

const frontendApp = await readFile(join(repoRoot, 'src/App.tsx'), 'utf8');
assert.ok(!frontendApp.includes('fetchOpenDataLeads'));

const frontendFirebase = await readFile(join(repoRoot, 'src/lib/firebase.ts'), 'utf8');
assert.ok(frontendFirebase.includes('isDesktopRuntime'));
assert.ok(frontendFirebase.includes('!isDesktopRuntime'));

const tempDir = await mkdtemp(join(tmpdir(), 'bloom-env-'));

try {
  await writeFile(join(tempDir, '.env.local'), [
    'GEMINI_API_KEY=from-env-file',
    'BACKEND_PORT=9999',
    'BACKEND_HOST=127.0.0.1',
  ].join('\n'));

  const loadedEnv = await loadBackendEnvironment({ cwd: tempDir, baseEnv: { BACKEND_PORT: '8787' } });
  assert.equal(loadedEnv.GEMINI_API_KEY, 'from-env-file');
  assert.equal(loadedEnv.BACKEND_PORT, '8787');
  assert.equal(loadedEnv.BACKEND_HOST, '127.0.0.1');
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
