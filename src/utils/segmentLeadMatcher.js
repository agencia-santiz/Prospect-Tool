import { normalizeSegmentText, resolveSegmentRecord } from './segmentDatabase.js';

const GENERIC_GOOGLE_TYPES = new Set([
  'restaurant',
  'cafe',
  'bar',
  'meal_takeaway',
  'store',
  'office',
  'company',
  'factory',
]);

const collectLeadText = (lead = {}) => [
  lead.nome_fantasia,
  lead.razao_social,
  lead.endereco,
  lead.bairro,
  lead.cidade,
  lead.uf,
  lead.website,
  lead.websiteDomain,
  lead.googleMapsUri,
  lead.telefone,
  lead.email,
].map((value) => normalizeSegmentText(value)).filter(Boolean).join(' ');

const collectLeadTokens = (lead = {}) => {
  const tokens = new Set();
  const add = (value) => {
    const normalized = normalizeSegmentText(value);
    if (normalized) {
      tokens.add(normalized);
    }
  };

  add(lead.atividade_principal);

  const provenance = lead.provenance || {};
  add(provenance.primaryType);

  if (Array.isArray(provenance.types)) {
    provenance.types.forEach(add);
  }

  const osmTags = provenance.osmTags || provenance.tags || {};
  if (osmTags && typeof osmTags === 'object') {
    for (const [key, value] of Object.entries(osmTags)) {
      if (value == null || value === '') {
        continue;
      }

      add(value);
      add(`${key}:${value}`);
    }
  }

  return [...tokens];
};

const includesAny = (text, terms) => terms.some((term) => text.includes(term));

const getSegmentTerms = (segmentRecord) => [
  segmentRecord?.label,
  ...(segmentRecord?.aliases || []),
  ...(segmentRecord?.positiveTerms || []),
].map((value) => normalizeSegmentText(value)).filter(Boolean);

const getNegativeTerms = (segmentRecord) => [
  ...(segmentRecord?.negativeTerms || []),
].map((value) => normalizeSegmentText(value)).filter(Boolean);

const getSegmentGoogleTypes = (segmentRecord) => [
  ...(segmentRecord?.googleTypes || []),
].map((value) => normalizeSegmentText(value)).filter(Boolean);

const getSpecificGoogleTypes = (segmentRecord) => {
  const googleTypes = getSegmentGoogleTypes(segmentRecord);
  return googleTypes.filter((value) => !GENERIC_GOOGLE_TYPES.has(value));
};

const hasStrongOsmSignal = (lead = {}, segmentRecord) => {
  const provenance = lead.provenance || {};
  const osmTags = provenance.osmTags || provenance.tags || {};
  if (!osmTags || typeof osmTags !== 'object') {
    return false;
  }

  const positiveTerms = getSegmentTerms(segmentRecord);
  const tagValues = Object.values(osmTags).map((value) => normalizeSegmentText(value)).filter(Boolean);
  if (tagValues.some((value) => positiveTerms.includes(value))) {
    return true;
  }

  if (segmentRecord?.id === 'pizzaria' && normalizeSegmentText(osmTags.cuisine) === 'pizza') {
    return true;
  }

  if (segmentRecord?.id === 'churrascaria' && ['bbq', 'barbecue', 'steakhouse'].includes(normalizeSegmentText(osmTags.cuisine))) {
    return true;
  }

  if (segmentRecord?.id === 'hamburgueria' && ['burger', 'hamburger'].includes(normalizeSegmentText(osmTags.cuisine))) {
    return true;
  }

  if (
    segmentRecord?.id === 'farmacia'
    && (
      normalizeSegmentText(osmTags.amenity) === 'pharmacy'
      || normalizeSegmentText(osmTags.healthcare) === 'pharmacy'
      || normalizeSegmentText(osmTags.shop) === 'chemist'
    )
  ) {
    return true;
  }

  return false;
};

export const isLeadRelevantToSegment = (lead = {}, segmentQuery = '') => {
  const segmentRecord = resolveSegmentRecord(segmentQuery, { allowLooseFallback: true });

  if (!segmentRecord?.canonicalId) {
    return {
      accepted: true,
      reason: 'free_text_segment',
      segmentRecord: null,
    };
  }

  const text = collectLeadText(lead);
  const tokens = collectLeadTokens(lead);
  const positiveTerms = getSegmentTerms(segmentRecord);
  const negativeTerms = getNegativeTerms(segmentRecord);
  const googleTypes = getSegmentGoogleTypes(segmentRecord);
  const specificGoogleTypes = getSpecificGoogleTypes(segmentRecord);

  if (negativeTerms.length > 0 && includesAny(text, negativeTerms)) {
    return {
      accepted: false,
      reason: 'negative_term_match',
      segmentRecord,
    };
  }

  if (includesAny(text, positiveTerms)) {
    return {
      accepted: true,
      reason: 'text_match',
      segmentRecord,
    };
  }

  const matchedTypes = tokens.filter((token) => googleTypes.includes(token));
  if (matchedTypes.some((token) => specificGoogleTypes.includes(token))) {
    return {
      accepted: true,
      reason: 'specific_type_match',
      segmentRecord,
    };
  }

  if (matchedTypes.length > 0 && specificGoogleTypes.length === 0) {
    return {
      accepted: true,
      reason: 'generic_type_match',
      segmentRecord,
    };
  }

  if (hasStrongOsmSignal(lead, segmentRecord)) {
    return {
      accepted: true,
      reason: 'osm_signal',
      segmentRecord,
    };
  }

  return {
    accepted: false,
    reason: 'insufficient_segment_evidence',
    segmentRecord,
  };
};

export const filterLeadsBySegment = (leads = [], segmentQuery = '') =>
  leads.filter((lead) => isLeadRelevantToSegment(lead, segmentQuery).accepted);
