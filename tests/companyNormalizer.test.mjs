import assert from 'node:assert/strict';
import { createCompanyNormalizer } from '../server/services/companyNormalizer.js';

const normalizer = createCompanyNormalizer();

const normalized = normalizer.normalizeCompany({
  id: 'abc-1',
  sourceId: 'abc-1',
  source: 'open_data',
  cnpj: '12.345.678/0001-95',
  razao_social: '  Tech Exemplo LTDA  ',
  nome_fantasia: '  Tech Exemplo  ',
  endereco: '  Rua Central, 100  ',
  cidade: 'Marilia',
  uf: 'sp',
  pais: 'Brasil',
  bairro: 'Centro',
  telefone: '(11) 98888-7777',
  website: 'https://www.example.com/',
  coordinates: {
    latitude: '-22.21',
    longitude: '-49.95',
  },
  whatsappStatus: 'confirmed',
  score: 111,
});

assert.equal(normalized.id, 'abc-1');
assert.equal(normalized.sourceId, 'abc-1');
assert.equal(normalized.source, 'OPEN_DATA');
assert.equal(normalized.cnpj, '12345678000195');
assert.equal(normalized['razão_social'], 'Tech Exemplo LTDA');
assert.equal(normalized.nome_fantasia, 'Tech Exemplo');
assert.equal(normalized.endereco, 'Rua Central, 100');
assert.equal(normalized.cidade, 'Marilia');
assert.equal(normalized.uf, 'SP');
assert.equal(normalized.pais, 'Brasil');
assert.equal(normalized.telefone, '11988887777');
assert.equal(normalized.website, 'example.com');
assert.equal(normalized.websiteDomain, 'example.com');
assert.equal(normalized.whatsappStatus, 'CONFIRMED');
assert.deepEqual(normalized.coordinates, {
  latitude: -22.21,
  longitude: -49.95,
});
assert.equal(normalized.score, 100);
