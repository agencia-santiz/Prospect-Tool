import assert from 'node:assert/strict';
import { buildWhatsAppChatUrl, getWhatsAppChatTarget, getWhatsAppStatus, isWhatsAppLink, normalizeWhatsAppPhone } from '../src/utils/whatsappLink.js';

assert.equal(normalizeWhatsAppPhone('(14) 99999-0000'), '5514999990000');
assert.equal(normalizeWhatsAppPhone('05514999990000'), '5514999990000');
assert.equal(normalizeWhatsAppPhone('5514999990000'), '5514999990000');
assert.equal(normalizeWhatsAppPhone(''), '');

assert.equal(buildWhatsAppChatUrl('(14) 99999-0000'), 'https://wa.me/5514999990000');
assert.equal(
  buildWhatsAppChatUrl('14999990000', 'Olá, tudo bem?'),
  'https://wa.me/5514999990000?text=Ol%C3%A1%2C+tudo+bem%3F',
);
assert.equal(buildWhatsAppChatUrl(''), '');

assert.equal(isWhatsAppLink('https://wa.me/5514999990000'), true);
assert.equal(isWhatsAppLink('https://example.com'), false);

assert.equal(
  getWhatsAppStatus({ telefone: '(14) 99999-0000' }),
  'UNCONFIRMED',
);
assert.equal(
  getWhatsAppStatus({ website: 'https://wa.me/5514999990000' }),
  'CONFIRMED',
);
assert.equal(
  getWhatsAppStatus({}),
  'NONE',
);

assert.equal(
  getWhatsAppChatTarget({ telefone: '(14) 99999-0000' }),
  '(14) 99999-0000',
);
assert.equal(
  getWhatsAppChatTarget({ website: 'https://wa.me/5514999990000' }),
  'https://wa.me/5514999990000',
);
