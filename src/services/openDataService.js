import { normalizeSegmentText, resolveSegmentQuery, resolveSegmentRecord } from '../utils/segmentDatabase.js';
import { filterLeadsBySegment } from '../utils/segmentLeadMatcher.js';
import { isWhatsAppLink, normalizeWhatsAppPhone } from '../utils/whatsappLink.js';

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
const OPEN_DATA_SOURCE = 'OPEN_DATA';
const OPEN_DATA_USER_AGENT = 'BloomLeadsDesktop/1.0 (OpenDataFallback)';
const OPEN_DATA_ACCEPT_LANGUAGE = 'pt-BR,pt;q=0.9,en;q=0.6';

const DEFAULT_OPEN_DATA_FILTERS = [
  { key: 'office', values: ['company'] },
  { key: 'shop', values: ['computer', 'electronics'] },
];

const containsAny = (value, terms) => terms.some((term) => value.includes(term));

const createFilters = (groups) =>
  groups.flatMap((group) =>
    group.values.map((value) => ({ key: group.key, value }))
  );

const createPizzaFilters = () => ([
  { tags: [{ key: 'cuisine', value: 'pizza' }] },
  { tags: [{ key: 'amenity', value: 'restaurant' }, { key: 'cuisine', value: 'pizza' }] },
  { tags: [{ key: 'amenity', value: 'fast_food' }, { key: 'cuisine', value: 'pizza' }] },
]);

const createFoodFilters = () => {
  const filters = createFilters([
    { key: 'amenity', values: ['restaurant', 'fast_food', 'cafe', 'bar'] },
    { key: 'shop', values: ['bakery'] },
  ]);

  return filters;
};

