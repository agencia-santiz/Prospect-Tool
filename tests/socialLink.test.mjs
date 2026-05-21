import assert from 'node:assert/strict';
import { buildInstagramProfileUrl, isInstagramLink } from '../src/utils/socialLink.js';

assert.equal(buildInstagramProfileUrl('@bloomleads'), 'https://www.instagram.com/bloomleads/');
assert.equal(buildInstagramProfileUrl('bloomleads'), 'https://www.instagram.com/bloomleads/');
assert.equal(buildInstagramProfileUrl('https://instagram.com/bloomleads'), 'https://instagram.com/bloomleads');
assert.equal(buildInstagramProfileUrl(''), '');

assert.equal(isInstagramLink('https://instagram.com/bloomleads'), true);
assert.equal(isInstagramLink('instagram.com/bloomleads'), true);
assert.equal(isInstagramLink('https://example.com'), false);
