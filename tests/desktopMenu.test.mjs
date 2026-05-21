import assert from 'node:assert/strict';
import { buildDesktopMenuTemplate } from '../desktop/menu.js';

let opened = 0;
let closed = 0;

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

const menu = buildDesktopMenuTemplate(fakeWindow);
const windowMenu = menu.find((item) => item.label === 'Window');

assert.ok(windowMenu);
assert.ok(Array.isArray(windowMenu.submenu));

const consoleItem = windowMenu.submenu.find((item) => item.label === 'Abrir console');
assert.ok(consoleItem);
assert.equal(typeof consoleItem.click, 'function');

consoleItem.click();
assert.equal(opened, 1);
assert.equal(closed, 0);

fakeWindow.webContents.isDevToolsOpened = () => true;
consoleItem.click();
assert.equal(opened, 1);
assert.equal(closed, 1);
