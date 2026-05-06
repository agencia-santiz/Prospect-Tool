import { sendError, sendJson } from '../http.js';

const handleAuthAction = async (response, context, requestData, action) => {
  const authService = context.services.auth;

  if (!authService) {
    sendError(response, 503, 'AUTH_SERVICE_UNAVAILABLE', 'Auth service is not configured', {
      requestId: context.requestId,
    });
    return;
  }

  try {
    let result;

    if (action === 'register') {
      result = await authService.register(requestData.body || {});
    } else if (action === 'login') {
      result = await authService.login(requestData.body || {});
    } else if (action === 'session') {
      result = await authService.getSession(requestData);
    } else if (action === 'logout') {
      result = await authService.logout(requestData);
    } else {
      sendError(response, 500, 'AUTH_ACTION_UNSUPPORTED', 'Unsupported auth action', {
        requestId: context.requestId,
      });
      return;
    }

    sendJson(response, action === 'register' ? 201 : 200, result, {
      requestId: context.requestId,
    });
  } catch (error) {
    sendError(response, error?.statusCode || 500, error?.code || 'AUTH_ERROR', error?.message || 'Authentication failed', {
      requestId: context.requestId,
    });
  }
};

export const handleAuthRegisterRoute = (response, context, requestData = {}) => handleAuthAction(response, context, requestData, 'register');
export const handleAuthLoginRoute = (response, context, requestData = {}) => handleAuthAction(response, context, requestData, 'login');
export const handleAuthSessionRoute = (response, context, requestData = {}) => handleAuthAction(response, context, requestData, 'session');
export const handleAuthLogoutRoute = (response, context, requestData = {}) => handleAuthAction(response, context, requestData, 'logout');
