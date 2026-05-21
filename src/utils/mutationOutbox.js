import { readPersistentValue, removePersistentValue, writePersistentValue } from './persistentStorage.js';

const OUTBOX_PREFIX = 'bloom_workspace_outbox_v1';
const DEFAULT_MAX_RECORDS = 2000;

const getOutboxKey = (workspaceId) => `${OUTBOX_PREFIX}:${workspaceId}`;

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const parseJson = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const cloneRecord = (record) => JSON.parse(JSON.stringify(record));

const indexById = (items = []) => {
  const map = new Map();

  for (const item of normalizeArray(items)) {
    if (item && typeof item === 'object' && typeof item.id === 'string' && item.id) {
      map.set(item.id, item);
    }
  }

  return map;
};

const isEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const createRecord = (workspaceId, entity, operation, entityId, nextValue, previousValue = null) => ({
  id: globalThis.crypto?.randomUUID?.() || `mutation-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  workspaceId,
  entity,
  operation,
  entityId,
  payload: nextValue === undefined ? null : cloneRecord(nextValue),
  previousPayload: previousValue === undefined || previousValue === null ? null : cloneRecord(previousValue),
  createdAt: new Date().toISOString(),
  status: 'pending',
});

const diffEntityCollection = (workspaceId, entity, previousItems, nextItems) => {
  const previousById = indexById(previousItems);
  const nextById = indexById(nextItems);
  const records = [];

  for (const [entityId, nextValue] of nextById.entries()) {
    const previousValue = previousById.get(entityId);

    if (!previousValue) {
      records.push(createRecord(workspaceId, entity, 'create', entityId, nextValue));
      continue;
    }

    if (!isEqual(previousValue, nextValue)) {
      records.push(createRecord(workspaceId, entity, 'update', entityId, nextValue, previousValue));
    }
  }

  for (const [entityId, previousValue] of previousById.entries()) {
    if (!nextById.has(entityId)) {
      records.push(createRecord(workspaceId, entity, 'delete', entityId, null, previousValue));
    }
  }

  return records;
};

export const readWorkspaceOutbox = (workspaceId) => {
  if (!workspaceId) {
    return [];
  }

  const rawValue = readPersistentValue(getOutboxKey(workspaceId));
  const parsed = parseJson(rawValue, []);

  return Array.isArray(parsed) ? parsed : [];
};

export const writeWorkspaceOutbox = (workspaceId, records = [], maxRecords = DEFAULT_MAX_RECORDS) => {
  if (!workspaceId) {
    return [];
  }

  const nextRecords = normalizeArray(records).slice(-maxRecords);
  writePersistentValue(getOutboxKey(workspaceId), JSON.stringify(nextRecords));
  return nextRecords;
};

export const appendWorkspaceOutboxRecords = (workspaceId, records = [], maxRecords = DEFAULT_MAX_RECORDS) => {
  if (!workspaceId) {
    return [];
  }

  const currentRecords = readWorkspaceOutbox(workspaceId);
  const nextRecords = [...currentRecords, ...normalizeArray(records)].slice(-maxRecords);
  writePersistentValue(getOutboxKey(workspaceId), JSON.stringify(nextRecords));
  return nextRecords;
};

export const clearWorkspaceOutbox = (workspaceId) => {
  if (!workspaceId) {
    return;
  }

  removePersistentValue(getOutboxKey(workspaceId));
};

export const buildWorkspaceMutationRecords = (workspaceId, previousState = {}, nextState = {}) => [
  ...diffEntityCollection(workspaceId, 'savedList', previousState.savedLists, nextState.savedLists),
  ...diffEntityCollection(workspaceId, 'contact', previousState.contacts, nextState.contacts),
  ...diffEntityCollection(workspaceId, 'pipeline', previousState.pipelines, nextState.pipelines),
  ...diffEntityCollection(workspaceId, 'deal', previousState.deals, nextState.deals),
];
