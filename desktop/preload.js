import { contextBridge, ipcRenderer } from 'electron';
import { resolveDesktopRuntime } from './runtime.js';
import { resolveDesktopUpdateConfig } from './updateConfig.js';

const runtime = resolveDesktopRuntime({
  frontendHost: process.env.BLOOM_FRONTEND_HOST,
  frontendPort: process.env.BLOOM_FRONTEND_PORT,
  frontendUrl: process.env.BLOOM_FRONTEND_URL,
  backendHost: process.env.BLOOM_BACKEND_HOST,
  backendPort: process.env.BLOOM_BACKEND_PORT,
  backendUrl: process.env.BLOOM_BACKEND_URL,
});

const updateConfig = resolveDesktopUpdateConfig({
  disabled: process.env.BLOOM_DESKTOP_DISABLE_UPDATES,
  updateUrl: process.env.BLOOM_UPDATE_URL,
  updateChannel: process.env.BLOOM_UPDATE_CHANNEL,
  autoDownload: process.env.BLOOM_UPDATE_AUTO_DOWNLOAD,
  checkOnStartup: process.env.BLOOM_UPDATE_CHECK_ON_STARTUP,
});

contextBridge.exposeInMainWorld('bloomDesktop', {
  isDesktop: true,
  ...runtime,
  updates: updateConfig,
  storage: {
    getItem: (key) => ipcRenderer.sendSync('bloom-storage:get-item', key),
    setItem: (key, value) => ipcRenderer.sendSync('bloom-storage:set-item', key, value),
    removeItem: (key) => ipcRenderer.sendSync('bloom-storage:remove-item', key),
    clear: () => ipcRenderer.sendSync('bloom-storage:clear'),
  },
});
