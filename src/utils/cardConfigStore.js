import { readPersistentValue, writePersistentValue } from './persistentStorage.js';

export const CARD_CONFIG_STORAGE_KEY = 'nexus_card_visibility_config';

export const DEFAULT_CARD_CONFIG = Object.freeze({
  showId: true,
  showValue: true,
  showPriority: true,
  showDate: true,
  showContactInfo: true,
  showLocation: true,
  showTags: true,
});

const toBoolean = (value, fallback) => (typeof value === 'boolean' ? value : fallback);

export const normalizeCardConfig = (config = {}) => ({
  showId: toBoolean(config.showId, DEFAULT_CARD_CONFIG.showId),
  showValue: toBoolean(config.showValue, DEFAULT_CARD_CONFIG.showValue),
  showPriority: toBoolean(config.showPriority, DEFAULT_CARD_CONFIG.showPriority),
  showDate: toBoolean(config.showDate, DEFAULT_CARD_CONFIG.showDate),
  showContactInfo: toBoolean(config.showContactInfo, DEFAULT_CARD_CONFIG.showContactInfo),
  showLocation: toBoolean(config.showLocation, DEFAULT_CARD_CONFIG.showLocation),
  showTags: toBoolean(config.showTags, DEFAULT_CARD_CONFIG.showTags),
});

export const parseCardConfig = (rawValue) => {
  if (!rawValue) {
    return { ...DEFAULT_CARD_CONFIG };
  }

  try {
    const parsed = JSON.parse(rawValue);
    return normalizeCardConfig(parsed);
  } catch {
    return { ...DEFAULT_CARD_CONFIG };
  }
};

export const serializeCardConfig = (config) => JSON.stringify(normalizeCardConfig(config));

export const readStoredCardConfig = () => parseCardConfig(readPersistentValue(CARD_CONFIG_STORAGE_KEY));

export const writeStoredCardConfig = (config) => {
  writePersistentValue(CARD_CONFIG_STORAGE_KEY, serializeCardConfig(config));
};
