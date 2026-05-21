export const SYNC_CONTRACT_VERSION = '2026-05-21';

export const SYNC_ENTITIES = [
  {
    name: 'workspace',
    storageKey: 'workspace',
    syncable: true,
    priority: 0,
    direction: 'bidirectional',
    conflictPolicy: 'remote-newer-wins-local-wins-on-tie',
  },
  {
    name: 'pipeline',
    storageKey: 'pipelines',
    syncable: true,
    priority: 1,
    direction: 'bidirectional',
    conflictPolicy: 'remote-newer-wins-local-wins-on-tie',
  },
  {
    name: 'savedList',
    storageKey: 'savedLists',
    syncable: true,
    priority: 2,
    direction: 'bidirectional',
    conflictPolicy: 'remote-newer-wins-local-wins-on-tie',
  },
  {
    name: 'contact',
    storageKey: 'contacts',
    syncable: true,
    priority: 3,
    direction: 'bidirectional',
    conflictPolicy: 'remote-newer-wins-local-wins-on-tie',
  },
  {
    name: 'deal',
    storageKey: 'deals',
    syncable: true,
    priority: 4,
    direction: 'bidirectional',
    conflictPolicy: 'remote-newer-wins-local-wins-on-tie',
  },
  {
    name: 'cardConfig',
    storageKey: 'nexus_card_visibility_config',
    syncable: false,
    priority: 100,
    direction: 'local-only',
    conflictPolicy: 'local-only',
  },
  {
    name: 'contactedKeys',
    storageKey: 'nexus_contacted_keys',
    syncable: false,
    priority: 101,
    direction: 'local-only',
    conflictPolicy: 'local-only',
  },
  {
    name: 'whatsappStatusOverrides',
    storageKey: 'nexus_whatsapp_status_overrides',
    syncable: false,
    priority: 102,
    direction: 'local-only',
    conflictPolicy: 'local-only',
  },
  {
    name: 'citiesCache',
    storageKey: 'nexus_cities_cache_v5',
    syncable: false,
    priority: 103,
    direction: 'local-only',
    conflictPolicy: 'local-only',
  },
];

const indexByName = new Map(SYNC_ENTITIES.map((entity) => [entity.name, entity]));

export const getSyncEntityContract = (entityName) => {
  const entity = indexByName.get(entityName);
  return entity ? { ...entity } : null;
};

export const getSyncableEntityContracts = () =>
  SYNC_ENTITIES
    .filter((entity) => entity.syncable)
    .map((entity) => ({ ...entity }))
    .sort((left, right) => left.priority - right.priority);

export const getLocalOnlyEntityContracts = () =>
  SYNC_ENTITIES
    .filter((entity) => !entity.syncable)
    .map((entity) => ({ ...entity }))
    .sort((left, right) => left.priority - right.priority);

export const buildSyncContract = () => ({
  version: SYNC_CONTRACT_VERSION,
  sharedEntities: getSyncableEntityContracts(),
  localOnlyEntities: getLocalOnlyEntityContracts(),
  pushOrder: getSyncableEntityContracts().map((entity) => entity.name),
  pullOrder: getSyncableEntityContracts().map((entity) => entity.name),
});
