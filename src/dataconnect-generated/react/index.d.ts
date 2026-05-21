import { GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables, GetWorkspaceBySlugData, GetWorkspaceBySlugVariables, ListWorkspaceMembersData, ListWorkspaceMembersVariables, ListSavedListsData, ListSavedListsVariables, ListPipelineOverviewData, ListPipelineOverviewVariables, ListPipelineStagesData, ListPipelineStagesVariables, ListContactsByWorkspaceData, ListContactsByWorkspaceVariables, ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables, ListDealsByWorkspaceData, ListDealsByWorkspaceVariables, BootstrapWorkspaceData, BootstrapWorkspaceVariables, CreateSavedListData, CreateSavedListVariables, UpsertCompanyData, UpsertCompanyVariables, UpsertLeadData, UpsertLeadVariables, AddLeadToSavedListData, AddLeadToSavedListVariables, DeleteSavedListData, DeleteSavedListVariables, UpsertPipelineData, UpsertPipelineVariables, UpsertPipelineStageData, UpsertPipelineStageVariables, UpsertDealData, UpsertDealVariables, DeleteDealData, DeleteDealVariables, CreateUsageEventData, CreateUsageEventVariables, ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables, UpsertEnrichmentJobData, UpsertEnrichmentJobVariables, UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables, ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables, ListStaleDealsData, ListStaleDealsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useGetCurrentUserByAuthUid(vars: GetCurrentUserByAuthUidVariables, options?: useDataConnectQueryOptions<GetCurrentUserByAuthUidData>): UseDataConnectQueryResult<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
export function useGetCurrentUserByAuthUid(dc: DataConnect, vars: GetCurrentUserByAuthUidVariables, options?: useDataConnectQueryOptions<GetCurrentUserByAuthUidData>): UseDataConnectQueryResult<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;

export function useGetWorkspaceBySlug(vars: GetWorkspaceBySlugVariables, options?: useDataConnectQueryOptions<GetWorkspaceBySlugData>): UseDataConnectQueryResult<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
export function useGetWorkspaceBySlug(dc: DataConnect, vars: GetWorkspaceBySlugVariables, options?: useDataConnectQueryOptions<GetWorkspaceBySlugData>): UseDataConnectQueryResult<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;

export function useListWorkspaceMembers(vars: ListWorkspaceMembersVariables, options?: useDataConnectQueryOptions<ListWorkspaceMembersData>): UseDataConnectQueryResult<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
export function useListWorkspaceMembers(dc: DataConnect, vars: ListWorkspaceMembersVariables, options?: useDataConnectQueryOptions<ListWorkspaceMembersData>): UseDataConnectQueryResult<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;

export function useListSavedLists(vars: ListSavedListsVariables, options?: useDataConnectQueryOptions<ListSavedListsData>): UseDataConnectQueryResult<ListSavedListsData, ListSavedListsVariables>;
export function useListSavedLists(dc: DataConnect, vars: ListSavedListsVariables, options?: useDataConnectQueryOptions<ListSavedListsData>): UseDataConnectQueryResult<ListSavedListsData, ListSavedListsVariables>;

export function useListPipelineOverview(vars: ListPipelineOverviewVariables, options?: useDataConnectQueryOptions<ListPipelineOverviewData>): UseDataConnectQueryResult<ListPipelineOverviewData, ListPipelineOverviewVariables>;
export function useListPipelineOverview(dc: DataConnect, vars: ListPipelineOverviewVariables, options?: useDataConnectQueryOptions<ListPipelineOverviewData>): UseDataConnectQueryResult<ListPipelineOverviewData, ListPipelineOverviewVariables>;

export function useListPipelineStages(vars: ListPipelineStagesVariables, options?: useDataConnectQueryOptions<ListPipelineStagesData>): UseDataConnectQueryResult<ListPipelineStagesData, ListPipelineStagesVariables>;
export function useListPipelineStages(dc: DataConnect, vars: ListPipelineStagesVariables, options?: useDataConnectQueryOptions<ListPipelineStagesData>): UseDataConnectQueryResult<ListPipelineStagesData, ListPipelineStagesVariables>;

export function useListContactsByWorkspace(vars: ListContactsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListContactsByWorkspaceData>): UseDataConnectQueryResult<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
export function useListContactsByWorkspace(dc: DataConnect, vars: ListContactsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListContactsByWorkspaceData>): UseDataConnectQueryResult<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;

export function useListLeadsByWorkspace(vars: ListLeadsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListLeadsByWorkspaceData>): UseDataConnectQueryResult<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;
export function useListLeadsByWorkspace(dc: DataConnect, vars: ListLeadsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListLeadsByWorkspaceData>): UseDataConnectQueryResult<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;

export function useListDealsByWorkspace(vars: ListDealsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListDealsByWorkspaceData>): UseDataConnectQueryResult<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
export function useListDealsByWorkspace(dc: DataConnect, vars: ListDealsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListDealsByWorkspaceData>): UseDataConnectQueryResult<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;

export function useBootstrapWorkspace(options?: useDataConnectMutationOptions<BootstrapWorkspaceData, FirebaseError, BootstrapWorkspaceVariables>): UseDataConnectMutationResult<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
export function useBootstrapWorkspace(dc: DataConnect, options?: useDataConnectMutationOptions<BootstrapWorkspaceData, FirebaseError, BootstrapWorkspaceVariables>): UseDataConnectMutationResult<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;

export function useCreateSavedList(options?: useDataConnectMutationOptions<CreateSavedListData, FirebaseError, CreateSavedListVariables>): UseDataConnectMutationResult<CreateSavedListData, CreateSavedListVariables>;
export function useCreateSavedList(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSavedListData, FirebaseError, CreateSavedListVariables>): UseDataConnectMutationResult<CreateSavedListData, CreateSavedListVariables>;

export function useUpsertCompany(options?: useDataConnectMutationOptions<UpsertCompanyData, FirebaseError, UpsertCompanyVariables>): UseDataConnectMutationResult<UpsertCompanyData, UpsertCompanyVariables>;
export function useUpsertCompany(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompanyData, FirebaseError, UpsertCompanyVariables>): UseDataConnectMutationResult<UpsertCompanyData, UpsertCompanyVariables>;

export function useUpsertLead(options?: useDataConnectMutationOptions<UpsertLeadData, FirebaseError, UpsertLeadVariables>): UseDataConnectMutationResult<UpsertLeadData, UpsertLeadVariables>;
export function useUpsertLead(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertLeadData, FirebaseError, UpsertLeadVariables>): UseDataConnectMutationResult<UpsertLeadData, UpsertLeadVariables>;

export function useAddLeadToSavedList(options?: useDataConnectMutationOptions<AddLeadToSavedListData, FirebaseError, AddLeadToSavedListVariables>): UseDataConnectMutationResult<AddLeadToSavedListData, AddLeadToSavedListVariables>;
export function useAddLeadToSavedList(dc: DataConnect, options?: useDataConnectMutationOptions<AddLeadToSavedListData, FirebaseError, AddLeadToSavedListVariables>): UseDataConnectMutationResult<AddLeadToSavedListData, AddLeadToSavedListVariables>;

export function useDeleteSavedList(options?: useDataConnectMutationOptions<DeleteSavedListData, FirebaseError, DeleteSavedListVariables>): UseDataConnectMutationResult<DeleteSavedListData, DeleteSavedListVariables>;
export function useDeleteSavedList(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSavedListData, FirebaseError, DeleteSavedListVariables>): UseDataConnectMutationResult<DeleteSavedListData, DeleteSavedListVariables>;

export function useUpsertPipeline(options?: useDataConnectMutationOptions<UpsertPipelineData, FirebaseError, UpsertPipelineVariables>): UseDataConnectMutationResult<UpsertPipelineData, UpsertPipelineVariables>;
export function useUpsertPipeline(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertPipelineData, FirebaseError, UpsertPipelineVariables>): UseDataConnectMutationResult<UpsertPipelineData, UpsertPipelineVariables>;

export function useUpsertPipelineStage(options?: useDataConnectMutationOptions<UpsertPipelineStageData, FirebaseError, UpsertPipelineStageVariables>): UseDataConnectMutationResult<UpsertPipelineStageData, UpsertPipelineStageVariables>;
export function useUpsertPipelineStage(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertPipelineStageData, FirebaseError, UpsertPipelineStageVariables>): UseDataConnectMutationResult<UpsertPipelineStageData, UpsertPipelineStageVariables>;

export function useUpsertDeal(options?: useDataConnectMutationOptions<UpsertDealData, FirebaseError, UpsertDealVariables>): UseDataConnectMutationResult<UpsertDealData, UpsertDealVariables>;
export function useUpsertDeal(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertDealData, FirebaseError, UpsertDealVariables>): UseDataConnectMutationResult<UpsertDealData, UpsertDealVariables>;

export function useDeleteDeal(options?: useDataConnectMutationOptions<DeleteDealData, FirebaseError, DeleteDealVariables>): UseDataConnectMutationResult<DeleteDealData, DeleteDealVariables>;
export function useDeleteDeal(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteDealData, FirebaseError, DeleteDealVariables>): UseDataConnectMutationResult<DeleteDealData, DeleteDealVariables>;

export function useCreateUsageEvent(options?: useDataConnectMutationOptions<CreateUsageEventData, FirebaseError, CreateUsageEventVariables>): UseDataConnectMutationResult<CreateUsageEventData, CreateUsageEventVariables>;
export function useCreateUsageEvent(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUsageEventData, FirebaseError, CreateUsageEventVariables>): UseDataConnectMutationResult<CreateUsageEventData, CreateUsageEventVariables>;

export function useListUsageEventsByWorkspace(vars: ListUsageEventsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListUsageEventsByWorkspaceData>): UseDataConnectQueryResult<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;
export function useListUsageEventsByWorkspace(dc: DataConnect, vars: ListUsageEventsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListUsageEventsByWorkspaceData>): UseDataConnectQueryResult<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;

export function useUpsertEnrichmentJob(options?: useDataConnectMutationOptions<UpsertEnrichmentJobData, FirebaseError, UpsertEnrichmentJobVariables>): UseDataConnectMutationResult<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;
export function useUpsertEnrichmentJob(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertEnrichmentJobData, FirebaseError, UpsertEnrichmentJobVariables>): UseDataConnectMutationResult<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;

export function useUpdateEnrichmentJobStatus(options?: useDataConnectMutationOptions<UpdateEnrichmentJobStatusData, FirebaseError, UpdateEnrichmentJobStatusVariables>): UseDataConnectMutationResult<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;
export function useUpdateEnrichmentJobStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEnrichmentJobStatusData, FirebaseError, UpdateEnrichmentJobStatusVariables>): UseDataConnectMutationResult<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;

export function useListQueuedEnrichmentJobs(vars: ListQueuedEnrichmentJobsVariables, options?: useDataConnectQueryOptions<ListQueuedEnrichmentJobsData>): UseDataConnectQueryResult<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;
export function useListQueuedEnrichmentJobs(dc: DataConnect, vars: ListQueuedEnrichmentJobsVariables, options?: useDataConnectQueryOptions<ListQueuedEnrichmentJobsData>): UseDataConnectQueryResult<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;

export function useListStaleDeals(vars: ListStaleDealsVariables, options?: useDataConnectQueryOptions<ListStaleDealsData>): UseDataConnectQueryResult<ListStaleDealsData, ListStaleDealsVariables>;
export function useListStaleDeals(dc: DataConnect, vars: ListStaleDealsVariables, options?: useDataConnectQueryOptions<ListStaleDealsData>): UseDataConnectQueryResult<ListStaleDealsData, ListStaleDealsVariables>;
