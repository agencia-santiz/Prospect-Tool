import assert from 'node:assert/strict';
import { createCompanyNormalizer } from '../server/services/companyNormalizer.js';
import { createCompanyDeduper } from '../server/services/companyDeduper.js';

const companyNormalizer = createCompanyNormalizer();
const companyDeduper = createCompanyDeduper({ companyNormalizer });

const result = companyDeduper.dedupeCompanies([
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
  {
    id: 'gemini-1',
    source: 'GOOGLE_MAPS',
    sourceId: 'place-2',
    nome_fantasia: 'Tech Exemplo Filial',
    razao_social: 'Tech Exemplo Filial LTDA',
    endereco: 'Rua Norte, 50',
    cidade: 'Campinas',
    uf: 'SP',
    telefone: '11988887777',
    score: 70,
  },
  {
    id: 'unique-1',
    source: 'OPEN_DATA',
    sourceId: 'osm-1000',
    nome_fantasia: 'Padaria Central',
    razao_social: 'Padaria Central LTDA',
    endereco: 'Rua do Comercio, 10',
    cidade: 'Marilia',
    uf: 'SP',
    telefone: '14999990000',
    website: 'padaria-central.com',
    score: 50,
  },
]);

assert.equal(result.companies.length, 3);
assert.equal(result.report.total, 4);
assert.equal(result.report.mergedCount, 1);
assert.equal(result.report.possibleDuplicateCount, 1);

const mergedLead = result.companies.find((lead) => lead.id === 'google-1');
assert.ok(mergedLead);
assert.equal(mergedLead.dedupeStatus, 'merged');
assert.ok(mergedLead.mergedFrom.includes('open-data-1'));
assert.equal(mergedLead.websiteDomain, 'example.com');
assert.equal(mergedLead.score, 80);

const possibleDuplicateLead = result.companies.find((lead) => lead.id === 'gemini-1');
assert.ok(possibleDuplicateLead);
assert.equal(possibleDuplicateLead.dedupeStatus, 'possible_duplicate');
assert.ok(possibleDuplicateLead.dedupeCandidates.includes('google-1'));

const uniqueLead = result.companies.find((lead) => lead.id === 'unique-1');
assert.ok(uniqueLead);
assert.equal(uniqueLead.dedupeStatus, 'unique');
