import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface BootstrapWorkspaceData {
  user_insert: User_Key;
  workspace_insert: Workspace_Key;
  workspaceMember_insert: WorkspaceMember_Key;
}

export interface BootstrapWorkspaceVariables {
  email: string;
  name: string;
  workspaceName: string;
  workspaceSlug: string;
}

export interface CompanySource_Key {
  id: UUIDString;
  __typename?: 'CompanySource_Key';
}

export interface Company_Key {
  id: UUIDString;
  __typename?: 'Company_Key';
}

export interface Contact_Key {
  id: UUIDString;
  __typename?: 'Contact_Key';
}

export interface Deal_Key {
  id: UUIDString;
  __typename?: 'Deal_Key';
}

export interface EnrichmentJob_Key {
  id: UUIDString;
  __typename?: 'EnrichmentJob_Key';
}

export interface GetCurrentUserByAuthUidData {
  users: ({
    id: UUIDString;
    authUid: string;
    email: string;
    name: string;
    avatarUrl?: string | null;
    authProvider: string;
    plan: string;
    isActive: boolean;
    usageLimit: number;
    usageCount: number;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    lastLoginAt?: TimestampString | null;
  } & User_Key)[];
}

export interface GetCurrentUserByAuthUidVariables {
  authUid: string;
}

export interface GetWorkspaceBySlugData {
  workspaces: ({
    id: UUIDString;
    name: string;
    slug: string;
    plan: string;
    isArchived: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    owner: {
      id: UUIDString;
      name: string;
      email: string;
      avatarUrl?: string | null;
    } & User_Key;
  } & Workspace_Key)[];
}

export interface GetWorkspaceBySlugVariables {
  slug: string;
}

export interface Lead_Key {
  id: UUIDString;
  __typename?: 'Lead_Key';
}

export interface ListContactsByWorkspaceData {
  contacts: ({
    id: UUIDString;
    name?: string | null;
    title?: string | null;
    email?: string | null;
    phone?: string | null;
    whatsappStatus: string;
    preferredChannel?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    company: {
      id: UUIDString;
      legalName: string;
      tradeName: string;
      city: string;
      region: string;
    } & Company_Key;
  } & Contact_Key)[];
}

export interface ListContactsByWorkspaceVariables {
  workspaceId: UUIDString;
}

export interface ListDealsByWorkspaceData {
  deals: ({
    id: UUIDString;
    title: string;
    value?: number | null;
    priority: string;
    nextStep?: string | null;
    notes?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    company?: {
      id: UUIDString;
      legalName: string;
      tradeName: string;
      city: string;
      region: string;
    } & Company_Key;
      contact?: {
        id: UUIDString;
        name?: string | null;
        email?: string | null;
        phone?: string | null;
      } & Contact_Key;
        pipeline: {
          id: UUIDString;
          name: string;
          isDefault: boolean;
        } & Pipeline_Key;
          stage: {
            id: UUIDString;
            name: string;
            sortOrder: number;
            color?: string | null;
          } & PipelineStage_Key;
  } & Deal_Key)[];
}

export interface ListDealsByWorkspaceVariables {
  workspaceId: UUIDString;
}

export interface ListPipelineOverviewData {
  pipelines: ({
    id: UUIDString;
    name: string;
    isDefault: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Pipeline_Key)[];
}

export interface ListPipelineOverviewVariables {
  workspaceId: UUIDString;
}

export interface ListPipelineStagesData {
  pipelineStages: ({
    id: UUIDString;
    name: string;
    sortOrder: number;
    color?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & PipelineStage_Key)[];
}

export interface ListPipelineStagesVariables {
  pipelineId: UUIDString;
}

export interface ListSavedListsData {
  savedLists: ({
    id: UUIDString;
    name: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    createdByUser?: {
      id: UUIDString;
      name: string;
      email: string;
    } & User_Key;
      search?: {
        id: UUIDString;
        city: string;
        segmentRaw: string;
        status: string;
      } & Search_Key;
  } & SavedList_Key)[];
}

export interface ListSavedListsVariables {
  workspaceId: UUIDString;
}

export interface ListWorkspaceMembersData {
  workspaceMembers: ({
    workspace: {
      id: UUIDString;
      name: string;
      slug: string;
    } & Workspace_Key;
      user: {
        id: UUIDString;
        name: string;
        email: string;
        avatarUrl?: string | null;
      } & User_Key;
        role: string;
        status: string;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  })[];
}

export interface ListWorkspaceMembersVariables {
  workspaceId: UUIDString;
}

export interface PipelineStage_Key {
  id: UUIDString;
  __typename?: 'PipelineStage_Key';
}

export interface Pipeline_Key {
  id: UUIDString;
  __typename?: 'Pipeline_Key';
}

export interface SavedListItem_Key {
  listId: UUIDString;
  leadId: UUIDString;
  __typename?: 'SavedListItem_Key';
}

export interface SavedList_Key {
  id: UUIDString;
  __typename?: 'SavedList_Key';
}

export interface SearchFeedback_Key {
  id: UUIDString;
  __typename?: 'SearchFeedback_Key';
}

export interface Search_Key {
  id: UUIDString;
  __typename?: 'Search_Key';
}

export interface UsageEvent_Key {
  id: UUIDString;
  __typename?: 'UsageEvent_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface WorkspaceMember_Key {
  workspaceId: UUIDString;
  userId: UUIDString;
  __typename?: 'WorkspaceMember_Key';
}

export interface Workspace_Key {
  id: UUIDString;
  __typename?: 'Workspace_Key';
}

interface GetCurrentUserByAuthUidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCurrentUserByAuthUidVariables): QueryRef<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCurrentUserByAuthUidVariables): QueryRef<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
  operationName: string;
}
export const getCurrentUserByAuthUidRef: GetCurrentUserByAuthUidRef;

