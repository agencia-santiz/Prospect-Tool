import { runDesktopReleaseSmoke } from '../desktop/releaseSmoke.js';

const loadConfigFromEnvironment = () => ({
  releaseDir: process.env.BLOOM_RELEASE_DIR,
  feedDir: process.env.BLOOM_RELEASE_FEED_DIR,
  feedPort: process.env.BLOOM_RELEASE_FEED_PORT,
  feedPath: process.env.BLOOM_RELEASE_FEED_PATH,
  feedHost: process.env.BLOOM_RELEASE_FEED_HOST,
});

const main = async () => {
  const result = await runDesktopReleaseSmoke(loadConfigFromEnvironment());
  console.log(`Desktop release smoke check passed: ${result.feedUrl}`);
  console.log(`Release dir: ${result.releaseDir}`);
  console.log(`Installer: ${result.installerPath}`);
  console.log(`Feed dir: ${result.feedDir}`);
};

main().catch((error) => {
  console.error('Desktop release smoke check failed', error);
  process.exitCode = 1;
});
