export const BACKEND_NAME = 'bloom-leads-api';
export const BACKEND_VERSION = '2026-05-05';
export const DEFAULT_BACKEND_HOST = '127.0.0.1';
export const DEFAULT_BACKEND_PORT = 8787;

export const CORE_MODULES = [
  { name: 'health', status: 'active', routes: ['/health'] },
  { name: 'version', status: 'active', routes: ['/version'] },
  { name: 'auth', status: 'active', routes: ['/auth/login', '/auth/register', '/auth/session', '/auth/logout'] },
  { name: 'workspace', status: 'active', routes: ['/workspaces/current'] },
  { name: 'search', status: 'active', routes: ['/search/enrich'] },
  { name: 'company', status: 'planned', routes: [] },
  { name: 'lead', status: 'planned', routes: [] },
  { name: 'contact', status: 'planned', routes: [] },
  { name: 'deal', status: 'planned', routes: [] },
  { name: 'pipeline', status: 'planned', routes: [] },
];
