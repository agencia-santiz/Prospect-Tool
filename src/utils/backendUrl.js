const DEFAULT_LOCAL_BACKEND_URL = 'http://127.0.0.1:8787';

const resolveDesktopBackendUrl = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const desktopRuntime = window.bloomDesktop;
  const desktopBackendUrl = desktopRuntime && typeof desktopRuntime === 'object'
    ? desktopRuntime.backendUrl
    : null;

  if (typeof desktopBackendUrl === 'string' && desktopBackendUrl.trim().length > 0) {
    return desktopBackendUrl.replace(/\/$/, '');
  }

  return null;
};

export const resolveBackendBaseUrl = (hostname) => {
  const desktopBackendUrl = resolveDesktopBackendUrl();
  if (desktopBackendUrl) {
    return desktopBackendUrl;
  }

  const resolvedHostname =
    hostname || (typeof window !== 'undefined' && window.location ? window.location.hostname : '');

  const isLocalHost =
    resolvedHostname === 'localhost' ||
    resolvedHostname === '127.0.0.1' ||
    resolvedHostname === '::1';

  if (!resolvedHostname) {
    return DEFAULT_LOCAL_BACKEND_URL;
  }

  return isLocalHost ? DEFAULT_LOCAL_BACKEND_URL : '/api';
};

export const getBackendBaseUrl = () => {
  return String(resolveBackendBaseUrl()).replace(/\/$/, '');
};
