export const buildDesktopMenuTemplate = (window) => ([
  {
    label: 'File',
    submenu: [
      { role: 'quit', label: 'Quit' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo', label: 'Undo' },
      { role: 'redo', label: 'Redo' },
      { type: 'separator' },
      { role: 'cut', label: 'Cut' },
      { role: 'copy', label: 'Copy' },
      { role: 'paste', label: 'Paste' },
      { role: 'selectAll', label: 'Select All' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload', label: 'Reload' },
      { role: 'forceReload', label: 'Force Reload' },
      { role: 'togglefullscreen', label: 'Toggle Full Screen' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize', label: 'Minimize', accelerator: 'Ctrl+M' },
      {
        label: 'Abrir console',
        click: () => {
          if (!window || window.isDestroyed()) {
            return;
          }

          if (window.webContents.isDevToolsOpened()) {
            window.webContents.closeDevTools();
            return;
          }

          window.webContents.openDevTools({
            mode: 'right',
            activate: true,
          });
        },
      },
      { type: 'separator' },
      { role: 'zoom', label: 'Zoom' },
      { role: 'close', label: 'Close', accelerator: 'Ctrl+W' },
    ],
  },
]);
