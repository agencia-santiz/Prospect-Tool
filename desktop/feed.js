import path from 'node:path';
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';

const DEFAULT_RELEASE_DIR = 'release';
const DEFAULT_FEED_DIR = path.join('updates', 'windows-x64');
const DEFAULT_FEED_PORT = 8090;
const DEFAULT_FEED_PATH = '/windows-x64';

const normalizeText = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

const normalizePort = (value, fallback) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.trunc(parsed);
};

const normalizePathSegment = (value, fallback) => {
  const trimmed = normalizeText(value);
  if (!trimmed) {
    return fallback;
  }

  const prefixed = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return prefixed.replace(/\/+$/, '') || fallback;
};

const normalizeArtifactName = (value) => String(value || '')
  .toLowerCase()
  .replace(/[\s-]+/g, '');

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

export const resolveDesktopFeedConfig = (overrides = {}) => {
  const releaseDir = normalizeText(overrides.releaseDir) || DEFAULT_RELEASE_DIR;
  const feedDir = normalizeText(overrides.feedDir) || DEFAULT_FEED_DIR;
  const feedPort = normalizePort(overrides.feedPort, DEFAULT_FEED_PORT);
  const feedPath = normalizePathSegment(overrides.feedPath, DEFAULT_FEED_PATH);
  const feedHost = normalizeText(overrides.feedHost) || '127.0.0.1';

  return {
    releaseDir,
    feedDir,
    feedPort,
    feedPath,
    feedHost,
  };
};

export const resolveDesktopFeedUrl = (config) => {
  const normalized = resolveDesktopFeedConfig(config);
  return `http://${normalized.feedHost}:${normalized.feedPort}${normalized.feedPath}`;
};

export const parseDesktopUpdateArtifactName = (latestYmlContents) => {
  const content = String(latestYmlContents || '');
  const match = content.match(/^\s*path:\s*(.+?)\s*$/m);
  return match ? match[1].trim() : '';
};

export const resolveDesktopFeedArtifactPaths = (config, artifactName) => {
  const normalized = resolveDesktopFeedConfig(config);
  const releaseDir = path.resolve(normalized.releaseDir);
  const feedDir = path.resolve(normalized.feedDir);
  const fileName = artifactName.trim();

  return {
    releaseDir,
    feedDir,
    latestSource: path.join(releaseDir, 'latest.yml'),
    latestTarget: path.join(feedDir, 'latest.yml'),
    artifactSource: path.join(releaseDir, fileName),
    artifactTarget: path.join(feedDir, fileName),
    blockMapSource: path.join(releaseDir, `${fileName}.blockmap`),
    blockMapTarget: path.join(feedDir, `${fileName}.blockmap`),
  };
};

export const stageDesktopFeed = async (config) => {
  const artifactName = config?.artifactName ? String(config.artifactName).trim() : '';
  const resolvedConfig = resolveDesktopFeedConfig(config);
  const releaseDir = path.resolve(resolvedConfig.releaseDir);
  const feedDir = path.resolve(resolvedConfig.feedDir);

  if (releaseDir === feedDir) {
    throw new Error('releaseDir and feedDir must not be the same path');
  }

  const latestSource = path.join(releaseDir, 'latest.yml');
  const latestContents = await readFile(latestSource, 'utf8');
  const resolvedArtifactName = artifactName || parseDesktopUpdateArtifactName(latestContents);
  if (!resolvedArtifactName) {
    throw new Error(`Unable to locate the installer file name in ${latestSource}`);
  }

  const actualArtifactName = await findMatchingArtifactName(releaseDir, resolvedArtifactName);

  const paths = resolveDesktopFeedArtifactPaths(
    {
      releaseDir,
      feedDir,
      feedPort: resolvedConfig.feedPort,
      feedPath: resolvedConfig.feedPath,
      feedHost: resolvedConfig.feedHost,
    },
    actualArtifactName
  );

  const manifestContents = actualArtifactName === resolvedArtifactName
    ? latestContents
    : latestContents.replace(new RegExp(escapeRegExp(resolvedArtifactName), 'g'), actualArtifactName);

  await rm(feedDir, { recursive: true, force: true });
  await mkdir(feedDir, { recursive: true });
  await writeFile(paths.latestTarget, manifestContents);
  await copyFile(paths.artifactSource, paths.artifactTarget);

  const blockMapExists = await stat(paths.blockMapSource).then(() => true).catch(() => false);
  if (blockMapExists) {
    await copyFile(paths.blockMapSource, paths.blockMapTarget);
  }

  return {
    artifactName: actualArtifactName,
    feedDir,
    feedUrl: resolveDesktopFeedUrl(resolvedConfig),
  };
};
