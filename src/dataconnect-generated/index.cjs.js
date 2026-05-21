const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'bloom-leads-dfd79-service',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;

const getCurrentUserByAuthUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUserByAuthUid', inputVars);
}
getCurrentUserByAuthUidRef.operationName = 'GetCurrentUserByAuthUid';
exports.getCurrentUserByAuthUidRef = getCurrentUserByAuthUidRef;

exports.getCurrentUserByAuthUid = function getCurrentUserByAuthUid(dcOrVars, vars) {
  return executeQuery(getCurrentUserByAuthUidRef(dcOrVars, vars));
};

const getWorkspaceBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkspaceBySlug', inputVars);
}
getWorkspaceBySlugRef.operationName = 'GetWorkspaceBySlug';
exports.getWorkspaceBySlugRef = getWorkspaceBySlugRef;

exports.getWorkspaceBySlug = function getWorkspaceBySlug(dcOrVars, vars) {
  return executeQuery(getWorkspaceBySlugRef(dcOrVars, vars));
};

const listWorkspaceMembersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWorkspaceMembers', inputVars);
}
listWorkspaceMembersRef.operationName = 'ListWorkspaceMembers';
exports.listWorkspaceMembersRef = listWorkspaceMembersRef;

exports.listWorkspaceMembers = function listWorkspaceMembers(dcOrVars, vars) {
  return executeQuery(listWorkspaceMembersRef(dcOrVars, vars));
};

const listSavedListsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSavedLists', inputVars);
}
listSavedListsRef.operationName = 'ListSavedLists';
exports.listSavedListsRef = listSavedListsRef;

exports.listSavedLists = function listSavedLists(dcOrVars, vars) {
  return executeQuery(listSavedListsRef(dcOrVars, vars));
};

const listPipelineOverviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPipelineOverview', inputVars);
}
listPipelineOverviewRef.operationName = 'ListPipelineOverview';
exports.listPipelineOverviewRef = listPipelineOverviewRef;

exports.listPipelineOverview = function listPipelineOverview(dcOrVars, vars) {
  return executeQuery(listPipelineOverviewRef(dcOrVars, vars));
};

const listPipelineStagesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPipelineStages', inputVars);
}
listPipelineStagesRef.operationName = 'ListPipelineStages';
exports.listPipelineStagesRef = listPipelineStagesRef;

exports.listPipelineStages = function listPipelineStages(dcOrVars, vars) {
  return executeQuery(listPipelineStagesRef(dcOrVars, vars));
};

const listContactsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListContactsByWorkspace', inputVars);
}
listContactsByWorkspaceRef.operationName = 'ListContactsByWorkspace';
exports.listContactsByWorkspaceRef = listContactsByWorkspaceRef;

exports.listContactsByWorkspace = function listContactsByWorkspace(dcOrVars, vars) {
  return executeQuery(listContactsByWorkspaceRef(dcOrVars, vars));
};

const listLeadsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListLeadsByWorkspace', inputVars);
}
listLeadsByWorkspaceRef.operationName = 'ListLeadsByWorkspace';
exports.listLeadsByWorkspaceRef = listLeadsByWorkspaceRef;

exports.listLeadsByWorkspace = function listLeadsByWorkspace(dcOrVars, vars) {
  return executeQuery(listLeadsByWorkspaceRef(dcOrVars, vars));
};

const listDealsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDealsByWorkspace', inputVars);
}
listDealsByWorkspaceRef.operationName = 'ListDealsByWorkspace';
exports.listDealsByWorkspaceRef = listDealsByWorkspaceRef;

exports.listDealsByWorkspace = function listDealsByWorkspace(dcOrVars, vars) {
  return executeQuery(listDealsByWorkspaceRef(dcOrVars, vars));
};

const bootstrapWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'BootstrapWorkspace', inputVars);
}
bootstrapWorkspaceRef.operationName = 'BootstrapWorkspace';
exports.bootstrapWorkspaceRef = bootstrapWorkspaceRef;

exports.bootstrapWorkspace = function bootstrapWorkspace(dcOrVars, vars) {
  return executeMutation(bootstrapWorkspaceRef(dcOrVars, vars));
};

const createSavedListRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSavedList', inputVars);
}
createSavedListRef.operationName = 'CreateSavedList';
exports.createSavedListRef = createSavedListRef;

exports.createSavedList = function createSavedList(dcOrVars, vars) {
  return executeMutation(createSavedListRef(dcOrVars, vars));
};

const upsertCompanyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCompany', inputVars);
}
upsertCompanyRef.operationName = 'UpsertCompany';
exports.upsertCompanyRef = upsertCompanyRef;

exports.upsertCompany = function upsertCompany(dcOrVars, vars) {
  return executeMutation(upsertCompanyRef(dcOrVars, vars));
};

const upsertLeadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertLead', inputVars);
}
upsertLeadRef.operationName = 'UpsertLead';
exports.upsertLeadRef = upsertLeadRef;

