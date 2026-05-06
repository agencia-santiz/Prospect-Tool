import { SEGMENT_DATABASE, getSegmentByCanonicalId, resolveSegmentRecord } from '../../src/utils/segmentDatabase.js';

const DEFAULT_CNPJ_API_BASE_URL = 'https://apigateway.conectagov.estaleiro.serpro.gov.br/api-cnpj-empresa/v2/empresa';

const clone = (value) => JSON.parse(JSON.stringify(value));

const dedupeStrings = (values = []) => [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

const normalizeDigits = (value = '') => String(value).replace(/\D+/g, '');

const normalizeCnaeCode = (value = '') => {
  const digits = normalizeDigits(value);
  if (digits.length < 6) {
    return String(value || '').trim();
  }

  const family = digits.slice(0, 4);
  const subFamily = digits.slice(4, 5);
  const subclass = digits.slice(5, 7);
  return `${family}-${subFamily}/${subclass}`;
};

const getCnaeFamilyPrefix = (value = '') => normalizeCnaeCode(value).replace(/[^0-9]/g, '').slice(0, 4);

const getCnaeDivisionPrefix = (value = '') => normalizeCnaeCode(value).replace(/[^0-9]/g, '').slice(0, 2);

const normalizeCnaeList = (values = []) => dedupeStrings(values.map(normalizeCnaeCode));

const normalizeCnpj = (value = '') => {
  const digits = normalizeDigits(value);
  return digits.length === 14 ? digits : '';
};

const validateCnpjChecksum = (cnpj) => {
  const digits = normalizeDigits(cnpj);
  if (digits.length !== 14) {
    return false;
  }

  if (/^(\d)\1+$/.test(digits)) {
    return false;
  }

  const calcDigit = (base, factors) => {
    const total = base.split('').reduce((acc, digit, index) => acc + Number(digit) * factors[index], 0);
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base12 = digits.slice(0, 12);
  const firstDigit = calcDigit(base12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calcDigit(`${base12}${firstDigit}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return digits.endsWith(`${firstDigit}${secondDigit}`);
};

const resolveSegmentProfile = (segmentQuery, segmentResolver) => {
  const resolved = segmentResolver?.resolveSegmentRecord
    ? segmentResolver.resolveSegmentRecord(segmentQuery, { allowLooseFallback: true })
    : resolveSegmentRecord(segmentQuery, { allowLooseFallback: true }, SEGMENT_DATABASE);

  if (!resolved) {
    return null;
  }

  const canonicalSegment = getSegmentByCanonicalId(resolved.canonicalId || resolved.id || '', SEGMENT_DATABASE) || resolved;
  const cnaeCodes = normalizeCnaeList(canonicalSegment.cnaeCodes || resolved.cnaeCodes || []);

  return {
    canonicalId: resolved.canonicalId || canonicalSegment.id || null,
    label: resolved.label || canonicalSegment.label || String(segmentQuery || '').trim(),
    category: canonicalSegment.category || resolved.category || '',
    cnaeCodes,
    cnaeFamilyPrefixes: dedupeStrings(cnaeCodes.map(getCnaeFamilyPrefix).filter(Boolean)),
    cnaeDivisionPrefixes: dedupeStrings(cnaeCodes.map(getCnaeDivisionPrefix).filter(Boolean)),
    negativeTerms: dedupeStrings(canonicalSegment.negativeTerms || resolved.negativeTerms || []),
    googleTypes: dedupeStrings(canonicalSegment.googleTypes || resolved.googleTypes || []),
    aliases: dedupeStrings(canonicalSegment.aliases || resolved.aliases || []),
    broadParent: canonicalSegment.broadParent || resolved.broadParent || '',
    taxonomyVersion: resolved.taxonomyVersion || null,
  };
};

const extractAny = (source, paths) => {
  for (const path of paths) {
    const segments = path.split('.');
    let current = source;
    let found = true;

    for (const segment of segments) {
      if (current == null || typeof current !== 'object' || !(segment in current)) {
        found = false;
        break;
      }

      current = current[segment];
    }

    if (found && current != null && current !== '') {
      return current;
    }
  }

  return null;
};

const normalizeCnpjRecord = (record = {}) => {
  const rawCnpj = extractAny(record, [
    'cnpj',
    'numero_inscricao',
    'numeroInscricao',
    'cnpj_basico',
    'cnpjBasico',
  ]);
  const cnpj = normalizeCnpj(rawCnpj);
  const mainCnaeCode = normalizeCnaeCode(extractAny(record, [
    'main_cnae_code',
    'cnae_fiscal_principal',
    'cnae_fiscal_codigo',
    'cnaeFiscalPrincipal',
    'cnaeFiscal',
  ]) || '');
  const secondaryCnaesRaw = extractAny(record, [
    'secondary_cnaes',
    'cnaes_secundarios',
    'cnae_fiscal_secundaria',
    'cnaeFiscalSecundaria',
  ]);
  const secondaryCnaes = Array.isArray(secondaryCnaesRaw)
    ? normalizeCnaeList(secondaryCnaesRaw)
    : normalizeCnaeList(String(secondaryCnaesRaw || '').split(/[;,]/g));

  const situacaoRaw = extractAny(record, [
    'situacao_cadastral',
    'situacaoCadastral',
    'status_cadastral',
    'statusCadastral',
  ]);
  const situacaoCadastral = String(situacaoRaw || '').trim();

  return {
    cnpj,
    razaoSocial: String(extractAny(record, ['razao_social', 'nome_empresarial', 'razaoSocial']) || '').trim(),
    nomeFantasia: String(extractAny(record, ['nome_fantasia', 'nomeFantasia']) || '').trim(),
    situacaoCadastral,
    situacaoCadastralNormalized: normalizeText(situacaoCadastral),
    isAtiva: /(^|[^a-z])ativa([^a-z]|$)/i.test(situacaoCadastral) || situacaoCadastral === '2',
    isMatriz: String(extractAny(record, ['identificador_matriz_filial', 'matriz_filial', 'isMatriz']) || '').trim() === '1',
    mainCnaeCode,
    mainCnaeDescription: String(extractAny(record, [
      'cnae_fiscal_descricao',
      'descricao_cnae_fiscal',
      'main_cnae_description',
    ]) || '').trim(),
    secondaryCnaes,
    address: String(extractAny(record, ['endereco', 'logradouro', 'address']) || '').trim(),
    city: String(extractAny(record, ['municipio', 'cidade', 'city']) || '').trim(),
    stateCode: String(extractAny(record, ['uf', 'estado', 'stateCode']) || '').trim(),
    cep: String(extractAny(record, ['cep', 'postalCode']) || '').trim(),
    email: String(extractAny(record, ['email', 'correio_eletronico']) || '').trim(),
    phone: String(extractAny(record, ['telefone', 'phone']) || '').trim(),
    source: String(extractAny(record, ['source', 'data_source']) || 'CNPJ').trim(),
    raw: clone(record),
  };
};

const scoreCnaeAgainstProfile = (cnaeCode, profile, description = '') => {
  const normalizedCode = normalizeCnaeCode(cnaeCode);
  if (!normalizedCode) {
    return { status: 'unknown', confidence: 0, reason: 'missing_cnae' };
  }

  if (profile.cnaeCodes.includes(normalizedCode)) {
    return { status: 'strong', confidence: 1, reason: 'exact_cnae_match' };
  }

  const familyPrefix = getCnaeFamilyPrefix(normalizedCode);
  if (familyPrefix && profile.cnaeFamilyPrefixes.includes(familyPrefix)) {
    return { status: 'related', confidence: 0.75, reason: 'same_cnae_family' };
  }

  const divisionPrefix = getCnaeDivisionPrefix(normalizedCode);
  if (divisionPrefix && profile.cnaeDivisionPrefixes.includes(divisionPrefix)) {
    return { status: 'related', confidence: 0.55, reason: 'same_cnae_division' };
  }

  const normalizedDescription = normalizeText(description);
  if (profile.negativeTerms.some((term) => normalizedDescription.includes(normalizeText(term)))) {
    return { status: 'negative', confidence: 0, reason: 'negative_term_match' };
  }

  if (profile.aliases.some((term) => normalizedDescription.includes(normalizeText(term)))) {
    return { status: 'related', confidence: 0.45, reason: 'description_alias_match' };
  }

  return { status: 'unknown', confidence: 0.2, reason: 'no_cnae_rule_match' };
};

const evaluateRecordAgainstProfile = (record, profile) => {
  const primaryScore = scoreCnaeAgainstProfile(record.mainCnaeCode, profile, record.mainCnaeDescription);
  const secondaryScores = record.secondaryCnaes.map((code) => scoreCnaeAgainstProfile(code, profile, record.mainCnaeDescription));
  const bestSecondary = secondaryScores.reduce((best, current) => (current.confidence > best.confidence ? current : best), { status: 'unknown', confidence: 0, reason: 'missing_cnae' });
  const bestScore = primaryScore.confidence >= bestSecondary.confidence ? primaryScore : bestSecondary;

  const cadastralState = record.isAtiva ? 'active' : (record.situacaoCadastral ? 'inactive' : 'unknown');
  const cnpjValid = record.cnpj ? validateCnpjChecksum(record.cnpj) : false;

  return {
    cnpj: record.cnpj,
    cnpjValid,
    cadastralState,
    cadastralStatus: record.situacaoCadastral || null,
    segmentCanonicalId: profile.canonicalId,
    segmentLabel: profile.label,
    cnaeStatus: bestScore.status,
    cnaeConfidence: bestScore.confidence,
    cnaeReason: bestScore.reason,
    mainCnaeCode: record.mainCnaeCode || null,
    mainCnaeDescription: record.mainCnaeDescription || null,
    secondaryCnaes: record.secondaryCnaes,
    isStrongMatch: bestScore.status === 'strong' && record.isAtiva,
    isConfirmed: bestScore.status === 'strong' && record.isAtiva && (!record.cnpj || cnpjValid),
    isRejected: bestScore.status === 'negative' || (!record.isAtiva && Boolean(record.situacaoCadastral)),
  };
};

export const createCnpjCnaeService = ({
  segmentResolver,
  fetchImpl = fetch,
  apiBaseUrl = DEFAULT_CNPJ_API_BASE_URL,
  apiToken = '',
  apiKey = '',
} = {}) => {
  const profileCache = new Map();

  const getSegmentCnaeProfile = (segmentQuery) => {
    const cacheKey = normalizeText(segmentQuery);
    if (profileCache.has(cacheKey)) {
      return clone(profileCache.get(cacheKey));
    }

    const profile = resolveSegmentProfile(segmentQuery, segmentResolver);
    if (!profile) {
      return null;
    }

    const result = {
      ...profile,
      strongCnaeCodes: profile.cnaeCodes,
      acceptedCnaeFamilies: profile.cnaeFamilyPrefixes,
      acceptedCnaeDivisions: profile.cnaeDivisionPrefixes,
      negativeCnaeTerms: profile.negativeTerms,
      validationMode: profile.cnaeCodes.length > 0 ? 'available' : 'unknown',
    };

    profileCache.set(cacheKey, result);
    return clone(result);
  };

  const evaluateCompanySector = (company, segmentQuery) => {
    const profile = getSegmentCnaeProfile(segmentQuery);
    if (!profile) {
      return {
        status: 'unknown',
        reason: 'missing_segment_profile',
        profile: null,
      };
    }

    const normalizedRecord = normalizeCnpjRecord(company);
    const evaluation = evaluateRecordAgainstProfile(normalizedRecord, profile);

    return {
      ...evaluation,
      profile,
      record: normalizedRecord,
    };
  };

  const lookupCnpj = async (cnpj) => {
    const normalizedCnpj = normalizeCnpj(cnpj);
    if (!normalizedCnpj) {
      const error = new Error('CNPJ must contain 14 digits');
      error.code = 'INVALID_CNPJ';
      throw error;
    }

    if (!apiBaseUrl) {
      const error = new Error('CNPJ API is not configured');
      error.code = 'MISSING_CNPJ_API_CONFIG';
      throw error;
    }

    const requestUrl = `${String(apiBaseUrl).replace(/\/$/, '')}/${normalizedCnpj}`;
    const headers = {
      Accept: 'application/json',
    };

    if (apiToken) {
      headers.Authorization = `Bearer ${apiToken}`;
    }

    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const response = await fetchImpl(requestUrl, { headers });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(`CNPJ lookup failed with status ${response.status}`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return normalizeCnpjRecord(payload || {});
  };

  return {
    getSegmentCnaeProfile,
    evaluateCompanySector,
    lookupCnpj,
    normalizeCnpj,
    normalizeCnaeCode,
    validateCnpjChecksum,
    normalizeCnpjRecord,
  };
};
