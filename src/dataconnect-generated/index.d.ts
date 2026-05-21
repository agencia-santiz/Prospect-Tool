import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddLeadToSavedListData {
  savedListItem_upsert: SavedListItem_Key;
}

export interface AddLeadToSavedListVariables {
  listId: UUIDString;
  leadId: UUIDString;
}

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

export interface CreateSavedListData {
  savedList_insert: SavedList_Key;
}

export interface CreateSavedListVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  name: string;
}

export interface CreateUsageEventData {
  usageEvent_insert: UsageEvent_Key;
}

export interface CreateUsageEventVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  userId?: UUIDString | null;
  eventType: string;
  source?: string | null;
  quantity: number;
  metadata: unknown;
}

export interface Deal_Key {
  id: UUIDString;
  __typename?: 'Deal_Key';
}

export interface DeleteDealData {
  deal_delete?: Deal_Key | null;
}

export interface DeleteDealVariables {
  id: UUIDString;
}

export interface DeleteSavedListData {
  savedList_delete?: SavedList_Key | null;
}

export interface DeleteSavedListVariables {
  id: UUIDString;
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
    payload: unknown;
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

export interface ListLeadsByWorkspaceData {
  leads: ({
    id: UUIDString;
    status: string;
    rank: number;
    score: number;
    reason?: string | null;
    source?: string | null;
    company: {
      id: UUIDString;
      legalName: string;
      tradeName: string;
      segment: string;
      city: string;
      region: string;
      country: string;
      phone?: string | null;
      website?: string | null;
      score: number;
    } & Company_Key;
  } & Lead_Key)[];
}

export interface ListLeadsByWorkspaceVariables {
  workspaceId: UUIDString;
}

export interface ListPipelineOverviewData {
  pipelines: ({
    id: UUIDString;
    name: string;
    isDefault: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    stages: ({
      id: UUIDString;
      name: string;
      sortOrder: number;
      color?: string | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
    } & PipelineStage_Key)[];
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

export interface ListQueuedEnrichmentJobsData {
  enrichmentJobs: ({
    id: UUIDString;
    jobType: string;
    companyId?: UUIDString | null;
    payload: unknown;
    attempts: number;
  } & EnrichmentJob_Key)[];
}

export interface ListQueuedEnrichmentJobsVariables {
  workspaceId: UUIDString;
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
        savedListItems_on_list: ({
          lead: {
            id: UUIDString;
            status: string;
            company: {
              id: UUIDString;
              legalName: string;
              tradeName: string;
              segment: string;
              city: string;
              region: string;
              country: string;
              phone?: string | null;
              website?: string | null;
              score: number;
            } & Company_Key;
          } & Lead_Key;
        })[];
  } & SavedList_Key)[];
}

export interface ListSavedListsVariables {
  workspaceId: UUIDString;
}

export interface ListStaleDealsData {
  deals: ({
    id: UUIDString;
    company?: {
      id: UUIDString;
    } & Company_Key;
      pipeline: {
        id: UUIDString;
      } & Pipeline_Key;
        stage: {
          id: UUIDString;
        } & PipelineStage_Key;
          title: string;
          value?: number | null;
          priority: string;
          payload: unknown;
  } & Deal_Key)[];
}

export interface ListStaleDealsVariables {
  workspaceId: UUIDString;
  staleDate: TimestampString;
}

export interface ListUsageEventsByWorkspaceData {
  usageEvents: ({
    id: UUIDString;
    eventType: string;
    quantity: number;
    occurredAt: TimestampString;
  } & UsageEvent_Key)[];
}

export interface ListUsageEventsByWorkspaceVariables {
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

export interface UpdateEnrichmentJobStatusData {
  enrichmentJob_update?: EnrichmentJob_Key | null;
}

export interface UpdateEnrichmentJobStatusVariables {
  id: UUIDString;
  status: string;
  result: unknown;
  errorMessage?: string | null;
}

export interface UpsertCompanyData {
  company_upsert: Company_Key;
}

export interface UpsertCompanyVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  legalName: string;
  tradeName: string;
  segment: string;
  city: string;
  region: string;
  country: string;
  phone?: string | null;
  website?: string | null;
}

export interface UpsertDealData {
  deal_upsert: Deal_Key;
}

export interface UpsertDealVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  pipelineId: UUIDString;
  stageId: UUIDString;
  title: string;
  companyId?: UUIDString | null;
  value?: number | null;
  priority: string;
  nextStep?: string | null;
  notes?: string | null;
  payload: unknown;
}

export interface UpsertEnrichmentJobData {
  enrichmentJob_upsert: EnrichmentJob_Key;
}

export interface UpsertEnrichmentJobVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  companyId?: UUIDString | null;
  jobType: string;
  payload: unknown;
}

