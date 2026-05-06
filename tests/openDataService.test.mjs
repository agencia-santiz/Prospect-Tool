import assert from 'node:assert/strict';
import {
  buildNominatimRequest,
  buildOverpassQuery,
  fetchOpenDataLeads,
  getOpenDataFiltersForSegment,
  mapOpenDataElementToCompany,
} from '../src/services/openDataService.js';
import { createOpenDataService } from '../server/services/openDataService.js';

const admFilters = getOpenDataFiltersForSegment('adm');
assert.ok(admFilters.some((filter) => filter.key === 'office' && filter.value === 'company'));

const papelariaFilters = getOpenDataFiltersForSegment('Papelaria / Material de Escritório');
assert.ok(papelariaFilters.some((filter) => filter.key === 'shop' && filter.value === 'stationery'));

const nominatimUrl = buildNominatimRequest('Marília - SP');
assert.ok(nominatimUrl.includes('countrycodes=br'));
assert.ok(nominatimUrl.includes('Mar%C3%ADlia'));

const overpassQuery = buildOverpassQuery([-22.5, -49.5, -22.0, -49.0], 'Restaurante / Gastronomia');
assert.ok(overpassQuery.includes('amenity"="restaurant"'));
assert.ok(overpassQuery.includes('shop"="bakery"'));

const mappedCompany = mapOpenDataElementToCompany(
  {
    type: 'node',
    id: 123,
    tags: {
      name: 'Padaria Central',
      'addr:street': 'Rua do Comércio',
      'addr:housenumber': '100',
      'addr:neighbourhood': 'Centro',
      'contact:phone': '(14) 99999-0000',
      'contact:website': 'https://padaria-central.com/',
      opening_hours: 'Mo-Fr 08:00-18:00',
    },
  },
  {
    city: 'Marília',
    region: 'SP',
    country: 'Brasil',
  },
  'Alimentação / Food Service',
);

assert.equal(mappedCompany.nome_fantasia, 'Padaria Central');
assert.equal(mappedCompany.source, 'OPEN_DATA');
assert.equal(mappedCompany.cidade, 'Marília');
assert.equal(mappedCompany.uf, 'SP');
assert.equal(mappedCompany.website, 'padaria-central.com');
assert.equal(mappedCompany.telefone, '(14) 99999-0000');
assert.ok(mappedCompany.endereco.includes('Rua do Comércio'));

const fakeFetch = async (url, options) => {
  if (String(url).includes('nominatim')) {
    return {
      ok: true,
      json: async () => ([
        {
          display_name: 'Marília, São Paulo, Brasil',
          lat: '-22.217',
          lon: '-49.950',
          boundingbox: ['-22.30', '-22.10', '-49.99', '-49.85'],
          address: {
            city: 'Marília',
            state: 'São Paulo',
            country: 'Brasil',
            country_code: 'br',
          },
        },
      ]),
    };
  }

  if (String(url).includes('overpass')) {
    assert.ok(String(options?.body || '').includes('amenity'));
    return {
      ok: true,
      json: async () => ({
        elements: [
          {
            type: 'node',
            id: 1,
            lat: -22.2,
            lon: -49.9,
            tags: {
              name: 'Padaria Central',
              'addr:street': 'Rua do Comércio',
              'addr:housenumber': '100',
              'addr:neighbourhood': 'Centro',
              'contact:phone': '(14) 99999-0000',
              'contact:website': 'https://padaria-central.com/',
              opening_hours: 'Mo-Fr 08:00-18:00',
            },
          },
          {
            type: 'way',
            id: 2,
            center: { lat: -22.21, lon: -49.91 },
            tags: {
              name: 'Padaria Central',
              'addr:street': 'Rua do Comércio',
              'addr:housenumber': '100',
              'addr:neighbourhood': 'Centro',
            },
          },
          {
            type: 'node',
            id: 3,
            lat: -22.23,
            lon: -49.92,
            tags: {
              name: 'Café Sol',
              'addr:street': 'Avenida Principal',
              'addr:housenumber': '200',
            },
          },
          {
            type: 'node',
            id: 4,
            lat: -22.24,
            lon: -49.93,
            tags: {
              name: 'Loja Whats',
              'contact:whatsapp': '(14) 98888-7777',
            },
          },
        ],
      }),
    };
  }

  throw new Error(`Unexpected fetch url: ${url}`);
};

const leads = await fetchOpenDataLeads('Marília - SP', 'Alimentação / Food Service', [], 3, fakeFetch);
assert.equal(leads.length, 3);
assert.equal(leads[0].source, 'OPEN_DATA');
assert.equal(leads[0].cidade, 'Marília');
assert.equal(leads[0].uf, 'SP');
assert.equal(leads[0].nome_fantasia, 'Padaria Central');
assert.ok(leads.some((lead) => lead.nome_fantasia === 'Café Sol'));
assert.ok(leads.some((lead) => lead.nome_fantasia === 'Loja Whats'));

const whatsappLead = mapOpenDataElementToCompany(
  {
    type: 'node',
    id: 4,
    tags: {
      name: 'Loja Whats',
      'contact:whatsapp': '(14) 98888-7777',
    },
  },
  {
    city: 'Marília',
    region: 'SP',
    country: 'Brasil',
  },
  'Varejo',
);
assert.equal(whatsappLead.whatsappStatus, 'CONFIRMED');
assert.equal(whatsappLead.telefone, '5514988887777');

const excludedLeads = await fetchOpenDataLeads('Marília - SP', 'Alimentação / Food Service', ['Café Sol'], 2, fakeFetch);
assert.equal(excludedLeads.length, 2);
assert.equal(excludedLeads[0].nome_fantasia, 'Padaria Central');
assert.equal(excludedLeads[1].nome_fantasia, 'Loja Whats');

const backendOpenDataService = createOpenDataService({ fetchImpl: fakeFetch });
const backendLeads = await backendOpenDataService.fetchEnrichedLeads({
  location: 'Marilia - SP',
  segment: 'Alimentacao / Food Service',
  excludeNames: ['Cafe Sol'],
  quantity: 2,
});

assert.equal(backendLeads.length, 2);
assert.equal(backendLeads[0].source, 'OPEN_DATA');
assert.equal(backendLeads[0].nome_fantasia, 'Padaria Central');