export const getOpenDataFiltersForSegment = (segment) => {
  const segmentRecord = resolveSegmentRecord(segment, { allowLooseFallback: true });
  const resolved = segmentRecord?.label || resolveSegmentQuery(segment) || String(segment || '');
  const normalized = normalizeSegmentText(resolved);

  if (segmentRecord?.id === 'pizzaria') {
    return createPizzaFilters();
  }

  if (segmentRecord?.broadParent === 'alimentacao' || containsAny(normalized, ['restaurante', 'gastronomia', 'alimentacao', 'food service', 'pizza'])) {
    const filters = createFoodFilters();

    if (segmentRecord?.id === 'alimentacao_food_service' || segmentRecord?.id === 'restaurante_gastronomia') {
      filters.push(
        { key: 'shop', value: 'supermarket' },
        { key: 'shop', value: 'convenience' }
      );
    }

    return filters;
  }

  if (containsAny(normalized, ['supermercado', 'varejo', 'comercio'])) {
    return createFilters([
      { key: 'shop', values: ['supermarket', 'convenience', 'mall', 'department_store'] },
    ]);
  }

  if (containsAny(normalized, ['ecommerce', 'e-commerce', 'e commerce', 'loja virtual', 'marketplace'])) {
    return createFilters([
      { key: 'shop', values: ['electronics', 'computer'] },
      { key: 'office', values: ['company'] },
    ]);
  }

  if (containsAny(normalized, ['vestuario', 'moda'])) {
    return createFilters([
      { key: 'shop', values: ['clothes', 'shoes', 'tailor'] },
    ]);
  }

  if (containsAny(normalized, ['administrativo', 'backoffice'])) {
    return createFilters([
      { key: 'office', values: ['company', 'administrative'] },
    ]);
  }

  if (containsAny(normalized, ['administracao publica', 'governo', 'setor publico', 'prefeitura'])) {
    return createFilters([
      { key: 'office', values: ['government'] },
      { key: 'amenity', values: ['townhall'] },
    ]);
  }

  if (containsAny(normalized, ['consultoria'])) {
    return createFilters([
      { key: 'office', values: ['consulting', 'company'] },
    ]);
  }

  if (containsAny(normalized, ['contabilidade', 'contabil', 'contador'])) {
    return createFilters([
      { key: 'office', values: ['accountant', 'company'] },
    ]);
  }

  if (containsAny(normalized, ['financeiro', 'bancario', 'fintech', 'banco'])) {
    return createFilters([
      { key: 'amenity', values: ['bank'] },
      { key: 'office', values: ['financial'] },
    ]);
  }

  if (containsAny(normalized, ['marketing', 'publicidade', 'agencia'])) {
    return createFilters([
      { key: 'office', values: ['advertising_agency', 'company'] },
    ]);
  }

  if (containsAny(normalized, ['recursos humanos', 'recrutamento', 'headhunter', 'rh'])) {
    return createFilters([
      { key: 'office', values: ['employment_agency', 'company'] },
    ]);
  }

  if (containsAny(normalized, ['juridico', 'advocacia', 'advogado'])) {
    return createFilters([
      { key: 'office', values: ['lawyer', 'company'] },
    ]);
  }

  if (containsAny(normalized, ['educacao', 'curso', 'escola', 'treinamento'])) {
    return createFilters([
      { key: 'amenity', values: ['school', 'college'] },
      { key: 'office', values: ['education'] },
    ]);
  }

  if (containsAny(normalized, ['saude', 'clinica', 'medico', 'hospital'])) {
    return createFilters([
      { key: 'amenity', values: ['clinic', 'doctors', 'hospital'] },
      { key: 'healthcare', values: ['clinic', 'doctor', 'hospital', 'centre'] },
    ]);
  }

  if (containsAny(normalized, ['odontologia', 'dentista', 'odontologico'])) {
    return createFilters([
      { key: 'amenity', values: ['dentist'] },
      { key: 'healthcare', values: ['dentist'] },
      { key: 'healthcare:speciality', values: ['dentistry'] },
    ]);
  }

  if (containsAny(normalized, ['farmacia', 'drogaria'])) {
    return createFilters([
      { key: 'amenity', values: ['pharmacy'] },
      { key: 'shop', values: ['chemist'] },
      { key: 'healthcare', values: ['pharmacy'] },
    ]);
  }

  if (containsAny(normalized, ['beleza', 'estetica', 'barbearia', 'salao'])) {
    return createFilters([
      { key: 'shop', values: ['hairdresser', 'beauty'] },
      { key: 'amenity', values: ['spa'] },
    ]);
  }

  if (containsAny(normalized, ['academia', 'fitness', 'pilates', 'crossfit'])) {
    return createFilters([
      { key: 'leisure', values: ['fitness_centre', 'sports_centre'] },
    ]);
  }

  if (containsAny(normalized, ['construcao', 'engenharia', 'arquitetura'])) {
    return createFilters([
      { key: 'office', values: ['architect', 'engineer', 'construction_company'] },
      { key: 'craft', values: ['builder'] },
    ]);
  }

  if (containsAny(normalized, ['imobiliario', 'imoveis'])) {
    return createFilters([
      { key: 'office', values: ['real_estate_agent'] },
    ]);
  }

  if (containsAny(normalized, ['logistica', 'transporte', 'frete'])) {
    return createFilters([
      { key: 'office', values: ['logistics', 'company'] },
      { key: 'amenity', values: ['bus_station'] },
    ]);
  }

  if (containsAny(normalized, ['automotivo', 'autopecas', 'concessionaria', 'oficina'])) {
    return createFilters([
      { key: 'shop', values: ['car', 'car_parts'] },
      { key: 'craft', values: ['mechanic'] },
      { key: 'shop', values: ['car_repair'] },
    ]);
  }

  if (containsAny(normalized, ['assistencia tecnica', 'suporte tecnico', 'reparo'])) {
    return createFilters([
      { key: 'shop', values: ['electronics', 'computer'] },
      { key: 'craft', values: ['repair'] },
    ]);
  }

  if (containsAny(normalized, ['telecom', 'telefonia', 'internet'])) {
    return createFilters([
      { key: 'shop', values: ['mobile_phone'] },
      { key: 'office', values: ['telecommunication'] },
    ]);
  }

  if (containsAny(normalized, ['energia solar', 'fotovoltaica', 'solar'])) {
    return createFilters([
      { key: 'office', values: ['energy_supplier'] },
      { key: 'craft', values: ['solar_energy'] },
    ]);
  }

  if (containsAny(normalized, ['seguranca', 'monitoramento', 'cftv'])) {
    return createFilters([
      { key: 'office', values: ['security'] },
      { key: 'craft', values: ['security'] },
    ]);
  }

  if (containsAny(normalized, ['limpeza', 'facilities'])) {
    return createFilters([
      { key: 'office', values: ['cleaning_service'] },
    ]);
  }

  if (containsAny(normalized, ['eventos', 'buffet', 'cerimonial'])) {
    return createFilters([
      { key: 'craft', values: ['caterer'] },
      { key: 'amenity', values: ['events_venue'] },
    ]);
  }

  if (containsAny(normalized, ['hotelaria', 'turismo', 'hotel', 'pousada'])) {
    return createFilters([
      { key: 'tourism', values: ['hotel', 'guest_house', 'hostel', 'apartment'] },
    ]);
  }

  if (containsAny(normalized, ['pet', 'veterinaria'])) {
    return createFilters([
      { key: 'shop', values: ['pet'] },
      { key: 'amenity', values: ['veterinary'] },
    ]);
  }

  if (containsAny(normalized, ['laboratorio', 'analises', 'diagnostico'])) {
    return createFilters([
      { key: 'amenity', values: ['laboratory'] },
    ]);
  }

  if (containsAny(normalized, ['otica', 'oculos'])) {
    return createFilters([
      { key: 'shop', values: ['optician'] },
    ]);
  }

  if (containsAny(normalized, ['papelaria', 'material de escritorio', 'escritorio'])) {
    return createFilters([
      { key: 'shop', values: ['stationery'] },
    ]);
  }

  if (containsAny(normalized, ['distribuidora', 'atacado', 'wholesale'])) {
    return createFilters([
      { key: 'shop', values: ['wholesale', 'supermarket'] },
    ]);
  }

  if (containsAny(normalized, ['importacao', 'exportacao', 'comex'])) {
    return createFilters([
      { key: 'office', values: ['company', 'logistics'] },
      { key: 'office', values: ['freight_forwarding'] },
    ]);
  }

  if (containsAny(normalized, ['startups', 'startup', 'saas'])) {
    return createFilters([
      { key: 'office', values: ['company', 'it'] },
    ]);
  }

  if (containsAny(normalized, ['cooperativa'])) {
    return createFilters([
      { key: 'office', values: ['cooperative'] },
    ]);
  }

  if (containsAny(normalized, ['utilities', 'saneamento', 'energia'])) {
    return createFilters([
      { key: 'office', values: ['utility'] },
    ]);
  }

  if (containsAny(normalized, ['call center', 'bpo', 'contact center'])) {
    return createFilters([
      { key: 'office', values: ['call_centre', 'company'] },
    ]);
  }

  if (containsAny(normalized, ['ti', 'infraestrutura', 'software'])) {
    return createFilters([
      { key: 'office', values: ['it', 'company'] },
      { key: 'shop', values: ['computer', 'electronics'] },
    ]);
  }

  return DEFAULT_OPEN_DATA_FILTERS;
};

