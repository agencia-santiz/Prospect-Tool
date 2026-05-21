import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, Menu, dialog, ipcMain, shell } from 'electron';
import { createDesktopLogger } from './logger.js';
import { buildDesktopMenuTemplate } from './menu.js';
import { createDesktopPersistentStorage, registerDesktopPersistentStorageIpc } from './persistence.js';
import { startBackend } from '../server/app.js';
import { loadBackendEnvironment } from '../server/env.js';
import { resolveDesktopFrontendTarget, resolveDesktopRuntime } from './runtime.js';
import { createDesktopAutoUpdateController } from './update.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runtime = resolveDesktopRuntime({
  frontendHost: process.env.BLOOM_FRONTEND_HOST,
  frontendPort: process.env.BLOOM_FRONTEND_PORT,
  frontendUrl: process.env.BLOOM_FRONTEND_URL,
  frontendFile: process.env.BLOOM_FRONTEND_FILE,
  backendHost: process.env.BLOOM_BACKEND_HOST,
  backendPort: process.env.BLOOM_BACKEND_PORT,
  backendUrl: process.env.BLOOM_BACKEND_URL,
  openDevTools: process.env.BLOOM_DESKTOP_OPEN_DEVTOOLS,
});

let mainWindow = null;
let backendServer = null;
let updateController = null;
let desktopLogger = console;
let desktopStorage = null;
let isShuttingDown = false;

const getDesktopLogger = () => desktopLogger || console;

const bringWindowToFront = () => {
  if (!mainWindow) {
    return;
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();
};

const loadFrontend = async (window) => {
  const target = resolveDesktopFrontendTarget({
    frontendUrl: process.env.BLOOM_FRONTEND_URL,
    frontendFile: process.env.BLOOM_FRONTEND_FILE,
  });

  if (target.type === 'url') {
    await window.loadURL(target.value);
    return;
  }

  const absolutePath = path.resolve(app.getAppPath(), target.value);
  await window.loadFile(absolutePath);
};

const shouldOpenDevTools = () => {
  return Boolean(runtime.openDevTools);
};

const startDesktopBackend = async () => {
  if (backendServer) {
    return backendServer;
  }

  const backendEnv = await loadBackendEnvironment({ cwd: app.getAppPath() });
  getDesktopLogger().info({
    event: 'desktop_backend_starting',
    host: runtime.backendHost,
    port: runtime.backendPort,
  });
  backendServer = await startBackend({
    host: runtime.backendHost,
    port: runtime.backendPort,
    env: backendEnv,
    logger: getDesktopLogger(),
  });
  getDesktopLogger().info({
    event: 'desktop_backend_started',
    host: runtime.backendHost,
    port: runtime.backendPort,
  });

  return backendServer;
};

const stopDesktopBackend = async () => {
  if (!backendServer) {
    return;
  }

  const server = backendServer;
  backendServer = null;

  getDesktopLogger().info({
    event: 'desktop_backend_stopping',
  });

  await new Promise((resolve) => {
    server.close(() => resolve());
  });
};

const createWindow = async () => {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: '#f8f9fb',
    title: 'Bloom Leads',
    icon: path.join(app.getAppPath(), 'assets', 'app-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow = window;

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  window.on('closed', () => {
    if (mainWindow === window) {
      mainWindow = null;
    }
  });

  await loadFrontend(window);
  if (shouldOpenDevTools()) {
    window.webContents.openDevTools({
      mode: 'right',
      activate: true,
    });
  }
  getDesktopLogger().info({
    event: 'desktop_window_ready',
  });
};

const applyDesktopMenu = () => {
  if (!mainWindow) {
    return;
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(buildDesktopMenuTemplate(
    mainWindow,
    updateController,
    () => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        return;
      }

      void dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Atualizações',
        message: 'Verificação de atualizações iniciada.',
        detail: 'O aplicativo vai consultar o feed configurado e, se houver uma versão nova, baixar em segundo plano.',
        buttons: ['OK'],
      });
    },
  )));
};

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on('second-instance', () => {
  bringWindowToFront();
});

app.whenReady().then(async () => {
  try {
    desktopLogger = createDesktopLogger({
      logDirectory: path.join(app.getPath('userData'), 'logs'),
    });
    desktopStorage = createDesktopPersistentStorage(path.join(app.getPath('userData'), 'persistent-state.json'));
    registerDesktopPersistentStorageIpc(desktopStorage, ipcMain);
    desktopLogger.info({
      event: 'desktop_logging_ready',
      logFilePath: desktopLogger.filePath,
    });
    desktopLogger.info({
      event: 'desktop_storage_ready',
      storageFilePath: desktopStorage.filePath,
    });

    await startDesktopBackend();
    await createWindow();
    applyDesktopMenu();
    updateController = createDesktopAutoUpdateController({
      disabled: !app.isPackaged || process.env.BLOOM_DESKTOP_DISABLE_UPDATES,
      packaged: app.isPackaged,
      provider: process.env.BLOOM_UPDATE_PROVIDER,
      updateUrl: process.env.BLOOM_UPDATE_URL,
      updateChannel: process.env.BLOOM_UPDATE_CHANNEL,
      autoDownload: process.env.BLOOM_UPDATE_AUTO_DOWNLOAD,
      checkOnStartup: process.env.BLOOM_UPDATE_CHECK_ON_STARTUP,
    }, getDesktopLogger());

    updateController.subscribe(() => {
      applyDesktopMenu();
    });

    applyDesktopMenu();

    if (updateController.enabled) {
      void updateController.checkForUpdates();
    }
  } catch (error) {
    getDesktopLogger().error({
      event: 'desktop_startup_failed',
      message: error instanceof Error ? error.message : String(error),
    });
    await stopDesktopBackend();
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void createWindow();
    return;
  }

  bringWindowToFront();
});

app.on('before-quit', (event) => {
  if (isShuttingDown || !backendServer) {
    return;
  }

  event.preventDefault();
  isShuttingDown = true;

  void stopDesktopBackend().finally(() => {
    getDesktopLogger().info({
      event: 'desktop_shutdown_complete',
    });
    app.quit();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
