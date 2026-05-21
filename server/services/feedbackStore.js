/**
 * feedbackStore.js
 * 
 * In-memory store for lead feedback signals.
 * Aggregates user feedback per company to influence ranking on subsequent searches.
 * 
 * Design decision: in-memory Map for MVP speed. The shape is intentionally
 * simple so it can be swapped for a Postgres table later without changing
 * the public API (recordFeedback / getCompanySignals / getSegmentPenalties).
 */

// Map<companyKey, { positive: number, negative: number, penalties: string[] }>
const companySignals = new Map();

// Map<segmentKey, { rejections: number }>
const segmentPenalties = new Map();

const FEEDBACK_WEIGHTS = {
  bom_lead:       { positive: 2, negative: 0 },
  duplicado:      { positive: 0, negative: 1 },
  fora_cidade:    { positive: 0, negative: 2 },
  fora_segmento:  { positive: 0, negative: 3 },
  sem_contato:    { positive: 0, negative: 1 },
};

const normalizeKey = (s) => (s || '').toLowerCase().trim();

/**
 * Record a user feedback event.
 * @param {{ leadId: string, feedbackType: string, companyName?: string, segment?: string, city?: string }} params
 */
export const recordFeedback = ({ leadId, feedbackType, companyName, segment, city }) => {
  const weight = FEEDBACK_WEIGHTS[feedbackType];
  if (!weight) return;

  // --- company-level signal ---
  const companyKey = normalizeKey(companyName) || leadId;
  const current = companySignals.get(companyKey) || { positive: 0, negative: 0, penalties: [] };
  current.positive += weight.positive;
  current.negative += weight.negative;

  if (feedbackType !== 'bom_lead') {
    current.penalties.push(feedbackType);
  }

  companySignals.set(companyKey, current);

  // --- segment+city level signal (for fora_segmento / fora_cidade) ---
  if ((feedbackType === 'fora_segmento' || feedbackType === 'fora_cidade') && segment) {
    const segKey = `${normalizeKey(segment)}|${normalizeKey(city)}`;
    const segCurrent = segmentPenalties.get(segKey) || { rejections: 0 };
    segCurrent.rejections += 1;
    segmentPenalties.set(segKey, segCurrent);
  }
};

/**
 * Get aggregated feedback signals for a company.
 * @param {string} companyName
 * @returns {{ positive: number, negative: number, penalties: string[], net: number } | null}
 */
export const getCompanySignals = (companyName) => {
  const key = normalizeKey(companyName);
  const signals = companySignals.get(key);
  if (!signals) return null;
  return {
    ...signals,
    net: signals.positive - signals.negative,
  };
};

/**
 * Get segment-level penalty info (how many times users rejected results for this segment+city combo).
 * @param {string} segment
 * @param {string} city
 * @returns {{ rejections: number } | null}
 */
export const getSegmentPenalties = (segment, city) => {
  const segKey = `${normalizeKey(segment)}|${normalizeKey(city)}`;
  return segmentPenalties.get(segKey) || null;
};

/**
 * Get all stored signals (for debugging/admin).
 */
export const getStats = () => ({
  totalCompanies: companySignals.size,
  totalSegmentPairs: segmentPenalties.size,
});
