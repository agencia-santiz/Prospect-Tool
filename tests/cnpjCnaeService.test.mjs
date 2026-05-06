import assert from 'node:assert/strict';
import { createSegmentResolver } from '../server/services/segmentResolver.js';
import { createCnpjCnaeService } from '../server/services/cnpjCnaeService.js';

const calcDigit = (base, factors) => {
  const total = base.split('').reduce((acc, digit, index) => acc + Number(digit) * factors[index], 0);
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

const makeValidCnpj = (base12) => {
  const digits = String(base12).replace(/\D+/g, '').padStart(12, '0').slice(0, 12);
  const firstDigit = calcDigit(digits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calcDigit(`${digits}${firstDigit}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return `${digits}${firstDigit}${secondDigit}`;
};

const validCnpj = makeValidCnpj('123456780001');
const segmentResolver = createSegmentResolver();
const requests = [];

const service = createCnpjCnaeService({
  segmentResolver,
  apiBaseUrl: 'https://example.test/api',
  apiToken: 'token-123',
  apiKey: 'key-456',
  fetchImpl: async (url, options) => {
    requests.push({ url, options });
    return {
      ok: true,
      json: async () => ({
        numero_inscricao: '12.345.678/0001-95',
        nome_empresarial: 'Tech Exemplo LTDA',
        nome_fantasia: 'Tech Exemplo',
        situacao_cadastral: '2',
        cnae_fiscal_principal: '6201501',
        cnae_fiscal_secundaria: ['6202300', '6209100'],
        endereco: 'Rua Central, 100',
        municipio: 'Marilia',
        uf: 'SP',
        cep: '17500-000',
        email: 'contato@example.com',
        telefone: '(11) 3333-4444',
      }),
    };
  },
});

assert.equal(service.normalizeCnpj('12.345.678/0001-95'), '12345678000195');
assert.equal(service.validateCnpjChecksum(validCnpj), true);
assert.equal(service.validateCnpjChecksum('00000000000000'), false);
assert.equal(service.normalizeCnaeCode('6201501'), '6201-5/01');

const profile = service.getSegmentCnaeProfile('tec');
assert.equal(profile.canonicalId, 'tecnologia_informacao_saas');
assert.ok(profile.strongCnaeCodes.includes('6201-5/01'));

const evaluation = service.evaluateCompanySector({
  cnpj: validCnpj,
  main_cnae_code: '6201501',
  situacao_cadastral: 'ATIVA',
  nome_fantasia: 'Tech Exemplo',
}, 'Tecnologia da Informacao / SaaS');

assert.equal(evaluation.cnpjValid, true);
assert.equal(evaluation.cnaeStatus, 'strong');
assert.equal(evaluation.isConfirmed, true);

const lookedUp = await service.lookupCnpj('12.345.678/0001-95');

assert.equal(requests.length, 1);
assert.equal(requests[0].url, 'https://example.test/api/12345678000195');
assert.equal(requests[0].options.headers.Authorization, 'Bearer token-123');
assert.equal(requests[0].options.headers['X-API-Key'], 'key-456');
assert.equal(lookedUp.cnpj, '12345678000195');
assert.equal(lookedUp.mainCnaeCode, '6201-5/01');
assert.deepEqual(lookedUp.secondaryCnaes, ['6202-3/00', '6209-1/00']);
assert.equal(lookedUp.isAtiva, true);
