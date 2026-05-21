import assert from 'node:assert/strict';
import { createWorkspaceSyncService } from '../src/services/workspaceSyncService.js';

const callLog = [];

const service = createWorkspaceSyncService({
  listSavedLists: async (_dc, vars) => {
    callLog.push(['listSavedLists', vars]);
    return {
      data: {
        savedLists: [
          {
            id: 'list-1',
            name: 'Lista 1',
            createdAt: '2026-05-21T00:00:00.000Z',
            savedListItems_on_list: [
              {
                lead: {
                  id: 'lead-1',
                  status: 'NEW',
                  score: 88,
                  company: {
                    id: 'company-1',
                    legalName: 'Empresa 1',
                    tradeName: 'Empresa 1',
                    segment: 'Tech',
                    city: 'São Paulo',
                    region: 'SP',
                  },
                },
              },
            ],
            search: { city: 'São Paulo', segmentRaw: 'Tech' },
          },
        ],
      },
    };
  },
  listPipelineOverview: async (_dc, vars) => {
    callLog.push(['listPipelineOverview', vars]);
    return {
      data: {
        pipelines: [
          {
            id: 'pipeline-1',
            name: 'Pipeline 1',
            isDefault: true,
            stages: [
              { id: 'stage-1', name: 'A', sortOrder: 1, color: '#111111' },
              { id: 'stage-0', name: 'B', sortOrder: 0, color: '#222222' },
            ],
          },
        ],
      },
    };
  },
  listLeadsByWorkspace: async (_dc, vars) => {
    callLog.push(['listLeadsByWorkspace', vars]);
    return {
      data: {
        leads: [
          {
            id: 'lead-1',
            status: 'NEW',
            rank: 0,
            score: 88,
            company: {
              id: 'company-1',
              legalName: 'Empresa 1',
              tradeName: 'Empresa 1',
              segment: 'Tech',
              city: 'São Paulo',
              region: 'SP',
              country: 'BR',
              phone: '11999999999',
              website: 'https://empresa1.example',
              score: 88,
            },
          },
        ],
      },
    };
  },
  listDealsByWorkspace: async (_dc, vars) => {
    callLog.push(['listDealsByWorkspace', vars]);
    return {
      data: {
        deals: [
          {
            id: 'deal-1',
            title: 'Deal 1',
            value: 1200,
            priority: 'high',
            nextStep: 'Call',
            notes: 'Note',
            payload: { summary: 'Resumo' },
            createdAt: '2026-05-21T01:00:00.000Z',
            company: {
              id: 'company-1',
              legalName: 'Empresa 1',
              tradeName: 'Empresa 1',
              city: 'São Paulo',
              region: 'SP',
            },
            pipeline: { id: 'pipeline-1', name: 'Pipeline 1', isDefault: true },
            stage: { id: 'stage-1', name: 'A', sortOrder: 1, color: '#111111' },
          },
        ],
      },
    };
  },
  createSavedList: async (_dc, vars) => {
    callLog.push(['createSavedList', vars]);
    return { data: { savedList_insert: { id: vars.id } } };
  },
  addLeadToSavedList: async (_dc, vars) => {
    callLog.push(['addLeadToSavedList', vars]);
    return { data: { savedListItem_upsert: { id: `${vars.listId}:${vars.leadId}` } } };
  },
  deleteSavedList: async (_dc, vars) => {
    callLog.push(['deleteSavedList', vars]);
    return { data: { savedList_delete: { id: vars.id } } };
  },
  upsertCompany: async (_dc, vars) => {
    callLog.push(['upsertCompany', vars]);
    return { data: { company_upsert: { id: vars.id } } };
  },
  upsertLead: async (_dc, vars) => {
    callLog.push(['upsertLead', vars]);
    return { data: { lead_upsert: { id: vars.id } } };
  },
  upsertPipeline: async (_dc, vars) => {
    callLog.push(['upsertPipeline', vars]);
    return { data: { pipeline_upsert: { id: vars.id } } };
  },
  upsertPipelineStage: async (_dc, vars) => {
    callLog.push(['upsertPipelineStage', vars]);
    return { data: { pipelineStage_upsert: { id: vars.id } } };
  },
  upsertDeal: async (_dc, vars) => {
    callLog.push(['upsertDeal', vars]);
    return { data: { deal_upsert: { id: vars.id } } };
  },
  deleteDeal: async (_dc, vars) => {
    callLog.push(['deleteDeal', vars]);
    return { data: { deal_delete: { id: vars.id } } };
  },
});

const snapshot = await service.createWorkspaceRemoteSnapshot({}, 'workspace-1');

assert.equal(snapshot.savedLists.length, 1);
assert.equal(snapshot.savedLists[0].leads[0].nome_fantasia, 'Empresa 1');
assert.deepEqual(snapshot.pipelines[0].stages.map((stage) => stage.id), ['stage-0', 'stage-1']);
assert.equal(snapshot.contacts[0].razao_social, 'Empresa 1');
assert.equal(snapshot.deals[0].priority, 'HIGH');

const flushResult = await service.flushWorkspaceOutboxRecords({}, 'workspace-1', [
  {
    entity: 'savedList',
    operation: 'create',
    entityId: 'list-local',
    payload: {
      id: 'list-local',
      name: 'Lista local',
      leads: [
        {
          id: 'company-local',
          cnpj: '',
          razao_social: 'Local SA',
          nome_fantasia: 'Local SA',
          cidade: 'Curitiba',
          uf: 'PR',
          pais: 'BR',
          atividade_principal: 'Tech',
          telefone: '41999999999',
          website: 'https://local.example',
          status: 'NEW',
          score: 50,
          source: 'OPEN_DATA',
        },
      ],
    },
  },
  {
    entity: 'deal',
    operation: 'delete',
    entityId: 'deal-1',
    payload: null,
  },
]);

assert.equal(flushResult.remainingRecords.length, 0);
assert.ok(callLog.some(([name]) => name === 'createSavedList'));
assert.ok(callLog.some(([name]) => name === 'upsertCompany'));
assert.ok(callLog.some(([name]) => name === 'upsertLead'));
assert.ok(callLog.some(([name]) => name === 'addLeadToSavedList'));
assert.ok(callLog.some(([name]) => name === 'deleteDeal'));
