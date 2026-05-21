import { normalizeSegmentText } from '../../src/utils/segmentDatabase.js';
import { filterLeadsBySegment } from '../../src/utils/segmentLeadMatcher.js';

const GOOGLE_PLACES_SEARCH_ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
const GOOGLE_PLACES_DETAILS_ENDPOINT = 'https://places.googleapis.com/v1/places';
const GOOGLE_GEOCODING_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';
const DEFAULT_LANGUAGE_CODE = 'pt-BR';
const DEFAULT_REGION_CODE = 'BR';
const GOOGLE_PLACES_MAX_PAGE_SIZE = 20;

const clone = (value) => JSON.parse(JSON.stringify(value));

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

const stripProtocol = (value) => String(value || '').trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');

const normalizePhone = (value) => {
  const digits = String(value || '').replace(/\D+/g, '');
  return digits || '';
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const pickAddressComponent = (components, type) => {
  if (!Array.isArray(components)) {
    return null;
  }

  return components.find((component) => Array.isArray(component?.types) && component.types.includes(type)) || null;
};

const normalizeCity = (place, locationContext) => {
  const cityComponent = pickAddressComponent(place?.addressComponents, 'locality')
    || pickAddressComponent(place?.addressComponents, 'administrative_area_level_2');
  return cityComponent?.longText || cityComponent?.shortText || locationContext?.city || '';
};

const normalizeState = (place, locationContext) => {
  const stateComponent = pickAddressComponent(place?.addressComponents, 'administrative_area_level_1');
  return stateComponent?.shortText || stateComponent?.longText || locationContext?.stateCode || '';
};

const normalizeCountry = (place, locationContext) => {
  const countryComponent = pickAddressComponent(place?.addressComponents, 'country');
  return countryComponent?.longText || countryComponent?.shortText || locationContext?.country || 'Brasil';
};

const normalizeBairro = (place, locationContext) => {
  const suburbComponent = pickAddressComponent(place?.addressComponents, 'sublocality')
    || pickAddressComponent(place?.addressComponents, 'sublocality_level_1');
  return suburbComponent?.longText || suburbComponent?.shortText || locationContext?.bairro || undefined;
};

const normalizeCep = (place) => {
  const postalCode = pickAddressComponent(place?.addressComponents, 'postal_code');
  return postalCode?.longText || postalCode?.shortText || undefined;
};

const buildCircleBias = (center, radius = 8000) => {
  if (!center || !Number.isFinite(center.latitude) || !Number.isFinite(center.longitude)) {
    return null;
  }

  return {
    circle: {
      center: {
        latitude: center.latitude,
        longitude: center.longitude,
      },
      radius,
    },
  };
};

const buildRectangleBias = (boundingBox) => {
  if (!boundingBox) {
    return null;
  }

  const { south, west, north, east } = boundingBox;
  if (![south, west, north, east].every((value) => Number.isFinite(Number(value)))) {
    return null;
  }

  return {
    rectangle: {
      low: {
        latitude: Number(south),
        longitude: Number(west),
      },
      high: {
        latitude: Number(north),
        longitude: Number(east),
      },
    },
  };
};

const buildLocationBias = (plan, geocodeResult) => {
  const fromBoundingBox = buildRectangleBias(plan?.location?.boundingBox);
  if (fromBoundingBox) {
    return fromBoundingBox;
  }

  if (geocodeResult?.location) {
    const circle = buildCircleBias(geocodeResult.location, 9000);
    if (circle) {
      return circle;
    }
  }

  return null;
};

const buildFetchUrl = (url, params = {}) => {
  const builtUrl = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      builtUrl.searchParams.set(key, String(value));
    }
  }
  return builtUrl.toString();
};

