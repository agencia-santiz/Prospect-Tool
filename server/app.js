import http from 'node:http';
import { BACKEND_VERSION, DEFAULT_BACKEND_HOST, DEFAULT_BACKEND_PORT } from './config.js';
import { randomUUID } from 'node:crypto';
import { createLogger } from './logger.js';
import { sendJson, sendMethodNotAllowed, sendNotFound } from './http.js';
import { getCoreModules } from './modules.js';
import { handleHealthRoute } from './routes/health.js';
import { handleVersionRoute } from './routes/version.js';
import { handleRootRoute } from './routes/root.js';
import { handleAuthLoginRoute, handleAuthLogoutRoute, handleAuthRegisterRoute, handleAuthSessionRoute } from './routes/auth.js';
import { handleWorkspaceCurrentRoute } from './routes/workspaces.js';
import { handleSearchEnrichRoute } from './routes/search.js';
import { handleSearchFeedbackRoute } from './routes/feedback.js';
import { handleExportCsvRoute } from './routes/export.js';
import { createGeminiLeadService } from './services/geminiService.js';
import { createAuthService } from './services/authService.js';
import { createLocationResolver } from './services/locationResolver.js';
import { createGoogleMapsService } from './services/googleMapsService.js';
import { createSearchOrchestrator } from './services/searchOrchestrator.js';
import { createSegmentResolver } from './services/segmentResolver.js';
import { createCnpjCnaeService } from './services/cnpjCnaeService.js';
import { createOpenDataService } from './services/openDataService.js';
import { createCompanyNormalizer } from './services/companyNormalizer.js';
import { createCompanyDeduper } from './services/companyDeduper.js';
import { createLeadRanker } from './services/leadRanker.js';
import { createCsvExporter } from './services/csvExporter.js';

const createContext = ({ env = process.env, logger = createLogger(), services: serviceOverrides = {} } = {}) => {
  const gemini = serviceOverrides.gemini || createGeminiLeadService(env);
  const auth = serviceOverrides.auth || createAuthService({ env });
  const googleMaps = serviceOverrides.googleMaps || createGoogleMapsService({ env });
  const locationResolver = serviceOverrides.locationResolver || createLocationResolver();
  const segmentResolver = serviceOverrides.segmentResolver || createSegmentResolver();
  const openData = serviceOverrides.openData || createOpenDataService();
  const companyNormalizer = serviceOverrides.companyNormalizer || createCompanyNormalizer();
  const companyDeduper = serviceOverrides.companyDeduper || createCompanyDeduper({ companyNormalizer });
  const leadRanker = serviceOverrides.leadRanker || createLeadRanker();
  const csvExporter = serviceOverrides.csvExporter || createCsvExporter();
  const cnpjCnae = serviceOverrides.cnpjCnae || createCnpjCnaeService({
    segmentResolver,
    apiBaseUrl: env.CNPJ_API_BASE_URL,
    apiToken: env.CNPJ_API_TOKEN,
    apiKey: env.CNPJ_API_KEY,
  });
  const searchOrchestrator = serviceOverrides.searchOrchestrator || createSearchOrchestrator({
    locationResolver,
    segmentResolver,
    geoSource: googleMaps,
    primaryLeadSource: googleMaps,
    fallbackLeadSource: gemini,
    auxiliaryLeadSource: openData,
    sectorValidationService: cnpjCnae,
    companyNormalizer,
    companyDeduper,
    leadRanker,
  });

  return {
    version: BACKEND_VERSION,
    modules: getCoreModules(),
    env,
    logger,
    services: {
      gemini,
      auth,
      googleMaps,
      locationResolver,
      segmentResolver,
      openData,
      companyNormalizer,
      companyDeduper,
      leadRanker,
      csvExporter,
      cnpjCnae,
      searchOrchestrator,
      ...serviceOverrides,
    },
  };
};

const coreRoutes = [
  { method: 'GET', path: '/', handler: handleRootRoute },
  { method: 'GET', path: '/health', handler: handleHealthRoute },
  { method: 'GET', path: '/version', handler: handleVersionRoute },
  { method: 'POST', path: '/auth/register', handler: handleAuthRegisterRoute },
  { method: 'POST', path: '/auth/login', handler: handleAuthLoginRoute },
  { method: 'GET', path: '/auth/session', handler: handleAuthSessionRoute },
  { method: 'POST', path: '/auth/logout', handler: handleAuthLogoutRoute },
  { method: 'GET', path: '/workspaces/current', handler: handleWorkspaceCurrentRoute },
  { method: 'POST', path: '/search/enrich', handler: handleSearchEnrichRoute },
  { method: 'POST', path: '/search/feedback', handler: handleSearchFeedbackRoute },
  { method: 'POST', path: '/export/csv', handler: handleExportCsvRoute },
];

