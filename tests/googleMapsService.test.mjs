import assert from 'node:assert/strict';
import { createGoogleMapsService } from '../server/services/googleMapsService.js';

let geocodeCalls = 0;
let searchCalls = 0;
const paginatedSearchPageTokens = [];

const buildPlace = (index, namePrefix = 'Pizzaria') => ({
  id: `place-${namePrefix.toLowerCase()}-${index}`,
  displayName: { text: `${namePrefix} ${index}` },
  formattedAddress: `Rua ${index}, ${index} - Sao Paulo - SP, Brasil`,
  location: { latitude: -23.55, longitude: -46.63 },
  primaryType: 'restaurant',
  types: ['restaurant', 'food'],
  businessStatus: 'OPERATIONAL',
  rating: 4.7,
  userRatingCount: 128,
  addressComponents: [
    { longText: 'Sao Paulo', shortText: 'Sao Paulo', types: ['locality'] },
    { longText: 'SP', shortText: 'SP', types: ['administrative_area_level_1'] },
  ],
});

const fakeFetch = async (url, options) => {
  const urlString = String(url);

  if (urlString.includes('/maps/api/geocode/json')) {
    geocodeCalls += 1;
    return {
      ok: true,
      json: async () => ({
        results: [
          {
            place_id: 'place-123',
            formatted_address: 'Marilia, SP, Brasil',
            geometry: {
              location: {
                lat: -22.21,
                lng: -49.95,
              },
              viewport: {
                northeast: { lat: -22.10, lng: -49.85 },
                southwest: { lat: -22.30, lng: -49.99 },
              },
            },
            types: ['locality'],
          },
        ],
        status: 'OK',
      }),
    };
  }

  if (urlString.includes('places.googleapis.com/v1/places:searchText')) {
    searchCalls += 1;
    const body = JSON.parse(String(options?.body || '{}'));
    assert.ok(Number(body.pageSize) <= 20);
    assert.ok(String(options?.headers?.['X-Goog-FieldMask'] || '').includes('nextPageToken'));
    if (body.textQuery === 'Pizzaria em Sao Paulo - SP') {
      assert.ok(body.locationRestriction?.rectangle, 'paginated municipality searches should keep the bounding box restriction');
      paginatedSearchPageTokens.push(body.pageToken || null);
      const start = body.pageToken === 'page-2' ? 21 : body.pageToken === 'page-3' ? 41 : 1;
      const end = body.pageToken === 'page-3' ? 45 : start + 19;

      return {
        ok: true,
        json: async () => ({
          places: Array.from({ length: end - start + 1 }, (_, index) => buildPlace(start + index)),
          ...(body.pageToken === 'page-3' ? {} : { nextPageToken: body.pageToken === 'page-2' ? 'page-3' : 'page-2' }),
        }),
      };
    }

    assert.equal(body.textQuery, 'Padaria em Marilia - SP');
    assert.ok(body.locationRestriction?.rectangle, 'municipality searches should restrict to the plan bounding box when available');

    return {
      ok: true,
      json: async () => ({
        places: [
          {
            id: 'place-123',
            displayName: { text: 'Padaria Central' },
            formattedAddress: 'Rua do Comercio, 100 - Marilia - SP, Brasil',
            location: { latitude: -22.2, longitude: -49.9 },
            primaryType: 'bakery',
            nationalPhoneNumber: '+55 14 99999-0000',
            websiteUri: 'https://padaria-central.com/',
            businessStatus: 'OPERATIONAL',
            rating: 4.9,
            userRatingCount: 87,
            addressComponents: [
              { longText: 'Marilia', shortText: 'Marilia', types: ['locality'] },
              { longText: 'SP', shortText: 'SP', types: ['administrative_area_level_1'] },
              { longText: '17500-000', shortText: '17500-000', types: ['postal_code'] },
            ],
          },
        ],
      }),
    };
  }

  throw new Error(`Unexpected fetch url: ${urlString}`);
};

const service = createGoogleMapsService({
  env: { GOOGLE_MAPS_API_KEY: 'test-key' },
  fetchImpl: fakeFetch,
});

const geocode = await service.geocodeLocation('Marilia - SP');
assert.equal(geocode.placeId, 'place-123');
assert.equal(geocode.location.latitude, -22.21);
assert.equal(geocode.viewport.east, -49.85);

const cachedGeocode = await service.geocodeLocation('Marilia - SP');
assert.equal(cachedGeocode.placeId, 'place-123');
assert.equal(geocodeCalls, 1, 'geocoding should reuse cache');

const leads = await service.fetchEnrichedLeads({
  location: 'Marilia - SP',
  segment: 'Padaria',
  excludeNames: ['Outra Padaria'],
  quantity: 3,
  plan: {
    location: {
      displayLabel: 'Marilia - SP',
      city: 'Marilia',
      stateCode: 'SP',
      country: 'Brasil',
      boundingBox: {
        south: -22.3,
        west: -49.99,
        north: -22.1,
        east: -49.85,
      },
    },
  },
});

assert.equal(searchCalls, 1);
assert.equal(leads.length, 1);
assert.equal(leads[0].nome_fantasia, 'Padaria Central');
assert.equal(leads[0].cidade, 'Marilia');
assert.equal(leads[0].uf, 'SP');
assert.equal(leads[0].website, 'padaria-central.com');
assert.equal(leads[0].telefone, '5514999990000');
assert.equal(leads[0].source, 'GOOGLE_MAPS');
assert.equal(leads[0].rating, 4.9);
assert.equal(leads[0].userRatingsTotal, 87);

const paginatedLeads = await service.fetchEnrichedLeads({
  location: 'Sao Paulo - SP',
  segment: 'Pizzaria',
  excludeNames: [],
  quantity: 45,
  plan: {
    location: {
      displayLabel: 'Sao Paulo - SP',
      city: 'Sao Paulo',
      stateCode: 'SP',
      country: 'Brasil',
      boundingBox: {
        south: -23.85,
        west: -46.85,
        north: -23.35,
        east: -46.40,
      },
    },
  },
});

assert.deepEqual(paginatedSearchPageTokens, [null, 'page-2', 'page-3']);
assert.equal(paginatedLeads.length, 45);
assert.equal(paginatedLeads[0].nome_fantasia, 'Pizzaria 1');
assert.equal(paginatedLeads[44].nome_fantasia, 'Pizzaria 45');
