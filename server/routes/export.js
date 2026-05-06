import { sendJson } from '../http.js';

export const handleExportCsvRoute = async (response, context, requestData = {}) => {
  const body = requestData.body || {};
  const leads = Array.isArray(body.leads) ? body.leads : [];

  if (leads.length === 0) {
    sendJson(response, 400, {
      error: 'INVALID_REQUEST',
      message: 'leads array is required and cannot be empty',
      requestId: context.requestId,
    }, {
      requestId: context.requestId,
    });
    return;
  }

  try {
    const csvContent = context.services.csvExporter.exportCompanies(leads);

    context.logger.info({
      event: 'csv_export_generated',
      count: leads.length,
      requestId: context.requestId,
    });

    response.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="leads_export.csv"',
      'X-Request-ID': context.requestId,
    });
    // Add BOM for Excel UTF-8 support
    response.write('\uFEFF');
    response.end(csvContent);
  } catch (error) {
    context.logger.error({
      event: 'csv_export_failed',
      error: error.message,
      requestId: context.requestId,
    });

    sendJson(response, 500, {
      error: 'EXPORT_FAILED',
      message: 'Failed to generate CSV export',
      requestId: context.requestId,
    }, {
      requestId: context.requestId,
    });
  }
};