const fetchJson = async (fetchImpl, url, options = {}) => {
  const response = await fetchImpl(url, options);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

const geocodeToLocation = (geocodeResult) => {
  if (!geocodeResult) {
    return null;
  }

  const geometry = geocodeResult.geometry || {};
  const viewport = geometry.viewport || {};
  const northeast = viewport.northeast || {};
  const southwest = viewport.southwest || {};

  return {
    placeId: geocodeResult.place_id || null,
    formattedAddress: geocodeResult.formatted_address || null,
    location: geometry.location && Number.isFinite(Number(geometry.location.lat)) && Number.isFinite(Number(geometry.location.lng))
      ? {
          latitude: Number(geometry.location.lat),
          longitude: Number(geometry.location.lng),
        }
      : null,
    viewport: geometry.viewport
      ? {
          north: Number(northeast.lat),
          east: Number(northeast.lng),
          south: Number(southwest.lat),
          west: Number(southwest.lng),
        }
      : null,
    locationType: geometry.location_type || null,
    granularity: geocodeResult.types?.[0] || null,
  };
};

const normalizePlacesResponse = (payload) => {
  if (!payload) {
    return [];
  }

  return Array.isArray(payload.places) ? payload.places : [];
};

const getGoogleMapsApiKey = (env) => env.GOOGLE_MAPS_API_KEY || env.GOOGLE_PLACES_API_KEY || env.GOOGLE_API_KEY || '';

const mapGooglePlaceToCompany = (place, locationContext, segmentLabel) => {
  const businessName = place?.displayName?.text || place?.displayName || place?.formattedAddress || segmentLabel || 'Empresa sem nome';
  const website = place?.websiteUri ? stripProtocol(place.websiteUri) : undefined;
  const phone = normalizePhone(place?.nationalPhoneNumber || place?.internationalPhoneNumber) || undefined;
  const rating = toNumber(place?.rating);
  const userRatingsTotal = toNumber(place?.userRatingCount ?? place?.userRatingsTotal);
  const city = normalizeCity(place, locationContext);
  const uf = normalizeState(place, locationContext);
  const country = normalizeCountry(place, locationContext);
  const bairro = normalizeBairro(place, locationContext);
  const cep = normalizeCep(place);
  const location = place?.location || {};
  const hasWhatsAppEvidence = /wa\.me|whatsapp/i.test(String(place?.websiteUri || ''));
  const baseScore = 70
    + (phone ? 15 : 0)
    + (website ? 10 : 0)
    + (place?.businessStatus === 'OPERATIONAL' ? 5 : 0)
    + (place?.primaryType ? 5 : 0);

  return {
    id: `GOOGLE_MAPS-${place?.id || normalizeSegmentText(`${businessName}|${place?.formattedAddress || city || ''}`)}`,
    sourceId: place?.id || undefined,
    cnpj: '',
    ['raz\u00e3o_social']: businessName,
    nome_fantasia: businessName,
    endereco: place?.formattedAddress || locationContext?.displayLabel || locationContext?.label || '',
    cidade: city || locationContext?.city || '',
    uf: uf || locationContext?.stateCode || '',
    pais: country || locationContext?.country || 'Brasil',
    bairro,
    cep,
    coordinates: Number.isFinite(location.latitude) && Number.isFinite(location.longitude)
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
        }
      : undefined,
    opening_hours: place?.currentOpeningHours?.weekdayDescriptions?.[0] || place?.regularOpeningHours?.weekdayDescriptions?.[0] || undefined,
    is_open_now: Boolean(place?.currentOpeningHours?.openNow ?? place?.regularOpeningHours?.openNow ?? false),
    atividade_principal: segmentLabel,
    telefone: phone,
    email: undefined,
    website,
    rating: Number.isFinite(rating) ? rating : undefined,
    userRatingsTotal: Number.isFinite(userRatingsTotal) ? userRatingsTotal : undefined,
    whatsappStatus: hasWhatsAppEvidence
      ? 'CONFIRMED'
      : phone
        ? 'UNCONFIRMED'
        : 'NONE',
    status: 'NEW',
    score: Math.min(100, baseScore),
    source: 'GOOGLE_MAPS',
    provenance: {
      source: 'GOOGLE_MAPS',
      primaryType: place?.primaryType || null,
      types: Array.isArray(place?.types) ? place.types : [],
      searchSegment: segmentLabel,
      location: locationContext,
    },
    googleMapsUri: place?.googleMapsUri || undefined,
    socials: {
      linkedin: undefined,
      instagram: undefined,
      facebook: undefined,
    },
  };
};

const dedupeCompanies = (companies) => {
  const seen = new Map();

  for (const company of companies) {
    const key = `${normalizeText(company.nome_fantasia)}|${normalizeText(company.endereco || company.cidade)}`;
    const existing = seen.get(key);

    if (!existing || company.score > existing.score) {
      seen.set(key, company);
    }
  }

  return Array.from(seen.values());
};