export function getCurrentUserByAuthUid(vars: GetCurrentUserByAuthUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
export function getCurrentUserByAuthUid(dc: DataConnect, vars: GetCurrentUserByAuthUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;

interface GetWorkspaceBySlugRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkspaceBySlugVariables): QueryRef<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWorkspaceBySlugVariables): QueryRef<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
  operationName: string;
}
export const getWorkspaceBySlugRef: GetWorkspaceBySlugRef;

export function getWorkspaceBySlug(vars: GetWorkspaceBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
export function getWorkspaceBySlug(dc: DataConnect, vars: GetWorkspaceBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;

interface ListWorkspaceMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListWorkspaceMembersVariables): QueryRef<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListWorkspaceMembersVariables): QueryRef<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
  operationName: string;
}
export const listWorkspaceMembersRef: ListWorkspaceMembersRef;

export function listWorkspaceMembers(vars: ListWorkspaceMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
export function listWorkspaceMembers(dc: DataConnect, vars: ListWorkspaceMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;

interface ListSavedListsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSavedListsVariables): QueryRef<ListSavedListsData, ListSavedListsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListSavedListsVariables): QueryRef<ListSavedListsData, ListSavedListsVariables>;
  operationName: string;
}
export const listSavedListsRef: ListSavedListsRef;

export function listSavedLists(vars: ListSavedListsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSavedListsData, ListSavedListsVariables>;
export function listSavedLists(dc: DataConnect, vars: ListSavedListsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSavedListsData, ListSavedListsVariables>;

interface ListPipelineOverviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPipelineOverviewVariables): QueryRef<ListPipelineOverviewData, ListPipelineOverviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPipelineOverviewVariables): QueryRef<ListPipelineOverviewData, ListPipelineOverviewVariables>;
  operationName: string;
}
export const listPipelineOverviewRef: ListPipelineOverviewRef;

export function listPipelineOverview(vars: ListPipelineOverviewVariables, options?: ExecuteQueryOptions): QueryPromise<ListPipelineOverviewData, ListPipelineOverviewVariables>;
export function listPipelineOverview(dc: DataConnect, vars: ListPipelineOverviewVariables, options?: ExecuteQueryOptions): QueryPromise<ListPipelineOverviewData, ListPipelineOverviewVariables>;

interface ListPipelineStagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPipelineStagesVariables): QueryRef<ListPipelineStagesData, ListPipelineStagesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPipelineStagesVariables): QueryRef<ListPipelineStagesData, ListPipelineStagesVariables>;
  operationName: string;
}
export const listPipelineStagesRef: ListPipelineStagesRef;

export function listPipelineStages(vars: ListPipelineStagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListPipelineStagesData, ListPipelineStagesVariables>;
export function listPipelineStages(dc: DataConnect, vars: ListPipelineStagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListPipelineStagesData, ListPipelineStagesVariables>;

interface ListContactsByWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListContactsByWorkspaceVariables): QueryRef<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListContactsByWorkspaceVariables): QueryRef<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
  operationName: string;
}
export const listContactsByWorkspaceRef: ListContactsByWorkspaceRef;

export function listContactsByWorkspace(vars: ListContactsByWorkspaceVariables, options?: ExecuteQueryOptions): QueryPromise<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
export function listContactsByWorkspace(dc: DataConnect, vars: ListContactsByWorkspaceVariables, options?: ExecuteQueryOptions): QueryPromise<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;

interface ListDealsByWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDealsByWorkspaceVariables): QueryRef<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListDealsByWorkspaceVariables): QueryRef<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
  operationName: string;
}
export const listDealsByWorkspaceRef: ListDealsByWorkspaceRef;

export function listDealsByWorkspace(vars: ListDealsByWorkspaceVariables, options?: ExecuteQueryOptions): QueryPromise<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
export function listDealsByWorkspace(dc: DataConnect, vars: ListDealsByWorkspaceVariables, options?: ExecuteQueryOptions): QueryPromise<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;

interface BootstrapWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: BootstrapWorkspaceVariables): MutationRef<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: BootstrapWorkspaceVariables): MutationRef<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
  operationName: string;
}
export const bootstrapWorkspaceRef: BootstrapWorkspaceRef;

export function bootstrapWorkspace(vars: BootstrapWorkspaceVariables): MutationPromise<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
export function bootstrapWorkspace(dc: DataConnect, vars: BootstrapWorkspaceVariables): MutationPromise<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;