const readJsonBody = (request) => new Promise((resolve, reject) => {
  const chunks = [];

  request.on('data', (chunk) => {
    chunks.push(chunk);
  });

  request.on('end', () => {
    const rawBody = Buffer.concat(chunks).toString('utf8');

    if (!rawBody) {
      resolve({});
      return;
    }

    try {
      resolve(JSON.parse(rawBody));
    } catch (error) {
      reject(error);
    }
  });

  request.on('error', reject);
});

export const createBackendApp = ({ env = process.env, logger = createLogger(), services = {} } = {}) => {
  const context = createContext({ env, logger, services });

  return http.createServer(async (request, response) => {
    const requestId = request.headers['x-request-id'] || randomUUID();
    const startedAt = Date.now();
    const requestMethod = request.method || 'GET';
    const requestUrl = new URL(request.url || '/', 'http://localhost');
    const baseContext = {
      ...context,
      requestId,
      path: requestUrl.pathname,
      method: requestMethod,
    };

    context.logger.info({
      event: 'request_started',
      requestId,
      method: requestMethod,
      path: requestUrl.pathname,
    });

    try {
      if (requestMethod === 'OPTIONS') {
        response.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-Id',
          'Access-Control-Max-Age': '86400',
        });
        response.end();
        context.logger.info({
          event: 'request_completed',
          requestId,
          method: requestMethod,
          path: requestUrl.pathname,
          statusCode: 204,
          durationMs: Date.now() - startedAt,
        });
        return;
      }

      const route = coreRoutes.find((item) => item.path === requestUrl.pathname);

      if (!route) {
        sendNotFound(response, requestUrl.pathname, requestId);
        context.logger.warn({
          event: 'request_not_found',
          requestId,
          method: requestMethod,
          path: requestUrl.pathname,
          statusCode: 404,
        });
        context.logger.info({
          event: 'request_completed',
          requestId,
          method: requestMethod,
          path: requestUrl.pathname,
          statusCode: 404,
          durationMs: Date.now() - startedAt,
        });
        return;
      }

      if (route.method !== requestMethod) {
        sendMethodNotAllowed(response, [route.method], requestId);
        context.logger.warn({
          event: 'request_method_not_allowed',
          requestId,
          method: requestMethod,
          path: requestUrl.pathname,
          allowedMethods: [route.method],
          statusCode: 405,
        });
        context.logger.info({
          event: 'request_completed',
          requestId,
          method: requestMethod,
          path: requestUrl.pathname,
          statusCode: 405,
          durationMs: Date.now() - startedAt,
        });
        return;
      }

      const requestData = {
        headers: request.headers,
        ...(route.method === 'POST' ? { body: await readJsonBody(request) } : {}),
      };
      await route.handler(response, baseContext, requestData);
      context.logger.info({
        event: 'request_completed',
        requestId,
        method: requestMethod,
        path: requestUrl.pathname,
        statusCode: response.statusCode,
        durationMs: Date.now() - startedAt,
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        sendJson(response, 400, {
          error: 'INVALID_JSON',
          message: 'Request body must be valid JSON',
          requestId,
        }, {
          requestId,
        });
        context.logger.warn({
          event: 'request_invalid_json',
          requestId,
          method: requestMethod,
          path: requestUrl.pathname,
          statusCode: 400,
        });
        context.logger.info({
          event: 'request_completed',
          requestId,
          method: requestMethod,
          path: requestUrl.pathname,
          statusCode: 400,
          durationMs: Date.now() - startedAt,
        });
        return;
      }

      sendJson(response, 500, {
        error: 'INTERNAL_SERVER_ERROR',
        message: error?.message || 'Unexpected backend error',
        requestId,
      }, {
        requestId,
      });
      context.logger.error({
        event: 'request_failed',
        requestId,
        method: requestMethod,
        path: requestUrl.pathname,
        statusCode: 500,
        durationMs: Date.now() - startedAt,
        errorMessage: error?.message || 'Unexpected backend error',
      });
      context.logger.info({
        event: 'request_completed',
        requestId,
        method: requestMethod,
        path: requestUrl.pathname,
        statusCode: 500,
        durationMs: Date.now() - startedAt,
      });
    }
  });
};

export const startBackend = ({ host = DEFAULT_BACKEND_HOST, port = DEFAULT_BACKEND_PORT, env = process.env, logger = createLogger(), services = {} } = {}) => {
  const app = createBackendApp({ env, logger, services });

  return new Promise((resolve, reject) => {
    app.once('error', reject);
    app.listen(port, host, () => {
      app.off('error', reject);
      resolve(app);
    });
  });
};
