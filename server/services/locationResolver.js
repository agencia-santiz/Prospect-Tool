const MUNICIPALITIES_ENDPOINT = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios';
const MUNICIPALITY_MALHA_ENDPOINT = 'https://servicodados.ibge.gov.br/api/v3/malhas/municipios';
const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const clone = (value) => JSON.parse(JSON.stringify(value));

const parseQuery = (query) => {
  const raw = String(query || '').trim();
  const splitParts = raw
    .split(/\s*(?:-|,)\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  const city = splitParts[0] || raw;
  const stateCodeCandidate = splitParts.find((part) => /^[A-Z]{2}$/.test(part.toUpperCase()));
  const stateCode = stateCodeCandidate ? stateCodeCandidate.toUpperCase() : '';

  return {
    raw,
    city,
    stateCode,
    normalizedCity: normalizeText(city),
    normalizedQuery: normalizeText(raw),
  };
};

const getMunicipalityLabel = (municipality) => {
  const stateCode = municipality?.microrregiao?.mesorregiao?.UF?.sigla || '';
  const name = String(municipality?.nome || '').trim();

  return {
    id: Number(municipality.id),
    name,
    stateCode,
    label: `${name} - ${stateCode}`,
    normalizedName: normalizeText(name),
    normalizedLabel: normalizeText(`${name} - ${stateCode}`),
  };
};

const fetchJson = async (fetchImpl, url, options) => {
  const response = await fetchImpl(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

const extractGeometry = (payload) => {
  if (!payload) {
    return null;
  }

  if (payload.type === 'FeatureCollection' && Array.isArray(payload.features) && payload.features.length > 0) {
    return payload.features[0]?.geometry || null;
  }

  if (payload.type === 'Feature') {
    return payload.geometry || null;
  }

  if (payload.geometry) {
    return payload.geometry;
  }

  if (Array.isArray(payload.features) && payload.features.length > 0) {
    return payload.features[0]?.geometry || null;
  }

  return null;
};

const visitPositions = (coordinates, visitor) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return;
  }

  if (typeof coordinates[0] === 'number') {
    visitor(coordinates);
    return;
  }

  for (const item of coordinates) {
    visitPositions(item, visitor);
  }
};

const computeBoundingBox = (geometry) => {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;

  visitPositions(geometry?.coordinates, ([longitude, latitude]) => {
    if (longitude < west) west = longitude;
    if (longitude > east) east = longitude;
    if (latitude < south) south = latitude;
    if (latitude > north) north = latitude;
  });

  if (!Number.isFinite(west) || !Number.isFinite(south) || !Number.isFinite(east) || !Number.isFinite(north)) {
    return null;
  }

  return {
    south,
    west,
    north,
    east,
  };
};

const ringCentroid = (ring) => {
  if (!Array.isArray(ring) || ring.length < 3) {
    return null;
  }

  let twiceArea = 0;
  let centroidX = 0;
  let centroidY = 0;

  for (let index = 0; index < ring.length - 1; index += 1) {
    const [x1, y1] = ring[index];
    const [x2, y2] = ring[index + 1];
    const cross = (x1 * y2) - (x2 * y1);
    twiceArea += cross;
    centroidX += (x1 + x2) * cross;
    centroidY += (y1 + y2) * cross;
  }

  if (twiceArea === 0) {
    return null;
  }

  const area = twiceArea / 2;
  return {
    longitude: centroidX / (6 * area),
    latitude: centroidY / (6 * area),
    area: Math.abs(area),
  };
};

const computeCentroid = (geometry, boundingBox) => {
  if (!geometry) {
    if (!boundingBox) {
      return null;
    }

    return {
      longitude: (boundingBox.west + boundingBox.east) / 2,
      latitude: (boundingBox.south + boundingBox.north) / 2,
    };
  }

  if (geometry.type === 'Polygon') {
    const centroid = ringCentroid(geometry.coordinates?.[0]);
    if (centroid) {
      return {
        longitude: centroid.longitude,
        latitude: centroid.latitude,
      };
    }
  }

  if (geometry.type === 'MultiPolygon') {
    let weightedLongitude = 0;
    let weightedLatitude = 0;
    let totalArea = 0;

    for (const polygon of geometry.coordinates || []) {
      const centroid = ringCentroid(polygon?.[0]);
      if (!centroid) {
        continue;
      }

      weightedLongitude += centroid.longitude * centroid.area;
      weightedLatitude += centroid.latitude * centroid.area;
      totalArea += centroid.area;
    }

    if (totalArea > 0) {
      return {
        longitude: weightedLongitude / totalArea,
        latitude: weightedLatitude / totalArea,
      };
    }
  }

  if (boundingBox) {
    return {
      longitude: (boundingBox.west + boundingBox.east) / 2,
      latitude: (boundingBox.south + boundingBox.north) / 2,
    };
  }

  return null;
};

export class LocationNotFoundError extends Error {
  constructor(query) {
    super(`Unable to resolve location: ${query}`);
    this.name = 'LocationNotFoundError';
    this.code = 'LOCATION_NOT_FOUND';
    this.query = query;
  }
}

export const createLocationResolver = ({
  fetchImpl = fetch,
  now = () => Date.now(),
  cacheTtlMs = DEFAULT_CACHE_TTL_MS,
} = {}) => {
  const queryCache = new Map();
  const geometryCache = new Map();
  const municipalityIndexCache = {
    loadedAt: 0,
    entries: [],
  };

  const loadMunicipalityIndex = async () => {
    if (municipalityIndexCache.entries.length > 0 && (now() - municipalityIndexCache.loadedAt) < cacheTtlMs) {
      return municipalityIndexCache.entries;
    }

    const municipalities = await fetchJson(fetchImpl, MUNICIPALITIES_ENDPOINT);
    const entries = Array.isArray(municipalities)
      ? municipalities
          .map(getMunicipalityLabel)
          .filter((item) => item.id && item.name && item.stateCode)
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];

    municipalityIndexCache.loadedAt = now();
    municipalityIndexCache.entries = entries;
    return entries;
  };

  const findMunicipality = (entries, query) => {
    const exactMatches = entries.filter((entry) => entry.normalizedLabel === query.normalizedQuery);
    if (exactMatches.length > 0) {
      return {
        municipality: exactMatches[0],
        matchStrategy: exactMatches.length > 1 ? 'exact-label-ambiguous' : 'exact-label',
      };
    }

    const normalizedCityMatches = entries.filter((entry) => entry.normalizedName === query.normalizedCity);
    if (normalizedCityMatches.length === 0) {
      return null;
    }

    if (query.stateCode) {
      const stateMatch = normalizedCityMatches.find((entry) => entry.stateCode === query.stateCode);
      if (stateMatch) {
        return {
          municipality: stateMatch,
          matchStrategy: 'city-state',
        };
      }
    }

    return {
      municipality: normalizedCityMatches[0],
      matchStrategy: normalizedCityMatches.length > 1 ? 'city-ambiguous' : 'city',
    };
  };

  const loadMunicipalityGeometry = async (municipalityId) => {
    const cached = geometryCache.get(municipalityId);
    if (cached && (now() - cached.loadedAt) < cacheTtlMs) {
      return cached.geometry;
    }

    const geometryPayload = await fetchJson(
      fetchImpl,
      `${MUNICIPALITY_MALHA_ENDPOINT}/${municipalityId}?formato=application/vnd.geo+json`,
      {
        headers: {
          Accept: 'application/vnd.geo+json',
        },
      }
    );

    const geometry = extractGeometry(geometryPayload);
    geometryCache.set(municipalityId, {
      loadedAt: now(),
      geometry,
    });

    return geometry;
  };

  const resolveLocation = async (query) => {
    const parsedQuery = parseQuery(query);
    if (!parsedQuery.raw) {
      throw new LocationNotFoundError(query);
    }

    const cachedResult = queryCache.get(parsedQuery.normalizedQuery);
    if (cachedResult && (now() - cachedResult.loadedAt) < cacheTtlMs) {
      return {
        ...clone(cachedResult.value),
        cacheHit: true,
      };
    }

    const index = await loadMunicipalityIndex();
    const match = findMunicipality(index, parsedQuery);

    if (!match) {
      throw new LocationNotFoundError(parsedQuery.raw);
    }

    const geometry = await loadMunicipalityGeometry(match.municipality.id);
    const boundingBox = computeBoundingBox(geometry);
    const centroid = computeCentroid(geometry, boundingBox);

    if (!boundingBox || !centroid) {
      throw new Error(`Could not derive geography for municipality ${match.municipality.id}`);
    }

    const resolved = {
      query: parsedQuery.raw,
      normalizedQuery: parsedQuery.normalizedQuery,
      city: match.municipality.name,
      stateCode: match.municipality.stateCode,
      country: 'Brasil',
      countryCode: 'BR',
      ibgeMunicipalityId: match.municipality.id,
      label: match.municipality.label,
      matchStrategy: match.matchStrategy,
      source: 'ibge',
      cacheHit: false,
      resolvedAt: new Date(now()).toISOString(),
      geometryType: geometry?.type || 'unknown',
      centroid,
      boundingBox,
    };

    queryCache.set(parsedQuery.normalizedQuery, {
      loadedAt: now(),
      value: resolved,
    });

    return clone(resolved);
  };

  const getCacheState = () => ({
    queryEntries: queryCache.size,
    municipalityEntries: municipalityIndexCache.entries.length,
    geometryEntries: geometryCache.size,
    municipalityIndexLoadedAt: municipalityIndexCache.loadedAt,
  });

  return {
    resolveLocation,
    getCacheState,
  };
};
