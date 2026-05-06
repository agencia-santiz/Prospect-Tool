const clone = (value) => {
  if (value == null) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
};

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

const normalizeDigits = (value = '') => String(value).replace(/\D+/g, '');

const extractDomain = (value = '') => {
  const text = String(value || '').trim();
  if (!text) {
    return '';
  }

  try {
    const withScheme = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    return new URL(withScheme).hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return text.toLowerCase().replace(/^www\./i, '').replace(/\/$/, '');
  }
};

const getCoordinatesKey = (company, precision = 4) => {
  const latitude = Number(company?.coordinates?.latitude);
  const longitude = Number(company?.coordinates?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return '';
  }

  return `${latitude.toFixed(precision)}|${longitude.toFixed(precision)}`;
};

const getRoundedCoordinates = (company, precision = 4) => {
  const latitude = Number(company?.coordinates?.latitude);
  const longitude = Number(company?.coordinates?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    latitude: Number(latitude.toFixed(precision)),
    longitude: Number(longitude.toFixed(precision)),
  };
};

const getPhoneKey = (company) => {
  const phone = normalizeDigits(company?.telefone || company?.phone || '');
  return phone.length >= 8 ? phone : '';
};

const getSourceIdKey = (company) => {
  const sourceId = String(company?.sourceId || '').trim();
  if (!sourceId) {
    return '';
  }

  const source = String(company?.source || 'UNKNOWN').trim().toUpperCase();
  return `${source}:${sourceId}`;
};

const getDomainKey = (company) => extractDomain(company?.websiteDomain || company?.website || '');

const getNameKey = (company) => normalizeText(company?.nome_fantasia || company?.razao_social || company?.['razão_social'] || '');

const getAddressKey = (company) => normalizeText([
  company?.endereco || '',
  company?.bairro || '',
  company?.cidade || '',
  company?.uf || '',
].filter(Boolean).join('|'));

const getLooseLocationKey = (company) => normalizeText([
  company?.cidade || '',
  company?.uf || '',
  company?.pais || '',
].filter(Boolean).join('|'));

const isSameLocale = (left, right) => normalizeText(left?.cidade || '') === normalizeText(right?.cidade || '')
  && normalizeText(left?.uf || '') === normalizeText(right?.uf || '');

const isHighConfidencePhoneMatch = (existing, incoming) => {
  const phoneKey = getPhoneKey(incoming);
  if (!phoneKey) {
    return false;
  }

  const sameLocale = isSameLocale(existing, incoming);
  const sameAddress = getAddressKey(existing) && getAddressKey(existing) === getAddressKey(incoming);
  const sameName = getNameKey(existing) && getNameKey(existing) === getNameKey(incoming);

  return sameLocale && (sameAddress || sameName);
};

const isHighConfidenceGeoMatch = (existing, incoming) => {
  const existingKey = getCoordinatesKey(existing, 4);
  const incomingKey = getCoordinatesKey(incoming, 4);
  if (!existingKey || existingKey !== incomingKey) {
    return false;
  }

  return isSameLocale(existing, incoming) || getAddressKey(existing) === getAddressKey(incoming);
};

const isPossibleDuplicate = (existing, incoming) => {
  const sameName = getNameKey(existing) && getNameKey(existing) === getNameKey(incoming);
  const sameAddress = getAddressKey(existing) && getAddressKey(existing) === getAddressKey(incoming);
  const samePhone = getPhoneKey(existing) && getPhoneKey(existing) === getPhoneKey(incoming);
  const sameDomain = getDomainKey(existing) && getDomainKey(existing) === getDomainKey(incoming);
  const sameGeoLoose = getCoordinatesKey(existing, 3) && getCoordinatesKey(existing, 3) === getCoordinatesKey(incoming, 3);

  return Boolean(
    sameDomain
    || samePhone
    || sameAddress
    || sameGeoLoose
    || (sameName && isSameLocale(existing, incoming))
  );
};

