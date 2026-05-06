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
  - [*ListDealsByWorkspace*](#listdealsbyworkspace)
- [**Mutations**](#mutations)
  - [*BootstrapWorkspace*](#bootstrapworkspace)

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

