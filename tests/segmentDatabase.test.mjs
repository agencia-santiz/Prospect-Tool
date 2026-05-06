import assert from 'node:assert/strict';
import {
  SEGMENT_DATABASE,
  SEGMENT_TAXONOMY_VERSION,
  getSegmentSuggestions,
  normalizeSegmentText,
  resolveSegmentRecord,
  resolveSegmentQuery,
} from '../src/utils/segmentDatabase.js';

assert.ok(SEGMENT_DATABASE.length >= 40, 'the segment database should contain a useful baseline catalog');
assert.equal(SEGMENT_TAXONOMY_VERSION, '2026-05-05');

assert.equal(normalizeSegmentText('ÁdM  Escritório'), 'adm escritorio');
assert.equal(normalizeSegmentText('Tecnologia / SaaS'), 'tecnologia / saas');

const admSuggestions = getSegmentSuggestions('adm');
assert.ok(admSuggestions.length > 0, 'adm should return at least one suggestion');
assert.equal(admSuggestions[0].label, 'Administrativo / Escritório');
assert.equal(admSuggestions[0].canonicalId, 'administrativo_escritorio');
assert.ok(admSuggestions.some((item) => item.label === 'Administração Pública'));

const techSuggestions = getSegmentSuggestions('tec');
assert.ok(techSuggestions.some((item) => item.label === 'Tecnologia da Informação / SaaS'));

const firstLetterSuggestions = getSegmentSuggestions('a');
assert.ok(firstLetterSuggestions.length > 0, 'single-letter queries should already return prefix-based suggestions');
assert.ok(
  firstLetterSuggestions.every((item) => {
    const prefixTokens = [item.label, item.category, ...item.aliases].map(normalizeSegmentText);
    return prefixTokens.some((token) => token.startsWith('a'));
  }),
  'single-letter suggestions should stay anchored to the first letter',
);

assert.equal(resolveSegmentRecord('adm')?.canonicalId, 'administrativo_escritorio');
assert.equal(resolveSegmentQuery('adm'), 'Administrativo / Escritório');
assert.equal(resolveSegmentQuery('escritorio'), 'Administrativo / Escritório');
assert.equal(resolveSegmentQuery('tec'), 'Tecnologia da Informação / SaaS');
assert.equal(resolveSegmentQuery('a'), '');
