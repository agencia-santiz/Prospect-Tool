import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'bloom-leads-dfd79-service',
  location: 'southamerica-east1'
};
export const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
export const getCurrentUserByAuthUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUserByAuthUid', inputVars);
}
getCurrentUserByAuthUidRef.operationName = 'GetCurrentUserByAuthUid';

export function getCurrentUserByAuthUid(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCurrentUserByAuthUidRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getWorkspaceBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkspaceBySlug', inputVars);
}
getWorkspaceBySlugRef.operationName = 'GetWorkspaceBySlug';

export function getWorkspaceBySlug(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getWorkspaceBySlugRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listWorkspaceMembersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWorkspaceMembers', inputVars);
}
listWorkspaceMembersRef.operationName = 'ListWorkspaceMembers';

export function listWorkspaceMembers(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listWorkspaceMembersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listSavedListsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSavedLists', inputVars);
}
listSavedListsRef.operationName = 'ListSavedLists';

export function listSavedLists(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listSavedListsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listPipelineOverviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPipelineOverview', inputVars);
}
listPipelineOverviewRef.operationName = 'ListPipelineOverview';

export function listPipelineOverview(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPipelineOverviewRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listPipelineStagesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPipelineStages', inputVars);
}
listPipelineStagesRef.operationName = 'ListPipelineStages';

export function listPipelineStages(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPipelineStagesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listContactsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListContactsByWorkspace', inputVars);
}
listContactsByWorkspaceRef.operationName = 'ListContactsByWorkspace';

export function listContactsByWorkspace(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listContactsByWorkspaceRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listDealsByWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDealsByWorkspace', inputVars);
}
listDealsByWorkspaceRef.operationName = 'ListDealsByWorkspace';

export function listDealsByWorkspace(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listDealsByWorkspaceRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const bootstrapWorkspaceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'BootstrapWorkspace', inputVars);
}
bootstrapWorkspaceRef.operationName = 'BootstrapWorkspace';

export function bootstrapWorkspace(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(bootstrapWorkspaceRef(dcInstance, inputVars));
}

