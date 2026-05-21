import { sendJson } from '../http.js';
import { recordFeedback } from '../services/feedbackStore.js';

export const handleSearchFeedbackRoute = async (response, context, requestData = {}) => {
  const startedAt = Date.now();
  const body = requestData.body || {};
  const leadId = String(body.leadId || '').trim();
  const feedbackType = String(body.feedbackType || '').trim(); // 'bom_lead', 'duplicado', 'fora_cidade', 'fora_segmento', 'sem_contato'
  const searchId = String(body.searchId || '').trim();
  const companyName = String(body.companyName || '').trim();
  const segment = String(body.segment || '').trim();
  const city = String(body.city || '').trim();

  if (!leadId || !feedbackType) {
    sendJson(response, 400, {
      error: 'INVALID_REQUEST',
      message: 'leadId and feedbackType are required',
      requestId: context.requestId,
    }, {
      requestId: context.requestId,
    });
    return;
  }

  // Persist feedback signal in the in-memory store
  recordFeedback({ leadId, feedbackType, companyName, segment, city });

  context.logger.info({
    event: 'lead_quality_signal_recorded',
    leadId,
    feedbackType,
    qualityDirection: feedbackType === 'bom_lead' ? 'positive' : 'negative',
    companyName,
    segment,
    city,
    searchId,
    durationMs: Date.now() - startedAt,
    requestId: context.requestId,
  });

  sendJson(response, 200, {
    success: true,
    message: 'Feedback registrado com sucesso',
  }, {
    requestId: context.requestId,
  });
};
