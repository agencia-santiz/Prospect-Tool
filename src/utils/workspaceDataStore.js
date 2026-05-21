import { readPersistentValue, removePersistentValue, writePersistentValue } from './persistentStorage.js';

const STORAGE_PREFIX = 'bloom_workspace_state_v1';

const getStorageKey = (workspaceId) => `${STORAGE_PREFIX}:${workspaceId}`;

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const readRawWorkspaceData = (workspaceId) => {
  if (!workspaceId) {
    return null;
  }

  const rawValue = readPersistentValue(getStorageKey(workspaceId));
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
};

export const readWorkspaceData = (workspaceId) => {
  const rawValue = readRawWorkspaceData(workspaceId);
  if (!rawValue || typeof rawValue !== 'object') {
    return null;
  }

  return {
    savedLists: normalizeArray(rawValue.savedLists),
    contacts: normalizeArray(rawValue.contacts),
    pipelines: normalizeArray(rawValue.pipelines),
    deals: normalizeArray(rawValue.deals),
  };
};

export const writeWorkspaceData = (workspaceId, data) => {
  if (!workspaceId) {
    return;
  }

  const payload = {
    savedLists: normalizeArray(data?.savedLists),
    contacts: normalizeArray(data?.contacts),
    pipelines: normalizeArray(data?.pipelines),
    deals: normalizeArray(data?.deals),
    updatedAt: new Date().toISOString(),
  };

  writePersistentValue(getStorageKey(workspaceId), JSON.stringify(payload));
};

export const clearWorkspaceData = (workspaceId) => {
  if (!workspaceId) {
    return;
  }

  removePersistentValue(getStorageKey(workspaceId));
};
