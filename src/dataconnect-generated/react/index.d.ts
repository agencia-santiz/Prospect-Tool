import { GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables, GetWorkspaceBySlugData, GetWorkspaceBySlugVariables, ListWorkspaceMembersData, ListWorkspaceMembersVariables, ListSavedListsData, ListSavedListsVariables, ListPipelineOverviewData, ListPipelineOverviewVariables, ListPipelineStagesData, ListPipelineStagesVariables, ListContactsByWorkspaceData, ListContactsByWorkspaceVariables, ListDealsByWorkspaceData, ListDealsByWorkspaceVariables, BootstrapWorkspaceData, BootstrapWorkspaceVariables } from '../';
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

export function useListDealsByWorkspace(vars: ListDealsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListDealsByWorkspaceData>): UseDataConnectQueryResult<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
export function useListDealsByWorkspace(dc: DataConnect, vars: ListDealsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListDealsByWorkspaceData>): UseDataConnectQueryResult<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;

export function useBootstrapWorkspace(options?: useDataConnectMutationOptions<BootstrapWorkspaceData, FirebaseError, BootstrapWorkspaceVariables>): UseDataConnectMutationResult<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
export function useBootstrapWorkspace(dc: DataConnect, options?: useDataConnectMutationOptions<BootstrapWorkspaceData, FirebaseError, BootstrapWorkspaceVariables>): UseDataConnectMutationResult<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
