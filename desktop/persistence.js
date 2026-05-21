import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_FILE_NAME = 'persistent-state.json';

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const readStoreFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return {};
    }

    const rawContents = fs.readFileSync(filePath, 'utf8');
    if (!rawContents.trim()) {
      return {};
    }

    const parsed = JSON.parse(rawContents);
    return isPlainObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const writeStoreFile = (filePath, payload) => {
  const directory = path.dirname(filePath);
  const tempPath = `${filePath}.tmp`;

  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2), 'utf8');
  fs.rmSync(filePath, { force: true });
  fs.renameSync(tempPath, filePath);
};

export const createDesktopPersistentStorage = (filePath) => {
  const absoluteFilePath = path.resolve(filePath || DEFAULT_FILE_NAME);
  let cache = readStoreFile(absoluteFilePath);

  const persist = () => {
    writeStoreFile(absoluteFilePath, cache);
  };

  const ensureStringValue = (value) => (value === null || value === undefined ? null : String(value));

  return {
    filePath: absoluteFilePath,
    getItem(key) {
      const normalizedKey = String(key || '');
      if (!normalizedKey) {
        return null;
      }

      return Object.prototype.hasOwnProperty.call(cache, normalizedKey)
        ? ensureStringValue(cache[normalizedKey])
        : null;
    },
    setItem(key, value) {
      const normalizedKey = String(key || '');
      if (!normalizedKey) {
        return;
      }

      cache = {
        ...cache,
        [normalizedKey]: ensureStringValue(value),
      };
      persist();
    },
    removeItem(key) {
      const normalizedKey = String(key || '');
      if (!normalizedKey || !Object.prototype.hasOwnProperty.call(cache, normalizedKey)) {
        return;
      }

      const { [normalizedKey]: _removed, ...nextCache } = cache;
      cache = nextCache;
      persist();
    },
    clear() {
      cache = {};
      persist();
    },
    dump() {
      return { ...cache };
    },
  };
};

export const registerDesktopPersistentStorageIpc = (store, ipcMain) => {
  if (!ipcMain) {
    return;
  }

  ipcMain.on('bloom-storage:get-item', (event, key) => {
    event.returnValue = store.getItem(key);
  });

  ipcMain.on('bloom-storage:set-item', (event, key, value) => {
    store.setItem(key, value);
    event.returnValue = true;
  });

  ipcMain.on('bloom-storage:remove-item', (event, key) => {
    store.removeItem(key);
    event.returnValue = true;
  });

  ipcMain.on('bloom-storage:clear', (event) => {
    store.clear();
    event.returnValue = true;
  });
};
