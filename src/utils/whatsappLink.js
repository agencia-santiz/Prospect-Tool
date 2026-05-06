const normalizeDigits = (value) => String(value ?? '').replace(/\D/g, '');

const WHATSAPP_LINK_PATTERNS = [
  /wa\.me/i,
  /api\.whatsapp\.com\/send/i,
  /web\.whatsapp\.com/i,
  /whatsapp\.com\/send/i,
];

export const isWhatsAppLink = (value) => {
  const normalizedValue = String(value ?? '').trim();

  if (!normalizedValue) {
    return false;
  }

  return WHATSAPP_LINK_PATTERNS.some((pattern) => pattern.test(normalizedValue));
};

export const normalizeWhatsAppPhone = (phone) => {
  let digits = normalizeDigits(phone);

  if (!digits) {
    return '';
  }

  digits = digits.replace(/^0+/, '');

  if (digits.startsWith('55')) {
    return digits;
  }

  if (digits.length >= 10 && digits.length <= 11) {
    return `55${digits}`;
  }

  return digits;
};

export const buildWhatsAppChatUrl = (phone, text = '') => {
  const normalizedPhone = normalizeWhatsAppPhone(phone);

  if (!normalizedPhone) {
    return '';
  }

  const url = new URL(`https://wa.me/${normalizedPhone}`);
  const trimmedText = String(text ?? '').trim();

  if (trimmedText) {
    url.searchParams.set('text', trimmedText);
  }

  return url.toString();
};

export const getWhatsAppChatTarget = (company) => {
  const explicitTarget = [company?.telefone, company?.website]
    .find((value) => isWhatsAppLink(value));

  if (explicitTarget) {
    return explicitTarget;
  }

  if (company?.telefone) {
    return company.telefone;
  }

  return '';
};

export const getWhatsAppStatus = (company) => {
  const explicitEvidence = [company?.telefone, company?.website]
    .some((value) => isWhatsAppLink(value));

  if (explicitEvidence) {
    return 'CONFIRMED';
  }

  if (normalizeWhatsAppPhone(company?.telefone)) {
    return 'UNCONFIRMED';
  }

  return 'NONE';
};