export interface UpsertLeadData {
  lead_upsert: Lead_Key;
}

export interface UpsertLeadVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  companyId: UUIDString;
  status: string;
  rank: number;
  score: number;
  source?: string | null;
}

export interface UpsertPipelineData {
  pipeline_upsert: Pipeline_Key;
}

export interface UpsertPipelineStageData {
  pipelineStage_upsert: PipelineStage_Key;
}

export interface UpsertPipelineStageVariables {
  id: UUIDString;
  pipelineId: UUIDString;
  name: string;
  sortOrder: number;
  color: string;
}

export interface UpsertPipelineVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  name: string;
  isDefault?: boolean | null;
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

export function getCurrentUserByAuthUid(vars: GetCurrentUserByAuthUidVariables): QueryPromise<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
export function getCurrentUserByAuthUid(dc: DataConnect, vars: GetCurrentUserByAuthUidVariables): QueryPromise<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;

interface GetWorkspaceBySlugRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkspaceBySlugVariables): QueryRef<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWorkspaceBySlugVariables): QueryRef<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
  operationName: string;
}
export const getWorkspaceBySlugRef: GetWorkspaceBySlugRef;

export function getWorkspaceBySlug(vars: GetWorkspaceBySlugVariables): QueryPromise<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
export function getWorkspaceBySlug(dc: DataConnect, vars: GetWorkspaceBySlugVariables): QueryPromise<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;

interface ListWorkspaceMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListWorkspaceMembersVariables): QueryRef<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListWorkspaceMembersVariables): QueryRef<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
  operationName: string;
}
export const listWorkspaceMembersRef: ListWorkspaceMembersRef;

export function listWorkspaceMembers(vars: ListWorkspaceMembersVariables): QueryPromise<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
export function listWorkspaceMembers(dc: DataConnect, vars: ListWorkspaceMembersVariables): QueryPromise<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;

interface ListSavedListsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSavedListsVariables): QueryRef<ListSavedListsData, ListSavedListsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListSavedListsVariables): QueryRef<ListSavedListsData, ListSavedListsVariables>;
  operationName: string;
}
export const listSavedListsRef: ListSavedListsRef;

export function listSavedLists(vars: ListSavedListsVariables): QueryPromise<ListSavedListsData, ListSavedListsVariables>;
export function listSavedLists(dc: DataConnect, vars: ListSavedListsVariables): QueryPromise<ListSavedListsData, ListSavedListsVariables>;

interface ListPipelineOverviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPipelineOverviewVariables): QueryRef<ListPipelineOverviewData, ListPipelineOverviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPipelineOverviewVariables): QueryRef<ListPipelineOverviewData, ListPipelineOverviewVariables>;
  operationName: string;
}
export const listPipelineOverviewRef: ListPipelineOverviewRef;

export function listPipelineOverview(vars: ListPipelineOverviewVariables): QueryPromise<ListPipelineOverviewData, ListPipelineOverviewVariables>;
export function listPipelineOverview(dc: DataConnect, vars: ListPipelineOverviewVariables): QueryPromise<ListPipelineOverviewData, ListPipelineOverviewVariables>;

interface ListPipelineStagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPipelineStagesVariables): QueryRef<ListPipelineStagesData, ListPipelineStagesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPipelineStagesVariables): QueryRef<ListPipelineStagesData, ListPipelineStagesVariables>;
  operationName: string;
}
export const listPipelineStagesRef: ListPipelineStagesRef;

export function listPipelineStages(vars: ListPipelineStagesVariables): QueryPromise<ListPipelineStagesData, ListPipelineStagesVariables>;
export function listPipelineStages(dc: DataConnect, vars: ListPipelineStagesVariables): QueryPromise<ListPipelineStagesData, ListPipelineStagesVariables>;

interface ListContactsByWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListContactsByWorkspaceVariables): QueryRef<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListContactsByWorkspaceVariables): QueryRef<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
  operationName: string;
}
export const listContactsByWorkspaceRef: ListContactsByWorkspaceRef;

export function listContactsByWorkspace(vars: ListContactsByWorkspaceVariables): QueryPromise<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
export function listContactsByWorkspace(dc: DataConnect, vars: ListContactsByWorkspaceVariables): QueryPromise<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;

interface ListLeadsByWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListLeadsByWorkspaceVariables): QueryRef<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListLeadsByWorkspaceVariables): QueryRef<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;
  operationName: string;
}
export const listLeadsByWorkspaceRef: ListLeadsByWorkspaceRef;

