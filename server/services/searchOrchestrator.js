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
    const googleLocation = geoSource && typeof geoSource.geocodeLocation === 'function'
      ? await geoSource.geocodeLocation(trimmedLocation, {
          regionCode: resolvedLocation.stateCode || 'BR',
          languageCode: 'pt-BR',
        })
      : null;
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
    const searchArgs = {
      location: plan.location.displayLabel,
      segment: plan.segment.label,
      excludeNames: plan.input.excludeNames,
      quantity: plan.input.quantity,
      plan,
    };

    const actualSources = [];
    
    // Intelligence Layer: Query Expansion
    // If the segment is broad or unknown, use Gemini to refine/expand the search string
    if (plan.segment.confidence === 'broad' && fallbackLeadSource && typeof fallbackLeadSource.refineSearchQuery === 'function') {
      try {
        const refined = await fallbackLeadSource.refineSearchQuery(plan.input.segment);
        if (refined && refined !== plan.input.segment) {
          searchArgs.segment = refined;
        }
      } catch (e) {
        // Silently continue if expansion fails
      }
    }

    let leads = [];
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

    try {
      leads = normalizeLeads(await resolvedPrimaryLeadSource.fetchEnrichedLeads(searchArgs), {
        location: plan.location,
        segment: plan.segment,
        source: plan.sourcePlan.primary,
      });
      actualSources.push(plan.sourcePlan.primary);
    } catch (error) {
      if (error?.code !== 'MISSING_GOOGLE_MAPS_API_KEY' && error?.code !== 'MISSING_GEMINI_API_KEY') {
        throw error;
      }
    }

    if (leads.length < plan.input.quantity && fallbackLeadSource && typeof fallbackLeadSource.fetchEnrichedLeads === 'function') {
      try {
        const fallbackLeads = normalizeLeads(await fallbackLeadSource.fetchEnrichedLeads(searchArgs), {
          location: plan.location,
          segment: plan.segment,
          source: 'gemini_fallback',
        });
        const seen = new Set(leads.map((lead) => `${String(lead.nome_fantasia || '').toLowerCase()}|${String(lead.endereco || lead.cidade || '').toLowerCase()}`));
        for (const lead of fallbackLeads) {
          const key = `${String(lead.nome_fantasia || '').toLowerCase()}|${String(lead.endereco || lead.cidade || '').toLowerCase()}`;
          if (!seen.has(key)) {
            leads.push(lead);
            seen.add(key);
          }
          if (leads.length >= plan.input.quantity) {
            break;
          }
        }
        if (fallbackLeads.length > 0) {
          actualSources.push('gemini_fallback');
        }
      } catch (error) {
        if (actualSources.length === 0) {
          throw error;
        }
      }
    }

    if (leads.length < plan.input.quantity && auxiliaryLeadSource && typeof auxiliaryLeadSource.fetchEnrichedLeads === 'function') {
      try {
        const auxiliaryLeads = normalizeLeads(await auxiliaryLeadSource.fetchEnrichedLeads(searchArgs), {
          location: plan.location,
          segment: plan.segment,
          source: 'open_data',
        });
        const seen = new Set(leads.map((lead) => `${String(lead.nome_fantasia || '').toLowerCase()}|${String(lead.endereco || lead.cidade || '').toLowerCase()}`));
        for (const lead of auxiliaryLeads) {
          const key = `${String(lead.nome_fantasia || '').toLowerCase()}|${String(lead.endereco || lead.cidade || '').toLowerCase()}`;
          if (!seen.has(key)) {
            leads.push(lead);
            seen.add(key);
          }
          if (leads.length >= plan.input.quantity) {
            break;
          }
        }
        if (auxiliaryLeads.length > 0) {
          actualSources.push('open_data');
        }
      } catch (error) {
        if (actualSources.length === 0) {
          throw error;
        }
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

    const rankedLeads = leadRanker && typeof leadRanker.rankLeads === 'function'
      ? leadRanker.rankLeads(validatedLeads)
      : validatedLeads;

    return {
      plan,
      leads: rankedLeads,
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
