export const sendJson = (response, statusCode, payload, options = {}) => {
  const { requestId, headers = {} } = options;
  const body = JSON.stringify(payload);

  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-Id',
    ...(requestId ? { 'X-Request-Id': requestId } : {}),
    ...headers,
  });

  response.end(body);
};

export const sendError = (response, statusCode, error, message, options = {}) => {
  const { requestId, details, headers = {}, extra = {} } = options;
  const payload = {
    error,
    message,
    ...(requestId ? { requestId } : {}),
    ...(details ? { details } : {}),
    ...extra,
  };

  sendJson(response, statusCode, payload, {
    requestId,
    headers,
  });
};

export const sendMethodNotAllowed = (response, allowedMethods, requestId) => {
  sendError(response, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed', {
    requestId,
    details: {
      allowedMethods,
    },
    extra: {
      allowedMethods,
    },
    headers: {
      Allow: allowedMethods.join(', '),
    },
  });
};

export const sendNotFound = (response, path, requestId) => {
  sendError(response, 404, 'NOT_FOUND', 'Route not found', {
    requestId,
    details: {
      path,
    },
    extra: {
      path,
    },
  });
};
