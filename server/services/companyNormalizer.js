const clone = (value) => {
  if (value == null) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
};

const trimText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

const normalizeDigits = (value = '') => String(value).replace(/\D+/g, '');

const normalizePhone = (value = '') => {
  const digits = normalizeDigits(value);
  return digits || '';
};

const normalizeWebsite = (value = '') => {
  const text = trimText(value);
  if (!text) {
    return '';
  }

  return text
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '');
};

const normalizeWebsiteDomain = (value = '') => {
  const website = normalizeWebsite(value);
  if (!website) {
    return '';
  }

  try {
    const withScheme = /^https?:\/\//i.test(website) ? website : `https://${website}`;
    return new URL(withScheme).hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return website.toLowerCase();
  }
};

const normalizeCnpj = (value = '') => {
  const digits = normalizeDigits(value);
  return digits.length === 14 ? digits : '';
};

const getByPath = (source, path) => {
  const segments = String(path).split('.');
  let current = source;

  for (const segment of segments) {
    if (current == null || typeof current !== 'object' || !(segment in current)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
};

const pickFirst = (source, paths = []) => {
  for (const path of paths) {
    const value = getByPath(source, path);
    if (value != null && String(value).trim() !== '') {
      return value;
    }
  }

  return undefined;
};

const normalizeRegion = (value = '') => {
  const text = trimText(value);
  return text.length === 2 ? text.toUpperCase() : text;
};

const normalizeCoordinates = (record = {}) => {
  const latitude = pickFirst(record, [
    'coordinates.latitude',
    'location.latitude',
    'geo.latitude',
    'lat',
    'latitude',
  ]);
  const longitude = pickFirst(record, [
    'coordinates.longitude',
    'location.longitude',
    'geo.longitude',
    'lon',
    'lng',
    'longitude',
  ]);

  const normalizedLatitude = Number(latitude);
  const normalizedLongitude = Number(longitude);

  if (!Number.isFinite(normalizedLatitude) || !Number.isFinite(normalizedLongitude)) {
    return null;
  }

  return {
    latitude: normalizedLatitude,
    longitude: normalizedLongitude,
  };
};

const normalizeWhatsAppStatus = (value) => {
  const text = trimText(value).toLowerCase();

  if (text === 'confirmed' || text === 'confimado' || text === 'confirmado') {
    return 'CONFIRMED';
  }

  if (text === 'unconfirmed' || text === 'nao confirmado' || text === 'não confirmado') {
    return 'UNCONFIRMED';
  }

  if (text === 'none' || text === 'nao possui' || text === 'não possui') {
    return 'NONE';
  }

  return '';
};

const normalizeScore = (value) => {
  const score = Number(value);
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

const buildAddress = (record = {}) => {
  const rawAddress = pickFirst(record, [
    'endereco',
    'address',
    'formattedAddress',
    'logradouro',
    'address.line1',
  ]);

  if (rawAddress) {
    return trimText(rawAddress);
  }

  const line1 = trimText(pickFirst(record, ['address.line1', 'street', 'logradouro']) || '');
  const neighborhood = trimText(pickFirst(record, ['bairro', 'neighborhood', 'address.neighborhood']) || '');
  const city = trimText(pickFirst(record, ['cidade', 'city', 'address.city']) || '');
  const region = trimText(pickFirst(record, ['uf', 'state', 'stateCode', 'address.region']) || '');
  const country = trimText(pickFirst(record, ['pais', 'country', 'address.country']) || '');
  const postalCode = trimText(pickFirst(record, ['cep', 'postalCode', 'address.postalCode']) || '');

  const parts = [line1, neighborhood, city, region, country].filter(Boolean);

  if (parts.length === 0 && postalCode) {
    return postalCode;
  }

  return parts.join(' - ');
};

export const createCompanyNormalizer = () => {
  const normalizeCompany = (company = {}, context = {}) => {
    const record = clone(company) || {};
    const source = trimText(record.source || context.source || 'UNKNOWN').toUpperCase();
    const legalName = trimText(pickFirst(record, [
      'razao_social',
      'razão_social',
      'nome_empresarial',
      'legalName',
      'operator',
      'brand',
      'displayName',
      'name',
    ]) || '');
    const tradeName = trimText(pickFirst(record, [
      'nome_fantasia',
      'tradeName',
      'businessName',
      'displayName',
      'name',
    ]) || legalName || 'Empresa sem nome');
    const address = buildAddress(record);
    const city = trimText(pickFirst(record, [
      'cidade',
      'city',
      'address.city',
    ]) || context.location?.city || '');
    const region = normalizeRegion(pickFirst(record, [
      'uf',
      'state',
      'stateCode',
      'address.region',
    ]) || context.location?.stateCode || '');
    const country = trimText(pickFirst(record, [
      'pais',
      'country',
      'address.country',
    ]) || context.location?.country || 'Brasil');
    const bairro = trimText(pickFirst(record, [
      'bairro',
      'neighborhood',
      'suburb',
      'address.neighborhood',
    ]) || '');
    const cep = trimText(pickFirst(record, [
      'cep',
      'postalCode',
      'address.postalCode',
    ]) || '');
    const phone = normalizePhone(pickFirst(record, [
      'telefone',
      'phone',
      'nationalPhoneNumber',
      'internationalPhoneNumber',
      'contact.phone',
      'contactPhone',
    ]) || '');
    const website = normalizeWebsite(pickFirst(record, [
      'website',
      'websiteUrl',
      'url',
      'contact.website',
      'site',
    ]) || '');
    const websiteDomain = normalizeWebsiteDomain(website || pickFirst(record, [
      'websiteDomain',
      'domain',
    ]) || '');
    const coordinates = normalizeCoordinates(record);
    const sourceId = trimText(pickFirst(record, [
      'sourceId',
      'id',
      'placeId',
      'place_id',
      'googlePlaceId',
    ]) || '');
    const whatsappStatus = normalizeWhatsAppStatus(pickFirst(record, [
      'whatsappStatus',
      'whatsapp_status',
    ]) || '');
    const normalizedName = tradeName || legalName || 'Empresa sem nome';

    return {
      ...record,
      id: record.id || sourceId || `${source}:${normalizedName}`,
      sourceId: sourceId || undefined,
      cnpj: normalizeCnpj(record.cnpj || record.taxId || ''),
      ['razão_social']: legalName || normalizedName,
      razao_social: legalName || normalizedName,
      nome_fantasia: normalizedName,
      endereco: address || undefined,
      cidade: city || context.location?.city || '',
      uf: region || context.location?.stateCode || '',
      pais: country || 'Brasil',
      bairro: bairro || undefined,
      cep: cep || undefined,
      telefone: phone || undefined,
      website: website || undefined,
      websiteDomain: websiteDomain || undefined,
      coordinates: coordinates || undefined,
      whatsappStatus: whatsappStatus || record.whatsappStatus || 'NONE',
      score: normalizeScore(record.score),
      source,
      provenance: {
        ...(record.provenance || {}),
        source,
      },
    };
  };

  const normalizeCompanies = (companies = [], context = {}) => companies.map((company) => normalizeCompany(company, context));

  return {
    normalizeCompany,
    normalizeCompanies,
  };
};
