const LEGACY_MIGRATION_FLAG_KEY = 'bloom_legacy_storage_migration_v1';
const WORKSPACE_STATE_PREFIX = 'bloom_workspace_state_v1:';
const MIGRATABLE_KEYS = new Set([
  'nexus_card_visibility_config',
  'nexus_whatsapp_status_overrides',
  'nexus_contacted_keys',
  'nexus_cities_cache_v5',
  'bloom_auth_token',
  'nexus_user',
]);

const shouldMigrateKey = (key) => MIGRATABLE_KEYS.has(key) || key.startsWith(WORKSPACE_STATE_PREFIX);

const enumerateStorageKeys = (storage) => {
  if (!storage || typeof storage.length !== 'number' || typeof storage.key !== 'function') {
    return [];
  }

  const keys = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (typeof key === 'string' && key) {
      keys.push(key);
    }
  }

  return keys;
};

const readMigrationFlag = (storage) => {
  try {
    return storage.getItem(LEGACY_MIGRATION_FLAG_KEY);
  } catch {
    return null;
  }
};

const writeMigrationFlag = (storage, payload) => {
  try {
    storage.setItem(LEGACY_MIGRATION_FLAG_KEY, JSON.stringify(payload));
  } catch {
    // Best effort only.
  }
};

export const migrateLegacyBrowserStorage = ({ sourceStorage, targetStorage, logger } = {}) => {
  if (
    !sourceStorage ||
    !targetStorage ||
    typeof sourceStorage.getItem !== 'function' ||
    typeof targetStorage.getItem !== 'function' ||
    typeof targetStorage.setItem !== 'function'
  ) {
    return {
      migrated: false,
      copiedKeys: [],
      conflicts: [],
      skippedKeys: [],
    };
  }

  if (readMigrationFlag(targetStorage)) {
    return {
      migrated: false,
      copiedKeys: [],
      conflicts: [],
      skippedKeys: [],
    };
  }

  const copiedKeys = [];
  const conflicts = [];
  const skippedKeys = [];
  const sourceKeys = enumerateStorageKeys(sourceStorage).filter(shouldMigrateKey);

  for (const key of sourceKeys) {
    const sourceValue = sourceStorage.getItem(key);

    if (sourceValue === null || sourceValue === undefined) {
      skippedKeys.push(key);
      continue;
    }

    const targetValue = targetStorage.getItem(key);
    if (targetValue === null) {
      targetStorage.setItem(key, sourceValue);
      copiedKeys.push(key);
      continue;
    }

    if (targetValue !== sourceValue) {
      conflicts.push({
        key,
        targetValue,
        sourceValue,
      });
    }
  }

  writeMigrationFlag(targetStorage, {
    importedAt: new Date().toISOString(),
    copiedKeys,
    conflicts: conflicts.length,
  });

  if (logger && typeof logger.info === 'function') {
    logger.info({
      event: 'legacy_storage_migrated',
      copiedKeys: copiedKeys.length,
      conflicts: conflicts.length,
    });
  }

  return {
    migrated: true,
    copiedKeys,
    conflicts,
    skippedKeys,
  };
};
