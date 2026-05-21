import assert from 'node:assert/strict';
import { createCompanyDeduper } from '../server/services/companyDeduper.js';
import { createCompanyNormalizer } from '../server/services/companyNormalizer.js';
import { createSegmentResolver } from '../server/services/segmentResolver.js';
import { createSearchOrchestrator } from '../server/services/searchOrchestrator.js';

const locationResolver = {
  resolveLocation: async (query) => ({
    query,
    normalizedQuery: query.toLowerCase(),
    city: 'Marília',
    stateCode: 'SP',
    country: 'Brasil',
    countryCode: 'BR',
    ibgeMunicipalityId: 3530607,
    label: 'Marília - SP',
    matchStrategy: 'city-state',
    source: 'ibge',
    cacheHit: false,
    resolvedAt: '2026-05-05T00:00:00.000Z',
    geometryType: 'Polygon',
    centroid: { longitude: -49.95, latitude: -22.21 },
    boundingBox: { south: -22.3, west: -49.99, north: -22.1, east: -49.85 },
  }),
};

const segmentResolver = createSegmentResolver();
const companyNormalizer = createCompanyNormalizer();
const companyDeduper = createCompanyDeduper({ companyNormalizer });

const geoCalls = [];
const geoService = {
  geocodeLocation: async (location, options) => {
    geoCalls.push({ location, options });
    return {
      placeId: 'place-123',
      formattedAddress: 'Marília, SP, Brasil',
      location: {
        latitude: -22.21,
        longitude: -49.95,
      },
      viewport: {
        north: -22.10,
        east: -49.85,
        south: -22.30,
        west: -49.99,
      },
      locationType: 'ROOFTOP',
      granularity: 'locality',
    };
  },
};

const primaryCalls = [];
const primaryLeadSource = {
  fetchEnrichedLeads: async (args) => {
    primaryCalls.push(args);
    return [];
  },
};

const fallbackCalls = [];
const fallbackLeadSource = {
  fetchEnrichedLeads: async (args) => {
    fallbackCalls.push(args);
    return [
      {
        id: 'lead-1',
        nome_fantasia: 'Tech Central',
        atividade_principal: 'Software',
        source: 'GOOGLE_MAPS',
      },
      {
        id: 'lead-2',
        nome_fantasia: 'Tech Sul',
        atividade_principal: 'Software',
        source: 'GOOGLE_MAPS',
      },
    ];
  },
};

const orchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver,
  geoSource: geoService,
  primaryLeadSource,
  fallbackLeadSource,
});

const plan = await orchestrator.planSearch({
  location: 'Marília - SP',
  segment: 'tec',
  excludeNames: ['Outro'],
  quantity: 4,
});

assert.equal(plan.location.label, 'Marília - SP');
assert.equal(plan.location.displayLabel, 'Marília - SP');
assert.equal(plan.segment.canonicalId, 'tecnologia_informacao_saas');
assert.equal(plan.segment.taxonomyVersion, '2026-05-05');
assert.equal(plan.segment.expansionLevel, 1);
assert.equal(plan.googleLocation.placeId, 'place-123');
assert.deepEqual(plan.sourcePlan.requested, ['google_geocoding', 'google_places', 'gemini_fallback']);
assert.equal(plan.searchKey, '3530607|tecnologia_informacao_saas|1');

const result = await orchestrator.runSearch({
  location: 'Marília - SP',
  segment: 'tec',
  excludeNames: ['Outro'],
  quantity: 4,
});

assert.equal(result.leads.length, 2);
assert.equal(result.sourcesUsed[0], 'google_places');
assert.equal(result.sourcesUsed[1], 'gemini_fallback');
assert.equal(geoCalls.length, 2);
assert.equal(primaryCalls.length, 1);
assert.equal(fallbackCalls.length, 1);
assert.equal(primaryCalls[0].location, 'Marília - SP');
assert.equal(primaryCalls[0].segment, 'Tecnologia da Informação / SaaS');
assert.equal(primaryCalls[0].plan.googleLocation.placeId, 'place-123');
assert.ok(fallbackCalls[0].quantity >= 4);

