import assert from 'node:assert/strict';
import { createLocationResolver, LocationNotFoundError } from '../server/services/locationResolver.js';

let fetchCount = 0;

const fakeFetch = async (url, options) => {
  fetchCount += 1;

  const urlString = String(url);

  if (urlString.includes('/api/v1/localidades/municipios')) {
    return {
      ok: true,
      json: async () => ([
        {
          id: 3530607,
          nome: 'Marilia',
          microrregiao: {
            mesorregiao: {
              UF: {
                sigla: 'SP',
              },
            },
          },
        },
        {
          id: 4115200,
          nome: 'Marilia',
          microrregiao: {
            mesorregiao: {
              UF: {
                sigla: 'PR',
              },
            },
          },
        },
      ]),
    };
  }

  if (urlString.includes('/api/v3/malhas/municipios/3530607')) {
    assert.ok(String(options?.headers?.Accept || options?.headers?.accept || '').includes('geo+json'));
    return {
      ok: true,
      json: async () => ({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-49.99, -22.30],
            [-49.85, -22.30],
            [-49.85, -22.10],
            [-49.99, -22.10],
            [-49.99, -22.30],
          ]],
        },
      }),
    };
  }

  throw new Error(`Unexpected fetch url: ${urlString}`);
};

const resolver = createLocationResolver({
  fetchImpl: fakeFetch,
  now: () => 1_000_000,
  cacheTtlMs: 60_000,
});

const firstResolution = await resolver.resolveLocation('Marilia - SP');
assert.equal(firstResolution.city, 'Marilia');
assert.equal(firstResolution.stateCode, 'SP');
assert.equal(firstResolution.country, 'Brasil');
assert.equal(firstResolution.countryCode, 'BR');
assert.equal(firstResolution.ibgeMunicipalityId, 3530607);
assert.equal(firstResolution.source, 'ibge');
assert.equal(firstResolution.cacheHit, false);
assert.equal(firstResolution.geometryType, 'Polygon');
assert.equal(firstResolution.boundingBox.west, -49.99);
assert.equal(firstResolution.boundingBox.east, -49.85);
assert.equal(firstResolution.boundingBox.south, -22.30);
assert.equal(firstResolution.boundingBox.north, -22.10);
assert.ok(firstResolution.centroid.longitude < -49.85 && firstResolution.centroid.longitude > -49.99);
assert.ok(firstResolution.centroid.latitude < -22.10 && firstResolution.centroid.latitude > -22.30);

const secondResolution = await resolver.resolveLocation('Marília, SP');
assert.equal(secondResolution.cacheHit, true);
assert.equal(secondResolution.ibgeMunicipalityId, 3530607);
assert.equal(fetchCount, 2, 'the second resolution should reuse cache instead of refetching');

await assert.rejects(
  resolver.resolveLocation('Cidade Inexistente - XX'),
  (error) => error instanceof LocationNotFoundError && error.code === 'LOCATION_NOT_FOUND'
);