export function listLeadsByWorkspace(vars: ListLeadsByWorkspaceVariables): QueryPromise<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;
export function listLeadsByWorkspace(dc: DataConnect, vars: ListLeadsByWorkspaceVariables): QueryPromise<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;

interface ListDealsByWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDealsByWorkspaceVariables): QueryRef<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListDealsByWorkspaceVariables): QueryRef<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
  operationName: string;
}
export const listDealsByWorkspaceRef: ListDealsByWorkspaceRef;

export function listDealsByWorkspace(vars: ListDealsByWorkspaceVariables): QueryPromise<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
export function listDealsByWorkspace(dc: DataConnect, vars: ListDealsByWorkspaceVariables): QueryPromise<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;

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

interface CreateSavedListRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSavedListVariables): MutationRef<CreateSavedListData, CreateSavedListVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSavedListVariables): MutationRef<CreateSavedListData, CreateSavedListVariables>;
  operationName: string;
}
export const createSavedListRef: CreateSavedListRef;

export function createSavedList(vars: CreateSavedListVariables): MutationPromise<CreateSavedListData, CreateSavedListVariables>;
export function createSavedList(dc: DataConnect, vars: CreateSavedListVariables): MutationPromise<CreateSavedListData, CreateSavedListVariables>;

interface UpsertCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompanyVariables): MutationRef<UpsertCompanyData, UpsertCompanyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCompanyVariables): MutationRef<UpsertCompanyData, UpsertCompanyVariables>;
  operationName: string;
}
export const upsertCompanyRef: UpsertCompanyRef;

export function upsertCompany(vars: UpsertCompanyVariables): MutationPromise<UpsertCompanyData, UpsertCompanyVariables>;
export function upsertCompany(dc: DataConnect, vars: UpsertCompanyVariables): MutationPromise<UpsertCompanyData, UpsertCompanyVariables>;

interface UpsertLeadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertLeadVariables): MutationRef<UpsertLeadData, UpsertLeadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertLeadVariables): MutationRef<UpsertLeadData, UpsertLeadVariables>;
  operationName: string;
}
export const upsertLeadRef: UpsertLeadRef;

export function upsertLead(vars: UpsertLeadVariables): MutationPromise<UpsertLeadData, UpsertLeadVariables>;
export function upsertLead(dc: DataConnect, vars: UpsertLeadVariables): MutationPromise<UpsertLeadData, UpsertLeadVariables>;

interface AddLeadToSavedListRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddLeadToSavedListVariables): MutationRef<AddLeadToSavedListData, AddLeadToSavedListVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddLeadToSavedListVariables): MutationRef<AddLeadToSavedListData, AddLeadToSavedListVariables>;
  operationName: string;
}
export const addLeadToSavedListRef: AddLeadToSavedListRef;

export function addLeadToSavedList(vars: AddLeadToSavedListVariables): MutationPromise<AddLeadToSavedListData, AddLeadToSavedListVariables>;
export function addLeadToSavedList(dc: DataConnect, vars: AddLeadToSavedListVariables): MutationPromise<AddLeadToSavedListData, AddLeadToSavedListVariables>;

interface DeleteSavedListRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSavedListVariables): MutationRef<DeleteSavedListData, DeleteSavedListVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSavedListVariables): MutationRef<DeleteSavedListData, DeleteSavedListVariables>;
  operationName: string;
}
export const deleteSavedListRef: DeleteSavedListRef;

export function deleteSavedList(vars: DeleteSavedListVariables): MutationPromise<DeleteSavedListData, DeleteSavedListVariables>;
export function deleteSavedList(dc: DataConnect, vars: DeleteSavedListVariables): MutationPromise<DeleteSavedListData, DeleteSavedListVariables>;

interface UpsertPipelineRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPipelineVariables): MutationRef<UpsertPipelineData, UpsertPipelineVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertPipelineVariables): MutationRef<UpsertPipelineData, UpsertPipelineVariables>;
  operationName: string;
}
export const upsertPipelineRef: UpsertPipelineRef;

export function upsertPipeline(vars: UpsertPipelineVariables): MutationPromise<UpsertPipelineData, UpsertPipelineVariables>;
export function upsertPipeline(dc: DataConnect, vars: UpsertPipelineVariables): MutationPromise<UpsertPipelineData, UpsertPipelineVariables>;

interface UpsertPipelineStageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPipelineStageVariables): MutationRef<UpsertPipelineStageData, UpsertPipelineStageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertPipelineStageVariables): MutationRef<UpsertPipelineStageData, UpsertPipelineStageVariables>;
  operationName: string;
}
export const upsertPipelineStageRef: UpsertPipelineStageRef;