const sectorValidationCalls = [];
const sectorValidationService = {
  getSegmentCnaeProfile: (query) => ({
    canonicalId: 'tecnologia_informacao_saas',
    label: 'Tecnologia da Informacao / SaaS',
    cnaeCodes: ['6201-5/01'],
    cnaeFamilyPrefixes: ['6201'],
    cnaeDivisionPrefixes: ['62'],
    negativeTerms: [],
    googleTypes: ['software_company'],
    aliases: ['software'],
    broadParent: 'tecnologia',
    taxonomyVersion: '2026-05-05',
    strongCnaeCodes: ['6201-5/01'],
    acceptedCnaeFamilies: ['6201'],
    acceptedCnaeDivisions: ['62'],
    negativeCnaeTerms: [],
    validationMode: 'available',
    query,
  }),
  normalizeCnpj: (value) => String(value || '').replace(/\D+/g, ''),
  lookupCnpj: async (cnpj) => ({
    cnpj,
    mainCnaeCode: '6201-5/01',
    situacaoCadastral: 'ATIVA',
    situacaoCadastralNormalized: 'ativa',
    isAtiva: true,
    isMatriz: true,
    mainCnaeDescription: 'software',
    secondaryCnaes: [],
    source: 'CNPJ',
  }),
  evaluateCompanySector: (company, segmentQuery) => {
    sectorValidationCalls.push({ company, segmentQuery });
    return {
      cnpj: String(company.cnpj || '').replace(/\D+/g, ''),
      cnpjValid: true,
      cadastralState: 'active',
      cadastralStatus: 'ATIVA',
      segmentCanonicalId: 'tecnologia_informacao_saas',
      segmentLabel: 'Tecnologia da Informacao / SaaS',
      cnaeStatus: 'strong',
      cnaeConfidence: 1,
      cnaeReason: 'exact_cnae_match',
      mainCnaeCode: '6201-5/01',
      mainCnaeDescription: 'software',
      secondaryCnaes: [],
      isStrongMatch: true,
      isConfirmed: true,
      isRejected: false,
    };
  },
};

const cnpjOrchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver,
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async () => ([
      {
        id: 'lead-cnpj-1',
        nome_fantasia: 'Tech Exemplo',
        cnpj: '12.345.678/0001-95',
        source: 'OPEN_DATA',
      },
    ]),
  },
  sectorValidationService,
});

const sectorResult = await cnpjOrchestrator.runSearch({
  location: 'MarÃ­lia - SP',
  segment: 'tec',
  excludeNames: [],
  quantity: 1,
});

assert.equal(sectorResult.leads[0].sectorValidation.isConfirmed, true);
assert.equal(sectorResult.sectorValidation.checkedLeads, 1);
assert.equal(sectorResult.sectorValidation.confirmedLeads, 1);
assert.equal(sectorValidationCalls.length, 1);

const auxiliaryLeadSource = {
  fetchEnrichedLeads: async () => ([
    {
      id: 'lead-open-1',
      nome_fantasia: 'Tech Open Data',
      atividade_principal: 'Software',
      endereco: 'Rua do Comercio, 100',
      source: 'OPEN_DATA',
    },
  ]),
};

const auxiliaryOrchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver,
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async () => {
      const error = new Error('GOOGLE_MAPS_API_KEY is not configured');
      error.code = 'MISSING_GOOGLE_MAPS_API_KEY';
      throw error;
    },
  },
  fallbackLeadSource: {
    fetchEnrichedLeads: async () => [],
  },
  auxiliaryLeadSource,
  companyNormalizer,
});

const auxiliaryPlan = await auxiliaryOrchestrator.planSearch({
  location: 'Marilia - SP',
  segment: 'tec',
  excludeNames: [],
  quantity: 1,
});

const auxiliaryResult = await auxiliaryOrchestrator.runSearch({
  location: 'Marilia - SP',
  segment: 'tec',
  excludeNames: [],
  quantity: 1,
});

assert.ok(auxiliaryPlan.sourcePlan.requested.includes('open_data'));
assert.equal(auxiliaryResult.leads.length, 1);
assert.deepEqual(auxiliaryResult.sourcesUsed, ['open_data']);
assert.equal(auxiliaryResult.leads[0].telefone, undefined);
assert.equal(auxiliaryResult.leads[0].website, undefined);

const resilientOrchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver,
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async () => {
      throw new Error('Request failed with status 403');
    },
  },
  fallbackLeadSource: {
    fetchEnrichedLeads: async () => [],
  },
  auxiliaryLeadSource: {
    fetchEnrichedLeads: async () => ([
      {
        id: 'lead-fallback-1',
        nome_fantasia: 'Tech Open Data',
        atividade_principal: 'Software',
        endereco: 'Rua do Comercio, 200',
        source: 'OPEN_DATA',
      },
    ]),
  },
  companyNormalizer,
});

const resilientResult = await resilientOrchestrator.runSearch({
  location: 'Marilia - SP',
  segment: 'tec',
  excludeNames: [],
  quantity: 1,
});

assert.equal(resilientResult.leads.length, 1);
assert.deepEqual(resilientResult.sourcesUsed, ['open_data']);

const normalizedOrchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver,
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async () => ([
      {
        id: 'raw-1',
        source: 'google_maps',
        razao_social: '  Tech Exemplo LTDA  ',
        nome_fantasia: '  Tech Exemplo  ',
        endereco: '  Rua Central, 100  ',
        cidade: 'Marilia',
        uf: 'sp',
        pais: 'Brasil',
        telefone: '(11) 98888-7777',
        website: 'https://www.example.com/',
        coordinates: {
          latitude: '-22.21',
          longitude: '-49.95',
        },
        score: 110,
      },
    ]),
  },
  companyNormalizer,
  companyDeduper,
});

const normalizedResult = await normalizedOrchestrator.runSearch({
  location: 'Marilia - SP',
  segment: 'tec',
  excludeNames: [],
  quantity: 1,
});

assert.equal(normalizedResult.leads[0].source, 'GOOGLE_MAPS');
assert.equal(normalizedResult.leads[0].telefone, '11988887777');
assert.equal(normalizedResult.leads[0].website, 'example.com');
assert.deepEqual(normalizedResult.leads[0].coordinates, {
  latitude: -22.21,
  longitude: -49.95,
});

const dedupeOrchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver,
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async () => ([
      {
        id: 'google-1',
        source: 'GOOGLE_MAPS',
        sourceId: 'place-1',
        nome_fantasia: 'Tech Exemplo',
        razao_social: 'Tech Exemplo LTDA',
        endereco: 'Rua Central, 100',
        cidade: 'Marilia',
        uf: 'SP',
        telefone: '(11) 98888-7777',
        website: 'https://example.com/',
        coordinates: {
          latitude: -22.21,
          longitude: -49.95,
        },
        score: 80,
      },
      {
        id: 'open-data-1',
        source: 'OPEN_DATA',
        sourceId: 'osm-999',
        nome_fantasia: 'Tech Exemplo',
        razao_social: 'Tech Exemplo LTDA',
        endereco: 'Rua Central, 100',
        cidade: 'Marilia',
        uf: 'SP',
        telefone: '11988887777',
        website: 'example.com',
        coordinates: {
          latitude: -22.21,
          longitude: -49.95,
        },
        score: 65,
      },
    ]),
  },
  companyNormalizer,
  companyDeduper,
});

const dedupeResult = await dedupeOrchestrator.runSearch({
  location: 'Marilia - SP',
  segment: 'tec',
  excludeNames: [],
  quantity: 2,
});

assert.equal(dedupeResult.leads.length, 1);
assert.equal(dedupeResult.dedupe.mergedCount, 1);
assert.equal(dedupeResult.leads[0].dedupeStatus, 'merged');

