import assert from 'node:assert/strict';
import { buildDesktopMenuTemplate } from '../desktop/menu.js';

let opened = 0;
let closed = 0;
let checked = 0;
let installed = 0;
let notified = 0;

const fakeWindow = {
  isDestroyed: () => false,
  webContents: {
    isDevToolsOpened: () => false,
    openDevTools: () => {
      opened += 1;
    },
    closeDevTools: () => {
      closed += 1;
    },
  },
};

const fakeUpdateController = {
  enabled: true,
  canInstallDownloadedUpdate: () => true,
  checkForUpdates: async () => {
    checked += 1;
  },
  installDownloadedUpdate: async () => {
    installed += 1;
  },
};

const menu = buildDesktopMenuTemplate(fakeWindow, fakeUpdateController, () => {
  notified += 1;
});
const windowMenu = menu.find((item) => item.label === 'Window');

assert.ok(windowMenu);
assert.ok(Array.isArray(windowMenu.submenu));

const consoleItem = windowMenu.submenu.find((item) => item.label === 'Abrir console');
assert.ok(consoleItem);
assert.equal(typeof consoleItem.click, 'function');

const checkUpdatesItem = windowMenu.submenu.find((item) => String(item.label || '').startsWith('Verificar'));
assert.ok(checkUpdatesItem);

const restartUpdateItem = windowMenu.submenu.find((item) => String(item.label || '').startsWith('Reiniciar para atualizar'));
assert.ok(restartUpdateItem);

consoleItem.click();
assert.equal(opened, 1);
assert.equal(closed, 0);

fakeWindow.webContents.isDevToolsOpened = () => true;
consoleItem.click();
assert.equal(opened, 1);
assert.equal(closed, 1);

await checkUpdatesItem.click();
assert.equal(checked, 1);
assert.equal(notified, 1);

await restartUpdateItem.click();
assert.equal(installed, 1);
