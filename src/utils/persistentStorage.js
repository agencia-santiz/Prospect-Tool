import { migrateLegacyBrowserStorage } from './legacyStorageMigration.js';

const getDesktopStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storage = window.bloomDesktop?.storage;
  if (
    storage &&
    typeof storage.getItem === 'function' &&
    typeof storage.setItem === 'function' &&
    typeof storage.removeItem === 'function'
  ) {
    return storage;
  }

  return null;
};

const getBrowserStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  return window.localStorage;
};

const getStorage = () => getDesktopStorage() || getBrowserStorage();

let legacyMigrationAttempted = false;

const migrateLegacyBrowserStorageIfNeeded = () => {
  if (legacyMigrationAttempted) {
    return;
  }

  legacyMigrationAttempted = true;

  const desktopStorage = getDesktopStorage();
  const browserStorage = getBrowserStorage();

  if (!desktopStorage || !browserStorage) {
    return;
  }

  migrateLegacyBrowserStorage({
    sourceStorage: browserStorage,
    targetStorage: desktopStorage,
  });
};

export const readPersistentValue = (key) => {
  migrateLegacyBrowserStorageIfNeeded();
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  return storage.getItem(key);
};

export const writePersistentValue = (key, value) => {
  migrateLegacyBrowserStorageIfNeeded();
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(key, value);
};

export const removePersistentValue = (key) => {
  migrateLegacyBrowserStorageIfNeeded();
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(key);
};
