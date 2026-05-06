import {
  SEGMENT_DATABASE,
  SEGMENT_TAXONOMY_VERSION,
  getSegmentByCanonicalId,
  getSegmentSuggestions,
  resolveSegmentQuery,
  resolveSegmentRecord,
} from '../../src/utils/segmentDatabase.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const createSegmentResolver = ({
  taxonomy = SEGMENT_DATABASE,
  taxonomyVersion = SEGMENT_TAXONOMY_VERSION,
  now = () => Date.now(),
  cacheTtlMs = 24 * 60 * 60 * 1000,
} = {}) => {
  const suggestionCache = new Map();
  const resolutionCache = new Map();
  const loadedAt = now();

  const isExpired = () => (now() - loadedAt) > cacheTtlMs;

  const listSegments = () => clone(taxonomy);

  const getSuggestions = (query, limit = 8) => {
    const cacheKey = `${String(query || '').trim()}|${Number(limit) || 0}`;
    if (!isExpired() && suggestionCache.has(cacheKey)) {
      return clone(suggestionCache.get(cacheKey));
    }

    const suggestions = getSegmentSuggestions(query, limit, taxonomy);
    suggestionCache.set(cacheKey, suggestions);
    return clone(suggestions);
  };

  const resolveSegment = (query, options = {}) => {
    const cacheKey = `${String(query || '').trim()}|${options.allowLooseFallback ? '1' : '0'}`;
    if (!isExpired() && resolutionCache.has(cacheKey)) {
      return clone(resolutionCache.get(cacheKey));
    }

    const resolution = resolveSegmentRecord(query, options, taxonomy);
    if (!resolution) {
      return null;
    }

    const result = {
      ...resolution,
      taxonomyVersion,
    };

    resolutionCache.set(cacheKey, result);
    return clone(result);
  };

  const resolveLabel = (query) => {
    const resolution = resolveSegment(query, { allowLooseFallback: true });
    return resolution?.label || '';
  };

  return {
    taxonomyVersion,
    listSegments,
    getSegmentSuggestions: getSuggestions,
    getSegmentByCanonicalId: (canonicalId) => getSegmentByCanonicalId(canonicalId, taxonomy) || null,
    resolveSegment,
    resolveSegmentQuery: resolveLabel,
    resolveSegmentRecord: (query, options = {}) => resolveSegment(query, options),
    refresh: () => {
      suggestionCache.clear();
      resolutionCache.clear();
    },
  };
};