const mergeLead = (target, source, reason) => {
  const mergedFrom = new Set([...(target.mergedFrom || []), source.id || source.sourceId || source.nome_fantasia || 'unknown']);
  const mergedProvenance = {
    ...(target.provenance || {}),
    ...(source.provenance || {}),
  };

  const merged = {
    ...target,
    cnpj: target.cnpj || source.cnpj || '',
    razao_social: target.razao_social || source.razao_social || source['razão_social'] || '',
    ['razão_social']: target['razão_social'] || source['razão_social'] || source.razao_social || '',
    nome_fantasia: target.nome_fantasia || source.nome_fantasia || '',
    endereco: target.endereco || source.endereco || '',
    cidade: target.cidade || source.cidade || '',
    uf: target.uf || source.uf || '',
    pais: target.pais || source.pais || 'Brasil',
    bairro: target.bairro || source.bairro || undefined,
    cep: target.cep || source.cep || undefined,
    telefone: target.telefone || source.telefone || undefined,
    website: target.website || source.website || undefined,
    websiteDomain: target.websiteDomain || source.websiteDomain || undefined,
    coordinates: target.coordinates || source.coordinates || undefined,
    whatsappStatus: target.whatsappStatus || source.whatsappStatus || 'NONE',
    score: Math.max(Number(target.score) || 0, Number(source.score) || 0),
    source: target.source,
    provenance: mergedProvenance,
    dedupeStatus: 'merged',
    dedupeReason: reason,
    mergedFrom: Array.from(mergedFrom),
  };

  if (!merged.coordinates) {
    const roundedCoordinates = getRoundedCoordinates(source);
    if (roundedCoordinates) {
      merged.coordinates = roundedCoordinates;
    }
  }

  return merged;
};

const annotatePossibleDuplicate = (company, existing, reasons) => ({
  ...company,
  dedupeStatus: company.dedupeStatus || 'possible_duplicate',
  dedupeReason: company.dedupeReason || reasons[0] || 'possible_duplicate',
  dedupeCandidates: Array.from(new Set([...(company.dedupeCandidates || []), existing.id || existing.sourceId || existing.nome_fantasia || 'unknown'])),
  duplicateReasons: Array.from(new Set([...(company.duplicateReasons || []), ...reasons])),
});

