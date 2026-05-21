const DEFAULT_FRONTEND_HOST = '127.0.0.1';
const DEFAULT_FRONTEND_PORT = 3000;
const DEFAULT_FRONTEND_FILE = 'dist/index.html';
const DEFAULT_BACKEND_HOST = '127.0.0.1';
const DEFAULT_BACKEND_PORT = 8787;

const normalizeHost = (value, fallback) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed || fallback;
};

const normalizePort = (value, fallback) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.trunc(parsed);
};

const buildUrl = (host, port) => `http://${host}:${port}`;

const parseBoolean = (value, fallback) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return fallback;
  }

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
};

export const resolveDesktopRuntime = (overrides = {}) => {
  const frontendHost = normalizeHost(overrides.frontendHost, DEFAULT_FRONTEND_HOST);
  const frontendPort = normalizePort(overrides.frontendPort, DEFAULT_FRONTEND_PORT);
  const backendHost = normalizeHost(overrides.backendHost, DEFAULT_BACKEND_HOST);
  const backendPort = normalizePort(overrides.backendPort, DEFAULT_BACKEND_PORT);
  const frontendFile = typeof overrides.frontendFile === 'string' && overrides.frontendFile.trim()
    ? overrides.frontendFile.trim()
    : '';
  const frontendUrl = typeof overrides.frontendUrl === 'string' && overrides.frontendUrl.trim()
    ? overrides.frontendUrl.trim()
    : buildUrl(frontendHost, frontendPort);
  const backendUrl = typeof overrides.backendUrl === 'string' && overrides.backendUrl.trim()
    ? overrides.backendUrl.trim()
    : buildUrl(backendHost, backendPort);
  const openDevTools = parseBoolean(overrides.openDevTools, false);

  return {
    frontendHost,
    frontendPort,
    frontendUrl,
    frontendFile,
    backendHost,
    backendPort,
    backendUrl,
    openDevTools,
  };
};

export const resolveDesktopFrontendTarget = (overrides = {}) => {
  if (typeof overrides.frontendUrl === 'string' && overrides.frontendUrl.trim()) {
    return {
      type: 'url',
      value: overrides.frontendUrl.trim(),
    };
  }

  if (typeof overrides.frontendFile === 'string' && overrides.frontendFile.trim()) {
    return {
      type: 'file',
      value: overrides.frontendFile.trim(),
    };
  }

  return {
    type: 'file',
    value: DEFAULT_FRONTEND_FILE,
  };
};

export const createDesktopRuntimeEnv = (overrides = {}, baseEnv = process.env) => {
  const runtime = resolveDesktopRuntime(overrides);

  return {
    ...baseEnv,
    BLOOM_DESKTOP_RUNTIME: '1',
    BLOOM_FRONTEND_HOST: runtime.frontendHost,
    BLOOM_FRONTEND_PORT: String(runtime.frontendPort),
    BLOOM_FRONTEND_URL: runtime.frontendUrl,
    ...(runtime.frontendFile ? { BLOOM_FRONTEND_FILE: runtime.frontendFile } : {}),
    BLOOM_BACKEND_HOST: runtime.backendHost,
    BLOOM_BACKEND_PORT: String(runtime.backendPort),
    BLOOM_BACKEND_URL: runtime.backendUrl,
    BLOOM_DESKTOP_OPEN_DEVTOOLS: runtime.openDevTools ? '1' : '0',
  };
};