const escapeOverpassValue = (value) =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

export const buildOverpassQuery = (bbox, segment) => {
  const filters = getOpenDataFiltersForSegment(segment);
  const [south, west, north, east] = bbox;

  const statements = filters.map((filter) => {
    const tags = filter.tags || [{ key: filter.key, value: filter.value }];
    const clause = tags
      .map(({ key, value }) => `["${escapeOverpassValue(key)}"="${escapeOverpassValue(value)}"]`)
      .join('');

    return `  nwr${clause}(${south},${west},${north},${east});`;
  });

  return [
    '[out:json][timeout:30];',
    '(',
    ...statements,
    ');',
    'out center;',
  ].join('\n');
};

export const buildNominatimRequest = (location) => {
  const raw = String(location || '').trim();
  const parts = raw.split(' - ').map((part) => part.trim()).filter(Boolean);
  const isBrazilianState = parts.length >= 2 && /^[A-Z]{2}$/.test(parts[1]);

  const query = isBrazilianState
    ? `${parts[0]}, ${parts[1]}, Brasil`
    : parts.length >= 2
      ? `${parts[0]}, ${parts.slice(1).join(', ')}`
      : raw;

  const params = new URLSearchParams({
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
    namedetails: '1',
    extratags: '1',
    q: query,
  });

  if (isBrazilianState) {
    params.set('countrycodes', 'br');
  }

  return `${NOMINATIM_ENDPOINT}?${params.toString()}`;
};

export const buildOpenDataRequestHeaders = () => ({
  'User-Agent': OPEN_DATA_USER_AGENT,
  'From': 'bloom-leads@localhost',
  'Accept-Language': OPEN_DATA_ACCEPT_LANGUAGE,
});