export function upsertPipelineStage(vars: UpsertPipelineStageVariables): MutationPromise<UpsertPipelineStageData, UpsertPipelineStageVariables>;
export function upsertPipelineStage(dc: DataConnect, vars: UpsertPipelineStageVariables): MutationPromise<UpsertPipelineStageData, UpsertPipelineStageVariables>;

interface UpsertDealRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertDealVariables): MutationRef<UpsertDealData, UpsertDealVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertDealVariables): MutationRef<UpsertDealData, UpsertDealVariables>;
  operationName: string;
}
export const upsertDealRef: UpsertDealRef;

export function upsertDeal(vars: UpsertDealVariables): MutationPromise<UpsertDealData, UpsertDealVariables>;
export function upsertDeal(dc: DataConnect, vars: UpsertDealVariables): MutationPromise<UpsertDealData, UpsertDealVariables>;

interface DeleteDealRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDealVariables): MutationRef<DeleteDealData, DeleteDealVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteDealVariables): MutationRef<DeleteDealData, DeleteDealVariables>;
  operationName: string;
}
export const deleteDealRef: DeleteDealRef;

export function deleteDeal(vars: DeleteDealVariables): MutationPromise<DeleteDealData, DeleteDealVariables>;
export function deleteDeal(dc: DataConnect, vars: DeleteDealVariables): MutationPromise<DeleteDealData, DeleteDealVariables>;

interface CreateUsageEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUsageEventVariables): MutationRef<CreateUsageEventData, CreateUsageEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUsageEventVariables): MutationRef<CreateUsageEventData, CreateUsageEventVariables>;
  operationName: string;
}
export const createUsageEventRef: CreateUsageEventRef;

export function createUsageEvent(vars: CreateUsageEventVariables): MutationPromise<CreateUsageEventData, CreateUsageEventVariables>;
export function createUsageEvent(dc: DataConnect, vars: CreateUsageEventVariables): MutationPromise<CreateUsageEventData, CreateUsageEventVariables>;

interface ListUsageEventsByWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUsageEventsByWorkspaceVariables): QueryRef<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUsageEventsByWorkspaceVariables): QueryRef<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;
  operationName: string;
}
export const listUsageEventsByWorkspaceRef: ListUsageEventsByWorkspaceRef;

export function listUsageEventsByWorkspace(vars: ListUsageEventsByWorkspaceVariables): QueryPromise<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;
export function listUsageEventsByWorkspace(dc: DataConnect, vars: ListUsageEventsByWorkspaceVariables): QueryPromise<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;

interface UpsertEnrichmentJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEnrichmentJobVariables): MutationRef<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertEnrichmentJobVariables): MutationRef<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;
  operationName: string;
}
export const upsertEnrichmentJobRef: UpsertEnrichmentJobRef;

export function upsertEnrichmentJob(vars: UpsertEnrichmentJobVariables): MutationPromise<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;
export function upsertEnrichmentJob(dc: DataConnect, vars: UpsertEnrichmentJobVariables): MutationPromise<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;

interface UpdateEnrichmentJobStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEnrichmentJobStatusVariables): MutationRef<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEnrichmentJobStatusVariables): MutationRef<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;
  operationName: string;
}
export const updateEnrichmentJobStatusRef: UpdateEnrichmentJobStatusRef;

export function updateEnrichmentJobStatus(vars: UpdateEnrichmentJobStatusVariables): MutationPromise<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;
export function updateEnrichmentJobStatus(dc: DataConnect, vars: UpdateEnrichmentJobStatusVariables): MutationPromise<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;

interface ListQueuedEnrichmentJobsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListQueuedEnrichmentJobsVariables): QueryRef<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListQueuedEnrichmentJobsVariables): QueryRef<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;
  operationName: string;
}
export const listQueuedEnrichmentJobsRef: ListQueuedEnrichmentJobsRef;

export function listQueuedEnrichmentJobs(vars: ListQueuedEnrichmentJobsVariables): QueryPromise<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;
export function listQueuedEnrichmentJobs(dc: DataConnect, vars: ListQueuedEnrichmentJobsVariables): QueryPromise<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;

interface ListStaleDealsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStaleDealsVariables): QueryRef<ListStaleDealsData, ListStaleDealsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListStaleDealsVariables): QueryRef<ListStaleDealsData, ListStaleDealsVariables>;
  operationName: string;
}
export const listStaleDealsRef: ListStaleDealsRef;

export function listStaleDeals(vars: ListStaleDealsVariables): QueryPromise<ListStaleDealsData, ListStaleDealsVariables>;
export function listStaleDeals(dc: DataConnect, vars: ListStaleDealsVariables): QueryPromise<ListStaleDealsData, ListStaleDealsVariables>;

