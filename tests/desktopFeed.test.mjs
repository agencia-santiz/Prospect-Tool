import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { readFile as readFileSync } from 'node:fs/promises';
import {
  parseDesktopUpdateArtifactName,
  resolveDesktopFeedConfig,
  resolveDesktopFeedUrl,
  stageDesktopFeed,
} from '../desktop/feed.js';

const packageJson = JSON.parse(await readFileSync(path.resolve('.','package.json'), 'utf8'));
const appVersion = packageJson.version;
const installerName = `Bloom Leads Setup ${appVersion}.exe`;
const manifestName = `Bloom-Leads-Setup-${appVersion}.exe`;

const tempDir = await mkdtemp(path.join(os.tmpdir(), 'bloom-feed-test-'));
const releaseDir = path.join(tempDir, 'release');
const feedDir = path.join(tempDir, 'updates', 'windows-x64');

await mkdir(releaseDir, { recursive: true });

await writeFile(path.join(releaseDir, 'latest.yml'), [
  `version: ${appVersion}`,
  `path: ${manifestName}`,
  'sha512: abc123',
].join('\n'));
await writeFile(path.join(releaseDir, installerName), 'installer-binary');
await writeFile(path.join(releaseDir, `${installerName}.blockmap`), 'blockmap-data');

const config = resolveDesktopFeedConfig({
  releaseDir,
  feedDir,
  feedPort: '8090',
  feedPath: 'windows-x64',
  feedHost: '127.0.0.1',
});

assert.equal(config.feedPath, '/windows-x64');
assert.equal(resolveDesktopFeedUrl(config), 'http://127.0.0.1:8090/windows-x64');
assert.equal(parseDesktopUpdateArtifactName(await readFile(path.join(releaseDir, 'latest.yml'), 'utf8')), manifestName);

const result = await stageDesktopFeed(config);
assert.equal(result.artifactName, installerName);

await stat(path.join(feedDir, 'latest.yml'));
await stat(path.join(feedDir, installerName));
await stat(path.join(feedDir, `${installerName}.blockmap`));

assert.equal(await readFile(path.join(feedDir, 'latest.yml'), 'utf8').then((text) => text.includes(`path: ${installerName}`)), true);
