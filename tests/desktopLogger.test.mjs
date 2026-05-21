import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createDesktopLogger } from '../desktop/logger.js';

const tempDir = await mkdtemp(path.join(os.tmpdir(), 'bloom-desktop-log-'));
const logDir = path.join(tempDir, 'logs');

const logger = createDesktopLogger({
  logDirectory: logDir,
  mirrorToStdout: false,
  maxBytes: 120,
  archiveCount: 5,
});

logger.info({ event: 'desktop_start', host: '127.0.0.1', port: 8787 });
logger.warn('desktop warning', { code: 'WARN_01' });
logger.error(new Error('boom'));
logger.info({ event: 'desktop_extra', payload: 'x'.repeat(200) });

const logFile = path.join(logDir, 'desktop.log');
const rotatedFiles = await readdir(logDir);
assert.ok(rotatedFiles.includes('desktop.log'));
assert.ok(rotatedFiles.some((file) => file === 'desktop.log.1' || file === 'desktop.log.2'));

const allFiles = rotatedFiles.filter((file) => file.startsWith('desktop.log'));
const allRecords = [];

for (const file of allFiles) {
  const text = await readFile(path.join(logDir, file), 'utf8');
  for (const line of text.trim().split('\n')) {
    if (line) {
      allRecords.push(JSON.parse(line));
    }
  }
}

assert.ok(allRecords.some((record) => record.event === 'desktop_start'));
assert.ok(allRecords.some((record) => record.event === 'desktop_log' && record.message === 'desktop warning'));
assert.ok(allRecords.some((record) => record.event === 'desktop_extra'));
assert.ok(allRecords.every((record) => record.level));
