import { BACKEND_NAME } from '../config.js';
import { sendJson } from '../http.js';

export const handleHealthRoute = (response, context) => {
  sendJson(response, 200, {
    status: 'ok',
    service: BACKEND_NAME,
    version: context.version,
    uptimeMs: Math.round(process.uptime() * 1000),
  }, {
    requestId: context.requestId,
  });
};
