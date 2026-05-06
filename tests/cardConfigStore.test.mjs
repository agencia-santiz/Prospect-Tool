import assert from 'node:assert/strict';
import {
  CARD_CONFIG_STORAGE_KEY,
  DEFAULT_CARD_CONFIG,
  normalizeCardConfig,
  parseCardConfig,
  serializeCardConfig,
} from '../src/utils/cardConfigStore.js';

assert.deepEqual(DEFAULT_CARD_CONFIG, {
  showId: true,
  showValue: true,
  showPriority: true,
  showDate: true,
  showContactInfo: true,
  showLocation: true,
  showTags: true,
});
assert.equal(CARD_CONFIG_STORAGE_KEY, 'nexus_card_visibility_config');

assert.deepEqual(parseCardConfig(undefined), DEFAULT_CARD_CONFIG);
assert.deepEqual(parseCardConfig(null), DEFAULT_CARD_CONFIG);
assert.deepEqual(parseCardConfig('{ not valid json }'), DEFAULT_CARD_CONFIG);

const normalized = normalizeCardConfig({
  showId: false,
  showValue: false,
  showPriority: true,
  showDate: 'nope',
  showContactInfo: false,
});

assert.deepEqual(normalized, {
  showId: false,
  showValue: false,
  showPriority: true,
  showDate: true,
  showContactInfo: false,
  showLocation: true,
  showTags: true,
});

const serialized = serializeCardConfig(normalized);
assert.deepEqual(JSON.parse(serialized), normalized);
