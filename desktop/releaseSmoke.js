import path from 'node:path';
import { readFile, readdir, stat } from 'node:fs/promises';
import {
  parseDesktopUpdateArtifactName,
  resolveDesktopFeedConfig,
  stageDesktopFeed,
} from './feed.js';

const normalizeArtifactName = (value) => String(value || '')
  .toLowerCase()
  .replace(/[\s-]+/g, '');

const findMatchingArtifactName = async (releaseDir, expectedArtifactName) => {
  const expected = String(expectedArtifactName || '').trim();
  const entries = await readdir(releaseDir, { withFileTypes: true });

  const exactMatch = entries.find((entry) => entry.isFile() && entry.name === expected);
  if (exactMatch) {
    return exactMatch.name;
  }

  const normalizedExpected = normalizeArtifactName(expected);
  const fuzzyMatch = entries.find((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.exe') && normalizeArtifactName(entry.name) === normalizedExpected);
  return fuzzyMatch ? fuzzyMatch.name : expected;
};

export const validateDesktopReleaseArtifacts = async (releaseDir) => {
  const absoluteReleaseDir = path.resolve(releaseDir);
  const manifestPath = path.join(absoluteReleaseDir, 'latest.yml');
  const manifestText = await readFile(manifestPath, 'utf8');
  const manifestArtifactName = parseDesktopUpdateArtifactName(manifestText);
  const artifactName = await findMatchingArtifactName(absoluteReleaseDir, manifestArtifactName);
  const installerPath = path.join(absoluteReleaseDir, artifactName);
  const blockMapPath = `${installerPath}.blockmap`;

  await stat(installerPath);
  await stat(blockMapPath);

  return {
    releaseDir: absoluteReleaseDir,
    manifestPath,
    manifestArtifactName,
    artifactName,
    installerPath,
    blockMapPath,
  };
};

export const runDesktopReleaseSmoke = async (overrides = {}) => {
  const config = resolveDesktopFeedConfig(overrides);
  const releaseArtifacts = await validateDesktopReleaseArtifacts(config.releaseDir);
  const feedArtifacts = await stageDesktopFeed(config);

  await stat(path.join(feedArtifacts.feedDir, 'latest.yml'));

  return {
    ...releaseArtifacts,
    ...feedArtifacts,
  };
};
