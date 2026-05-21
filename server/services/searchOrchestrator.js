import { filterLeadsBySegment } from '../../src/utils/segmentLeadMatcher.js';

const clone = (value) => {
  if (value == null) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
};

const PREFIX_MATCH_STRATEGIES = new Set([
  'label-prefix',
  'term-prefix',
  'category-prefix',
  'token-contains',
]);

const SECTOR_EVIDENCE_KEYS = [
  'cnpj',
  'numero_inscricao',
  'numeroInscricao',
  'main_cnae_code',
  'mainCnaeCode',
  'cnae_fiscal_principal',
  'cnaeFiscalPrincipal',
  'cnae_fiscal_codigo',
  'cnaeFiscal',
  'cnae_fiscal_secundaria',
  'cnaeFiscalSecundaria',
  'situacao_cadastral',
  'situacaoCadastral',
  'status_cadastral',
  'statusCadastral',
];

const MAX_RESULTS_PER_SOURCE_CALL = 20;

const getExpansionLevel = (segmentResolution) => {
  if (!segmentResolution) {
    return 2;
  }

  if (segmentResolution.matchedBy === 'free-text') {
    return 2;
  }

  if (PREFIX_MATCH_STRATEGIES.has(segmentResolution.matchedBy)) {
    return 1;
  }

  return 0;
};

const getSegmentConfidence = (segmentResolution, expansionLevel) => {
  if (!segmentResolution || segmentResolution.matchedBy === 'free-text') {
    return 'broad';
  }

  if (expansionLevel === 0) {
    return 'strong';
  }

  if (expansionLevel === 1) {
    return 'medium';
  }

  return 'broad';
};

const getSourcePlan = (expansionLevel, hasAuxiliaryLeadSource = false) => {
  const requested = ['google_geocoding', 'google_places'];

  if (expansionLevel >= 1) {
    requested.push('gemini_fallback');
  }

  if (hasAuxiliaryLeadSource) {
    requested.push('open_data');
  }

  return {
    primary: 'google_places',
    requested,
    used: [],
  };
};

const hasSectorEvidence = (lead = {}) => SECTOR_EVIDENCE_KEYS.some((key) => {
  const value = lead?.[key];
  return value != null && String(value).trim() !== '';
});

const getLeadSectorQuery = (lead = {}, fallbackSegment = '') => String(
  lead?.atividade_principal
    || lead?.segment
    || lead?.segmento
    || lead?.mainCnaeDescription
    || fallbackSegment
    || '',
).trim();

const buildSectorValidationSummary = (evaluation, source = 'local') => ({
  source,
  cnpj: evaluation.cnpj || null,
  cnpjValid: evaluation.cnpjValid,
  cadastralState: evaluation.cadastralState,
  cadastralStatus: evaluation.cadastralStatus,
  cnaeStatus: evaluation.cnaeStatus,
  cnaeConfidence: evaluation.cnaeConfidence,
  cnaeReason: evaluation.cnaeReason,
  segmentCanonicalId: evaluation.segmentCanonicalId,
  segmentLabel: evaluation.segmentLabel,
  isStrongMatch: evaluation.isStrongMatch,
  isConfirmed: evaluation.isConfirmed,
  isRejected: evaluation.isRejected,
});

const normalizeSearchVariant = (value) => String(value || '').trim().replace(/\s+/g, ' ');

const splitVariantList = (value) =>
  String(value || '')
    .split(/[,;\n|]+/g)
    .flatMap((item) => item.split(/\s+\/\s+/g))
    .map((item) => normalizeSearchVariant(item))
    .filter(Boolean);

const pushUniqueVariant = (variants, seen, value) => {
  const variant = normalizeSearchVariant(value);
  if (!variant) {
    return;
  }

  const normalized = variant.toLowerCase();
  if (seen.has(normalized)) {
    return;
  }

  seen.add(normalized);
  variants.push(variant);
};

