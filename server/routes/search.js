import { sendJson } from '../http.js';

export const handleSearchEnrichRoute = async (response, context, requestData = {}) => {
  const body = requestData.body || {};
  const location = String(body.location || '').trim();
  const segment = String(body.segment || '').trim();
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
      })
      : {
        plan: null,
        leads: await context.services.gemini.fetchEnrichedLeads(location, segment, excludeNames, quantity),
        sourcesUsed: ['google_maps'],
      };

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