const parseLocationParts = (location, nominatimResult) => {
  const raw = String(location || '').trim();
  const parts = raw.split(' - ').map((part) => part.trim()).filter(Boolean);
  const region = parts[1] || '';
  const isBrazilianState = /^[A-Z]{2}$/.test(region);
  const address = nominatimResult?.address || {};
  const parsedRegion = isBrazilianState
    ? region
    : address.state || region || '';

  return {
    city: address.city || address.town || address.village || parts[0] || raw,
    region: parsedRegion,
    country: address.country || (isBrazilianState ? 'Brasil' : region || ''),
    countryCode: address.country_code || (isBrazilianState ? 'br' : ''),
    isBrazilianState,
  };
};

const normalizeWebsite = (value) => {
  if (!value) return null;
  const cleaned = String(value).trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
  return cleaned || null;
};

const normalizePhone = (value) => {
  if (!value) return null;
  const cleaned = String(value).trim();
  return cleaned || null;
};

const getTag = (tags, names) => {
  for (const name of names) {
    if (tags?.[name]) return tags[name];
  }
  return null;
};

const formatAddress = (tags, locationInfo) => {
  const fullAddress = tags?.['addr:full'];
  if (fullAddress) return fullAddress;

  const street = getTag(tags, ['addr:street']);
  const number = getTag(tags, ['addr:housenumber']);
  const neighborhood = getTag(tags, ['addr:neighbourhood', 'addr:suburb', 'addr:quarter']);
  const city = getTag(tags, ['addr:city']) || locationInfo.city;
  const region = getTag(tags, ['addr:state']) || locationInfo.region;
  const country = getTag(tags, ['addr:country']) || locationInfo.country;

  const streetLine = [street, number].filter(Boolean).join(', ');
  const parts = [streetLine, neighborhood, city, region, country].filter(Boolean);
  return parts.length > 0 ? parts.join(' - ') : '';
};

const computeScore = (tags) => {
  let score = 40;
  if (getTag(tags, ['website', 'contact:website'])) score += 15;
  if (getTag(tags, ['phone', 'contact:phone'])) score += 15;
  if (isWhatsAppLink(getTag(tags, ['website', 'contact:website'])) || getTag(tags, ['contact:whatsapp', 'whatsapp'])) score += 10;
  if (getTag(tags, ['email', 'contact:email'])) score += 10;
  if (getTag(tags, ['opening_hours'])) score += 5;
  if (getTag(tags, ['addr:street', 'addr:full'])) score += 5;
  if (getTag(tags, ['addr:city', 'addr:state'])) score += 5;
  return Math.min(100, score);
};

export const mapOpenDataElementToCompany = (element, locationInfo, segment) => {
  const tags = element?.tags || {};
  const businessName = getTag(tags, ['name', 'brand', 'operator']) || segment || 'Empresa sem nome';
  const legalName = getTag(tags, ['operator', 'brand', 'name']) || businessName;
  const whatsappContact = getTag(tags, ['contact:whatsapp', 'whatsapp']);
  const phoneContact = getTag(tags, ['phone', 'contact:phone']);
  const city = locationInfo.city || getTag(tags, ['addr:city']) || '';
  const region = getTag(tags, ['addr:state']) || locationInfo.region || '';
  const country = getTag(tags, ['addr:country']) || locationInfo.country || '';
  const bairro = getTag(tags, ['addr:neighbourhood', 'addr:suburb', 'addr:quarter']);
  const websiteTag = getTag(tags, ['website', 'contact:website']);
  const hasExplicitWhatsAppEvidence = isWhatsAppLink(websiteTag) || Boolean(whatsappContact);
  const normalizedWebsite = normalizeWebsite(websiteTag) || (isWhatsAppLink(whatsappContact) ? normalizeWebsite(whatsappContact) : null);
  const normalizedPhone = normalizePhone(phoneContact)
    || (whatsappContact ? normalizeWhatsAppPhone(whatsappContact) || normalizePhone(whatsappContact) : null);

  return {
    id: `${OPEN_DATA_SOURCE}-${element?.type || 'item'}-${element?.id || businessName}-${normalizeSegmentText(businessName)}`,
    sourceId: element?.id ? String(element.id) : undefined,
    cnpj: '',
    razao_social: legalName,
    nome_fantasia: businessName,
    endereco: formatAddress(tags, locationInfo),
    cidade: city,
    uf: region,
    pais: country || 'Brasil',
    bairro: bairro || undefined,
    cep: getTag(tags, ['addr:postcode']) || undefined,
    opening_hours: getTag(tags, ['opening_hours']) || undefined,
    is_open_now: false,
    atividade_principal: segment,
    telefone: normalizedPhone || undefined,
    email: getTag(tags, ['email', 'contact:email']) || undefined,
    website: normalizedWebsite || undefined,
    coordinates: Number.isFinite(Number(element?.lat)) && Number.isFinite(Number(element?.lon))
      ? {
          latitude: Number(element.lat),
          longitude: Number(element.lon),
        }
      : Number.isFinite(Number(element?.center?.lat)) && Number.isFinite(Number(element?.center?.lon))
        ? {
            latitude: Number(element.center.lat),
            longitude: Number(element.center.lon),
          }
        : undefined,
    whatsappStatus: hasExplicitWhatsAppEvidence
      ? 'CONFIRMED'
      : normalizedPhone
        ? 'UNCONFIRMED'
        : 'NONE',
    status: 'NEW',
    score: computeScore(tags),
    source: OPEN_DATA_SOURCE,
    provenance: {
      source: OPEN_DATA_SOURCE,
      osmTags: tags,
      searchSegment: segment,
      location: locationInfo,
    },
    googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName}, ${formatAddress(tags, locationInfo)}`)}`,
    socials: {
      instagram: getTag(tags, ['contact:instagram']) || undefined,
      facebook: getTag(tags, ['contact:facebook']) || undefined,
      linkedin: getTag(tags, ['contact:linkedin']) || undefined,
    },
  };
};

