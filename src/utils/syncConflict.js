const parseTimestamp = (value) => {
  const parsed = new Date(value || '');
  const time = parsed.getTime();
  return Number.isNaN(time) ? 0 : time;
};

const cloneRecord = (record) => (record ? JSON.parse(JSON.stringify(record)) : null);

const resolveByTimestamp = (localRecord, remoteRecord) => {
  if (!localRecord) {
    return { winner: cloneRecord(remoteRecord), resolution: 'remote-only', conflict: false };
  }

  if (!remoteRecord) {
    return { winner: cloneRecord(localRecord), resolution: 'local-only', conflict: false };
  }

  const localUpdatedAt = parseTimestamp(localRecord.updatedAt || localRecord.createdAt);
  const remoteUpdatedAt = parseTimestamp(remoteRecord.updatedAt || remoteRecord.createdAt);

  if (remoteUpdatedAt > localUpdatedAt) {
    return { winner: cloneRecord(remoteRecord), resolution: 'remote-newer-wins', conflict: true };
  }

  if (localUpdatedAt > remoteUpdatedAt) {
    return { winner: cloneRecord(localRecord), resolution: 'local-newer-wins', conflict: true };
  }

  return { winner: cloneRecord(localRecord), resolution: 'local-wins-on-tie', conflict: true };
};

export const resolveSyncConflict = ({
  entityName,
  localRecord = null,
  remoteRecord = null,
  policy = 'remote-newer-wins-local-wins-on-tie',
} = {}) => {
  if (policy === 'local-only') {
    return {
      entityName,
      winner: cloneRecord(localRecord || remoteRecord),
      resolution: 'local-only',
      conflict: Boolean(localRecord && remoteRecord),
    };
  }

  return {
    entityName,
    ...resolveByTimestamp(localRecord, remoteRecord),
  };
};

export const resolveSyncConflictSet = (items = [], policy = 'remote-newer-wins-local-wins-on-tie') =>
  items.map((item) =>
    resolveSyncConflict({
      entityName: item?.entityName,
      localRecord: item?.localRecord || null,
      remoteRecord: item?.remoteRecord || null,
      policy,
    })
  );
