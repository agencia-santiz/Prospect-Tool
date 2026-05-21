import {
  addLeadToSavedList,
  createSavedList,
  deleteSavedList,
  listDealsByWorkspace,
  listLeadsByWorkspace,
  listPipelineOverview,
  listSavedLists,
  upsertCompany,
  upsertDeal,
  upsertLead,
  upsertPipeline,
  upsertPipelineStage,
} from '@dataconnect/generated';

const DEFAULT_PRIORITY = 'MEDIUM';

const defaultOperations = {
  listSavedLists,
  listPipelineOverview,
  listLeadsByWorkspace,
  listDealsByWorkspace,
  createSavedList,
  addLeadToSavedList,
  deleteSavedList,
  upsertCompany,
  upsertLead,
  upsertPipeline,
  upsertPipelineStage,
  upsertDeal,
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const toStringValue = (value, fallback = '') => (typeof value === 'string' ? value : fallback);

const normalizeDealPriority = (priority) => {
  const value = toStringValue(priority, DEFAULT_PRIORITY).toUpperCase();
  return value === 'LOW' || value === 'MEDIUM' || value === 'HIGH' ? value : DEFAULT_PRIORITY;
};

const mapRemoteLeadToCompany = (lead) => {
  const company = lead?.company || {};

  return {
    id: String(company.id || lead.id),
    cnpj: '',
    razao_social: String(company.legalName || company.tradeName || ''),
    nome_fantasia: String(company.tradeName || company.legalName || ''),
    cidade: String(company.city || ''),
    uf: String(company.region || ''),
    pais: 'BR',
    atividade_principal: String(company.segment || ''),
    telefone: company.phone || undefined,
    email: undefined,
    website: company.website || undefined,
    websiteDomain: undefined,
    rating: undefined,
    userRatingsTotal: undefined,
    whatsappStatus: 'NONE',
    status: String(lead.status || 'NEW').toUpperCase(),
    score: Number(lead.score || company.score || 0),
    rankingReasons: [],
    relevance_summary: '',
    provenance: {},
    partners: [],
    source: 'OPEN_DATA',
    googleMapsUri: undefined,
    socials: undefined,
  };
};

const mapRemoteSavedListToLocal = (savedList) => ({
  id: String(savedList.id),
  name: String(savedList.name || ''),
  createdAt: String(savedList.createdAt || new Date().toISOString()),
  leads: normalizeArray(savedList.savedListItems_on_list).map((item) => mapRemoteLeadToCompany(item.lead)),
  params: {
    city: String(savedList.search?.city || ''),
    segment: String(savedList.search?.segmentRaw || ''),
  },
  groupName: undefined,
});

const mapRemotePipelineToLocal = (pipeline) => ({
  id: String(pipeline.id),
  name: String(pipeline.name || ''),
  isDefault: pipeline.isDefault === true,
  stages: normalizeArray(pipeline.stages)
    .slice()
    .sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0))
    .map((stage) => ({
      id: String(stage.id),
      name: String(stage.name || ''),
      color: String(stage.color || '#999999'),
    })),
});

const mapRemoteDealToLocal = (deal) => {
  const payload = typeof deal.payload === 'object' && deal.payload ? deal.payload : {};
  const company = deal.company || {};
  const pipeline = deal.pipeline || {};
  const stage = deal.stage || {};

  return {
    id: String(deal.id),
    companyId: company.id ? String(company.id) : undefined,
    ownerUserId: '',
    companyName: String(company.tradeName || company.legalName || deal.title || ''),
    value: Number(deal.value || 0),
    pipelineId: String(pipeline.id || ''),
    stageId: String(stage.id || ''),
    priority: normalizeDealPriority(deal.priority),
    createdAt: String(deal.createdAt || new Date().toISOString()),
    summary: toStringValue(payload.summary, ''),
    nextStep: toStringValue(deal.nextStep || payload.nextStep, ''),
    contactInfo: payload.contactInfo || undefined,
    customFields: normalizeArray(payload.customFields),
    activities: normalizeArray(payload.activities),
    people: normalizeArray(payload.people),
    tasks: normalizeArray(payload.tasks),
  };
};

const mapLocalSavedListToVariables = (workspaceId, savedList) => ({
  id: savedList.id,
  workspaceId,
  name: savedList.name,
});

const mapLocalCompanyToVariables = (workspaceId, company) => ({
  id: company.id,
  workspaceId,
  legalName: company.razao_social || company.nome_fantasia || company.cnpj || 'Contato',
  tradeName: company.nome_fantasia || company.razao_social || company.cnpj || 'Contato',
  segment: company.atividade_principal || '',
  city: company.cidade || '',
  region: company.uf || '',
  country: company.pais || 'BR',
  phone: company.telefone || null,
  website: company.website || null,
});

const mapLocalLeadToVariables = (workspaceId, company) => ({
  id: company.id,
  workspaceId,
  companyId: company.id,
  status: toStringValue(company.status, 'NEW'),
  rank: 0,
  score: Number(company.score || 0),
  source: toStringValue(company.source, 'OPEN_DATA'),
});

const mapLocalPipelineToVariables = (workspaceId, pipeline) => ({
  id: pipeline.id,
  workspaceId,
  name: pipeline.name,
  isDefault: pipeline.isDefault === true,
});

const mapLocalPipelineStageToVariables = (pipelineId, stage, index) => ({
  id: stage.id,
  pipelineId,
  name: stage.name,
  sortOrder: index,
  color: stage.color || null,
});