export const createGoogleMapsService = ({
  env = process.env,
  fetchImpl = fetch,
} = {}) => {
  const apiKey = getGoogleMapsApiKey(env);
  const configured = Boolean(apiKey);
  const geocodeCache = new Map();
  const searchCache = new Map();

  const geocodeLocation = async (location, { regionCode = DEFAULT_REGION_CODE, languageCode = DEFAULT_LANGUAGE_CODE } = {}) => {
    const query = String(location || '').trim();
    if (!query) {
      return null;
    }

    if (!configured) {
      return null;
    }

    const cacheKey = `${normalizeText(query)}|${regionCode}|${languageCode}`;
    if (geocodeCache.has(cacheKey)) {
      return clone(geocodeCache.get(cacheKey));
    }

    const url = buildFetchUrl(GOOGLE_GEOCODING_ENDPOINT, {
      address: query,
      region: regionCode.toLowerCase(),
      language: languageCode,
      key: apiKey,
    });

    const payload = await fetchJson(fetchImpl, url);
    const geocodeResult = Array.isArray(payload?.results) ? payload.results[0] : null;
    const normalized = geocodeToLocation(geocodeResult);

    geocodeCache.set(cacheKey, normalized);
    return clone(normalized);
  };

  const searchPlaces = async ({
    textQuery,
    pageSize = 9,
    languageCode = DEFAULT_LANGUAGE_CODE,
    regionCode = DEFAULT_REGION_CODE,
    locationBias = null,
    includePureServiceAreaBusinesses = true,
  } = {}) => {
    const query = String(textQuery || '').trim();
    if (!query) {
      return [];
    }

    if (!configured) {
      const error = new Error('GOOGLE_MAPS_API_KEY is not configured on the backend');
      error.code = 'MISSING_GOOGLE_MAPS_API_KEY';
      throw error;
    }

    const requestedResultCount = Math.max(1, Number(pageSize) || 9);
    const normalizedPageSize = Math.min(requestedResultCount, GOOGLE_PLACES_MAX_PAGE_SIZE);
    const cacheKey = JSON.stringify({
      query: normalizeText(query),
      requestedResultCount,
      languageCode,
      regionCode,
      locationBias,
      includePureServiceAreaBusinesses,
    });

    if (searchCache.has(cacheKey)) {
      return clone(searchCache.get(cacheKey));
    }

    const requestHeaders = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.location',
        'places.primaryType',
        'places.types',
        'places.websiteUri',
        'places.nationalPhoneNumber',
        'places.internationalPhoneNumber',
        'places.rating',
        'places.userRatingCount',
        'places.googleMapsUri',
        'places.businessStatus',
        'places.addressComponents',
        'places.currentOpeningHours',
        'places.regularOpeningHours',
        'nextPageToken',
      ].join(','),
    };

    const locationRequest = locationBias?.rectangle
      ? { locationRestriction: locationBias }
      : locationBias
        ? { locationBias }
        : {};

    const baseRequestBody = {
      textQuery: query,
      pageSize: normalizedPageSize,
      languageCode,
      regionCode,
      includePureServiceAreaBusinesses,
      ...locationRequest,
    };

    const places = [];
    let nextPageToken = null;

    do {
      const payload = await fetchJson(fetchImpl, GOOGLE_PLACES_SEARCH_ENDPOINT, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          ...baseRequestBody,
          ...(nextPageToken ? { pageToken: nextPageToken } : {}),
        }),
      });

      places.push(...normalizePlacesResponse(payload));
      nextPageToken = payload?.nextPageToken || null;
    } while (nextPageToken && places.length < requestedResultCount);

    const limitedPlaces = places.slice(0, requestedResultCount);
    searchCache.set(cacheKey, limitedPlaces);
    return clone(limitedPlaces);
  };

  const fetchEnrichedLeads = async (locationOrArgs, segment, excludeNames = [], quantity = 9) => {
    const args = locationOrArgs && typeof locationOrArgs === 'object' && !Array.isArray(locationOrArgs)
      ? locationOrArgs
      : {
          location: locationOrArgs,
          segment,
          excludeNames,
          quantity,
        };

    const location = String(args.location || '').trim();
    const resolvedSegment = String(args.segment || '').trim();
    const resolvedExcludeNames = Array.isArray(args.excludeNames) ? args.excludeNames : [];
    const resolvedQuantity = Math.max(1, Number(args.quantity) || 9);
    const plan = args.plan || {};
    const locationContext = plan.location || {};
    const hasPlanBoundingBox = Boolean(buildRectangleBias(locationContext.boundingBox));
    const geocodedLocation = hasPlanBoundingBox
      ? null
      : plan.googleLocation || await geocodeLocation(location, {
          regionCode: locationContext.countryCode || DEFAULT_REGION_CODE,
          languageCode: DEFAULT_LANGUAGE_CODE,
        });
    const locationBias = buildLocationBias(plan, geocodedLocation);
    const canonicalQuery = `${resolvedSegment} em ${location}`;

    const places = await searchPlaces({
      textQuery: canonicalQuery,
      pageSize: resolvedQuantity,
      languageCode: DEFAULT_LANGUAGE_CODE,
      regionCode: locationContext.countryCode || DEFAULT_REGION_CODE,
      locationBias,
      includePureServiceAreaBusinesses: true,
    });

    const excluded = new Set(resolvedExcludeNames.map((value) => normalizeText(value)));
    const companies = places
      .map((place) => mapGooglePlaceToCompany(place, locationContext, resolvedSegment))
      .filter((company) => !excluded.has(normalizeText(company.nome_fantasia)));

    return filterLeadsBySegment(dedupeCompanies(companies), resolvedSegment).slice(0, resolvedQuantity);
  };

  return {
    configured,
    geocodeLocation,
    searchPlaces,
    fetchEnrichedLeads,
  };
};
