import assert from 'node:assert/strict';
import {
  buildOpenDataRequestHeaders,
  buildOverpassQuery,
  getOpenDataFiltersForSegment,
  fetchOpenDataLeads,
} from '../src/services/openDataService.js';

const pizzaFilters = getOpenDataFiltersForSegment('Pizzaria');
assert.ok(
  pizzaFilters.some((filter) => Array.isArray(filter.tags) && filter.tags.some((tag) => tag.key === 'cuisine' && tag.value === 'pizza')),
  'Pizzaria should include cuisine=pizza in OpenStreetMap filters'
);
assert.ok(
  pizzaFilters.some((filter) => Array.isArray(filter.tags) && filter.tags.some((tag) => tag.key === 'amenity' && tag.value === 'restaurant') && filter.tags.some((tag) => tag.key === 'cuisine' && tag.value === 'pizza')),
  'Pizzaria should include restaurant amenity in OpenStreetMap filters'
);

const query = buildOverpassQuery([-22.25, -49.95, -22.15, -49.85], 'Pizzaria');
assert.ok(query.includes('["cuisine"="pizza"]'));
assert.ok(query.includes('["amenity"="restaurant"]["cuisine"="pizza"]'));
assert.ok(query.includes('["amenity"="fast_food"]["cuisine"="pizza"]'));
assert.ok(!query.includes('["amenity"="bar"]'));
assert.ok(!query.includes('["amenity"="cafe"]'));

const pharmacyFilters = getOpenDataFiltersForSegment('Farmácia');
assert.ok(
  pharmacyFilters.some((filter) => filter.key === 'amenity' && filter.value === 'pharmacy'),
  'Farmácia should include amenity=pharmacy in OpenStreetMap filters'
);
assert.ok(
  pharmacyFilters.some((filter) => filter.key === 'shop' && filter.value === 'chemist'),
  'Farmácia should include shop=chemist in OpenStreetMap filters'
);
assert.ok(
  pharmacyFilters.some((filter) => filter.key === 'healthcare' && filter.value === 'pharmacy'),
  'Farmácia should include healthcare=pharmacy in OpenStreetMap filters'
);

const pharmacyQuery = buildOverpassQuery([-22.25, -49.95, -22.15, -49.85], 'Farmácia');
assert.ok(pharmacyQuery.includes('["amenity"="pharmacy"]'));
assert.ok(pharmacyQuery.includes('["shop"="chemist"]'));
assert.ok(pharmacyQuery.includes('["healthcare"="pharmacy"]'));

const headers = buildOpenDataRequestHeaders();
assert.equal(headers['User-Agent'], 'BloomLeadsDesktop/1.0 (OpenDataFallback)');
assert.equal(headers['Accept-Language'], 'pt-BR,pt;q=0.9,en;q=0.6');
assert.equal(headers.From, 'bloom-leads@localhost');

const fetchCalls = [];
const mockFetch = async (url) => {
  fetchCalls.push(url);

  if (String(url).includes('nominatim.openstreetmap.org')) {
    return {
      ok: true,
      json: async () => ([{
        lat: '-23.55052',
        lon: '-46.63331',
        boundingbox: ['-23.60', '-23.50', '-46.70', '-46.60'],
        address: {
          city: 'Sao Paulo',
          state: 'SP',
          country: 'Brasil',
          country_code: 'br',
        },
      }]),
    };
  }

  if (String(url).includes('overpass-api.de/api/interpreter')) {
    return {
      ok: false,
      status: 406,
      json: async () => ({}),
    };
  }

  if (String(url).includes('overpass.kumi.systems/api/interpreter')) {
    return {
      ok: true,
      json: async () => ({
        elements: [
          {
            type: 'node',
            id: 1,
            lat: -23.55,
            lon: -46.63,
            tags: {
              name: 'Farmacia Retry',
              amenity: 'pharmacy',
            },
          },
        ],
      }),
    };
  }

  throw new Error(`Unexpected fetch: ${url}`);
};

const retryLeads = await fetchOpenDataLeads('Sao Paulo - SP', 'Farmacia', [], 5, mockFetch);
assert.equal(retryLeads.length, 1);
assert.ok(fetchCalls.some((url) => String(url).includes('overpass-api.de/api/interpreter')));
assert.ok(fetchCalls.some((url) => String(url).includes('overpass.kumi.systems/api/interpreter')));