const mapLocalDealToVariables = (workspaceId, deal) => ({
  id: deal.id,
  workspaceId,
  pipelineId: deal.pipelineId,
  stageId: deal.stageId,
  title: deal.companyName,
  companyId: deal.companyId || null,
  value: Number.isFinite(deal.value) ? deal.value : 0,
  priority: normalizeDealPriority(deal.priority),
  nextStep: deal.nextStep || null,
  notes: deal.summary || null,
  payload: {
    summary: deal.summary || '',
    nextStep: deal.nextStep || '',
    contactInfo: deal.contactInfo || null,
    customFields: deal.customFields || [],
    activities: deal.activities || [],
    people: deal.people || [],
    tasks: deal.tasks || [],
  },
});

const safeCall = async (operation, variables) => {
  const response = await operation(variables);
  return response?.data || {};
};

const buildRemoteSnapshot = async (dataConnect, workspaceId, operations = defaultOperations) => {
  const [savedListsResult, pipelinesResult, leadsResult, dealsResult] = await Promise.all([
    safeCall((vars) => operations.listSavedLists(dataConnect, vars), { workspaceId }),
    safeCall((vars) => operations.listPipelineOverview(dataConnect, vars), { workspaceId }),
    safeCall((vars) => operations.listLeadsByWorkspace(dataConnect, vars), { workspaceId }),
    safeCall((vars) => operations.listDealsByWorkspace(dataConnect, vars), { workspaceId }),
  ]);

  return {
    savedLists: normalizeArray(savedListsResult.savedLists).map(mapRemoteSavedListToLocal),
    contacts: normalizeArray(leadsResult.leads).map(mapRemoteLeadToCompany),
    pipelines: normalizeArray(pipelinesResult.pipelines).map(mapRemotePipelineToLocal),
    deals: normalizeArray(dealsResult.deals).map(mapRemoteDealToLocal),
  };
};

const flushOutboxRecords = async (dataConnect, workspaceId, records = [], operations = defaultOperations) => {
  const pendingRecords = normalizeArray(records);
  const remainingRecords = [];
  const appliedRecords = [];

  for (const record of pendingRecords) {
    try {
      if (record.entity === 'savedList') {
        if (record.operation === 'delete') {
          await safeCall((vars) => operations.deleteSavedList(dataConnect, vars), { id: record.entityId });
          appliedRecords.push(record);
          continue;
        }

        const savedList = record.payload || {};
        const listId = String(savedList.id || record.entityId);

        if (record.operation === 'update') {
          await safeCall((vars) => operations.deleteSavedList(dataConnect, vars), { id: listId });
        }

        await safeCall((vars) => operations.createSavedList(dataConnect, vars), mapLocalSavedListToVariables(workspaceId, {
          id: listId,
          name: String(savedList.name || ''),
        }));

        for (const lead of normalizeArray(savedList.leads)) {
          await safeCall((vars) => operations.upsertCompany(dataConnect, vars), mapLocalCompanyToVariables(workspaceId, lead));
          await safeCall((vars) => operations.upsertLead(dataConnect, vars), mapLocalLeadToVariables(workspaceId, lead));
          await safeCall((vars) => operations.addLeadToSavedList(dataConnect, vars), {
            listId,
            leadId: lead.id,
          });
        }

        appliedRecords.push(record);
        continue;
      }

      if (record.entity === 'contact') {
        if (record.operation === 'delete') {
          remainingRecords.push(record);
          continue;
        }

        const company = record.payload || {};
        await safeCall((vars) => operations.upsertCompany(dataConnect, vars), mapLocalCompanyToVariables(workspaceId, company));
        await safeCall((vars) => operations.upsertLead(dataConnect, vars), mapLocalLeadToVariables(workspaceId, company));
        appliedRecords.push(record);
        continue;
      }

      if (record.entity === 'pipeline') {
        if (record.operation === 'delete') {
          remainingRecords.push(record);
          continue;
        }

        const pipeline = record.payload || {};
        await safeCall((vars) => operations.upsertPipeline(dataConnect, vars), mapLocalPipelineToVariables(workspaceId, pipeline));

        for (const [index, stage] of normalizeArray(pipeline.stages).entries()) {
          await safeCall((vars) => operations.upsertPipelineStage(dataConnect, vars), mapLocalPipelineStageToVariables(pipeline.id, stage, index));
        }

        appliedRecords.push(record);
        continue;
      }

      if (record.entity === 'deal') {
        if (record.operation === 'delete') {
          await safeCall((vars) => operations.deleteDeal(dataConnect, vars), { id: record.entityId });
          appliedRecords.push(record);
          continue;
        }

        const deal = record.payload || {};
        await safeCall((vars) => operations.upsertDeal(dataConnect, vars), mapLocalDealToVariables(workspaceId, deal));
        appliedRecords.push(record);
        continue;
      }

      remainingRecords.push(record);
    } catch {
      remainingRecords.push(record);
      break;
    }
  }

  const processedCount = appliedRecords.length + remainingRecords.length;
  return {
    appliedRecords,
    remainingRecords: [...remainingRecords, ...pendingRecords.slice(processedCount)],
  };
};

export const createWorkspaceSyncService = (operations = {}) => {
  const resolvedOperations = { ...defaultOperations, ...operations };

  return {
    createWorkspaceRemoteSnapshot: (dataConnect, workspaceId) => buildRemoteSnapshot(dataConnect, workspaceId, resolvedOperations),
    flushWorkspaceOutboxRecords: (dataConnect, workspaceId, records = []) => flushOutboxRecords(dataConnect, workspaceId, records, resolvedOperations),
  };
};

const defaultWorkspaceSyncService = createWorkspaceSyncService();

export const createWorkspaceRemoteSnapshot = defaultWorkspaceSyncService.createWorkspaceRemoteSnapshot;
export const flushWorkspaceOutboxRecords = defaultWorkspaceSyncService.flushWorkspaceOutboxRecords;