const quantityCalls = [];
const quantityBufferOrchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver: {
    resolveSegmentRecord: () => null,
    resolveSegmentQuery: (value) => value,
  },
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async (args) => {
      quantityCalls.push(args);
      return Array.from({ length: args.quantity }, (_, index) => ({
        id: `lead-${index + 1}`,
        nome_fantasia: `Software Lead ${index + 1}`,
        atividade_principal: 'Software',
        source: 'GOOGLE_MAPS',
        ...(index === 4 ? { cnpj: '12.345.678/0001-95' } : {}),
      }));
    },
  },
  companyDeduper: {
    dedupeCompanies: (companies) => ({
      companies,
      report: {
        total: companies.length,
        uniqueCount: companies.length,
        mergedCount: 0,
        possibleDuplicateCount: 0,
        groups: [],
      },
    }),
  },
  leadRanker: {
    rankLeads: (companies) => companies,
  },
  sectorValidationService: {
    evaluateCompanySector: (company) => ({
      cnpj: company.cnpj || '',
      cnpjValid: true,
      cadastralState: 'active',
      cadastralStatus: 'ATIVA',
      segmentCanonicalId: 'software',
      segmentLabel: 'Software',
      cnaeStatus: company.cnpj ? 'rejected' : 'strong',
      cnaeConfidence: company.cnpj ? 0 : 1,
      cnaeReason: company.cnpj ? 'sector_mismatch' : 'exact_cnae_match',
      isStrongMatch: !company.cnpj,
      isConfirmed: !company.cnpj,
      isRejected: Boolean(company.cnpj),
    }),
  },
});

const quantityBufferResult = await quantityBufferOrchestrator.runSearch({
  location: 'Marilia - SP',
  segment: 'Software',
  excludeNames: [],
  quantity: 9,
});

assert.equal(quantityCalls[0].quantity, 19);
assert.equal(quantityBufferResult.leads.length, 9);

const largeQuantityCalls = [];
const largeQuantityOrchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver: {
    resolveSegmentRecord: () => ({
      canonicalId: 'software',
      label: 'Software',
      confidence: 'strong',
      matchedBy: 'label-exact',
    }),
    resolveSegmentQuery: (value) => value,
  },
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async (args) => {
      largeQuantityCalls.push(args);
      return [];
    },
  },
  fallbackLeadSource: {
    fetchEnrichedLeads: async (args) => {
      largeQuantityCalls.push(args);
      return Array.from({ length: args.quantity }, (_, index) => ({
        id: `fallback-${index + 1}`,
        nome_fantasia: `Tech Lead ${index + 1}`,
        atividade_principal: 'Tecnologia da Informação',
        source: 'GOOGLE_MAPS',
      }));
    },
  },
  companyDeduper: {
    dedupeCompanies: (companies) => ({
      companies,
      report: {
        total: companies.length,
        uniqueCount: companies.length,
        mergedCount: 0,
        possibleDuplicateCount: 0,
        groups: [],
      },
    }),
  },
  leadRanker: {
    rankLeads: (companies) => companies,
  },
});

const largeQuantityResult = await largeQuantityOrchestrator.runSearch({
  location: 'Marilia - SP',
  segment: 'tec',
  excludeNames: [],
  quantity: 100,
});

assert.ok(largeQuantityCalls.length >= 2);
assert.equal(largeQuantityCalls[0].quantity, 100);
assert.equal(largeQuantityResult.leads.length, 100);

const variantCalls = [];
const variantExpansionOrchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver: createSegmentResolver(),
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async (args) => {
      variantCalls.push({
        source: 'google_places',
        segment: args.segment,
        quantity: args.quantity,
      });
      return [];
    },
  },
  fallbackLeadSource: {
    fetchEnrichedLeads: async (args) => {
      variantCalls.push({
        source: 'gemini_fallback',
        segment: args.segment,
        quantity: args.quantity,
      });

      if (args.segment === 'Tecnologia da Informação / SaaS') {
        return Array.from({ length: 12 }, (_, index) => ({
          id: `variant-base-${index + 1}`,
          nome_fantasia: `Tech Variant Base ${index + 1}`,
          atividade_principal: 'Software',
          endereco: `Rua Base ${index + 1}`,
          source: 'GOOGLE_MAPS',
        }));
      }

      if (['tec', 'tech', 'software', 'saas'].includes(String(args.segment || '').toLowerCase())) {
        return Array.from({ length: 11 }, (_, index) => ({
          id: `variant-extra-${args.segment}-${index + 1}`,
          nome_fantasia: `Tech Variant Extra ${args.segment} ${index + 1}`,
          atividade_principal: 'Software',
          endereco: `Rua Extra ${args.segment} ${index + 1}`,
          source: 'GOOGLE_MAPS',
        }));
      }

      return [];
    },
  },
  companyDeduper: {
    dedupeCompanies: (companies) => ({
      companies,
      report: {
        total: companies.length,
        uniqueCount: companies.length,
        mergedCount: 0,
        possibleDuplicateCount: 0,
        groups: [],
      },
    }),
  },
  leadRanker: {
    rankLeads: (companies) => companies,
  },
});

