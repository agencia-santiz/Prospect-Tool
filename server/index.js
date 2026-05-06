import { startBackend } from './app.js';
import { DEFAULT_BACKEND_HOST, DEFAULT_BACKEND_PORT } from './config.js';
import { loadBackendEnvironment } from './env.js';

const backendEnv = await loadBackendEnvironment();

const server = await startBackend({
  host: backendEnv.BACKEND_HOST || DEFAULT_BACKEND_HOST,
  port: Number(backendEnv.BACKEND_PORT || DEFAULT_BACKEND_PORT),
  env: backendEnv,
});

const address = server.address();
const host = typeof address === 'object' && address ? address.address : DEFAULT_BACKEND_HOST;
const port = typeof address === 'object' && address ? address.port : DEFAULT_BACKEND_PORT;

console.log(`Bloom Leads API running at http://${host}:${port}`);