exports.upsertLead = function upsertLead(dcOrVars, vars) {
  return executeMutation(upsertLeadRef(dcOrVars, vars));
};

const addLeadToSavedListRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddLeadToSavedList', inputVars);
}
addLeadToSavedListRef.operationName = 'AddLeadToSavedList';
exports.addLeadToSavedListRef = addLeadToSavedListRef;

exports.addLeadToSavedList = function addLeadToSavedList(dcOrVars, vars) {
  return executeMutation(addLeadToSavedListRef(dcOrVars, vars));
};

const deleteSavedListRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSavedList', inputVars);
}
deleteSavedListRef.operationName = 'DeleteSavedList';
exports.deleteSavedListRef = deleteSavedListRef;

exports.deleteSavedList = function deleteSavedList(dcOrVars, vars) {
  return executeMutation(deleteSavedListRef(dcOrVars, vars));
};

const upsertPipelineRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPipeline', inputVars);
}
upsertPipelineRef.operationName = 'UpsertPipeline';
exports.upsertPipelineRef = upsertPipelineRef;

exports.upsertPipeline = function upsertPipeline(dcOrVars, vars) {
  return executeMutation(upsertPipelineRef(dcOrVars, vars));
};

const upsertPipelineStageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPipelineStage', inputVars);
}
upsertPipelineStageRef.operationName = 'UpsertPipelineStage';
exports.upsertPipelineStageRef = upsertPipelineStageRef;

exports.upsertPipelineStage = function upsertPipelineStage(dcOrVars, vars) {
  return executeMutation(upsertPipelineStageRef(dcOrVars, vars));
};

const upsertDealRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertDeal', inputVars);
}
upsertDealRef.operationName = 'UpsertDeal';
exports.upsertDealRef = upsertDealRef;

exports.upsertDeal = function upsertDeal(dcOrVars, vars) {
  return executeMutation(upsertDealRef(dcOrVars, vars));
};

const deleteDealRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteDeal', inputVars);
}
deleteDealRef.operationName = 'DeleteDeal';
exports.deleteDealRef = deleteDealRef;

exports.deleteDeal = function deleteDeal(dcOrVars, vars) {
  return executeMutation(deleteDealRef(dcOrVars, vars));
};

const createUsageEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUsageEvent', inputVars);
}
createUsageEventRef.operationName = 'CreateUsageEvent';
exports.createUsageEventRef = createUsageEventRef;

exports.createUsageEvent = function createUsageEvent(dcOrVars, vars) {
  return executeMutation(createUsageEventRef(dcOrVars, vars));
};

const listUsageEventsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUsageEventsByWorkspace', inputVars);
}
listUsageEventsByWorkspaceRef.operationName = 'ListUsageEventsByWorkspace';
exports.listUsageEventsByWorkspaceRef = listUsageEventsByWorkspaceRef;

exports.listUsageEventsByWorkspace = function listUsageEventsByWorkspace(dcOrVars, vars) {
  return executeQuery(listUsageEventsByWorkspaceRef(dcOrVars, vars));
};

const upsertEnrichmentJobRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertEnrichmentJob', inputVars);
}
upsertEnrichmentJobRef.operationName = 'UpsertEnrichmentJob';
exports.upsertEnrichmentJobRef = upsertEnrichmentJobRef;

exports.upsertEnrichmentJob = function upsertEnrichmentJob(dcOrVars, vars) {
  return executeMutation(upsertEnrichmentJobRef(dcOrVars, vars));
};

const updateEnrichmentJobStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEnrichmentJobStatus', inputVars);
}
updateEnrichmentJobStatusRef.operationName = 'UpdateEnrichmentJobStatus';
exports.updateEnrichmentJobStatusRef = updateEnrichmentJobStatusRef;

exports.updateEnrichmentJobStatus = function updateEnrichmentJobStatus(dcOrVars, vars) {
  return executeMutation(updateEnrichmentJobStatusRef(dcOrVars, vars));
};

const listQueuedEnrichmentJobsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListQueuedEnrichmentJobs', inputVars);
}
listQueuedEnrichmentJobsRef.operationName = 'ListQueuedEnrichmentJobs';
exports.listQueuedEnrichmentJobsRef = listQueuedEnrichmentJobsRef;

exports.listQueuedEnrichmentJobs = function listQueuedEnrichmentJobs(dcOrVars, vars) {
  return executeQuery(listQueuedEnrichmentJobsRef(dcOrVars, vars));
};

const listStaleDealsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStaleDeals', inputVars);
}
listStaleDealsRef.operationName = 'ListStaleDeals';
exports.listStaleDealsRef = listStaleDealsRef;

exports.listStaleDeals = function listStaleDeals(dcOrVars, vars) {
  return executeQuery(listStaleDealsRef(dcOrVars, vars));
};
