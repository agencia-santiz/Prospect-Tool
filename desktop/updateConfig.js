const DEFAULT_UPDATE_AUTO_DOWNLOAD = true;
const DEFAULT_UPDATE_CHECK_ON_STARTUP = true;

const parseBoolean = (value, fallback) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return fallback;
  }

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
};

const normalizeText = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

const normalizeUrl = (value) => {
  const trimmed = normalizeText(value);
  if (!trimmed) {
    return '';
  }

  try {
    return new URL(trimmed).toString().replace(/\/$/, '');
  } catch {
    return '';
  }
};

export const resolveDesktopUpdateConfig = (overrides = {}) => {
  const disabled = parseBoolean(overrides.disabled, false);
  const packaged = parseBoolean(overrides.packaged, false);
  const updateUrl = normalizeUrl(overrides.updateUrl);
  const updateChannel = normalizeText(overrides.updateChannel);
  const provider = normalizeText(overrides.provider) || (updateUrl ? 'generic' : 'github');
  const autoDownload = parseBoolean(overrides.autoDownload, DEFAULT_UPDATE_AUTO_DOWNLOAD);
  const checkOnStartup = parseBoolean(overrides.checkOnStartup, DEFAULT_UPDATE_CHECK_ON_STARTUP);

  return {
    enabled: !disabled && (updateUrl.length > 0 || packaged),
    packaged,
    provider,
    updateUrl,
    updateChannel,
    autoDownload,
    checkOnStartup,
  };
};