const buildSearchVariants = async ({ plan, requestedQuantity, fallbackLeadSource, segmentResolver, refinedQuery = '' }) => {
  const variants = [];
  const seen = new Set();

  pushUniqueVariant(variants, seen, refinedQuery);
  pushUniqueVariant(variants, seen, plan?.segment?.label);
  pushUniqueVariant(variants, seen, plan?.segment?.query);
  pushUniqueVariant(variants, seen, plan?.input?.segment);
  pushUniqueVariant(variants, seen, plan?.segment?.category);
  pushUniqueVariant(variants, seen, plan?.segment?.aliases);
  pushUniqueVariant(variants, seen, plan?.segment?.positiveTerms);

  if (requestedQuantity > MAX_RESULTS_PER_SOURCE_CALL && typeof segmentResolver?.getSegmentSuggestions === 'function') {
    const suggestions = segmentResolver.getSegmentSuggestions(plan?.input?.segment || plan?.segment?.label || '', 12);
    for (const suggestion of suggestions) {
      pushUniqueVariant(variants, seen, suggestion?.label);
    }
  }

  if (!normalizeSearchVariant(refinedQuery) && fallbackLeadSource && typeof fallbackLeadSource.refineSearchQuery === 'function') {
    try {
      const refined = await fallbackLeadSource.refineSearchQuery(plan?.input?.segment || plan?.segment?.label || '');
      for (const variant of splitVariantList(refined)) {
        pushUniqueVariant(variants, seen, variant);
      }
    } catch {
      // Ignore query expansion failures and keep the original query set.
    }
  }

  return variants;
};

const normalizeBoundingBox = (boundingBox) => {
  if (!boundingBox) {
    return null;
  }

  const south = Number(boundingBox.south);
  const west = Number(boundingBox.west);
  const north = Number(boundingBox.north);
  const east = Number(boundingBox.east);

  if (![south, west, north, east].every((value) => Number.isFinite(value))) {
    return null;
  }

  if (south >= north || west >= east) {
    return null;
  }

  return {
    south,
    west,
    north,
    east,
  };
};

const buildLocationVariants = (plan, requestedQuantity) => {
  const normalizedBoundingBox = normalizeBoundingBox(plan?.location?.boundingBox);
  if (!normalizedBoundingBox || requestedQuantity <= MAX_RESULTS_PER_SOURCE_CALL) {
    return [
      {
        key: 'base',
        plan,
      },
    ];
  }

  const gridSize = requestedQuantity >= 100 ? 3 : 2;
  const latStep = (normalizedBoundingBox.north - normalizedBoundingBox.south) / gridSize;
  const lonStep = (normalizedBoundingBox.east - normalizedBoundingBox.west) / gridSize;

  const variants = [];
  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col < gridSize; col += 1) {
      const sliceSouth = row === 0 ? normalizedBoundingBox.south : normalizedBoundingBox.south + (latStep * row);
      const sliceNorth = row === gridSize - 1 ? normalizedBoundingBox.north : normalizedBoundingBox.south + (latStep * (row + 1));
      const sliceWest = col === 0 ? normalizedBoundingBox.west : normalizedBoundingBox.west + (lonStep * col);
      const sliceEast = col === gridSize - 1 ? normalizedBoundingBox.east : normalizedBoundingBox.west + (lonStep * (col + 1));

      variants.push({
        key: `slice-${row}-${col}`,
        plan: {
          ...plan,
          location: {
            ...plan.location,
            boundingBox: {
              south: sliceSouth,
              west: sliceWest,
              north: sliceNorth,
              east: sliceEast,
            },
          },
          googleLocation: null,
        },
      });
    }
  }

  return variants;
};

