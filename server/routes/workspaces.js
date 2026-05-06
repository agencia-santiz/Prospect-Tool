import { sendError, sendJson } from '../http.js';

export const handleWorkspaceCurrentRoute = async (response, context, requestData = {}) => {
  const authService = context.services.auth;

  if (!authService) {
    sendError(response, 503, 'AUTH_SERVICE_UNAVAILABLE', 'Auth service is not configured', {
      requestId: context.requestId,
    });
    return;
  }

  try {
    const workspaceContext = await authService.getWorkspaceContext(requestData);

    sendJson(response, 200, workspaceContext, {
      requestId: context.requestId,
    });
  } catch (error) {
    sendError(response, error?.statusCode || 500, error?.code || 'WORKSPACE_ERROR', error?.message || 'Workspace lookup failed', {
      requestId: context.requestId,
    });
  }
};
