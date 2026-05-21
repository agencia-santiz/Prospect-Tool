import assert from 'node:assert';
import test from 'node:test';
import { createLeadRanker } from '../server/services/leadRanker.js';

test('LeadRanker - Initialization', () => {
  const leadRanker = createLeadRanker();
  assert.ok(leadRanker);
  assert.strictEqual(typeof leadRanker.rankLeads, 'function');
});

test('LeadRanker - Ranks based on phone and website', () => {
  const leadRanker = createLeadRanker();

  const leads = [
    { id: '1', nome_fantasia: 'No Info' },
    { id: '2', nome_fantasia: 'Only Phone', telefone: '123456789' },
    { id: '3', nome_fantasia: 'Only Website', website: 'example.com' },
    { id: '4', nome_fantasia: 'Both', telefone: '123', website: 'example.com' },
  ];

  const ranked = leadRanker.rankLeads(leads);

  assert.strictEqual(ranked.length, 4);
  assert.strictEqual(ranked[0].id, '4');
  assert.strictEqual(ranked[1].id, '2');
  assert.strictEqual(ranked[2].id, '3');
  assert.strictEqual(ranked[3].id, '1');

  assert.strictEqual(ranked[0].score > ranked[1].score, true);
  assert.strictEqual(ranked[1].score > ranked[2].score, true);
  assert.strictEqual(ranked[2].score > ranked[3].score, true);

  assert.ok(ranked[0].rankingReasons.includes('Possui telefone (+)'));
  assert.ok(ranked[0].rankingReasons.includes('Possui website (+)'));
});

test('LeadRanker - Penalizes closed businesses', () => {
  const leadRanker = createLeadRanker();

  const leads = [
    { id: '1', businessStatus: 'OPERATIONAL', telefone: '123' },
    { id: '2', businessStatus: 'CLOSED_PERMANENTLY', telefone: '123' },
    { id: '3', businessStatus: 'CLOSED_TEMPORARILY', telefone: '123' },
  ];

  const ranked = leadRanker.rankLeads(leads);

  assert.strictEqual(ranked[0].id, '1');
  assert.strictEqual(ranked[1].id, '3');
  assert.strictEqual(ranked[2].id, '2');

  assert.strictEqual(ranked[2].score, 0);
});

test('LeadRanker - Rewards Google rating and review count', () => {
  const leadRanker = createLeadRanker();

  const leads = [
    { id: '1', rating: 3.5, userRatingsTotal: 5 },
    { id: '2', rating: 4.5, userRatingsTotal: 60 },
    { id: '3', rating: 2.0, userRatingsTotal: 2 },
  ];

  const ranked = leadRanker.rankLeads(leads);

  assert.strictEqual(ranked[0].id, '2');
  assert.strictEqual(ranked[2].id, '3');

  assert.ok(ranked[0].rankingReasons.some((reason) => reason.startsWith('Avaliação Google (4.5)')));
  assert.ok(ranked[0].rankingReasons.includes('Muitas avaliações'));
  assert.ok(ranked[2].rankingReasons.some((reason) => reason.startsWith('Avaliação Google (2.0)')));
});

test('LeadRanker - Evaluates sector validation', () => {
  const leadRanker = createLeadRanker();

  const leads = [
    { id: '1', telefone: '123', sectorValidation: { isConfirmed: true } },
    { id: '2', telefone: '123', sectorValidation: { isRejected: true } },
    { id: '3', telefone: '123', sectorValidation: null },
  ];

  const ranked = leadRanker.rankLeads(leads);

  assert.strictEqual(ranked[0].id, '1');
  assert.strictEqual(ranked[1].id, '3');
  assert.strictEqual(ranked[2].id, '2');
});
