import { sendJson } from '../http.js';

export const handleSearchEnrichRoute = async (response, context, requestData = {}) => {
  const startedAt = Date.now();
  const body = requestData.body || {};
  const location = String(body.location || '').trim();
  const segment = String(body.segment || '').trim();
  const intent = String(body.intent || 'NONE').trim();
  const excludeNames = Array.isArray(body.excludeNames) ? body.excludeNames.map((value) => String(value)) : [];
  const quantity = Number.isFinite(Number(body.quantity)) ? Number(body.quantity) : 9;

  if (!location || !segment) {
    sendJson(response, 400, {
      error: 'INVALID_REQUEST',
      message: 'location and segment are required',
      requestId: context.requestId,
    }, {
      requestId: context.requestId,
    });
    return;
  }

  try {
    const orchestrator = context.services.searchOrchestrator;
    const result = orchestrator
      ? await orchestrator.runSearch({
        location,
        segment,
        excludeNames,
        quantity,
        intent,
      })
      : {
        plan: null,
        leads: await context.services.gemini.fetchEnrichedLeads(location, segment, excludeNames, quantity),
        sourcesUsed: ['google_maps'],
      };

    const durationMs = Date.now() - startedAt;
    const resultCount = Array.isArray(result.leads) ? result.leads.length : 0;
    const zeroResult = resultCount === 0;

    context.logger[zeroResult ? 'warn' : 'info']({
      event: zeroResult ? 'search_enrichment_zero_result' : 'search_enrichment_completed',
      requestId: context.requestId,
      location,
      segment,
      intent,
      quantityRequested: quantity,
      resultCount,
      zeroResult,
      durationMs,
      sourceCount: Array.isArray(result.sourcesUsed) ? result.sourcesUsed.length : 0,
      sourcesUsed: Array.isArray(result.sourcesUsed) ? result.sourcesUsed : [],
      dedupe: result.dedupe ? {
        total: result.dedupe.total,
        uniqueCount: result.dedupe.uniqueCount,
        mergedCount: result.dedupe.mergedCount,
        possibleDuplicateCount: result.dedupe.possibleDuplicateCount,
      } : null,
      sectorValidation: result.sectorValidation ? {
        enabled: Boolean(result.sectorValidation.enabled),
        checkedLeads: result.sectorValidation.checkedLeads || 0,
        confirmedLeads: result.sectorValidation.confirmedLeads || 0,
        relatedLeads: result.sectorValidation.relatedLeads || 0,
        rejectedLeads: result.sectorValidation.rejectedLeads || 0,
      } : null,
    });

    sendJson(response, 200, {
      leads: result.leads,
      search: result.plan,
      sourcesUsed: result.sourcesUsed,
      dedupe: result.dedupe,
      sectorValidation: result.sectorValidation,
    }, {
      requestId: context.requestId,
    });
  } catch (error) {
    if (error?.code === 'LOCATION_NOT_FOUND') {
      sendJson(response, 400, {
        error: 'LOCATION_NOT_FOUND',
        message: error?.message || 'Unable to resolve location',
        requestId: context.requestId,
      }, {
        requestId: context.requestId,
      });
      return;
    }

    context.logger.error({
      event: 'search_enrichment_failed',
      requestId: context.requestId,
      location,
      segment,
      intent,
      quantityRequested: quantity,
      durationMs: Date.now() - startedAt,
      errorCode: error?.code || 'UNKNOWN',
      errorMessage: error?.message || 'Failed to fetch enriched leads',
    });

    const isMissingKey = error?.code === 'MISSING_GEMINI_API_KEY';
    sendJson(response, isMissingKey ? 503 : 502, {
      error: isMissingKey ? 'GEMINI_API_KEY_NOT_CONFIGURED' : 'GEMINI_SEARCH_FAILED',
      message: error?.message || 'Failed to fetch enriched leads',
      requestId: context.requestId,
    }, {
      requestId: context.requestId,
    });
  }
};
