import assert from 'node:assert/strict';
import {
  getCompanyWhatsAppStatus,
  readWhatsAppStatusOverrides,
  serializeWhatsAppStatusOverrides,
  setCompanyWhatsAppStatusOverride,
} from '../src/utils/whatsappStatusStore.js';

const lead = {
  nome_fantasia: 'Pizzaria e Lanchonete Marília',
  endereco: 'Av. João Martins Coelho, 1680',
  cidade: 'Marília',
  uf: 'SP',
  telefone: '(14) 99999-0000',
};

assert.deepEqual(readWhatsAppStatusOverrides('not-json'), {});
assert.deepEqual(readWhatsAppStatusOverrides({ foo: 'confirmed', bar: 'invalid', baz: 'NONE' }), { foo: 'CONFIRMED', baz: 'NONE' });

const confirmedOverrides = setCompanyWhatsAppStatusOverride({}, lead, 'CONFIRMED');
assert.equal(Object.keys(confirmedOverrides).length, 1);
assert.equal(getCompanyWhatsAppStatus(lead, confirmedOverrides), 'CONFIRMED');

const noneOverrides = setCompanyWhatsAppStatusOverride(confirmedOverrides, lead, 'NONE');
assert.equal(Object.keys(noneOverrides).length, 1);
assert.equal(getCompanyWhatsAppStatus(lead, noneOverrides), 'NONE');

assert.equal(
  getCompanyWhatsAppStatus({ ...lead, whatsappStatus: 'UNCONFIRMED' }, {}),
  'UNCONFIRMED',
);
assert.equal(
  serializeWhatsAppStatusOverrides({ foo: 'CONFIRMED', bar: 'NONE' }),
  '{"foo":"CONFIRMED","bar":"NONE"}',
);
