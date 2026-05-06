import { CORE_MODULES } from './config.js';

export const getCoreModules = () => CORE_MODULES.map((module) => ({
  ...module,
  routes: [...module.routes],
}));
