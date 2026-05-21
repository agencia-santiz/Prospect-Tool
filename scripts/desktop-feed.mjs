import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolveDesktopFeedConfig,
  resolveDesktopFeedUrl,
  stageDesktopFeed,
} from '../desktop/feed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const contentTypeByExt = {
  '.yml': 'text/yaml; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.exe': 'application/vnd.microsoft.portable-executable',
  '.blockmap': 'application/octet-stream',
};

const getContentType = (filePath) => contentTypeByExt[path.extname(filePath).toLowerCase()] || 'application/octet-stream';

const serveFeed = async (config) => {
  const feedDir = path.resolve(projectRoot, config.feedDir);
  const serveRoot = path.dirname(feedDir);
  await stat(feedDir);

  const server = createServer(async (request, response) => {
    const requestPath = decodeURIComponent((request.url || '/').split('?')[0] || '/');
    const relativePath = requestPath === '/' ? 'latest.yml' : requestPath.replace(/^\//, '');
    const filePath = path.join(serveRoot, relativePath);

    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        response.statusCode = 404;
        response.end('Not found');
        return;
      }

      const data = await readFile(filePath);
      response.statusCode = 200;
      response.setHeader('Content-Type', getContentType(filePath));
      response.setHeader('Content-Length', data.length);
      response.end(data);
    } catch {
      response.statusCode = 404;
      response.end('Not found');
    }
  });

  await new Promise((resolve) => {
    server.listen(config.feedPort, config.feedHost, resolve);
  });

  const feedUrl = resolveDesktopFeedUrl(config);
  console.log(`Desktop update feed serving at ${feedUrl}`);
  console.log(`Feed directory: ${feedDir}`);

  const shutdown = async () => {
    await new Promise((resolve) => server.close(resolve));
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

const main = async () => {
  const command = (process.argv[2] || 'serve').trim();
  const config = resolveDesktopFeedConfig({
    releaseDir: process.env.BLOOM_RELEASE_DIR,
    feedDir: process.env.BLOOM_UPDATE_FEED_DIR,
    feedPort: process.env.BLOOM_UPDATE_FEED_PORT,
    feedPath: process.env.BLOOM_UPDATE_FEED_PATH,
    feedHost: process.env.BLOOM_UPDATE_FEED_HOST,
  });

  if (command === 'stage') {
    const result = await stageDesktopFeed(config);
    console.log(`Desktop update feed staged: ${result.feedUrl}`);
    console.log(`Artifact: ${result.artifactName}`);
    console.log(`Feed directory: ${result.feedDir}`);
    return;
  }

  if (command === 'serve') {
    const result = await stageDesktopFeed(config);
    console.log(`Desktop update feed staged: ${result.feedUrl}`);
    console.log(`Artifact: ${result.artifactName}`);
    await serveFeed(config);
    return;
  }

  throw new Error(`Unknown desktop feed command: ${command}`);
};

main().catch((error) => {
  console.error('Desktop feed command failed', error);
  process.exitCode = 1;
});
