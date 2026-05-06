import assert from 'node:assert/strict';
import { createGoogleMapsService } from '../server/services/googleMapsService.js';

let geocodeCalls = 0;
let searchCalls = 0;

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
            formatted_address: 'Marília, SP, Brasil',
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
    assert.equal(body.textQuery, 'Padaria em Marília - SP');
    assert.ok(body.locationBias?.circle || body.locationBias?.rectangle);

    return {
      ok: true,
      json: async () => ({
        places: [
          {
            id: 'place-123',
            displayName: { text: 'Padaria Central' },
            formattedAddress: 'Rua do Comércio, 100 - Marília - SP, Brasil',
            location: { latitude: -22.2, longitude: -49.9 },
            primaryType: 'bakery',
            nationalPhoneNumber: '+55 14 99999-0000',
            websiteUri: 'https://padaria-central.com/',
            businessStatus: 'OPERATIONAL',
            addressComponents: [
              { longText: 'Marília', shortText: 'Marília', types: ['locality'] },
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

const geocode = await service.geocodeLocation('Marília - SP');
assert.equal(geocode.placeId, 'place-123');
assert.equal(geocode.location.latitude, -22.21);
assert.equal(geocode.viewport.east, -49.85);

const cachedGeocode = await service.geocodeLocation('Marília - SP');
assert.equal(cachedGeocode.placeId, 'place-123');
assert.equal(geocodeCalls, 1, 'geocoding should reuse cache');

const leads = await service.fetchEnrichedLeads({
  location: 'Marília - SP',
  segment: 'Padaria',
  excludeNames: ['Outra Padaria'],
  quantity: 3,
  plan: {
    location: {
      displayLabel: 'Marília - SP',
      city: 'Marília',
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
assert.equal(leads[0].cidade, 'Marília');
assert.equal(leads[0].uf, 'SP');
assert.equal(leads[0].website, 'padaria-central.com');
assert.equal(leads[0].telefone, '5514999990000');
assert.equal(leads[0].source, 'GOOGLE_MAPS');
