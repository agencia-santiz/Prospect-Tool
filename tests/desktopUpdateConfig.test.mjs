import assert from 'node:assert/strict';
import { resolveDesktopUpdateConfig } from '../desktop/updateConfig.js';

const disabledConfig = resolveDesktopUpdateConfig({
  disabled: true,
  updateUrl: 'https://updates.example.com/bloom/',
});

assert.equal(disabledConfig.enabled, false);
assert.equal(disabledConfig.updateUrl, 'https://updates.example.com/bloom');
assert.equal(disabledConfig.autoDownload, true);
assert.equal(disabledConfig.checkOnStartup, true);

const enabledConfig = resolveDesktopUpdateConfig({
  updateUrl: 'https://updates.example.com/bloom/',
  updateChannel: 'beta',
  autoDownload: 'false',
  checkOnStartup: '0',
});

assert.equal(enabledConfig.enabled, true);
assert.equal(enabledConfig.updateUrl, 'https://updates.example.com/bloom');
assert.equal(enabledConfig.updateChannel, 'beta');
assert.equal(enabledConfig.autoDownload, false);
assert.equal(enabledConfig.checkOnStartup, false);

const invalidConfig = resolveDesktopUpdateConfig({
  updateUrl: 'not-a-valid-url',
});

assert.equal(invalidConfig.enabled, false);
assert.equal(invalidConfig.updateUrl, '');