const variantExpansionResult = await variantExpansionOrchestrator.runSearch({
  location: 'Marilia - SP',
  segment: 'tec',
  excludeNames: [],
  quantity: 200,
});

assert.ok(variantCalls.some((call) => call.source === 'google_places'));
assert.ok(variantCalls.some((call) => call.source === 'gemini_fallback'));
assert.ok(new Set(variantCalls.map((call) => call.segment)).size >= 2);
assert.equal(variantExpansionResult.leads.length, 23);

const highVolumeCalls = [];
const highVolumeOrchestrator = createSearchOrchestrator({
  locationResolver,
  segmentResolver,
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async (args) => {
      highVolumeCalls.push({ source: 'primary', segment: args.segment, quantity: args.quantity });
      return Array.from({ length: 20 }, (_, index) => ({
        id: `${args.segment}-primary-${index + 1}`,
        nome_fantasia: `${args.segment} Lead ${index + 1}`,
        atividade_principal: args.segment,
        source: 'GOOGLE_MAPS',
      }));
    },
  },
  fallbackLeadSource: {
    refineSearchQuery: async () => 'Pizzarias, Pizzaria Delivery, Restaurantes Italianos, Forno a Lenha, Fast Food, Lanchonetes, Hamburguerias, Cafeterias, Food Service, Restaurante',
    fetchEnrichedLeads: async (args) => {
      highVolumeCalls.push({ source: 'fallback', segment: args.segment, quantity: args.quantity });
      return Array.from({ length: 20 }, (_, index) => ({
        id: `${args.segment}-fallback-${index + 1}`,
        nome_fantasia: `${args.segment} Fallback ${index + 1}`,
        atividade_principal: args.segment,
        source: 'GOOGLE_MAPS',
      }));
    },
  },
  companyDeduper: {
    dedupeCompanies: (companies) => ({
      companies,
      report: {
        total: companies.length,
        uniqueCount: companies.length,
        mergedCount: 0,
        possibleDuplicateCount: 0,
        groups: [],
      },
    }),
  },
  leadRanker: {
    rankLeads: (companies) => companies,
  },
});

const highVolumeResult = await highVolumeOrchestrator.runSearch({
  location: 'Marilia - SP',
  segment: 'Pizzaria',
  excludeNames: [],
  quantity: 200,
});

assert.equal(highVolumeResult.leads.length, 200);
assert.ok(highVolumeCalls.length >= 10);
assert.equal(highVolumeCalls[0].quantity, 200);

const progressiveCalls = [];
const progressiveLeadPool = Array.from({ length: 48 }, (_, index) => ({
  id: `ph-${index + 1}`,
  nome_fantasia: `Farmacia Alpha ${String(index + 1).padStart(2, '0')}`,
  atividade_principal: 'Farmácia',
  source: 'GOOGLE_MAPS',
}));