const dedupeCompanies = (companies) => {
  const seen = new Map();

  for (const company of companies) {
    const key = `${normalizeSegmentText(company.nome_fantasia)}|${normalizeSegmentText(company.endereco || company.cidade)}`;
    const existing = seen.get(key);

    if (!existing || company.score > existing.score) {
      seen.set(key, company);
    }
  }

  return Array.from(seen.values());
};

const fetchJson = async (fetchImpl, url, options) => {
  const response = await fetchImpl(url, options);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

export const fetchOpenDataLeads = async (
  location,
  segment,
  excludeNames = [],
  quantity = 9,
  fetchImpl = fetch
) => {
  const nominatimUrl = buildNominatimRequest(location);
  const openDataHeaders = buildOpenDataRequestHeaders();
  const geocodes = await fetchJson(fetchImpl, nominatimUrl, {
    headers: openDataHeaders,
  });

  if (!Array.isArray(geocodes) || geocodes.length === 0) {
    return [];
  }

  const geocode = geocodes[0];
  const locationInfo = parseLocationParts(location, geocode);
  const bboxRaw = geocode.boundingbox;
  const bbox = Array.isArray(bboxRaw) && bboxRaw.length === 4
    ? [Number(bboxRaw[0]), Number(bboxRaw[2]), Number(bboxRaw[1]), Number(bboxRaw[3])]
    : (() => {
        const lat = Number(geocode.lat);
        const lon = Number(geocode.lon);
        const delta = 0.05;
        return [lat - delta, lon - delta, lat + delta, lon + delta];
      })();

  const overpassQuery = buildOverpassQuery(bbox, segment);
  const overpassBody = new URLSearchParams({ data: overpassQuery });
  let overpassData = null;
  let lastError = null;

  for (const overpassEndpoint of OVERPASS_ENDPOINTS) {
    try {
      const overpassResponse = await fetchImpl(overpassEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          ...openDataHeaders,
        },
        body: overpassBody,
      });

      if (!overpassResponse.ok) {
        lastError = new Error(`Request failed with status ${overpassResponse.status}`);
        lastError.status = overpassResponse.status;
        continue;
      }

      overpassData = await overpassResponse.json();
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!overpassData) {
    throw lastError || new Error('Request failed for all Overpass endpoints');
  }

  const elements = Array.isArray(overpassData?.elements) ? overpassData.elements : [];
  const excluded = new Set(excludeNames.map((name) => normalizeSegmentText(name)));
  const companies = elements
    .map((element) => mapOpenDataElementToCompany(element, locationInfo, segment))
    .filter((company) => !excluded.has(normalizeSegmentText(company.nome_fantasia)))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.nome_fantasia.localeCompare(b.nome_fantasia);
    });

  return filterLeadsBySegment(dedupeCompanies(companies), segment).slice(0, quantity);
};
