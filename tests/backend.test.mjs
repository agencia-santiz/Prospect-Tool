import assert from 'node:assert/strict';
import { once } from 'node:events';
import { startBackend } from '../server/app.js';
import { createLogger } from '../server/logger.js';

const logLines = [];
const logger = createLogger({
  sink: (line) => {
    logLines.push(line);
  },
});

const server = await startBackend({
  host: '127.0.0.1',
  port: 0,
  env: {},
  logger,
  services: {
    searchOrchestrator: {
      runSearch: async ({ location, segment, quantity, intent }) => {
        if (location === 'Marilia - SP') {
          const error = new Error('GEMINI_API_KEY is not configured on the backend');
          error.code = 'MISSING_GEMINI_API_KEY';
          throw error;
        }

        if (location === 'Cidade Vazia - SP') {
          return {
            plan: {
              location: { displayLabel: location },
              segment: { label: segment },
              input: { quantity, intent },
            },
            leads: [],
            sourcesUsed: [],
            dedupe: {
              total: 0,
              uniqueCount: 0,
              mergedCount: 0,
              possibleDuplicateCount: 0,
              groups: [],
            },
            sectorValidation: {
              enabled: true,
              checkedLeads: 0,
              confirmedLeads: 0,
              relatedLeads: 0,
              rejectedLeads: 0,
            },
          };
        }

        return {
          plan: {
            location: { displayLabel: location },
            segment: { label: segment },
            input: { quantity, intent },
          },
          leads: [
            {
              id: 'lead-1',
              nome_fantasia: 'ACME B2B',
              cidade: 'Campinas',
              telefone: '(11) 99999-0000',
            },
          ],
          sourcesUsed: ['google_maps'],
          dedupe: {
            total: 1,
            uniqueCount: 1,
            mergedCount: 0,
            possibleDuplicateCount: 0,
            groups: [],
          },
          sectorValidation: {
            enabled: true,
            checkedLeads: 1,
            confirmedLeads: 1,
            relatedLeads: 0,
            rejectedLeads: 0,
          },
        };
      },
    },
  },
});
const address = server.address();
assert.ok(address && typeof address === 'object', 'the backend should expose a bound address');

const baseUrl = `http://127.0.0.1:${address.port}`;

