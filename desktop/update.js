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

  if (!config.enabled) {
    return {
      config,
      enabled: false,
      checkForUpdates: async () => null,
    };
  }

  autoUpdater.logger = logger;
  autoUpdater.autoDownload = config.autoDownload;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = config.updateChannel !== '' && config.updateChannel !== 'latest';
  autoUpdater.allowDowngrade = autoUpdater.allowPrerelease;

  autoUpdater.setFeedURL({
    provider: 'generic',
    url: config.updateUrl,
    ...(config.updateChannel ? { channel: config.updateChannel } : {}),
  });

  autoUpdater.on('checking-for-update', () => {
    logUpdater(logger, 'info', 'desktop update check started');
  });

  autoUpdater.on('update-available', (info) => {
    logUpdater(logger, 'info', 'desktop update available', {
      version: info?.version,
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    logUpdater(logger, 'info', 'desktop update not available', {
      version: info?.version,
    });
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
  });

  autoUpdater.on('error', (error) => {
    logUpdater(logger, 'warn', 'desktop update check failed', {
      message: error instanceof Error ? error.message : String(error),
    });
  });

  const checkForUpdates = async () => {
    try {
      return await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      logUpdater(logger, 'warn', 'desktop update request failed', {
        message: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  };

  return {
    config,
    enabled: true,
    checkForUpdates,
  };
};
