const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'bloom-leads-dfd79-service',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const getCurrentUserByAuthUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUserByAuthUid', inputVars);
}
getCurrentUserByAuthUidRef.operationName = 'GetCurrentUserByAuthUid';
exports.getCurrentUserByAuthUidRef = getCurrentUserByAuthUidRef;

exports.getCurrentUserByAuthUid = function getCurrentUserByAuthUid(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCurrentUserByAuthUidRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getWorkspaceBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkspaceBySlug', inputVars);
}
getWorkspaceBySlugRef.operationName = 'GetWorkspaceBySlug';
exports.getWorkspaceBySlugRef = getWorkspaceBySlugRef;

exports.getWorkspaceBySlug = function getWorkspaceBySlug(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getWorkspaceBySlugRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listWorkspaceMembersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWorkspaceMembers', inputVars);
}
listWorkspaceMembersRef.operationName = 'ListWorkspaceMembers';
exports.listWorkspaceMembersRef = listWorkspaceMembersRef;

exports.listWorkspaceMembers = function listWorkspaceMembers(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listWorkspaceMembersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listSavedListsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSavedLists', inputVars);
}
listSavedListsRef.operationName = 'ListSavedLists';
exports.listSavedListsRef = listSavedListsRef;

exports.listSavedLists = function listSavedLists(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listSavedListsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listPipelineOverviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPipelineOverview', inputVars);
}
listPipelineOverviewRef.operationName = 'ListPipelineOverview';
exports.listPipelineOverviewRef = listPipelineOverviewRef;

exports.listPipelineOverview = function listPipelineOverview(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPipelineOverviewRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listPipelineStagesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPipelineStages', inputVars);
}
listPipelineStagesRef.operationName = 'ListPipelineStages';
exports.listPipelineStagesRef = listPipelineStagesRef;

exports.listPipelineStages = function listPipelineStages(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPipelineStagesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listContactsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListContactsByWorkspace', inputVars);
}
listContactsByWorkspaceRef.operationName = 'ListContactsByWorkspace';
exports.listContactsByWorkspaceRef = listContactsByWorkspaceRef;

exports.listContactsByWorkspace = function listContactsByWorkspace(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listContactsByWorkspaceRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listDealsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDealsByWorkspace', inputVars);
}
listDealsByWorkspaceRef.operationName = 'ListDealsByWorkspace';
exports.listDealsByWorkspaceRef = listDealsByWorkspaceRef;

exports.listDealsByWorkspace = function listDealsByWorkspace(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listDealsByWorkspaceRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const bootstrapWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'BootstrapWorkspace', inputVars);
}
bootstrapWorkspaceRef.operationName = 'BootstrapWorkspace';
exports.bootstrapWorkspaceRef = bootstrapWorkspaceRef;

exports.bootstrapWorkspace = function bootstrapWorkspace(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(bootstrapWorkspaceRef(dcInstance, inputVars));
}
;
