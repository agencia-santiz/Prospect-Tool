# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUserByAuthUid*](#getcurrentuserbyauthuid)
  - [*GetWorkspaceBySlug*](#getworkspacebyslug)
  - [*ListWorkspaceMembers*](#listworkspacemembers)
  - [*ListSavedLists*](#listsavedlists)
  - [*ListPipelineOverview*](#listpipelineoverview)
  - [*ListPipelineStages*](#listpipelinestages)
  - [*ListContactsByWorkspace*](#listcontactsbyworkspace)
  - [*ListLeadsByWorkspace*](#listleadsbyworkspace)
  - [*ListDealsByWorkspace*](#listdealsbyworkspace)
  - [*ListUsageEventsByWorkspace*](#listusageeventsbyworkspace)
  - [*ListQueuedEnrichmentJobs*](#listqueuedenrichmentjobs)
  - [*ListStaleDeals*](#liststaledeals)
- [**Mutations**](#mutations)
  - [*BootstrapWorkspace*](#bootstrapworkspace)
  - [*CreateSavedList*](#createsavedlist)
  - [*UpsertCompany*](#upsertcompany)
  - [*UpsertLead*](#upsertlead)
  - [*AddLeadToSavedList*](#addleadtosavedlist)
  - [*DeleteSavedList*](#deletesavedlist)
  - [*UpsertPipeline*](#upsertpipeline)
  - [*UpsertPipelineStage*](#upsertpipelinestage)
  - [*UpsertDeal*](#upsertdeal)
  - [*DeleteDeal*](#deletedeal)
  - [*CreateUsageEvent*](#createusageevent)
  - [*UpsertEnrichmentJob*](#upsertenrichmentjob)
  - [*UpdateEnrichmentJobStatus*](#updateenrichmentjobstatus)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetCurrentUserByAuthUid
You can execute the `GetCurrentUserByAuthUid` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetCurrentUserByAuthUid(dc: DataConnect, vars: GetCurrentUserByAuthUidVariables, options?: useDataConnectQueryOptions<GetCurrentUserByAuthUidData>): UseDataConnectQueryResult<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetCurrentUserByAuthUid(vars: GetCurrentUserByAuthUidVariables, options?: useDataConnectQueryOptions<GetCurrentUserByAuthUidData>): UseDataConnectQueryResult<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
```

### Variables
The `GetCurrentUserByAuthUid` Query requires an argument of type `GetCurrentUserByAuthUidVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetCurrentUserByAuthUidVariables {
  authUid: string;
}
```
### Return Type
Recall that calling the `GetCurrentUserByAuthUid` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetCurrentUserByAuthUid` Query is of type `GetCurrentUserByAuthUidData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetCurrentUserByAuthUid`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetCurrentUserByAuthUidVariables } from '@dataconnect/generated';
import { useGetCurrentUserByAuthUid } from '@dataconnect/generated/react'

export default function GetCurrentUserByAuthUidComponent() {
  // The `useGetCurrentUserByAuthUid` Query hook requires an argument of type `GetCurrentUserByAuthUidVariables`:
  const getCurrentUserByAuthUidVars: GetCurrentUserByAuthUidVariables = {
    authUid: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetCurrentUserByAuthUid(getCurrentUserByAuthUidVars);
  // Variables can be defined inline as well.
  const query = useGetCurrentUserByAuthUid({ authUid: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetCurrentUserByAuthUid(dataConnect, getCurrentUserByAuthUidVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetCurrentUserByAuthUid(getCurrentUserByAuthUidVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetCurrentUserByAuthUid(dataConnect, getCurrentUserByAuthUidVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.users);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetWorkspaceBySlug
You can execute the `GetWorkspaceBySlug` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetWorkspaceBySlug(dc: DataConnect, vars: GetWorkspaceBySlugVariables, options?: useDataConnectQueryOptions<GetWorkspaceBySlugData>): UseDataConnectQueryResult<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetWorkspaceBySlug(vars: GetWorkspaceBySlugVariables, options?: useDataConnectQueryOptions<GetWorkspaceBySlugData>): UseDataConnectQueryResult<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
```

### Variables
The `GetWorkspaceBySlug` Query requires an argument of type `GetWorkspaceBySlugVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetWorkspaceBySlugVariables {
  slug: string;
}
```
### Return Type
Recall that calling the `GetWorkspaceBySlug` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetWorkspaceBySlug` Query is of type `GetWorkspaceBySlugData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetWorkspaceBySlug`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetWorkspaceBySlugVariables } from '@dataconnect/generated';
import { useGetWorkspaceBySlug } from '@dataconnect/generated/react'

export default function GetWorkspaceBySlugComponent() {
  // The `useGetWorkspaceBySlug` Query hook requires an argument of type `GetWorkspaceBySlugVariables`:
  const getWorkspaceBySlugVars: GetWorkspaceBySlugVariables = {
    slug: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetWorkspaceBySlug(getWorkspaceBySlugVars);
  // Variables can be defined inline as well.
  const query = useGetWorkspaceBySlug({ slug: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetWorkspaceBySlug(dataConnect, getWorkspaceBySlugVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetWorkspaceBySlug(getWorkspaceBySlugVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetWorkspaceBySlug(dataConnect, getWorkspaceBySlugVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.workspaces);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListWorkspaceMembers
You can execute the `ListWorkspaceMembers` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListWorkspaceMembers(dc: DataConnect, vars: ListWorkspaceMembersVariables, options?: useDataConnectQueryOptions<ListWorkspaceMembersData>): UseDataConnectQueryResult<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListWorkspaceMembers(vars: ListWorkspaceMembersVariables, options?: useDataConnectQueryOptions<ListWorkspaceMembersData>): UseDataConnectQueryResult<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
```

### Variables
The `ListWorkspaceMembers` Query requires an argument of type `ListWorkspaceMembersVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListWorkspaceMembersVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that calling the `ListWorkspaceMembers` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListWorkspaceMembers` Query is of type `ListWorkspaceMembersData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListWorkspaceMembers`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListWorkspaceMembersVariables } from '@dataconnect/generated';
import { useListWorkspaceMembers } from '@dataconnect/generated/react'

export default function ListWorkspaceMembersComponent() {
  // The `useListWorkspaceMembers` Query hook requires an argument of type `ListWorkspaceMembersVariables`:
  const listWorkspaceMembersVars: ListWorkspaceMembersVariables = {
    workspaceId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListWorkspaceMembers(listWorkspaceMembersVars);
  // Variables can be defined inline as well.
  const query = useListWorkspaceMembers({ workspaceId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListWorkspaceMembers(dataConnect, listWorkspaceMembersVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListWorkspaceMembers(listWorkspaceMembersVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListWorkspaceMembers(dataConnect, listWorkspaceMembersVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.workspaceMembers);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListSavedLists
You can execute the `ListSavedLists` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListSavedLists(dc: DataConnect, vars: ListSavedListsVariables, options?: useDataConnectQueryOptions<ListSavedListsData>): UseDataConnectQueryResult<ListSavedListsData, ListSavedListsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListSavedLists(vars: ListSavedListsVariables, options?: useDataConnectQueryOptions<ListSavedListsData>): UseDataConnectQueryResult<ListSavedListsData, ListSavedListsVariables>;
```

### Variables
The `ListSavedLists` Query requires an argument of type `ListSavedListsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListSavedListsVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that calling the `ListSavedLists` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListSavedLists` Query is of type `ListSavedListsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListSavedLists`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListSavedListsVariables } from '@dataconnect/generated';
import { useListSavedLists } from '@dataconnect/generated/react'

export default function ListSavedListsComponent() {
  // The `useListSavedLists` Query hook requires an argument of type `ListSavedListsVariables`:
  const listSavedListsVars: ListSavedListsVariables = {
    workspaceId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListSavedLists(listSavedListsVars);
  // Variables can be defined inline as well.
  const query = useListSavedLists({ workspaceId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListSavedLists(dataConnect, listSavedListsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListSavedLists(listSavedListsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListSavedLists(dataConnect, listSavedListsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.savedLists);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListPipelineOverview
You can execute the `ListPipelineOverview` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListPipelineOverview(dc: DataConnect, vars: ListPipelineOverviewVariables, options?: useDataConnectQueryOptions<ListPipelineOverviewData>): UseDataConnectQueryResult<ListPipelineOverviewData, ListPipelineOverviewVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListPipelineOverview(vars: ListPipelineOverviewVariables, options?: useDataConnectQueryOptions<ListPipelineOverviewData>): UseDataConnectQueryResult<ListPipelineOverviewData, ListPipelineOverviewVariables>;
```

### Variables
The `ListPipelineOverview` Query requires an argument of type `ListPipelineOverviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListPipelineOverviewVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that calling the `ListPipelineOverview` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListPipelineOverview` Query is of type `ListPipelineOverviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListPipelineOverview`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListPipelineOverviewVariables } from '@dataconnect/generated';
import { useListPipelineOverview } from '@dataconnect/generated/react'

export default function ListPipelineOverviewComponent() {
  // The `useListPipelineOverview` Query hook requires an argument of type `ListPipelineOverviewVariables`:
  const listPipelineOverviewVars: ListPipelineOverviewVariables = {
    workspaceId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListPipelineOverview(listPipelineOverviewVars);
  // Variables can be defined inline as well.
  const query = useListPipelineOverview({ workspaceId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListPipelineOverview(dataConnect, listPipelineOverviewVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListPipelineOverview(listPipelineOverviewVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListPipelineOverview(dataConnect, listPipelineOverviewVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.pipelines);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListPipelineStages
You can execute the `ListPipelineStages` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListPipelineStages(dc: DataConnect, vars: ListPipelineStagesVariables, options?: useDataConnectQueryOptions<ListPipelineStagesData>): UseDataConnectQueryResult<ListPipelineStagesData, ListPipelineStagesVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListPipelineStages(vars: ListPipelineStagesVariables, options?: useDataConnectQueryOptions<ListPipelineStagesData>): UseDataConnectQueryResult<ListPipelineStagesData, ListPipelineStagesVariables>;
```

### Variables
The `ListPipelineStages` Query requires an argument of type `ListPipelineStagesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListPipelineStagesVariables {
  pipelineId: UUIDString;
}
```
### Return Type
Recall that calling the `ListPipelineStages` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListPipelineStages` Query is of type `ListPipelineStagesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListPipelineStages`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListPipelineStagesVariables } from '@dataconnect/generated';
import { useListPipelineStages } from '@dataconnect/generated/react'

export default function ListPipelineStagesComponent() {
  // The `useListPipelineStages` Query hook requires an argument of type `ListPipelineStagesVariables`:
  const listPipelineStagesVars: ListPipelineStagesVariables = {
    pipelineId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListPipelineStages(listPipelineStagesVars);
  // Variables can be defined inline as well.
  const query = useListPipelineStages({ pipelineId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListPipelineStages(dataConnect, listPipelineStagesVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListPipelineStages(listPipelineStagesVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListPipelineStages(dataConnect, listPipelineStagesVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.pipelineStages);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListContactsByWorkspace
You can execute the `ListContactsByWorkspace` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListContactsByWorkspace(dc: DataConnect, vars: ListContactsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListContactsByWorkspaceData>): UseDataConnectQueryResult<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListContactsByWorkspace(vars: ListContactsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListContactsByWorkspaceData>): UseDataConnectQueryResult<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
```

### Variables
The `ListContactsByWorkspace` Query requires an argument of type `ListContactsByWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListContactsByWorkspaceVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that calling the `ListContactsByWorkspace` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListContactsByWorkspace` Query is of type `ListContactsByWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListContactsByWorkspace`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListContactsByWorkspaceVariables } from '@dataconnect/generated';
import { useListContactsByWorkspace } from '@dataconnect/generated/react'

export default function ListContactsByWorkspaceComponent() {
  // The `useListContactsByWorkspace` Query hook requires an argument of type `ListContactsByWorkspaceVariables`:
  const listContactsByWorkspaceVars: ListContactsByWorkspaceVariables = {
    workspaceId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListContactsByWorkspace(listContactsByWorkspaceVars);
  // Variables can be defined inline as well.
  const query = useListContactsByWorkspace({ workspaceId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListContactsByWorkspace(dataConnect, listContactsByWorkspaceVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListContactsByWorkspace(listContactsByWorkspaceVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListContactsByWorkspace(dataConnect, listContactsByWorkspaceVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.contacts);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListLeadsByWorkspace
You can execute the `ListLeadsByWorkspace` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListLeadsByWorkspace(dc: DataConnect, vars: ListLeadsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListLeadsByWorkspaceData>): UseDataConnectQueryResult<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListLeadsByWorkspace(vars: ListLeadsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListLeadsByWorkspaceData>): UseDataConnectQueryResult<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;
```

### Variables
The `ListLeadsByWorkspace` Query requires an argument of type `ListLeadsByWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListLeadsByWorkspaceVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that calling the `ListLeadsByWorkspace` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListLeadsByWorkspace` Query is of type `ListLeadsByWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListLeadsByWorkspace`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListLeadsByWorkspaceVariables } from '@dataconnect/generated';
import { useListLeadsByWorkspace } from '@dataconnect/generated/react'

export default function ListLeadsByWorkspaceComponent() {
  // The `useListLeadsByWorkspace` Query hook requires an argument of type `ListLeadsByWorkspaceVariables`:
  const listLeadsByWorkspaceVars: ListLeadsByWorkspaceVariables = {
    workspaceId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListLeadsByWorkspace(listLeadsByWorkspaceVars);
  // Variables can be defined inline as well.
  const query = useListLeadsByWorkspace({ workspaceId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListLeadsByWorkspace(dataConnect, listLeadsByWorkspaceVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListLeadsByWorkspace(listLeadsByWorkspaceVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListLeadsByWorkspace(dataConnect, listLeadsByWorkspaceVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.leads);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListDealsByWorkspace
You can execute the `ListDealsByWorkspace` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListDealsByWorkspace(dc: DataConnect, vars: ListDealsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListDealsByWorkspaceData>): UseDataConnectQueryResult<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListDealsByWorkspace(vars: ListDealsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListDealsByWorkspaceData>): UseDataConnectQueryResult<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
```

### Variables
The `ListDealsByWorkspace` Query requires an argument of type `ListDealsByWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListDealsByWorkspaceVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that calling the `ListDealsByWorkspace` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListDealsByWorkspace` Query is of type `ListDealsByWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListDealsByWorkspace`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListDealsByWorkspaceVariables } from '@dataconnect/generated';
import { useListDealsByWorkspace } from '@dataconnect/generated/react'

export default function ListDealsByWorkspaceComponent() {
  // The `useListDealsByWorkspace` Query hook requires an argument of type `ListDealsByWorkspaceVariables`:
  const listDealsByWorkspaceVars: ListDealsByWorkspaceVariables = {
    workspaceId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListDealsByWorkspace(listDealsByWorkspaceVars);
  // Variables can be defined inline as well.
  const query = useListDealsByWorkspace({ workspaceId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListDealsByWorkspace(dataConnect, listDealsByWorkspaceVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListDealsByWorkspace(listDealsByWorkspaceVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListDealsByWorkspace(dataConnect, listDealsByWorkspaceVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.deals);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListUsageEventsByWorkspace
You can execute the `ListUsageEventsByWorkspace` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListUsageEventsByWorkspace(dc: DataConnect, vars: ListUsageEventsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListUsageEventsByWorkspaceData>): UseDataConnectQueryResult<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListUsageEventsByWorkspace(vars: ListUsageEventsByWorkspaceVariables, options?: useDataConnectQueryOptions<ListUsageEventsByWorkspaceData>): UseDataConnectQueryResult<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;
```

### Variables
The `ListUsageEventsByWorkspace` Query requires an argument of type `ListUsageEventsByWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListUsageEventsByWorkspaceVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that calling the `ListUsageEventsByWorkspace` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListUsageEventsByWorkspace` Query is of type `ListUsageEventsByWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListUsageEventsByWorkspaceData {
  usageEvents: ({
    id: UUIDString;
    eventType: string;
    quantity: number;
    occurredAt: TimestampString;
  } & UsageEvent_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListUsageEventsByWorkspace`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListUsageEventsByWorkspaceVariables } from '@dataconnect/generated';
import { useListUsageEventsByWorkspace } from '@dataconnect/generated/react'

export default function ListUsageEventsByWorkspaceComponent() {
  // The `useListUsageEventsByWorkspace` Query hook requires an argument of type `ListUsageEventsByWorkspaceVariables`:
  const listUsageEventsByWorkspaceVars: ListUsageEventsByWorkspaceVariables = {
    workspaceId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListUsageEventsByWorkspace(listUsageEventsByWorkspaceVars);
  // Variables can be defined inline as well.
  const query = useListUsageEventsByWorkspace({ workspaceId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListUsageEventsByWorkspace(dataConnect, listUsageEventsByWorkspaceVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListUsageEventsByWorkspace(listUsageEventsByWorkspaceVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListUsageEventsByWorkspace(dataConnect, listUsageEventsByWorkspaceVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.usageEvents);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListQueuedEnrichmentJobs
You can execute the `ListQueuedEnrichmentJobs` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListQueuedEnrichmentJobs(dc: DataConnect, vars: ListQueuedEnrichmentJobsVariables, options?: useDataConnectQueryOptions<ListQueuedEnrichmentJobsData>): UseDataConnectQueryResult<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListQueuedEnrichmentJobs(vars: ListQueuedEnrichmentJobsVariables, options?: useDataConnectQueryOptions<ListQueuedEnrichmentJobsData>): UseDataConnectQueryResult<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;
```

### Variables
The `ListQueuedEnrichmentJobs` Query requires an argument of type `ListQueuedEnrichmentJobsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListQueuedEnrichmentJobsVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that calling the `ListQueuedEnrichmentJobs` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListQueuedEnrichmentJobs` Query is of type `ListQueuedEnrichmentJobsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListQueuedEnrichmentJobsData {
  enrichmentJobs: ({
    id: UUIDString;
    jobType: string;
    companyId?: UUIDString | null;
    payload: unknown;
    attempts: number;
  } & EnrichmentJob_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListQueuedEnrichmentJobs`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListQueuedEnrichmentJobsVariables } from '@dataconnect/generated';
import { useListQueuedEnrichmentJobs } from '@dataconnect/generated/react'

export default function ListQueuedEnrichmentJobsComponent() {
  // The `useListQueuedEnrichmentJobs` Query hook requires an argument of type `ListQueuedEnrichmentJobsVariables`:
  const listQueuedEnrichmentJobsVars: ListQueuedEnrichmentJobsVariables = {
    workspaceId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListQueuedEnrichmentJobs(listQueuedEnrichmentJobsVars);
  // Variables can be defined inline as well.
  const query = useListQueuedEnrichmentJobs({ workspaceId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListQueuedEnrichmentJobs(dataConnect, listQueuedEnrichmentJobsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListQueuedEnrichmentJobs(listQueuedEnrichmentJobsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListQueuedEnrichmentJobs(dataConnect, listQueuedEnrichmentJobsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.enrichmentJobs);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListStaleDeals
You can execute the `ListStaleDeals` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListStaleDeals(dc: DataConnect, vars: ListStaleDealsVariables, options?: useDataConnectQueryOptions<ListStaleDealsData>): UseDataConnectQueryResult<ListStaleDealsData, ListStaleDealsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListStaleDeals(vars: ListStaleDealsVariables, options?: useDataConnectQueryOptions<ListStaleDealsData>): UseDataConnectQueryResult<ListStaleDealsData, ListStaleDealsVariables>;
```

### Variables
The `ListStaleDeals` Query requires an argument of type `ListStaleDealsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListStaleDealsVariables {
  workspaceId: UUIDString;
  staleDate: TimestampString;
}
```
### Return Type
Recall that calling the `ListStaleDeals` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListStaleDeals` Query is of type `ListStaleDealsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListStaleDeals`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListStaleDealsVariables } from '@dataconnect/generated';
import { useListStaleDeals } from '@dataconnect/generated/react'

export default function ListStaleDealsComponent() {
  // The `useListStaleDeals` Query hook requires an argument of type `ListStaleDealsVariables`:
  const listStaleDealsVars: ListStaleDealsVariables = {
    workspaceId: ..., 
    staleDate: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListStaleDeals(listStaleDealsVars);
  // Variables can be defined inline as well.
  const query = useListStaleDeals({ workspaceId: ..., staleDate: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListStaleDeals(dataConnect, listStaleDealsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListStaleDeals(listStaleDealsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListStaleDeals(dataConnect, listStaleDealsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.deals);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## BootstrapWorkspace
You can execute the `BootstrapWorkspace` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useBootstrapWorkspace(options?: useDataConnectMutationOptions<BootstrapWorkspaceData, FirebaseError, BootstrapWorkspaceVariables>): UseDataConnectMutationResult<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useBootstrapWorkspace(dc: DataConnect, options?: useDataConnectMutationOptions<BootstrapWorkspaceData, FirebaseError, BootstrapWorkspaceVariables>): UseDataConnectMutationResult<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
```

### Variables
The `BootstrapWorkspace` Mutation requires an argument of type `BootstrapWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface BootstrapWorkspaceVariables {
  email: string;
  name: string;
  workspaceName: string;
  workspaceSlug: string;
}
```
### Return Type
Recall that calling the `BootstrapWorkspace` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `BootstrapWorkspace` Mutation is of type `BootstrapWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface BootstrapWorkspaceData {
  user_insert: User_Key;
  workspace_insert: Workspace_Key;
  workspaceMember_insert: WorkspaceMember_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `BootstrapWorkspace`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, BootstrapWorkspaceVariables } from '@dataconnect/generated';
import { useBootstrapWorkspace } from '@dataconnect/generated/react'

export default function BootstrapWorkspaceComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useBootstrapWorkspace();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useBootstrapWorkspace(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useBootstrapWorkspace(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useBootstrapWorkspace(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useBootstrapWorkspace` Mutation requires an argument of type `BootstrapWorkspaceVariables`:
  const bootstrapWorkspaceVars: BootstrapWorkspaceVariables = {
    email: ..., 
    name: ..., 
    workspaceName: ..., 
    workspaceSlug: ..., 
  };
  mutation.mutate(bootstrapWorkspaceVars);
  // Variables can be defined inline as well.
  mutation.mutate({ email: ..., name: ..., workspaceName: ..., workspaceSlug: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(bootstrapWorkspaceVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_insert);
    console.log(mutation.data.workspace_insert);
    console.log(mutation.data.workspaceMember_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateSavedList
You can execute the `CreateSavedList` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateSavedList(options?: useDataConnectMutationOptions<CreateSavedListData, FirebaseError, CreateSavedListVariables>): UseDataConnectMutationResult<CreateSavedListData, CreateSavedListVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateSavedList(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSavedListData, FirebaseError, CreateSavedListVariables>): UseDataConnectMutationResult<CreateSavedListData, CreateSavedListVariables>;
```

### Variables
The `CreateSavedList` Mutation requires an argument of type `CreateSavedListVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateSavedListVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  name: string;
}
```
### Return Type
Recall that calling the `CreateSavedList` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateSavedList` Mutation is of type `CreateSavedListData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateSavedListData {
  savedList_insert: SavedList_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateSavedList`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateSavedListVariables } from '@dataconnect/generated';
import { useCreateSavedList } from '@dataconnect/generated/react'

export default function CreateSavedListComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateSavedList();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateSavedList(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSavedList(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSavedList(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateSavedList` Mutation requires an argument of type `CreateSavedListVariables`:
  const createSavedListVars: CreateSavedListVariables = {
    id: ..., 
    workspaceId: ..., 
    name: ..., 
  };
  mutation.mutate(createSavedListVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., workspaceId: ..., name: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createSavedListVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.savedList_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertCompany
You can execute the `UpsertCompany` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertCompany(options?: useDataConnectMutationOptions<UpsertCompanyData, FirebaseError, UpsertCompanyVariables>): UseDataConnectMutationResult<UpsertCompanyData, UpsertCompanyVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertCompany(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompanyData, FirebaseError, UpsertCompanyVariables>): UseDataConnectMutationResult<UpsertCompanyData, UpsertCompanyVariables>;
```

### Variables
The `UpsertCompany` Mutation requires an argument of type `UpsertCompanyVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpsertCompany` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertCompany` Mutation is of type `UpsertCompanyData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertCompanyData {
  company_upsert: Company_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertCompany`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertCompanyVariables } from '@dataconnect/generated';
import { useUpsertCompany } from '@dataconnect/generated/react'

export default function UpsertCompanyComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertCompany();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertCompany(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCompany(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCompany(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertCompany` Mutation requires an argument of type `UpsertCompanyVariables`:
  const upsertCompanyVars: UpsertCompanyVariables = {
    id: ..., 
    workspaceId: ..., 
    legalName: ..., 
    tradeName: ..., 
    segment: ..., 
    city: ..., 
    region: ..., 
    country: ..., 
    phone: ..., // optional
    website: ..., // optional
  };
  mutation.mutate(upsertCompanyVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., workspaceId: ..., legalName: ..., tradeName: ..., segment: ..., city: ..., region: ..., country: ..., phone: ..., website: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertCompanyVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.company_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertLead
You can execute the `UpsertLead` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertLead(options?: useDataConnectMutationOptions<UpsertLeadData, FirebaseError, UpsertLeadVariables>): UseDataConnectMutationResult<UpsertLeadData, UpsertLeadVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertLead(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertLeadData, FirebaseError, UpsertLeadVariables>): UseDataConnectMutationResult<UpsertLeadData, UpsertLeadVariables>;
```

### Variables
The `UpsertLead` Mutation requires an argument of type `UpsertLeadVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertLeadVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  companyId: UUIDString;
  status: string;
  rank: number;
  score: number;
  source?: string | null;
}
```
### Return Type
Recall that calling the `UpsertLead` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertLead` Mutation is of type `UpsertLeadData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertLeadData {
  lead_upsert: Lead_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertLead`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertLeadVariables } from '@dataconnect/generated';
import { useUpsertLead } from '@dataconnect/generated/react'

export default function UpsertLeadComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertLead();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertLead(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertLead(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertLead(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertLead` Mutation requires an argument of type `UpsertLeadVariables`:
  const upsertLeadVars: UpsertLeadVariables = {
    id: ..., 
    workspaceId: ..., 
    companyId: ..., 
    status: ..., 
    rank: ..., 
    score: ..., 
    source: ..., // optional
  };
  mutation.mutate(upsertLeadVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., workspaceId: ..., companyId: ..., status: ..., rank: ..., score: ..., source: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertLeadVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.lead_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AddLeadToSavedList
You can execute the `AddLeadToSavedList` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAddLeadToSavedList(options?: useDataConnectMutationOptions<AddLeadToSavedListData, FirebaseError, AddLeadToSavedListVariables>): UseDataConnectMutationResult<AddLeadToSavedListData, AddLeadToSavedListVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAddLeadToSavedList(dc: DataConnect, options?: useDataConnectMutationOptions<AddLeadToSavedListData, FirebaseError, AddLeadToSavedListVariables>): UseDataConnectMutationResult<AddLeadToSavedListData, AddLeadToSavedListVariables>;
```

### Variables
The `AddLeadToSavedList` Mutation requires an argument of type `AddLeadToSavedListVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AddLeadToSavedListVariables {
  listId: UUIDString;
  leadId: UUIDString;
}
```
### Return Type
Recall that calling the `AddLeadToSavedList` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AddLeadToSavedList` Mutation is of type `AddLeadToSavedListData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AddLeadToSavedListData {
  savedListItem_upsert: SavedListItem_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AddLeadToSavedList`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AddLeadToSavedListVariables } from '@dataconnect/generated';
import { useAddLeadToSavedList } from '@dataconnect/generated/react'

export default function AddLeadToSavedListComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAddLeadToSavedList();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAddLeadToSavedList(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddLeadToSavedList(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddLeadToSavedList(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAddLeadToSavedList` Mutation requires an argument of type `AddLeadToSavedListVariables`:
  const addLeadToSavedListVars: AddLeadToSavedListVariables = {
    listId: ..., 
    leadId: ..., 
  };
  mutation.mutate(addLeadToSavedListVars);
  // Variables can be defined inline as well.
  mutation.mutate({ listId: ..., leadId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(addLeadToSavedListVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.savedListItem_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteSavedList
You can execute the `DeleteSavedList` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteSavedList(options?: useDataConnectMutationOptions<DeleteSavedListData, FirebaseError, DeleteSavedListVariables>): UseDataConnectMutationResult<DeleteSavedListData, DeleteSavedListVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteSavedList(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSavedListData, FirebaseError, DeleteSavedListVariables>): UseDataConnectMutationResult<DeleteSavedListData, DeleteSavedListVariables>;
```

### Variables
The `DeleteSavedList` Mutation requires an argument of type `DeleteSavedListVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteSavedListVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteSavedList` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteSavedList` Mutation is of type `DeleteSavedListData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteSavedListData {
  savedList_delete?: SavedList_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteSavedList`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteSavedListVariables } from '@dataconnect/generated';
import { useDeleteSavedList } from '@dataconnect/generated/react'

export default function DeleteSavedListComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteSavedList();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteSavedList(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSavedList(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSavedList(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteSavedList` Mutation requires an argument of type `DeleteSavedListVariables`:
  const deleteSavedListVars: DeleteSavedListVariables = {
    id: ..., 
  };
  mutation.mutate(deleteSavedListVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteSavedListVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.savedList_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertPipeline
You can execute the `UpsertPipeline` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertPipeline(options?: useDataConnectMutationOptions<UpsertPipelineData, FirebaseError, UpsertPipelineVariables>): UseDataConnectMutationResult<UpsertPipelineData, UpsertPipelineVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertPipeline(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertPipelineData, FirebaseError, UpsertPipelineVariables>): UseDataConnectMutationResult<UpsertPipelineData, UpsertPipelineVariables>;
```

### Variables
The `UpsertPipeline` Mutation requires an argument of type `UpsertPipelineVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertPipelineVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  name: string;
  isDefault?: boolean | null;
}
```
### Return Type
Recall that calling the `UpsertPipeline` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertPipeline` Mutation is of type `UpsertPipelineData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertPipelineData {
  pipeline_upsert: Pipeline_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertPipeline`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertPipelineVariables } from '@dataconnect/generated';
import { useUpsertPipeline } from '@dataconnect/generated/react'

export default function UpsertPipelineComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertPipeline();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertPipeline(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertPipeline(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertPipeline(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertPipeline` Mutation requires an argument of type `UpsertPipelineVariables`:
  const upsertPipelineVars: UpsertPipelineVariables = {
    id: ..., 
    workspaceId: ..., 
    name: ..., 
    isDefault: ..., // optional
  };
  mutation.mutate(upsertPipelineVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., workspaceId: ..., name: ..., isDefault: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertPipelineVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.pipeline_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertPipelineStage
You can execute the `UpsertPipelineStage` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertPipelineStage(options?: useDataConnectMutationOptions<UpsertPipelineStageData, FirebaseError, UpsertPipelineStageVariables>): UseDataConnectMutationResult<UpsertPipelineStageData, UpsertPipelineStageVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertPipelineStage(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertPipelineStageData, FirebaseError, UpsertPipelineStageVariables>): UseDataConnectMutationResult<UpsertPipelineStageData, UpsertPipelineStageVariables>;
```

### Variables
The `UpsertPipelineStage` Mutation requires an argument of type `UpsertPipelineStageVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertPipelineStageVariables {
  id: UUIDString;
  pipelineId: UUIDString;
  name: string;
  sortOrder: number;
  color: string;
}
```
### Return Type
Recall that calling the `UpsertPipelineStage` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertPipelineStage` Mutation is of type `UpsertPipelineStageData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertPipelineStageData {
  pipelineStage_upsert: PipelineStage_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertPipelineStage`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertPipelineStageVariables } from '@dataconnect/generated';
import { useUpsertPipelineStage } from '@dataconnect/generated/react'

export default function UpsertPipelineStageComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertPipelineStage();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertPipelineStage(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertPipelineStage(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertPipelineStage(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertPipelineStage` Mutation requires an argument of type `UpsertPipelineStageVariables`:
  const upsertPipelineStageVars: UpsertPipelineStageVariables = {
    id: ..., 
    pipelineId: ..., 
    name: ..., 
    sortOrder: ..., 
    color: ..., 
  };
  mutation.mutate(upsertPipelineStageVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., pipelineId: ..., name: ..., sortOrder: ..., color: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertPipelineStageVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.pipelineStage_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertDeal
You can execute the `UpsertDeal` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertDeal(options?: useDataConnectMutationOptions<UpsertDealData, FirebaseError, UpsertDealVariables>): UseDataConnectMutationResult<UpsertDealData, UpsertDealVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertDeal(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertDealData, FirebaseError, UpsertDealVariables>): UseDataConnectMutationResult<UpsertDealData, UpsertDealVariables>;
```

### Variables
The `UpsertDeal` Mutation requires an argument of type `UpsertDealVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpsertDeal` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertDeal` Mutation is of type `UpsertDealData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertDealData {
  deal_upsert: Deal_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertDeal`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertDealVariables } from '@dataconnect/generated';
import { useUpsertDeal } from '@dataconnect/generated/react'

export default function UpsertDealComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertDeal();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertDeal(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertDeal(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertDeal(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertDeal` Mutation requires an argument of type `UpsertDealVariables`:
  const upsertDealVars: UpsertDealVariables = {
    id: ..., 
    workspaceId: ..., 
    pipelineId: ..., 
    stageId: ..., 
    title: ..., 
    companyId: ..., // optional
    value: ..., // optional
    priority: ..., 
    nextStep: ..., // optional
    notes: ..., // optional
    payload: ..., 
  };
  mutation.mutate(upsertDealVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., workspaceId: ..., pipelineId: ..., stageId: ..., title: ..., companyId: ..., value: ..., priority: ..., nextStep: ..., notes: ..., payload: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertDealVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.deal_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteDeal
You can execute the `DeleteDeal` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteDeal(options?: useDataConnectMutationOptions<DeleteDealData, FirebaseError, DeleteDealVariables>): UseDataConnectMutationResult<DeleteDealData, DeleteDealVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteDeal(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteDealData, FirebaseError, DeleteDealVariables>): UseDataConnectMutationResult<DeleteDealData, DeleteDealVariables>;
```

### Variables
The `DeleteDeal` Mutation requires an argument of type `DeleteDealVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteDealVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteDeal` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteDeal` Mutation is of type `DeleteDealData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteDealData {
  deal_delete?: Deal_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteDeal`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteDealVariables } from '@dataconnect/generated';
import { useDeleteDeal } from '@dataconnect/generated/react'

export default function DeleteDealComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteDeal();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteDeal(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteDeal(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteDeal(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteDeal` Mutation requires an argument of type `DeleteDealVariables`:
  const deleteDealVars: DeleteDealVariables = {
    id: ..., 
  };
  mutation.mutate(deleteDealVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteDealVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.deal_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateUsageEvent
You can execute the `CreateUsageEvent` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateUsageEvent(options?: useDataConnectMutationOptions<CreateUsageEventData, FirebaseError, CreateUsageEventVariables>): UseDataConnectMutationResult<CreateUsageEventData, CreateUsageEventVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateUsageEvent(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUsageEventData, FirebaseError, CreateUsageEventVariables>): UseDataConnectMutationResult<CreateUsageEventData, CreateUsageEventVariables>;
```

### Variables
The `CreateUsageEvent` Mutation requires an argument of type `CreateUsageEventVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateUsageEventVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  userId?: UUIDString | null;
  eventType: string;
  source?: string | null;
  quantity: number;
  metadata: unknown;
}
```
### Return Type
Recall that calling the `CreateUsageEvent` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateUsageEvent` Mutation is of type `CreateUsageEventData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateUsageEventData {
  usageEvent_insert: UsageEvent_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateUsageEvent`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateUsageEventVariables } from '@dataconnect/generated';
import { useCreateUsageEvent } from '@dataconnect/generated/react'

export default function CreateUsageEventComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateUsageEvent();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateUsageEvent(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUsageEvent(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUsageEvent(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateUsageEvent` Mutation requires an argument of type `CreateUsageEventVariables`:
  const createUsageEventVars: CreateUsageEventVariables = {
    id: ..., 
    workspaceId: ..., 
    userId: ..., // optional
    eventType: ..., 
    source: ..., // optional
    quantity: ..., 
    metadata: ..., 
  };
  mutation.mutate(createUsageEventVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., workspaceId: ..., userId: ..., eventType: ..., source: ..., quantity: ..., metadata: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createUsageEventVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.usageEvent_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertEnrichmentJob
You can execute the `UpsertEnrichmentJob` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertEnrichmentJob(options?: useDataConnectMutationOptions<UpsertEnrichmentJobData, FirebaseError, UpsertEnrichmentJobVariables>): UseDataConnectMutationResult<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertEnrichmentJob(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertEnrichmentJobData, FirebaseError, UpsertEnrichmentJobVariables>): UseDataConnectMutationResult<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;
```

### Variables
The `UpsertEnrichmentJob` Mutation requires an argument of type `UpsertEnrichmentJobVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertEnrichmentJobVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  companyId?: UUIDString | null;
  jobType: string;
  payload: unknown;
}
```
### Return Type
Recall that calling the `UpsertEnrichmentJob` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertEnrichmentJob` Mutation is of type `UpsertEnrichmentJobData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertEnrichmentJobData {
  enrichmentJob_upsert: EnrichmentJob_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertEnrichmentJob`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertEnrichmentJobVariables } from '@dataconnect/generated';
import { useUpsertEnrichmentJob } from '@dataconnect/generated/react'

export default function UpsertEnrichmentJobComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertEnrichmentJob();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertEnrichmentJob(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertEnrichmentJob(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertEnrichmentJob(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertEnrichmentJob` Mutation requires an argument of type `UpsertEnrichmentJobVariables`:
  const upsertEnrichmentJobVars: UpsertEnrichmentJobVariables = {
    id: ..., 
    workspaceId: ..., 
    companyId: ..., // optional
    jobType: ..., 
    payload: ..., 
  };
  mutation.mutate(upsertEnrichmentJobVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., workspaceId: ..., companyId: ..., jobType: ..., payload: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertEnrichmentJobVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.enrichmentJob_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateEnrichmentJobStatus
You can execute the `UpdateEnrichmentJobStatus` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEnrichmentJobStatus(options?: useDataConnectMutationOptions<UpdateEnrichmentJobStatusData, FirebaseError, UpdateEnrichmentJobStatusVariables>): UseDataConnectMutationResult<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEnrichmentJobStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEnrichmentJobStatusData, FirebaseError, UpdateEnrichmentJobStatusVariables>): UseDataConnectMutationResult<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;
```

### Variables
The `UpdateEnrichmentJobStatus` Mutation requires an argument of type `UpdateEnrichmentJobStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateEnrichmentJobStatusVariables {
  id: UUIDString;
  status: string;
  result: unknown;
  errorMessage?: string | null;
}
```
### Return Type
Recall that calling the `UpdateEnrichmentJobStatus` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEnrichmentJobStatus` Mutation is of type `UpdateEnrichmentJobStatusData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEnrichmentJobStatusData {
  enrichmentJob_update?: EnrichmentJob_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEnrichmentJobStatus`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEnrichmentJobStatusVariables } from '@dataconnect/generated';
import { useUpdateEnrichmentJobStatus } from '@dataconnect/generated/react'

export default function UpdateEnrichmentJobStatusComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEnrichmentJobStatus();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEnrichmentJobStatus(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEnrichmentJobStatus(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEnrichmentJobStatus(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEnrichmentJobStatus` Mutation requires an argument of type `UpdateEnrichmentJobStatusVariables`:
  const updateEnrichmentJobStatusVars: UpdateEnrichmentJobStatusVariables = {
    id: ..., 
    status: ..., 
    result: ..., 
    errorMessage: ..., // optional
  };
  mutation.mutate(updateEnrichmentJobStatusVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., status: ..., result: ..., errorMessage: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEnrichmentJobStatusVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.enrichmentJob_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

