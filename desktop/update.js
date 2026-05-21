import { createRequire } from 'node:module';
import { resolveDesktopUpdateConfig } from './updateConfig.js';

const DEFAULT_LOGGER = console;
const require = createRequire(import.meta.url);
const { autoUpdater } = require('electron-updater');

const logUpdater = (logger, level, message, details) => {
  const target = logger && typeof logger[level] === 'function' ? logger : DEFAULT_LOGGER;
  const args = details === undefined ? [message] : [message, details];
  target[level](...args);
};

export const createDesktopAutoUpdateController = (overrides = {}, logger = DEFAULT_LOGGER) => {
  const config = resolveDesktopUpdateConfig(overrides);
  let downloadedUpdateInfo = null;
  const listeners = new Set();

  const notifyListeners = () => {
    for (const listener of listeners) {
      try {
        listener({
          downloadedUpdateInfo,
          config,
        });
      } catch {
        // Keep updater callbacks isolated.
      }
    }
  };

  const subscribe = (listener) => {
    if (typeof listener !== 'function') {
      return () => {};
    }

    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  if (!config.enabled) {
    return {
      config,
      enabled: false,
      checkForUpdates: async () => null,
      installDownloadedUpdate: async () => null,
      canInstallDownloadedUpdate: () => false,
      subscribe,
    };
  }

  autoUpdater.logger = logger;
  autoUpdater.autoDownload = config.autoDownload;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = config.updateChannel !== '' && config.updateChannel !== 'latest';
  autoUpdater.allowDowngrade = autoUpdater.allowPrerelease;

  if (config.provider === 'generic') {
    autoUpdater.setFeedURL({
      provider: 'generic',
      url: config.updateUrl,
      ...(config.updateChannel ? { channel: config.updateChannel } : {}),
    });
  }

  autoUpdater.on('checking-for-update', () => {
    logUpdater(logger, 'info', 'desktop update check started');
    notifyListeners();
  });

  autoUpdater.on('update-available', (info) => {
    logUpdater(logger, 'info', 'desktop update available', {
      version: info?.version,
    });
    notifyListeners();
  });

  autoUpdater.on('update-not-available', (info) => {
    logUpdater(logger, 'info', 'desktop update not available', {
      version: info?.version,
    });
    downloadedUpdateInfo = null;
    notifyListeners();
  });

  autoUpdater.on('download-progress', (progress) => {
    logUpdater(logger, 'info', 'desktop update download progress', {
      percent: Math.round(progress?.percent ?? 0),
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    logUpdater(logger, 'info', 'desktop update downloaded', {
      version: info?.version,
    });
    downloadedUpdateInfo = info || null;
    notifyListeners();
  });

  autoUpdater.on('error', (error) => {
    logUpdater(logger, 'warn', 'desktop update check failed', {
      message: error instanceof Error ? error.message : String(error),
    });
    notifyListeners();
  });

  const checkForUpdates = async () => {
    try {
      return await autoUpdater.checkForUpdates();
    } catch (error) {
      logUpdater(logger, 'warn', 'desktop update request failed', {
        message: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  };

  const installDownloadedUpdate = async () => {
    if (!downloadedUpdateInfo) {
      return null;
    }

    autoUpdater.quitAndInstall(false, true);
    return downloadedUpdateInfo;
  };

  return {
    config,
    enabled: true,
    checkForUpdates,
    installDownloadedUpdate,
    canInstallDownloadedUpdate: () => Boolean(downloadedUpdateInfo),
    subscribe,
  };
};
