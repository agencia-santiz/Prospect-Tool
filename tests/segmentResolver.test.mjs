import assert from 'node:assert/strict';
import { createSegmentResolver } from '../server/services/segmentResolver.js';

const resolver = createSegmentResolver();

assert.equal(resolver.taxonomyVersion, '2026-05-05');
assert.ok(resolver.listSegments().length >= 40, 'resolver should expose the canonical taxonomy');

const admResolution = resolver.resolveSegment('adm');
assert.ok(admResolution, 'adm should resolve to a canonical segment');
assert.equal(admResolution.canonicalId, 'administrativo_escritorio');
assert.equal(admResolution.label, 'Administrativo / Escritório');
assert.equal(admResolution.taxonomyVersion, '2026-05-05');

const admLooseResolution = resolver.resolveSegmentRecord('adm', { allowLooseFallback: true });
assert.equal(admLooseResolution?.canonicalId, 'administrativo_escritorio');
assert.equal(resolver.resolveSegmentQuery('adm'), 'Administrativo / Escritório');

const unknownResolution = resolver.resolveSegment('segmento inventado');
assert.equal(unknownResolution, null);
assert.equal(resolver.resolveSegmentQuery('segmento inventado'), 'segmento inventado');

const techSuggestions = resolver.getSegmentSuggestions('tec', 3);
assert.ok(techSuggestions.some((item) => item.canonicalId === 'tecnologia_informacao_saas'));
