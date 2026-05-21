import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { readFile as readPackageJson } from 'node:fs/promises';
import { runDesktopReleaseSmoke, validateDesktopReleaseArtifacts } from '../desktop/releaseSmoke.js';
import { resolveDesktopFeedUrl } from '../desktop/feed.js';

const packageJson = JSON.parse(await readPackageJson(path.resolve('.', 'package.json'), 'utf8'));
const appVersion = packageJson.version;
const installerName = `Bloom Leads Setup ${appVersion}.exe`;
const manifestName = `Bloom-Leads-Setup-${appVersion}.exe`;

const tempDir = await mkdtemp(path.join(os.tmpdir(), 'bloom-release-smoke-'));
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

const releaseArtifacts = await validateDesktopReleaseArtifacts(releaseDir);
assert.equal(releaseArtifacts.manifestArtifactName, manifestName);
assert.equal(releaseArtifacts.artifactName, installerName);
assert.equal(path.basename(releaseArtifacts.installerPath), installerName);

const smokeResult = await runDesktopReleaseSmoke({
  releaseDir,
  feedDir,
  feedPort: '8090',
  feedPath: 'windows-x64',
  feedHost: '127.0.0.1',
});

assert.equal(smokeResult.feedUrl, resolveDesktopFeedUrl({
  feedHost: '127.0.0.1',
  feedPort: 8090,
  feedPath: '/windows-x64',
}));

await stat(path.join(feedDir, 'latest.yml'));
await stat(path.join(feedDir, installerName));
await stat(path.join(feedDir, `${installerName}.blockmap`));
assert.equal(await readFile(path.join(feedDir, 'latest.yml'), 'utf8').then((text) => text.includes(`path: ${installerName}`)), true);
