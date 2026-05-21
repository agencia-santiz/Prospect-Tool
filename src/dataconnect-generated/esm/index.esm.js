import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'bloom-leads-dfd79-service',
  location: 'southamerica-east1'
};

export const getCurrentUserByAuthUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUserByAuthUid', inputVars);
}
getCurrentUserByAuthUidRef.operationName = 'GetCurrentUserByAuthUid';

export function getCurrentUserByAuthUid(dcOrVars, vars) {
  return executeQuery(getCurrentUserByAuthUidRef(dcOrVars, vars));
}

export const getWorkspaceBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkspaceBySlug', inputVars);
}
getWorkspaceBySlugRef.operationName = 'GetWorkspaceBySlug';

export function getWorkspaceBySlug(dcOrVars, vars) {
  return executeQuery(getWorkspaceBySlugRef(dcOrVars, vars));
}

export const listWorkspaceMembersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWorkspaceMembers', inputVars);
}
listWorkspaceMembersRef.operationName = 'ListWorkspaceMembers';

export function listWorkspaceMembers(dcOrVars, vars) {
  return executeQuery(listWorkspaceMembersRef(dcOrVars, vars));
}

export const listSavedListsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSavedLists', inputVars);
}
listSavedListsRef.operationName = 'ListSavedLists';

export function listSavedLists(dcOrVars, vars) {
  return executeQuery(listSavedListsRef(dcOrVars, vars));
}

export const listPipelineOverviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPipelineOverview', inputVars);
}
listPipelineOverviewRef.operationName = 'ListPipelineOverview';

export function listPipelineOverview(dcOrVars, vars) {
  return executeQuery(listPipelineOverviewRef(dcOrVars, vars));
}

export const listPipelineStagesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPipelineStages', inputVars);
}
listPipelineStagesRef.operationName = 'ListPipelineStages';

export function listPipelineStages(dcOrVars, vars) {
  return executeQuery(listPipelineStagesRef(dcOrVars, vars));
}

export const listContactsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListContactsByWorkspace', inputVars);
}
listContactsByWorkspaceRef.operationName = 'ListContactsByWorkspace';

export function listContactsByWorkspace(dcOrVars, vars) {
  return executeQuery(listContactsByWorkspaceRef(dcOrVars, vars));
}

export const listLeadsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListLeadsByWorkspace', inputVars);
}
listLeadsByWorkspaceRef.operationName = 'ListLeadsByWorkspace';

export function listLeadsByWorkspace(dcOrVars, vars) {
  return executeQuery(listLeadsByWorkspaceRef(dcOrVars, vars));
}

export const listStaleLeadsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStaleLeads', inputVars);
}
listStaleLeadsRef.operationName = 'ListStaleLeads';

export function listStaleLeads(dcOrVars, vars) {
  return executeQuery(listStaleLeadsRef(dcOrVars, vars));
}

export const listDealsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDealsByWorkspace', inputVars);
}
listDealsByWorkspaceRef.operationName = 'ListDealsByWorkspace';

export function listDealsByWorkspace(dcOrVars, vars) {
  return executeQuery(listDealsByWorkspaceRef(dcOrVars, vars));
}

export const bootstrapWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'BootstrapWorkspace', inputVars);
}
bootstrapWorkspaceRef.operationName = 'BootstrapWorkspace';

export function bootstrapWorkspace(dcOrVars, vars) {
  return executeMutation(bootstrapWorkspaceRef(dcOrVars, vars));
}

export const createSavedListRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSavedList', inputVars);
}
createSavedListRef.operationName = 'CreateSavedList';

export function createSavedList(dcOrVars, vars) {
  return executeMutation(createSavedListRef(dcOrVars, vars));
}

export const upsertCompanyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCompany', inputVars);
}
upsertCompanyRef.operationName = 'UpsertCompany';

export function upsertCompany(dcOrVars, vars) {
  return executeMutation(upsertCompanyRef(dcOrVars, vars));
}

export const upsertLeadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertLead', inputVars);
}
upsertLeadRef.operationName = 'UpsertLead';

export function upsertLead(dcOrVars, vars) {
  return executeMutation(upsertLeadRef(dcOrVars, vars));
}

export const addLeadToSavedListRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddLeadToSavedList', inputVars);
}
addLeadToSavedListRef.operationName = 'AddLeadToSavedList';

export function addLeadToSavedList(dcOrVars, vars) {
  return executeMutation(addLeadToSavedListRef(dcOrVars, vars));
}

export const deleteSavedListRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSavedList', inputVars);
}
deleteSavedListRef.operationName = 'DeleteSavedList';

export function deleteSavedList(dcOrVars, vars) {
  return executeMutation(deleteSavedListRef(dcOrVars, vars));
}

export const upsertPipelineRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPipeline', inputVars);
}
upsertPipelineRef.operationName = 'UpsertPipeline';

export function upsertPipeline(dcOrVars, vars) {
  return executeMutation(upsertPipelineRef(dcOrVars, vars));
}

export const upsertPipelineStageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPipelineStage', inputVars);
}
upsertPipelineStageRef.operationName = 'UpsertPipelineStage';

export function upsertPipelineStage(dcOrVars, vars) {
  return executeMutation(upsertPipelineStageRef(dcOrVars, vars));
}

export const upsertDealRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertDeal', inputVars);
}
upsertDealRef.operationName = 'UpsertDeal';

export function upsertDeal(dcOrVars, vars) {
  return executeMutation(upsertDealRef(dcOrVars, vars));
}

export const deleteDealRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteDeal', inputVars);
}
deleteDealRef.operationName = 'DeleteDeal';

export function deleteDeal(dcOrVars, vars) {
  return executeMutation(deleteDealRef(dcOrVars, vars));
}

export const createUsageEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUsageEvent', inputVars);
}
createUsageEventRef.operationName = 'CreateUsageEvent';

export function createUsageEvent(dcOrVars, vars) {
  return executeMutation(createUsageEventRef(dcOrVars, vars));
}

export const listUsageEventsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUsageEventsByWorkspace', inputVars);
}
listUsageEventsByWorkspaceRef.operationName = 'ListUsageEventsByWorkspace';

export function listUsageEventsByWorkspace(dcOrVars, vars) {
  return executeQuery(listUsageEventsByWorkspaceRef(dcOrVars, vars));
}

export const upsertEnrichmentJobRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertEnrichmentJob', inputVars);
}
upsertEnrichmentJobRef.operationName = 'UpsertEnrichmentJob';

export function upsertEnrichmentJob(dcOrVars, vars) {
  return executeMutation(upsertEnrichmentJobRef(dcOrVars, vars));
}

export const updateEnrichmentJobStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEnrichmentJobStatus', inputVars);
}
updateEnrichmentJobStatusRef.operationName = 'UpdateEnrichmentJobStatus';

export function updateEnrichmentJobStatus(dcOrVars, vars) {
  return executeMutation(updateEnrichmentJobStatusRef(dcOrVars, vars));
}

export const listQueuedEnrichmentJobsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListQueuedEnrichmentJobs', inputVars);
}
listQueuedEnrichmentJobsRef.operationName = 'ListQueuedEnrichmentJobs';

export function listQueuedEnrichmentJobs(dcOrVars, vars) {
  return executeQuery(listQueuedEnrichmentJobsRef(dcOrVars, vars));
}

export const listStaleDealsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStaleDeals', inputVars);
}
listStaleDealsRef.operationName = 'ListStaleDeals';

export function listStaleDeals(dcOrVars, vars) {
  return executeQuery(listStaleDealsRef(dcOrVars, vars));
}
