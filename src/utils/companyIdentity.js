const normalizeIdentityText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const buildKeySegment = (value) => normalizeIdentityText(value) || 'unknown';

export const getLegacyCompanyContactKey = (company = {}) =>
  `NAME:${buildKeySegment(company.nome_fantasia)}_${buildKeySegment(company.cidade)}`;

export const getCompanyContactKey = (company = {}) =>
  [
    `NAME:${buildKeySegment(company.nome_fantasia)}`,
    `ADDRESS:${buildKeySegment(company.endereco)}`,
    `CITY:${buildKeySegment(company.cidade)}`,
    `UF:${buildKeySegment(company.uf)}`,
  ].join('|');

const isLegacyCompanyContactKey = (key) => typeof key === 'string' && key.startsWith('NAME:') && !key.includes('|ADDRESS:');

export const migrateContactedKeys = (contactedKeys = new Set(), leads = []) => {
  const leadGroups = new Map();

  for (const lead of leads) {
    const legacyKey = getLegacyCompanyContactKey(lead);
    const groupedLeads = leadGroups.get(legacyKey) || [];
    groupedLeads.push(lead);
    leadGroups.set(legacyKey, groupedLeads);
  }

  const nextKeys = new Set();

  for (const key of contactedKeys) {
    if (!isLegacyCompanyContactKey(key)) {
      nextKeys.add(key);
      continue;
    }

    const matchingLeads = leadGroups.get(key);
    if (matchingLeads && matchingLeads.length > 0) {
      const matchingContactKeys = new Set(matchingLeads.map((lead) => getCompanyContactKey(lead)));
      if (matchingContactKeys.size === 1) {
        nextKeys.add(matchingContactKeys.values().next().value);
      }
    }
  }

  return nextKeys;
};
