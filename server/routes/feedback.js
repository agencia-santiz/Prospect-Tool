import { sendJson } from '../http.js';

export const handleSearchFeedbackRoute = async (response, context, requestData = {}) => {
  const body = requestData.body || {};
  const leadId = String(body.leadId || '').trim();
  const feedbackType = String(body.feedbackType || '').trim(); // 'bom_lead', 'duplicado', 'fora_cidade', 'fora_segmento', 'sem_contato'
  const searchId = String(body.searchId || '').trim();

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

  // TODO: Em uma fase futura, persistir este feedback no Postgres.
  // Por enquanto, logamos de forma estruturada para "alimentar melhoria futura".
  context.logger.info({
    event: 'lead_feedback_received',
    leadId,
    feedbackType,
    searchId,
    requestId: context.requestId,
  });

  sendJson(response, 200, {
    success: true,
    message: 'Feedback registrado com sucesso',
  }, {
    requestId: context.requestId,
  });
};