const buildRuntimeExcludeNames = (planExcludeNames = [], leads = []) => {
  const seen = new Set();
  const runtimeExcludeNames = [];

  const add = (value) => {
    const text = String(value || '').trim();
    if (!text) {
      return;
    }

    const normalized = text.toLowerCase();
    if (seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    runtimeExcludeNames.push(text);
  };

  for (const name of planExcludeNames) {
    add(name);
  }

  for (const lead of leads) {
    add(lead?.nome_fantasia);
    add(lead?.razao_social);
  }

  return runtimeExcludeNames.slice(0, 200);
};

export const createSearchOrchestrator = ({
  locationResolver,
  segmentResolver,
  geoSource,
  primaryLeadSource,
  fallbackLeadSource,
  auxiliaryLeadSource,
  sectorValidationService,
  companyNormalizer,
  companyDeduper,
  leadRanker,
  leadSource,
  taxonomyVersion = '2026-05-05',
} = {}) => {
  if (!locationResolver || typeof locationResolver.resolveLocation !== 'function') {
    throw new Error('locationResolver is required');
  }

  if (!segmentResolver || typeof segmentResolver.resolveSegmentRecord !== 'function' || typeof segmentResolver.resolveSegmentQuery !== 'function') {
    throw new Error('segmentResolver is required');
  }

  const resolvedPrimaryLeadSource = primaryLeadSource || leadSource;
  if (!resolvedPrimaryLeadSource || typeof resolvedPrimaryLeadSource.fetchEnrichedLeads !== 'function') {
    throw new Error('leadSource is required');
  }

  const normalizeLeads = (leads, context) => {
    if (!companyNormalizer || typeof companyNormalizer.normalizeCompanies !== 'function') {
      return leads;
    }

    return companyNormalizer.normalizeCompanies(leads, context);
  };

  const planSearch = async ({
    location,
    segment,
    excludeNames = [],
    quantity = 9,
    intent = 'NONE',
  } = {}) => {
    const trimmedLocation = String(location || '').trim();
    const trimmedSegment = String(segment || '').trim();

    if (!trimmedLocation || !trimmedSegment) {
      const error = new Error('location and segment are required');
      error.code = 'INVALID_REQUEST';
      throw error;
    }

    const resolvedLocation = await locationResolver.resolveLocation(trimmedLocation);
    const resolvedSegment = segmentResolver.resolveSegmentRecord(trimmedSegment, { allowLooseFallback: true });
    const canonicalSegmentLabel = resolvedSegment?.label || trimmedSegment;
    const canonicalSegmentId = resolvedSegment?.canonicalId || null;
    const expansionLevel = getExpansionLevel(resolvedSegment);
    const sourcePlan = getSourcePlan(expansionLevel, Boolean(auxiliaryLeadSource));
    let googleLocation = null;
    if (geoSource && typeof geoSource.geocodeLocation === 'function') {
      try {
        googleLocation = await geoSource.geocodeLocation(trimmedLocation, {
          regionCode: resolvedLocation.stateCode || 'BR',
          languageCode: 'pt-BR',
        });
      } catch {
        googleLocation = null;
      }
    }
    const sectorValidationProfile = sectorValidationService?.getSegmentCnaeProfile
      ? sectorValidationService.getSegmentCnaeProfile(resolvedSegment?.label || trimmedSegment)
      : null;

    return {
      taxonomyVersion,
      input: {
        location: trimmedLocation,
        segment: trimmedSegment,
        excludeNames: excludeNames.slice(0, 50).map((value) => String(value)),
        quantity,
        intent,
      },
      location: {
        ...clone(resolvedLocation),
        displayLabel: resolvedLocation.label,
      },
      googleLocation,
      segment: {
        ...clone(resolvedSegment),
        canonicalId: canonicalSegmentId,
        label: canonicalSegmentLabel,
        query: trimmedSegment,
        taxonomyVersion,
        expansionLevel,
        confidence: getSegmentConfidence(resolvedSegment, expansionLevel),
        sourcePlan,
      },
      sectorValidation: sectorValidationProfile ? {
        enabled: true,
        profile: clone(sectorValidationProfile),
        validationMode: sectorValidationProfile.validationMode || 'unknown',
      } : {
        enabled: false,
        profile: null,
        validationMode: 'unavailable',
      },
      sourcePlan,
      searchKey: [
        resolvedLocation.ibgeMunicipalityId,
        canonicalSegmentId || 'free_text',
        expansionLevel,
      ].join('|'),
      ready: true,
    };
  };

  const runSearch = async (params = {}) => {
    const plan = await planSearch(params);
    const requestedQuantity = Math.max(1, Number(plan.input.quantity) || 1);
    const useVariantSearch = requestedQuantity > MAX_RESULTS_PER_SOURCE_CALL;
    const fetchQuantity = useVariantSearch
      ? requestedQuantity
      : Math.min(Math.max(requestedQuantity + 10, requestedQuantity * 2), 20);

    const searchArgs = {
      location: plan.location.displayLabel,
      segment: plan.segment.label,
      excludeNames: plan.input.excludeNames,
      quantity: fetchQuantity,
      plan,
    };

    const actualSources = [];
    let refinedSearchQuery = '';

    if (plan.segment.confidence === 'broad' && fallbackLeadSource && typeof fallbackLeadSource.refineSearchQuery === 'function') {
      try {
        const refined = await fallbackLeadSource.refineSearchQuery(plan.input.segment);
        refinedSearchQuery = refined || '';
        if (refined && !useVariantSearch) {
          searchArgs.segment = refined;
        }
      } catch {
        // Silently continue if expansion fails.
      }
    }

    const searchVariants = useVariantSearch
      ? await buildSearchVariants({
          plan,
          requestedQuantity,
          fallbackLeadSource,
          segmentResolver,
          refinedQuery: refinedSearchQuery,
        })
      : [searchArgs.segment];

    if (useVariantSearch && searchVariants.length > 0) {
      searchArgs.segment = searchVariants[0];
    }

    const locationVariants = buildLocationVariants(plan, requestedQuantity);

    const sectorValidationSummary = plan.sectorValidation?.enabled ? {
      enabled: true,
      profile: clone(plan.sectorValidation.profile),
      validationMode: plan.sectorValidation.validationMode || 'unknown',
      checkedLeads: 0,
      confirmedLeads: 0,
      relatedLeads: 0,
      rejectedLeads: 0,
    } : {
      enabled: false,
      profile: null,
      validationMode: 'unavailable',
      checkedLeads: 0,
      confirmedLeads: 0,
      relatedLeads: 0,
      rejectedLeads: 0,
    };

    let leads = [];

    const addLeads = (incomingLeads, dedupeAgainstExisting = false) => {
      if (!Array.isArray(incomingLeads) || incomingLeads.length === 0) {
        return;
      }

      if (!dedupeAgainstExisting) {
        leads.push(...incomingLeads);
        return;
      }

      const seen = new Set(leads.map((lead) => `${String(lead.nome_fantasia || '').toLowerCase()}|${String(lead.endereco || lead.cidade || '').toLowerCase()}`));

      for (const lead of incomingLeads) {
        const key = `${String(lead.nome_fantasia || '').toLowerCase()}|${String(lead.endereco || lead.cidade || '').toLowerCase()}`;
        if (!seen.has(key)) {
          leads.push(lead);
          seen.add(key);
        }
        if (leads.length >= requestedQuantity) {
          break;
        }
      }
    };

    const fetchFromSource = async (source, sourceName, contextSource, { recordAttemptEvenIfEmpty = false } = {}) => {
      if (!source || typeof source.fetchEnrichedLeads !== 'function' || leads.length >= requestedQuantity) {
        return;
      }

      const variantsToTry = searchVariants.length > 0 ? searchVariants : [searchArgs.segment];
      const locationsToTry = locationVariants.length > 0 ? locationVariants : [{ key: 'base', plan }];
      const maxPasses = useVariantSearch
        ? Math.max(2, Math.ceil(requestedQuantity / MAX_RESULTS_PER_SOURCE_CALL))
        : 1;
      let sourceAttempted = false;
      let sourceHadResults = false;

      for (let passIndex = 0; passIndex < maxPasses && leads.length < requestedQuantity; passIndex += 1) {
        let passAddedLeads = false;

        for (const locationVariant of locationsToTry) {
          if (leads.length >= requestedQuantity) {
            break;
          }

          for (const variant of variantsToTry) {
            if (leads.length >= requestedQuantity) {
              break;
            }

            try {
              const requestPlan = locationVariant.plan || plan;
              const runtimeExcludeNames = buildRuntimeExcludeNames(plan.input.excludeNames, leads);

              const fetchedLeads = normalizeLeads(await source.fetchEnrichedLeads({
                ...searchArgs,
                plan: requestPlan,
                segment: variant,
                quantity: searchArgs.quantity,
                excludeNames: runtimeExcludeNames,
              }), {
                location: requestPlan.location,
                segment: plan.segment,
                source: contextSource,
              });

              sourceAttempted = true;

              const beforeCount = leads.length;
              const filterQuery = useVariantSearch ? variant : plan.segment.label;
              const filteredLeads = filterLeadsBySegment(fetchedLeads, filterQuery);

              if (filteredLeads.length > 0) {
                sourceHadResults = true;
                addLeads(filteredLeads, useVariantSearch || sourceName !== plan.sourcePlan.primary);
              }

              if (leads.length > beforeCount) {
                passAddedLeads = true;
              }
            } catch (error) {
              if (error?.code === 'MISSING_GOOGLE_MAPS_API_KEY' || error?.code === 'MISSING_GEMINI_API_KEY') {
                continue;
              }
            }
          }
        }

        if (!passAddedLeads) {
          break;
        }
      }

      if ((recordAttemptEvenIfEmpty ? sourceAttempted : sourceHadResults) && !actualSources.includes(sourceName)) {
        actualSources.push(sourceName);
      }
    };

    try {
      await fetchFromSource(resolvedPrimaryLeadSource, plan.sourcePlan.primary, plan.sourcePlan.primary, {
        recordAttemptEvenIfEmpty: true,
      });

      if (leads.length < requestedQuantity) {
        await fetchFromSource(fallbackLeadSource, 'gemini_fallback', 'gemini_fallback');
      }

      if (leads.length < requestedQuantity) {
        await fetchFromSource(auxiliaryLeadSource, 'open_data', 'open_data');
      }
    } catch (error) {
      if (error?.code !== 'MISSING_GOOGLE_MAPS_API_KEY' && error?.code !== 'MISSING_GEMINI_API_KEY') {
        throw error;
      }
    }

    const dedupeResult = companyDeduper && typeof companyDeduper.dedupeCompanies === 'function'
      ? companyDeduper.dedupeCompanies(leads, {
          location: plan.location,
          segment: plan.segment,
        })
      : {
          companies: leads,
          report: {
            total: leads.length,
            uniqueCount: leads.length,
            mergedCount: 0,
            possibleDuplicateCount: 0,
            groups: [],
          },
        };

    const dedupedLeads = dedupeResult.companies || [];
    const validatedLeads = sectorValidationService && typeof sectorValidationService.evaluateCompanySector === 'function'
      ? await Promise.all(dedupedLeads.map(async (lead) => {
          if (!hasSectorEvidence(lead)) {
            return lead;
          }

          let sectorSource = 'local';
          let recordForValidation = lead;
          const normalizedCnpj = typeof sectorValidationService.normalizeCnpj === 'function'
            ? sectorValidationService.normalizeCnpj(lead.cnpj || lead.numero_inscricao || lead.numeroInscricao || '')
            : '';

          if (normalizedCnpj && typeof sectorValidationService.lookupCnpj === 'function') {
            try {
              recordForValidation = {
                ...lead,
                ...await sectorValidationService.lookupCnpj(normalizedCnpj),
              };
              sectorSource = 'cnpj_api';
            } catch (error) {
              sectorSource = error?.code === 'MISSING_CNPJ_API_CONFIG' ? 'local' : 'cnpj_api_unavailable';
            }
          }

          const evaluation = sectorValidationService.evaluateCompanySector(
            recordForValidation,
            getLeadSectorQuery(recordForValidation, plan.segment.label),
          );

          sectorValidationSummary.checkedLeads += 1;
          if (evaluation.isConfirmed) {
            sectorValidationSummary.confirmedLeads += 1;
          } else if (evaluation.cnaeStatus === 'related') {
            sectorValidationSummary.relatedLeads += 1;
          } else if (evaluation.isRejected) {
            sectorValidationSummary.rejectedLeads += 1;
          }

          return {
            ...recordForValidation,
            sectorValidation: buildSectorValidationSummary(evaluation, sectorSource),
          };
        }))
      : dedupedLeads;

    const preciselyMatchedLeads = validatedLeads.filter((lead) => !lead?.sectorValidation?.isRejected);

    const rankedLeads = leadRanker && typeof leadRanker.rankLeads === 'function'
      ? leadRanker.rankLeads(preciselyMatchedLeads, plan.input.intent)
      : preciselyMatchedLeads;

    return {
      plan,
      leads: rankedLeads.slice(0, requestedQuantity),
      sourcesUsed: actualSources,
      dedupe: dedupeResult.report,
      sectorValidation: sectorValidationSummary,
    };
  };

  return {
    taxonomyVersion,
    planSearch,
    runSearch,
    resolveSearchContext: planSearch,
  };
};