try {
  const healthResponse = await fetch(`${baseUrl}/health`);
  assert.equal(healthResponse.status, 200);
  assert.ok(healthResponse.headers.get('x-request-id'));
  const healthJson = await healthResponse.json();
  assert.equal(healthJson.status, 'ok');
  assert.equal(healthJson.service, 'bloom-leads-api');
  assert.equal(healthJson.version, '2026-05-05');
  assert.equal(typeof healthJson.uptimeMs, 'number');

  const versionResponse = await fetch(`${baseUrl}/version`);
  assert.equal(versionResponse.status, 200);
  const versionJson = await versionResponse.json();
  assert.equal(versionJson.service, 'bloom-leads-api');
  assert.equal(versionJson.version, '2026-05-05');
  assert.ok(Array.isArray(versionJson.modules));
  assert.ok(versionJson.modules.some((module) => module.name === 'auth' && module.status === 'active'));
  assert.ok(versionJson.modules.some((module) => module.name === 'workspace' && module.status === 'active'));
  assert.ok(versionJson.modules.some((module) => module.name === 'search' && module.status === 'active'));

  const rootResponse = await fetch(`${baseUrl}/`);
  assert.equal(rootResponse.status, 200);
  const rootJson = await rootResponse.json();
  assert.equal(rootJson.service, 'bloom-leads-api');
  assert.equal(rootJson.status, 'ok');
  assert.ok(rootJson.modules.some((module) => module.name === 'health'));
  assert.ok(rootJson.modules.some((module) => module.name === 'auth' && module.status === 'active'));
  assert.ok(rootJson.modules.some((module) => module.name === 'workspace' && module.status === 'active'));

  const missingResponse = await fetch(`${baseUrl}/missing`);
  assert.equal(missingResponse.status, 404);
  assert.ok(missingResponse.headers.get('x-request-id'));
  const missingJson = await missingResponse.json();
  assert.equal(missingJson.error, 'NOT_FOUND');
  assert.equal(missingJson.path, '/missing');
  assert.equal(typeof missingJson.requestId, 'string');

  const successSearchResponse = await fetch(`${baseUrl}/search/enrich`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: 'Campinas - SP',
      segment: 'Software',
      excludeNames: [],
      quantity: 1,
      intent: 'SOFTWARE',
    }),
  });
  assert.equal(successSearchResponse.status, 200);
  const successSearchJson = await successSearchResponse.json();
  assert.equal(Array.isArray(successSearchJson.leads), true);
  assert.equal(successSearchJson.leads.length, 1);
  assert.equal(successSearchJson.sourcesUsed[0], 'google_maps');

  const zeroSearchResponse = await fetch(`${baseUrl}/search/enrich`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: 'Cidade Vazia - SP',
      segment: 'Papelaria',
      excludeNames: [],
      quantity: 2,
    }),
  });
  assert.equal(zeroSearchResponse.status, 200);
  const zeroSearchJson = await zeroSearchResponse.json();
  assert.equal(Array.isArray(zeroSearchJson.leads), true);
  assert.equal(zeroSearchJson.leads.length, 0);

  const enrichResponse = await fetch(`${baseUrl}/search/enrich`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: 'Marilia - SP',
      segment: 'Papelaria',
      excludeNames: [],
      quantity: 2,
    }),
  });
  assert.equal(enrichResponse.status, 503);
  assert.ok(enrichResponse.headers.get('x-request-id'));
  const enrichJson = await enrichResponse.json();
  assert.equal(enrichJson.error, 'GEMINI_API_KEY_NOT_CONFIGURED');
  assert.equal(typeof enrichJson.requestId, 'string');

  const invalidJsonResponse = await fetch(`${baseUrl}/search/enrich`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '{invalid-json',
  });
  assert.equal(invalidJsonResponse.status, 400);
  assert.ok(invalidJsonResponse.headers.get('x-request-id'));
  const invalidJson = await invalidJsonResponse.json();
  assert.equal(invalidJson.error, 'INVALID_JSON');
  assert.equal(typeof invalidJson.requestId, 'string');

  const feedbackResponse = await fetch(`${baseUrl}/search/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      leadId: 'lead-1',
      feedbackType: 'bom_lead',
      companyName: 'ACME B2B',
      segment: 'Software',
      city: 'Campinas',
      searchId: 'search-1',
    }),
  });
  assert.equal(feedbackResponse.status, 200);
  const feedbackJson = await feedbackResponse.json();
  assert.equal(feedbackJson.success, true);

  const exportResponse = await fetch(`${baseUrl}/export/csv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      leads: [
        {
          id: 'lead-1',
          nome_fantasia: 'ACME B2B',
          razao_social: 'ACME Brasil Ltda',
          cnpj: '12.345.678/0001-90',
          atividade_principal: 'Software',
          telefone: '(11) 99999-0000',
          whatsappStatus: 'CONFIRMED',
          website: 'https://acme.example',
          endereco: 'Rua Principal, 123',
          cidade: 'Sao Paulo',
          uf: 'SP',
          cep: '01000-000',
          pais: 'Brasil',
          score: 87,
          rating: 'A',
          businessStatus: 'OPEN',
          source: 'OPEN_DATA',
        },
      ],
    }),
  });
  assert.equal(exportResponse.status, 200);
  assert.equal(exportResponse.headers.get('content-type'), 'text/csv; charset=utf-8');
  assert.equal(exportResponse.headers.get('content-disposition'), 'attachment; filename="leads_export.csv"');
  const exportText = (await exportResponse.text()).replace(/^\uFEFF/, '');
  assert.ok(exportText.startsWith('ID,Nome Fantasia'));
  assert.ok(exportText.includes('ACME B2B'));
  assert.ok(exportText.includes('ACME Brasil Ltda'));
  assert.ok(exportText.includes('12.345.678/0001-90'));
  assert.ok(exportText.includes('Rua Principal, 123'));

  const emptyExportResponse = await fetch(`${baseUrl}/export/csv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ leads: [] }),
  });
  assert.equal(emptyExportResponse.status, 400);
  assert.ok(emptyExportResponse.headers.get('x-request-id'));
  const emptyExportJson = await emptyExportResponse.json();
  assert.equal(emptyExportJson.error, 'INVALID_REQUEST');
  assert.equal(typeof emptyExportJson.requestId, 'string');

  const parsedLogs = logLines.map((line) => JSON.parse(line));
  assert.ok(parsedLogs.some((entry) => entry.event === 'request_started' && entry.level === 'info'));
  assert.ok(parsedLogs.some((entry) => entry.event === 'request_completed' && entry.statusCode === 200));
  assert.ok(parsedLogs.some((entry) => entry.event === 'request_not_found' && entry.level === 'warn'));
  assert.ok(parsedLogs.some((entry) => entry.event === 'request_invalid_json' && entry.statusCode === 400));
  assert.ok(parsedLogs.some((entry) => entry.event === 'search_enrichment_completed' && entry.resultCount === 1 && entry.durationMs >= 0));
  assert.ok(parsedLogs.some((entry) => entry.event === 'search_enrichment_zero_result' && entry.zeroResult === true));
  assert.ok(parsedLogs.some((entry) => entry.event === 'search_enrichment_failed' && entry.errorCode === 'MISSING_GEMINI_API_KEY'));
  assert.ok(parsedLogs.some((entry) => entry.event === 'lead_quality_signal_recorded' && entry.qualityDirection === 'positive'));
  assert.ok(parsedLogs.some((entry) => entry.event === 'csv_export_generated' && entry.count === 1 && entry.durationMs >= 0));
  assert.ok(parsedLogs.some((entry) => entry.event === 'csv_export_rejected_empty_payload' && entry.rowCount === 0));
} finally {
  server.close();
  await once(server, 'close');
}
