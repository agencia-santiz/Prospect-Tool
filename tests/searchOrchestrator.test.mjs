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
        nome_fantasia: 'Padaria Central',
        source: 'GOOGLE_MAPS',
      },
      {
        id: 'lead-2',
        nome_fantasia: 'Padaria Sul',
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
assert.equal(fallbackCalls[0].quantity, 4);

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
      nome_fantasia: 'Padaria Central',
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
