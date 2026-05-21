import { readPersistentValue, writePersistentValue } from './persistentStorage.js';
import { getCompanyContactKey } from './companyIdentity.js';
import { getWhatsAppStatus } from './whatsappLink.js';

export const WHATSAPP_CONFIRMATION_STORAGE_KEY = 'nexus_whatsapp_status_overrides';

const VALID_WHATSAPP_STATUSES = new Set(['CONFIRMED', 'UNCONFIRMED', 'NONE']);

const normalizeWhatsAppStatus = (value) => {
  const status = String(value ?? '').trim().toUpperCase();

  if (!VALID_WHATSAPP_STATUSES.has(status)) {
    return '';
  }

  return status;
};

export const readWhatsAppStatusOverrides = (rawValue) => {
  if (!rawValue) {
    return {};
  }

  let parsedValue = rawValue;

  if (typeof rawValue === 'string') {
    try {
      parsedValue = JSON.parse(rawValue);
    } catch (error) {
      return {};
    }
  }

  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    return {};
  }

  return Object.entries(parsedValue).reduce((acc, [key, value]) => {
    const status = normalizeWhatsAppStatus(value);

    if (key && status) {
      acc[key] = status;
    }

    return acc;
  }, {});
};

export const serializeWhatsAppStatusOverrides = (overrides = {}) =>
  JSON.stringify(readWhatsAppStatusOverrides(overrides));

export const getCompanyWhatsAppStatus = (company = {}, overrides = {}) => {
  const companyKey = getCompanyContactKey(company);
  const overrideStatus = normalizeWhatsAppStatus(overrides[companyKey]);

  if (overrideStatus !== '') {
    return overrideStatus;
  }

  const companyStatus = normalizeWhatsAppStatus(company.whatsappStatus);
  if (companyStatus !== '') {
    return companyStatus;
  }

  return getWhatsAppStatus(company);
};

export const setCompanyWhatsAppStatusOverride = (overrides = {}, company = {}, nextStatus = 'NONE') => {
  const normalizedStatus = normalizeWhatsAppStatus(nextStatus);
  const companyKey = getCompanyContactKey(company);
  const nextOverrides = { ...readWhatsAppStatusOverrides(overrides) };

  if (!companyKey) {
    return nextOverrides;
  }

  if (!normalizedStatus) {
    return nextOverrides;
  }

  nextOverrides[companyKey] = normalizedStatus;
  return nextOverrides;
};

export const readStoredWhatsAppStatusOverrides = () =>
  readWhatsAppStatusOverrides(readPersistentValue(WHATSAPP_CONFIRMATION_STORAGE_KEY));

export const writeStoredWhatsAppStatusOverrides = (overrides = {}) => {
  writePersistentValue(WHATSAPP_CONFIRMATION_STORAGE_KEY, serializeWhatsAppStatusOverrides(overrides));
};