export const createCompanyDeduper = ({ companyNormalizer } = {}) => {
  const normalizeCompanies = (companies = [], context = {}) => {
    if (companyNormalizer && typeof companyNormalizer.normalizeCompanies === 'function') {
      return companyNormalizer.normalizeCompanies(companies, context);
    }

    return companies.map((company) => clone(company));
  };

  const dedupeCompanies = (companies = [], context = {}) => {
    const normalizedCompanies = normalizeCompanies(companies, context);
    const uniqueCompanies = [];
    const report = {
      total: normalizedCompanies.length,
      uniqueCount: 0,
      mergedCount: 0,
      possibleDuplicateCount: 0,
      groups: [],
    };

    const indexMaps = {
      cnpj: new Map(),
      sourceId: new Map(),
      domain: new Map(),
      phone: new Map(),
      coordinates: new Map(),
      nameAddress: new Map(),
      nameLocale: new Map(),
    };

    const addIndex = (map, key, index) => {
      if (!key) {
        return;
      }

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key).push(index);
    };

    const registerIndexes = (company, index) => {
      addIndex(indexMaps.cnpj, normalizeDigits(company.cnpj || ''), index);
      addIndex(indexMaps.sourceId, getSourceIdKey(company), index);
      addIndex(indexMaps.domain, getDomainKey(company), index);
      addIndex(indexMaps.phone, getPhoneKey(company), index);
      addIndex(indexMaps.coordinates, getCoordinatesKey(company, 4), index);
      addIndex(indexMaps.nameAddress, `${getNameKey(company)}|${getAddressKey(company)}`, index);
      addIndex(indexMaps.nameLocale, `${getNameKey(company)}|${getLooseLocationKey(company)}`, index);
    };

    const findFirstMatch = (map, key) => {
      if (!key || !map.has(key)) {
        return null;
      }

      const indexes = map.get(key);
      return indexes.length > 0 ? indexes[0] : null;
    };

    const findBestMatch = (company) => {
      const cnpjKey = normalizeDigits(company.cnpj || '');
      if (cnpjKey) {
        const matchIndex = findFirstMatch(indexMaps.cnpj, cnpjKey);
        if (matchIndex != null) {
          return { index: matchIndex, reason: 'cnpj', certainty: 'high' };
        }
      }

      const sourceIdKey = getSourceIdKey(company);
      if (sourceIdKey) {
        const matchIndex = findFirstMatch(indexMaps.sourceId, sourceIdKey);
        if (matchIndex != null) {
          return { index: matchIndex, reason: 'source_id', certainty: 'high' };
        }
      }

      const domainKey = getDomainKey(company);
      if (domainKey) {
        const matchIndex = findFirstMatch(indexMaps.domain, domainKey);
        if (matchIndex != null) {
          return { index: matchIndex, reason: 'domain', certainty: 'high' };
        }
      }

      const phoneKey = getPhoneKey(company);
      if (phoneKey) {
        const indexes = indexMaps.phone.get(phoneKey) || [];
        for (const index of indexes) {
          if (isHighConfidencePhoneMatch(uniqueCompanies[index], company)) {
            return { index, reason: 'phone', certainty: 'high' };
          }
        }
      }

      const geoKey = getCoordinatesKey(company, 4);
      if (geoKey) {
        const indexes = indexMaps.coordinates.get(geoKey) || [];
        for (const index of indexes) {
          if (isHighConfidenceGeoMatch(uniqueCompanies[index], company)) {
            return { index, reason: 'geography', certainty: 'high' };
          }
        }
      }

      const nameAddressKey = `${getNameKey(company)}|${getAddressKey(company)}`;
      if (nameAddressKey !== '|') {
        const matchIndex = findFirstMatch(indexMaps.nameAddress, nameAddressKey);
        if (matchIndex != null) {
          return { index: matchIndex, reason: 'name_address', certainty: 'high' };
        }
      }

      const possibleDuplicateReasons = [];
      const nameLocaleKey = `${getNameKey(company)}|${getLooseLocationKey(company)}`;
      const nameLocaleIndex = findFirstMatch(indexMaps.nameLocale, nameLocaleKey);
      if (nameLocaleIndex != null) {
        possibleDuplicateReasons.push('same_name_same_locale');
      }

      if (phoneKey) {
        possibleDuplicateReasons.push('same_phone');
      }

      if (domainKey) {
        possibleDuplicateReasons.push('same_domain');
      }

      if (geoKey) {
        possibleDuplicateReasons.push('nearby_coordinates');
      }

      if (possibleDuplicateReasons.length > 0) {
        const candidateIndex =
          nameLocaleIndex ??
          (indexMaps.phone.get(phoneKey)?.[0] ?? null) ??
          (indexMaps.domain.get(domainKey)?.[0] ?? null) ??
          (indexMaps.coordinates.get(geoKey)?.[0] ?? null);

        if (candidateIndex != null) {
          return {
            index: candidateIndex,
            reason: possibleDuplicateReasons[0],
            certainty: 'possible',
            reasons: possibleDuplicateReasons,
          };
        }
      }

      return null;
    };

    for (const company of normalizedCompanies) {
      const match = findBestMatch(company);

      if (match?.certainty === 'high') {
        const canonical = uniqueCompanies[match.index];
        uniqueCompanies[match.index] = mergeLead(canonical, company, match.reason);
        registerIndexes(uniqueCompanies[match.index], match.index);
        report.mergedCount += 1;
        report.groups.push({
          canonicalId: uniqueCompanies[match.index].id,
          mergedFrom: company.id || company.sourceId || company.nome_fantasia || 'unknown',
          reason: match.reason,
          certainty: 'high',
        });
        continue;
      }

      let nextCompany = company;
      if (match?.certainty === 'possible') {
        nextCompany = annotatePossibleDuplicate(company, uniqueCompanies[match.index], match.reasons || [match.reason]);
        report.possibleDuplicateCount += 1;
        report.groups.push({
          canonicalId: uniqueCompanies[match.index].id,
          duplicateId: company.id || company.sourceId || company.nome_fantasia || 'unknown',
          reason: match.reason,
          certainty: 'possible',
        });
      }

      nextCompany = {
        ...nextCompany,
        dedupeStatus: nextCompany.dedupeStatus || 'unique',
      };

      uniqueCompanies.push(nextCompany);
      registerIndexes(nextCompany, uniqueCompanies.length - 1);
    }

    report.uniqueCount = uniqueCompanies.length;

    return {
      companies: uniqueCompanies,
      report,
    };
  };

  return {
    dedupeCompanies,
  };
};
