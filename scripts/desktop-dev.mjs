import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDesktopRuntimeEnv, resolveDesktopRuntime } from '../desktop/runtime.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const electronCli = path.join(rootDir, 'node_modules', 'electron', 'cli.js');
const viteCli = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

const runtime = resolveDesktopRuntime();
const env = createDesktopRuntimeEnv(runtime);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const spawnNodeScript = (scriptPath, args = [], childEnv = env) =>
  spawn(process.execPath, [scriptPath, ...args], {
    cwd: rootDir,
    env: childEnv,
    stdio: 'inherit',
  });

const waitForUrl = async (url, { attempts = 60, delayMs = 500 } = {}) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        return;
      }
    } catch {
      // Keep retrying until the process is ready.
    }

    await sleep(delayMs);
  }

  throw new Error(`Timed out waiting for ${url}`);
};

const killChild = (child) => {
  if (!child || child.killed) {
    return;
  }

  child.kill();

  setTimeout(() => {
    if (!child.killed) {
      child.kill('SIGKILL');
    }
  }, 1000);
};

const start = async () => {
  await access(electronCli);
  await access(viteCli);

  const vite = spawnNodeScript(viteCli, ['--host', runtime.frontendHost, '--port', String(runtime.frontendPort), '--strictPort']);
  await waitForUrl(runtime.frontendUrl);
  const electron = spawnNodeScript(electronCli, [path.join(rootDir, 'desktop', 'main.js')]);

  const shutdown = (code = 0) => {
    killChild(vite);
    killChild(electron);
    process.exitCode = code;
  };

  vite.once('exit', (code) => {
    if (code !== 0) {
      console.error(`Vite process exited with code ${code}`);
      shutdown(code || 1);
    }
  });

  electron.once('exit', (code) => {
    shutdown(code || 0);
  });

  process.once('SIGINT', () => shutdown(0));
  process.once('SIGTERM', () => shutdown(0));
};

void start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
