import { BACKEND_NAME } from '../config.js';
import { sendJson } from '../http.js';

export const handleVersionRoute = (response, context) => {
  sendJson(response, 200, {
    service: BACKEND_NAME,
    version: context.version,
    modules: context.modules.map((module) => ({
      name: module.name,
      status: module.status,
      routeCount: module.routes.length,
    })),
  }, {
    requestId: context.requestId,
  });
};