const progressiveOrchestrator = createSearchOrchestrator({
  locationResolver: {
    resolveLocation: async (query) => ({
      query,
      normalizedQuery: query.toLowerCase(),
      city: 'São Paulo',
      stateCode: 'SP',
      country: 'Brasil',
      countryCode: 'BR',
      ibgeMunicipalityId: 3550308,
      label: 'São Paulo - SP',
      matchStrategy: 'city-state',
      source: 'ibge',
      cacheHit: false,
      resolvedAt: '2026-05-05T00:00:00.000Z',
      geometryType: 'Polygon',
      centroid: { longitude: -46.63, latitude: -23.55 },
      boundingBox: null,
    }),
  },
  segmentResolver: {
    resolveSegmentRecord: () => ({
      label: 'Farmácia',
      query: 'Farmácia',
      canonicalId: 'farmacia',
      matchedBy: 'free-text',
      confidence: 'broad',
      sourcePlan: {
        primary: 'google_places',
        requested: ['google_geocoding', 'google_places'],
        used: [],
      },
    }),
    resolveSegmentQuery: (value) => value,
  },
  primaryLeadSource: {
    fetchEnrichedLeads: async (args) => {
      const excludeNames = Array.isArray(args.excludeNames)
        ? args.excludeNames.map((value) => String(value).trim().toLowerCase()).filter(Boolean)
        : [];

      progressiveCalls.push({
        excludeCount: excludeNames.length,
        quantity: args.quantity,
      });

      const excluded = new Set(excludeNames);
      return progressiveLeadPool
        .filter((lead) => !excluded.has(lead.nome_fantasia.toLowerCase()))
        .slice(0, 16);
    },
  },
  companyDeduper: {
    dedupeCompanies: (companies) => ({
      companies,
      report: {
        total: companies.length,
        uniqueCount: companies.length,
        mergedCount: 0,
        possibleDuplicateCount: 0,
        groups: [],
      },
    }),
  },
  leadRanker: {
    rankLeads: (companies) => companies,
  },
});

const progressiveResult = await progressiveOrchestrator.runSearch({
  location: 'São Paulo - SP',
  segment: 'Farmácia',
  excludeNames: [],
  quantity: 200,
});

assert.equal(progressiveResult.leads.length, 48);
assert.equal(progressiveCalls.length, 4);
assert.equal(progressiveCalls[0].excludeCount, 0);
assert.ok(progressiveCalls[1].excludeCount >= 16);
assert.ok(progressiveCalls[2].excludeCount >= 32);

const saoPauloGeoCalls = [];
const saoPauloGeoOrchestrator = createSearchOrchestrator({
  locationResolver: {
    resolveLocation: async (query) => ({
      query,
      normalizedQuery: query.toLowerCase(),
      city: 'São Paulo',
      stateCode: 'SP',
      country: 'Brasil',
      countryCode: 'BR',
      ibgeMunicipalityId: 3550308,
      label: 'São Paulo - SP',
      matchStrategy: 'city-state',
      source: 'ibge',
      cacheHit: false,
      resolvedAt: '2026-05-05T00:00:00.000Z',
      geometryType: 'Polygon',
      centroid: { longitude: -46.63, latitude: -23.55 },
      boundingBox: { south: -23.85, west: -46.85, north: -23.35, east: -46.40 },
    }),
  },
  segmentResolver: createSegmentResolver(),
  geoSource: geoService,
  primaryLeadSource: {
    fetchEnrichedLeads: async (args) => {
      const box = args.plan?.location?.boundingBox || {};
      const boxKey = [
        box.south,
        box.west,
        box.north,
        box.east,
      ].map((value) => Number(value).toFixed(4)).join('|');

      saoPauloGeoCalls.push({
        segment: args.segment,
        boxKey,
        quantity: args.quantity,
      });

      return Array.from({ length: 2 }, (_, index) => ({
        id: `${boxKey}-${args.segment}-${index + 1}`,
        nome_fantasia: `Farmacia ${boxKey} ${args.segment} ${index + 1}`,
        atividade_principal: 'Farmácia',
        endereco: `Rua ${boxKey} ${index + 1}`,
        cidade: 'São Paulo',
        uf: 'SP',
        source: 'GOOGLE_MAPS',
      }));
    },
  },
  companyDeduper: {
    dedupeCompanies: (companies) => ({
      companies,
      report: {
        total: companies.length,
        uniqueCount: companies.length,
        mergedCount: 0,
        possibleDuplicateCount: 0,
        groups: [],
      },
    }),
  },
  leadRanker: {
    rankLeads: (companies) => companies,
  },
});

const saoPauloGeoResult = await saoPauloGeoOrchestrator.runSearch({
  location: 'São Paulo - SP',
  segment: 'Farmácia',
  excludeNames: [],
  quantity: 200,
});

assert.ok(saoPauloGeoCalls.length >= 9);
assert.ok(new Set(saoPauloGeoCalls.map((call) => call.boxKey)).size >= 4);
assert.ok(saoPauloGeoResult.leads.length > 16);
