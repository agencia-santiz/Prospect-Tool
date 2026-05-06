import { BACKEND_NAME } from '../config.js';
import { sendJson } from '../http.js';

export const handleRootRoute = (response, context) => {
  sendJson(response, 200, {
    service: BACKEND_NAME,
    version: context.version,
    status: 'ok',
    modules: context.modules,
  }, {
    requestId: context.requestId,
  });
};
