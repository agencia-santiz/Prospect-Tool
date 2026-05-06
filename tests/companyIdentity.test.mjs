import assert from 'node:assert/strict';
import { getCompanyContactKey, getLegacyCompanyContactKey, migrateContactedKeys } from '../src/utils/companyIdentity.js';

const raiaCentro = {
  nome_fantasia: 'Droga Raia',
  endereco: 'Avenida Paulista, 809',
  cidade: 'São Paulo',
  uf: 'SP',
};

const raiaBelaVista = {
  nome_fantasia: 'Droga Raia',
  endereco: 'Rua Teodoro Sampaio, 123',
  cidade: 'São Paulo',
  uf: 'SP',
};

const sameNameDifferentAddressA = getCompanyContactKey(raiaCentro);
const sameNameDifferentAddressB = getCompanyContactKey(raiaBelaVista);

assert.notEqual(sameNameDifferentAddressA, sameNameDifferentAddressB);
assert.equal(getCompanyContactKey({ ...raiaCentro, endereco: ' Avenida Paulista, 809 ' }), sameNameDifferentAddressA);

const legacyKey = getLegacyCompanyContactKey(raiaCentro);
const migratedUnique = migrateContactedKeys(new Set([legacyKey]), [raiaCentro]);
assert.deepEqual(Array.from(migratedUnique), [sameNameDifferentAddressA]);

const duplicateBranch = migrateContactedKeys(
  new Set([legacyKey]),
  [raiaCentro, { ...raiaCentro, id: 'duplicate-source-record' }]
);
assert.deepEqual(Array.from(duplicateBranch), [sameNameDifferentAddressA]);

const migratedAmbiguous = migrateContactedKeys(new Set([legacyKey]), [raiaCentro, raiaBelaVista]);
assert.equal(migratedAmbiguous.size, 0);
