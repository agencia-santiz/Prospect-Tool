# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
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

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUserByAuthUid
You can execute the `GetCurrentUserByAuthUid` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCurrentUserByAuthUid(vars: GetCurrentUserByAuthUidVariables): QueryPromise<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;

interface GetCurrentUserByAuthUidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCurrentUserByAuthUidVariables): QueryRef<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
}
export const getCurrentUserByAuthUidRef: GetCurrentUserByAuthUidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUserByAuthUid(dc: DataConnect, vars: GetCurrentUserByAuthUidVariables): QueryPromise<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;

interface GetCurrentUserByAuthUidRef {
  ...
  (dc: DataConnect, vars: GetCurrentUserByAuthUidVariables): QueryRef<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
}
export const getCurrentUserByAuthUidRef: GetCurrentUserByAuthUidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserByAuthUidRef:
```typescript
const name = getCurrentUserByAuthUidRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentUserByAuthUid` query requires an argument of type `GetCurrentUserByAuthUidVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCurrentUserByAuthUidVariables {
  authUid: string;
}
```
### Return Type
Recall that executing the `GetCurrentUserByAuthUid` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserByAuthUidData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetCurrentUserByAuthUid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserByAuthUid, GetCurrentUserByAuthUidVariables } from '@dataconnect/generated';

// The `GetCurrentUserByAuthUid` query requires an argument of type `GetCurrentUserByAuthUidVariables`:
const getCurrentUserByAuthUidVars: GetCurrentUserByAuthUidVariables = {
  authUid: ..., 
};

// Call the `getCurrentUserByAuthUid()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUserByAuthUid(getCurrentUserByAuthUidVars);
// Variables can be defined inline as well.
const { data } = await getCurrentUserByAuthUid({ authUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUserByAuthUid(dataConnect, getCurrentUserByAuthUidVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getCurrentUserByAuthUid(getCurrentUserByAuthUidVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetCurrentUserByAuthUid`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserByAuthUidRef, GetCurrentUserByAuthUidVariables } from '@dataconnect/generated';

// The `GetCurrentUserByAuthUid` query requires an argument of type `GetCurrentUserByAuthUidVariables`:
const getCurrentUserByAuthUidVars: GetCurrentUserByAuthUidVariables = {
  authUid: ..., 
};

// Call the `getCurrentUserByAuthUidRef()` function to get a reference to the query.
const ref = getCurrentUserByAuthUidRef(getCurrentUserByAuthUidVars);
// Variables can be defined inline as well.
const ref = getCurrentUserByAuthUidRef({ authUid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserByAuthUidRef(dataConnect, getCurrentUserByAuthUidVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetWorkspaceBySlug
You can execute the `GetWorkspaceBySlug` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getWorkspaceBySlug(vars: GetWorkspaceBySlugVariables): QueryPromise<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;

interface GetWorkspaceBySlugRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkspaceBySlugVariables): QueryRef<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
}
export const getWorkspaceBySlugRef: GetWorkspaceBySlugRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWorkspaceBySlug(dc: DataConnect, vars: GetWorkspaceBySlugVariables): QueryPromise<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;

interface GetWorkspaceBySlugRef {
  ...
  (dc: DataConnect, vars: GetWorkspaceBySlugVariables): QueryRef<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
}
export const getWorkspaceBySlugRef: GetWorkspaceBySlugRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWorkspaceBySlugRef:
```typescript
const name = getWorkspaceBySlugRef.operationName;
console.log(name);
```

### Variables
The `GetWorkspaceBySlug` query requires an argument of type `GetWorkspaceBySlugVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWorkspaceBySlugVariables {
  slug: string;
}
```
### Return Type
Recall that executing the `GetWorkspaceBySlug` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWorkspaceBySlugData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetWorkspaceBySlug`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWorkspaceBySlug, GetWorkspaceBySlugVariables } from '@dataconnect/generated';

// The `GetWorkspaceBySlug` query requires an argument of type `GetWorkspaceBySlugVariables`:
const getWorkspaceBySlugVars: GetWorkspaceBySlugVariables = {
  slug: ..., 
};

// Call the `getWorkspaceBySlug()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWorkspaceBySlug(getWorkspaceBySlugVars);
// Variables can be defined inline as well.
const { data } = await getWorkspaceBySlug({ slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWorkspaceBySlug(dataConnect, getWorkspaceBySlugVars);

console.log(data.workspaces);

// Or, you can use the `Promise` API.
getWorkspaceBySlug(getWorkspaceBySlugVars).then((response) => {
  const data = response.data;
  console.log(data.workspaces);
});
```

### Using `GetWorkspaceBySlug`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWorkspaceBySlugRef, GetWorkspaceBySlugVariables } from '@dataconnect/generated';

// The `GetWorkspaceBySlug` query requires an argument of type `GetWorkspaceBySlugVariables`:
const getWorkspaceBySlugVars: GetWorkspaceBySlugVariables = {
  slug: ..., 
};

// Call the `getWorkspaceBySlugRef()` function to get a reference to the query.
const ref = getWorkspaceBySlugRef(getWorkspaceBySlugVars);
// Variables can be defined inline as well.
const ref = getWorkspaceBySlugRef({ slug: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWorkspaceBySlugRef(dataConnect, getWorkspaceBySlugVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workspaces);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workspaces);
});
```

## ListWorkspaceMembers
You can execute the `ListWorkspaceMembers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listWorkspaceMembers(vars: ListWorkspaceMembersVariables): QueryPromise<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;

interface ListWorkspaceMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListWorkspaceMembersVariables): QueryRef<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
}
export const listWorkspaceMembersRef: ListWorkspaceMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listWorkspaceMembers(dc: DataConnect, vars: ListWorkspaceMembersVariables): QueryPromise<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;

interface ListWorkspaceMembersRef {
  ...
  (dc: DataConnect, vars: ListWorkspaceMembersVariables): QueryRef<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
}
export const listWorkspaceMembersRef: ListWorkspaceMembersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listWorkspaceMembersRef:
```typescript
const name = listWorkspaceMembersRef.operationName;
console.log(name);
```

### Variables
The `ListWorkspaceMembers` query requires an argument of type `ListWorkspaceMembersVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListWorkspaceMembersVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that executing the `ListWorkspaceMembers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListWorkspaceMembersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListWorkspaceMembers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listWorkspaceMembers, ListWorkspaceMembersVariables } from '@dataconnect/generated';

// The `ListWorkspaceMembers` query requires an argument of type `ListWorkspaceMembersVariables`:
const listWorkspaceMembersVars: ListWorkspaceMembersVariables = {
  workspaceId: ..., 
};

// Call the `listWorkspaceMembers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listWorkspaceMembers(listWorkspaceMembersVars);
// Variables can be defined inline as well.
const { data } = await listWorkspaceMembers({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listWorkspaceMembers(dataConnect, listWorkspaceMembersVars);

console.log(data.workspaceMembers);

// Or, you can use the `Promise` API.
listWorkspaceMembers(listWorkspaceMembersVars).then((response) => {
  const data = response.data;
  console.log(data.workspaceMembers);
});
```

### Using `ListWorkspaceMembers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listWorkspaceMembersRef, ListWorkspaceMembersVariables } from '@dataconnect/generated';

// The `ListWorkspaceMembers` query requires an argument of type `ListWorkspaceMembersVariables`:
const listWorkspaceMembersVars: ListWorkspaceMembersVariables = {
  workspaceId: ..., 
};

// Call the `listWorkspaceMembersRef()` function to get a reference to the query.
const ref = listWorkspaceMembersRef(listWorkspaceMembersVars);
// Variables can be defined inline as well.
const ref = listWorkspaceMembersRef({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listWorkspaceMembersRef(dataConnect, listWorkspaceMembersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workspaceMembers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workspaceMembers);
});
```

## ListSavedLists
You can execute the `ListSavedLists` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSavedLists(vars: ListSavedListsVariables): QueryPromise<ListSavedListsData, ListSavedListsVariables>;

interface ListSavedListsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSavedListsVariables): QueryRef<ListSavedListsData, ListSavedListsVariables>;
}
export const listSavedListsRef: ListSavedListsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSavedLists(dc: DataConnect, vars: ListSavedListsVariables): QueryPromise<ListSavedListsData, ListSavedListsVariables>;

interface ListSavedListsRef {
  ...
  (dc: DataConnect, vars: ListSavedListsVariables): QueryRef<ListSavedListsData, ListSavedListsVariables>;
}
export const listSavedListsRef: ListSavedListsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSavedListsRef:
```typescript
const name = listSavedListsRef.operationName;
console.log(name);
```

### Variables
The `ListSavedLists` query requires an argument of type `ListSavedListsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSavedListsVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that executing the `ListSavedLists` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSavedListsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListSavedLists`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSavedLists, ListSavedListsVariables } from '@dataconnect/generated';

// The `ListSavedLists` query requires an argument of type `ListSavedListsVariables`:
const listSavedListsVars: ListSavedListsVariables = {
  workspaceId: ..., 
};

// Call the `listSavedLists()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSavedLists(listSavedListsVars);
// Variables can be defined inline as well.
const { data } = await listSavedLists({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSavedLists(dataConnect, listSavedListsVars);

console.log(data.savedLists);

// Or, you can use the `Promise` API.
listSavedLists(listSavedListsVars).then((response) => {
  const data = response.data;
  console.log(data.savedLists);
});
```

### Using `ListSavedLists`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSavedListsRef, ListSavedListsVariables } from '@dataconnect/generated';

// The `ListSavedLists` query requires an argument of type `ListSavedListsVariables`:
const listSavedListsVars: ListSavedListsVariables = {
  workspaceId: ..., 
};

// Call the `listSavedListsRef()` function to get a reference to the query.
const ref = listSavedListsRef(listSavedListsVars);
// Variables can be defined inline as well.
const ref = listSavedListsRef({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSavedListsRef(dataConnect, listSavedListsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.savedLists);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.savedLists);
});
```

## ListPipelineOverview
You can execute the `ListPipelineOverview` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPipelineOverview(vars: ListPipelineOverviewVariables): QueryPromise<ListPipelineOverviewData, ListPipelineOverviewVariables>;

interface ListPipelineOverviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPipelineOverviewVariables): QueryRef<ListPipelineOverviewData, ListPipelineOverviewVariables>;
}
export const listPipelineOverviewRef: ListPipelineOverviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPipelineOverview(dc: DataConnect, vars: ListPipelineOverviewVariables): QueryPromise<ListPipelineOverviewData, ListPipelineOverviewVariables>;

interface ListPipelineOverviewRef {
  ...
  (dc: DataConnect, vars: ListPipelineOverviewVariables): QueryRef<ListPipelineOverviewData, ListPipelineOverviewVariables>;
}
export const listPipelineOverviewRef: ListPipelineOverviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPipelineOverviewRef:
```typescript
const name = listPipelineOverviewRef.operationName;
console.log(name);
```

### Variables
The `ListPipelineOverview` query requires an argument of type `ListPipelineOverviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPipelineOverviewVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that executing the `ListPipelineOverview` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPipelineOverviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListPipelineOverview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPipelineOverview, ListPipelineOverviewVariables } from '@dataconnect/generated';

// The `ListPipelineOverview` query requires an argument of type `ListPipelineOverviewVariables`:
const listPipelineOverviewVars: ListPipelineOverviewVariables = {
  workspaceId: ..., 
};

// Call the `listPipelineOverview()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPipelineOverview(listPipelineOverviewVars);
// Variables can be defined inline as well.
const { data } = await listPipelineOverview({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPipelineOverview(dataConnect, listPipelineOverviewVars);

console.log(data.pipelines);

// Or, you can use the `Promise` API.
listPipelineOverview(listPipelineOverviewVars).then((response) => {
  const data = response.data;
  console.log(data.pipelines);
});
```

### Using `ListPipelineOverview`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPipelineOverviewRef, ListPipelineOverviewVariables } from '@dataconnect/generated';

// The `ListPipelineOverview` query requires an argument of type `ListPipelineOverviewVariables`:
const listPipelineOverviewVars: ListPipelineOverviewVariables = {
  workspaceId: ..., 
};

// Call the `listPipelineOverviewRef()` function to get a reference to the query.
const ref = listPipelineOverviewRef(listPipelineOverviewVars);
// Variables can be defined inline as well.
const ref = listPipelineOverviewRef({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPipelineOverviewRef(dataConnect, listPipelineOverviewVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.pipelines);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.pipelines);
});
```

## ListPipelineStages
You can execute the `ListPipelineStages` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPipelineStages(vars: ListPipelineStagesVariables): QueryPromise<ListPipelineStagesData, ListPipelineStagesVariables>;

interface ListPipelineStagesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPipelineStagesVariables): QueryRef<ListPipelineStagesData, ListPipelineStagesVariables>;
}
export const listPipelineStagesRef: ListPipelineStagesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPipelineStages(dc: DataConnect, vars: ListPipelineStagesVariables): QueryPromise<ListPipelineStagesData, ListPipelineStagesVariables>;

interface ListPipelineStagesRef {
  ...
  (dc: DataConnect, vars: ListPipelineStagesVariables): QueryRef<ListPipelineStagesData, ListPipelineStagesVariables>;
}
export const listPipelineStagesRef: ListPipelineStagesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPipelineStagesRef:
```typescript
const name = listPipelineStagesRef.operationName;
console.log(name);
```

### Variables
The `ListPipelineStages` query requires an argument of type `ListPipelineStagesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPipelineStagesVariables {
  pipelineId: UUIDString;
}
```
### Return Type
Recall that executing the `ListPipelineStages` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPipelineStagesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListPipelineStages`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPipelineStages, ListPipelineStagesVariables } from '@dataconnect/generated';

// The `ListPipelineStages` query requires an argument of type `ListPipelineStagesVariables`:
const listPipelineStagesVars: ListPipelineStagesVariables = {
  pipelineId: ..., 
};

// Call the `listPipelineStages()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPipelineStages(listPipelineStagesVars);
// Variables can be defined inline as well.
const { data } = await listPipelineStages({ pipelineId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPipelineStages(dataConnect, listPipelineStagesVars);

console.log(data.pipelineStages);

// Or, you can use the `Promise` API.
listPipelineStages(listPipelineStagesVars).then((response) => {
  const data = response.data;
  console.log(data.pipelineStages);
});
```

### Using `ListPipelineStages`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPipelineStagesRef, ListPipelineStagesVariables } from '@dataconnect/generated';

// The `ListPipelineStages` query requires an argument of type `ListPipelineStagesVariables`:
const listPipelineStagesVars: ListPipelineStagesVariables = {
  pipelineId: ..., 
};

// Call the `listPipelineStagesRef()` function to get a reference to the query.
const ref = listPipelineStagesRef(listPipelineStagesVars);
// Variables can be defined inline as well.
const ref = listPipelineStagesRef({ pipelineId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPipelineStagesRef(dataConnect, listPipelineStagesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.pipelineStages);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.pipelineStages);
});
```

## ListContactsByWorkspace
You can execute the `ListContactsByWorkspace` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listContactsByWorkspace(vars: ListContactsByWorkspaceVariables): QueryPromise<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;

interface ListContactsByWorkspaceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListContactsByWorkspaceVariables): QueryRef<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
}
export const listContactsByWorkspaceRef: ListContactsByWorkspaceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listContactsByWorkspace(dc: DataConnect, vars: ListContactsByWorkspaceVariables): QueryPromise<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;

interface ListContactsByWorkspaceRef {
  ...
  (dc: DataConnect, vars: ListContactsByWorkspaceVariables): QueryRef<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
}
export const listContactsByWorkspaceRef: ListContactsByWorkspaceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listContactsByWorkspaceRef:
```typescript
const name = listContactsByWorkspaceRef.operationName;
console.log(name);
```

### Variables
The `ListContactsByWorkspace` query requires an argument of type `ListContactsByWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListContactsByWorkspaceVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that executing the `ListContactsByWorkspace` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListContactsByWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListContactsByWorkspace`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listContactsByWorkspace, ListContactsByWorkspaceVariables } from '@dataconnect/generated';

// The `ListContactsByWorkspace` query requires an argument of type `ListContactsByWorkspaceVariables`:
const listContactsByWorkspaceVars: ListContactsByWorkspaceVariables = {
  workspaceId: ..., 
};

// Call the `listContactsByWorkspace()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listContactsByWorkspace(listContactsByWorkspaceVars);
// Variables can be defined inline as well.
const { data } = await listContactsByWorkspace({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listContactsByWorkspace(dataConnect, listContactsByWorkspaceVars);

console.log(data.contacts);

// Or, you can use the `Promise` API.
listContactsByWorkspace(listContactsByWorkspaceVars).then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

### Using `ListContactsByWorkspace`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listContactsByWorkspaceRef, ListContactsByWorkspaceVariables } from '@dataconnect/generated';

// The `ListContactsByWorkspace` query requires an argument of type `ListContactsByWorkspaceVariables`:
const listContactsByWorkspaceVars: ListContactsByWorkspaceVariables = {
  workspaceId: ..., 
};

// Call the `listContactsByWorkspaceRef()` function to get a reference to the query.
const ref = listContactsByWorkspaceRef(listContactsByWorkspaceVars);
// Variables can be defined inline as well.
const ref = listContactsByWorkspaceRef({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listContactsByWorkspaceRef(dataConnect, listContactsByWorkspaceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contacts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

## ListLeadsByWorkspace
You can execute the `ListLeadsByWorkspace` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listLeadsByWorkspace(vars: ListLeadsByWorkspaceVariables): QueryPromise<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;

interface ListLeadsByWorkspaceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListLeadsByWorkspaceVariables): QueryRef<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;
}
export const listLeadsByWorkspaceRef: ListLeadsByWorkspaceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listLeadsByWorkspace(dc: DataConnect, vars: ListLeadsByWorkspaceVariables): QueryPromise<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;

interface ListLeadsByWorkspaceRef {
  ...
  (dc: DataConnect, vars: ListLeadsByWorkspaceVariables): QueryRef<ListLeadsByWorkspaceData, ListLeadsByWorkspaceVariables>;
}
export const listLeadsByWorkspaceRef: ListLeadsByWorkspaceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listLeadsByWorkspaceRef:
```typescript
const name = listLeadsByWorkspaceRef.operationName;
console.log(name);
```

### Variables
The `ListLeadsByWorkspace` query requires an argument of type `ListLeadsByWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListLeadsByWorkspaceVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that executing the `ListLeadsByWorkspace` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListLeadsByWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListLeadsByWorkspace`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listLeadsByWorkspace, ListLeadsByWorkspaceVariables } from '@dataconnect/generated';

// The `ListLeadsByWorkspace` query requires an argument of type `ListLeadsByWorkspaceVariables`:
const listLeadsByWorkspaceVars: ListLeadsByWorkspaceVariables = {
  workspaceId: ..., 
};

// Call the `listLeadsByWorkspace()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listLeadsByWorkspace(listLeadsByWorkspaceVars);
// Variables can be defined inline as well.
const { data } = await listLeadsByWorkspace({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listLeadsByWorkspace(dataConnect, listLeadsByWorkspaceVars);

console.log(data.leads);

// Or, you can use the `Promise` API.
listLeadsByWorkspace(listLeadsByWorkspaceVars).then((response) => {
  const data = response.data;
  console.log(data.leads);
});
```

### Using `ListLeadsByWorkspace`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listLeadsByWorkspaceRef, ListLeadsByWorkspaceVariables } from '@dataconnect/generated';

// The `ListLeadsByWorkspace` query requires an argument of type `ListLeadsByWorkspaceVariables`:
const listLeadsByWorkspaceVars: ListLeadsByWorkspaceVariables = {
  workspaceId: ..., 
};

// Call the `listLeadsByWorkspaceRef()` function to get a reference to the query.
const ref = listLeadsByWorkspaceRef(listLeadsByWorkspaceVars);
// Variables can be defined inline as well.
const ref = listLeadsByWorkspaceRef({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listLeadsByWorkspaceRef(dataConnect, listLeadsByWorkspaceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.leads);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.leads);
});
```

## ListDealsByWorkspace
You can execute the `ListDealsByWorkspace` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listDealsByWorkspace(vars: ListDealsByWorkspaceVariables): QueryPromise<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;

interface ListDealsByWorkspaceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDealsByWorkspaceVariables): QueryRef<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
}
export const listDealsByWorkspaceRef: ListDealsByWorkspaceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDealsByWorkspace(dc: DataConnect, vars: ListDealsByWorkspaceVariables): QueryPromise<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;

interface ListDealsByWorkspaceRef {
  ...
  (dc: DataConnect, vars: ListDealsByWorkspaceVariables): QueryRef<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
}
export const listDealsByWorkspaceRef: ListDealsByWorkspaceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDealsByWorkspaceRef:
```typescript
const name = listDealsByWorkspaceRef.operationName;
console.log(name);
```

### Variables
The `ListDealsByWorkspace` query requires an argument of type `ListDealsByWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListDealsByWorkspaceVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that executing the `ListDealsByWorkspace` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDealsByWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListDealsByWorkspace`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDealsByWorkspace, ListDealsByWorkspaceVariables } from '@dataconnect/generated';

// The `ListDealsByWorkspace` query requires an argument of type `ListDealsByWorkspaceVariables`:
const listDealsByWorkspaceVars: ListDealsByWorkspaceVariables = {
  workspaceId: ..., 
};

// Call the `listDealsByWorkspace()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDealsByWorkspace(listDealsByWorkspaceVars);
// Variables can be defined inline as well.
const { data } = await listDealsByWorkspace({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDealsByWorkspace(dataConnect, listDealsByWorkspaceVars);

console.log(data.deals);

// Or, you can use the `Promise` API.
listDealsByWorkspace(listDealsByWorkspaceVars).then((response) => {
  const data = response.data;
  console.log(data.deals);
});
```

### Using `ListDealsByWorkspace`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDealsByWorkspaceRef, ListDealsByWorkspaceVariables } from '@dataconnect/generated';

// The `ListDealsByWorkspace` query requires an argument of type `ListDealsByWorkspaceVariables`:
const listDealsByWorkspaceVars: ListDealsByWorkspaceVariables = {
  workspaceId: ..., 
};

// Call the `listDealsByWorkspaceRef()` function to get a reference to the query.
const ref = listDealsByWorkspaceRef(listDealsByWorkspaceVars);
// Variables can be defined inline as well.
const ref = listDealsByWorkspaceRef({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDealsByWorkspaceRef(dataConnect, listDealsByWorkspaceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.deals);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.deals);
});
```

## ListUsageEventsByWorkspace
You can execute the `ListUsageEventsByWorkspace` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsageEventsByWorkspace(vars: ListUsageEventsByWorkspaceVariables): QueryPromise<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;

interface ListUsageEventsByWorkspaceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUsageEventsByWorkspaceVariables): QueryRef<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;
}
export const listUsageEventsByWorkspaceRef: ListUsageEventsByWorkspaceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsageEventsByWorkspace(dc: DataConnect, vars: ListUsageEventsByWorkspaceVariables): QueryPromise<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;

interface ListUsageEventsByWorkspaceRef {
  ...
  (dc: DataConnect, vars: ListUsageEventsByWorkspaceVariables): QueryRef<ListUsageEventsByWorkspaceData, ListUsageEventsByWorkspaceVariables>;
}
export const listUsageEventsByWorkspaceRef: ListUsageEventsByWorkspaceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsageEventsByWorkspaceRef:
```typescript
const name = listUsageEventsByWorkspaceRef.operationName;
console.log(name);
```

### Variables
The `ListUsageEventsByWorkspace` query requires an argument of type `ListUsageEventsByWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUsageEventsByWorkspaceVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that executing the `ListUsageEventsByWorkspace` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsageEventsByWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsageEventsByWorkspaceData {
  usageEvents: ({
    id: UUIDString;
    eventType: string;
    quantity: number;
    occurredAt: TimestampString;
  } & UsageEvent_Key)[];
}
```
### Using `ListUsageEventsByWorkspace`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsageEventsByWorkspace, ListUsageEventsByWorkspaceVariables } from '@dataconnect/generated';

// The `ListUsageEventsByWorkspace` query requires an argument of type `ListUsageEventsByWorkspaceVariables`:
const listUsageEventsByWorkspaceVars: ListUsageEventsByWorkspaceVariables = {
  workspaceId: ..., 
};

// Call the `listUsageEventsByWorkspace()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsageEventsByWorkspace(listUsageEventsByWorkspaceVars);
// Variables can be defined inline as well.
const { data } = await listUsageEventsByWorkspace({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsageEventsByWorkspace(dataConnect, listUsageEventsByWorkspaceVars);

console.log(data.usageEvents);

// Or, you can use the `Promise` API.
listUsageEventsByWorkspace(listUsageEventsByWorkspaceVars).then((response) => {
  const data = response.data;
  console.log(data.usageEvents);
});
```

### Using `ListUsageEventsByWorkspace`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsageEventsByWorkspaceRef, ListUsageEventsByWorkspaceVariables } from '@dataconnect/generated';

// The `ListUsageEventsByWorkspace` query requires an argument of type `ListUsageEventsByWorkspaceVariables`:
const listUsageEventsByWorkspaceVars: ListUsageEventsByWorkspaceVariables = {
  workspaceId: ..., 
};

// Call the `listUsageEventsByWorkspaceRef()` function to get a reference to the query.
const ref = listUsageEventsByWorkspaceRef(listUsageEventsByWorkspaceVars);
// Variables can be defined inline as well.
const ref = listUsageEventsByWorkspaceRef({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsageEventsByWorkspaceRef(dataConnect, listUsageEventsByWorkspaceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.usageEvents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.usageEvents);
});
```

## ListQueuedEnrichmentJobs
You can execute the `ListQueuedEnrichmentJobs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listQueuedEnrichmentJobs(vars: ListQueuedEnrichmentJobsVariables): QueryPromise<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;

interface ListQueuedEnrichmentJobsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListQueuedEnrichmentJobsVariables): QueryRef<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;
}
export const listQueuedEnrichmentJobsRef: ListQueuedEnrichmentJobsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listQueuedEnrichmentJobs(dc: DataConnect, vars: ListQueuedEnrichmentJobsVariables): QueryPromise<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;

interface ListQueuedEnrichmentJobsRef {
  ...
  (dc: DataConnect, vars: ListQueuedEnrichmentJobsVariables): QueryRef<ListQueuedEnrichmentJobsData, ListQueuedEnrichmentJobsVariables>;
}
export const listQueuedEnrichmentJobsRef: ListQueuedEnrichmentJobsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listQueuedEnrichmentJobsRef:
```typescript
const name = listQueuedEnrichmentJobsRef.operationName;
console.log(name);
```

### Variables
The `ListQueuedEnrichmentJobs` query requires an argument of type `ListQueuedEnrichmentJobsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListQueuedEnrichmentJobsVariables {
  workspaceId: UUIDString;
}
```
### Return Type
Recall that executing the `ListQueuedEnrichmentJobs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListQueuedEnrichmentJobsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListQueuedEnrichmentJobs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listQueuedEnrichmentJobs, ListQueuedEnrichmentJobsVariables } from '@dataconnect/generated';

// The `ListQueuedEnrichmentJobs` query requires an argument of type `ListQueuedEnrichmentJobsVariables`:
const listQueuedEnrichmentJobsVars: ListQueuedEnrichmentJobsVariables = {
  workspaceId: ..., 
};

// Call the `listQueuedEnrichmentJobs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listQueuedEnrichmentJobs(listQueuedEnrichmentJobsVars);
// Variables can be defined inline as well.
const { data } = await listQueuedEnrichmentJobs({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listQueuedEnrichmentJobs(dataConnect, listQueuedEnrichmentJobsVars);

console.log(data.enrichmentJobs);

// Or, you can use the `Promise` API.
listQueuedEnrichmentJobs(listQueuedEnrichmentJobsVars).then((response) => {
  const data = response.data;
  console.log(data.enrichmentJobs);
});
```

### Using `ListQueuedEnrichmentJobs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listQueuedEnrichmentJobsRef, ListQueuedEnrichmentJobsVariables } from '@dataconnect/generated';

// The `ListQueuedEnrichmentJobs` query requires an argument of type `ListQueuedEnrichmentJobsVariables`:
const listQueuedEnrichmentJobsVars: ListQueuedEnrichmentJobsVariables = {
  workspaceId: ..., 
};

// Call the `listQueuedEnrichmentJobsRef()` function to get a reference to the query.
const ref = listQueuedEnrichmentJobsRef(listQueuedEnrichmentJobsVars);
// Variables can be defined inline as well.
const ref = listQueuedEnrichmentJobsRef({ workspaceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listQueuedEnrichmentJobsRef(dataConnect, listQueuedEnrichmentJobsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.enrichmentJobs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.enrichmentJobs);
});
```

## ListStaleDeals
You can execute the `ListStaleDeals` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listStaleDeals(vars: ListStaleDealsVariables): QueryPromise<ListStaleDealsData, ListStaleDealsVariables>;

interface ListStaleDealsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStaleDealsVariables): QueryRef<ListStaleDealsData, ListStaleDealsVariables>;
}
export const listStaleDealsRef: ListStaleDealsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStaleDeals(dc: DataConnect, vars: ListStaleDealsVariables): QueryPromise<ListStaleDealsData, ListStaleDealsVariables>;

interface ListStaleDealsRef {
  ...
  (dc: DataConnect, vars: ListStaleDealsVariables): QueryRef<ListStaleDealsData, ListStaleDealsVariables>;
}
export const listStaleDealsRef: ListStaleDealsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStaleDealsRef:
```typescript
const name = listStaleDealsRef.operationName;
console.log(name);
```

### Variables
The `ListStaleDeals` query requires an argument of type `ListStaleDealsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListStaleDealsVariables {
  workspaceId: UUIDString;
  staleDate: TimestampString;
}
```
### Return Type
Recall that executing the `ListStaleDeals` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStaleDealsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListStaleDeals`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStaleDeals, ListStaleDealsVariables } from '@dataconnect/generated';

// The `ListStaleDeals` query requires an argument of type `ListStaleDealsVariables`:
const listStaleDealsVars: ListStaleDealsVariables = {
  workspaceId: ..., 
  staleDate: ..., 
};

// Call the `listStaleDeals()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStaleDeals(listStaleDealsVars);
// Variables can be defined inline as well.
const { data } = await listStaleDeals({ workspaceId: ..., staleDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStaleDeals(dataConnect, listStaleDealsVars);

console.log(data.deals);

// Or, you can use the `Promise` API.
listStaleDeals(listStaleDealsVars).then((response) => {
  const data = response.data;
  console.log(data.deals);
});
```

### Using `ListStaleDeals`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStaleDealsRef, ListStaleDealsVariables } from '@dataconnect/generated';

// The `ListStaleDeals` query requires an argument of type `ListStaleDealsVariables`:
const listStaleDealsVars: ListStaleDealsVariables = {
  workspaceId: ..., 
  staleDate: ..., 
};

// Call the `listStaleDealsRef()` function to get a reference to the query.
const ref = listStaleDealsRef(listStaleDealsVars);
// Variables can be defined inline as well.
const ref = listStaleDealsRef({ workspaceId: ..., staleDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStaleDealsRef(dataConnect, listStaleDealsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.deals);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.deals);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## BootstrapWorkspace
You can execute the `BootstrapWorkspace` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
bootstrapWorkspace(vars: BootstrapWorkspaceVariables): MutationPromise<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;

interface BootstrapWorkspaceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: BootstrapWorkspaceVariables): MutationRef<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
}
export const bootstrapWorkspaceRef: BootstrapWorkspaceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
bootstrapWorkspace(dc: DataConnect, vars: BootstrapWorkspaceVariables): MutationPromise<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;

interface BootstrapWorkspaceRef {
  ...
  (dc: DataConnect, vars: BootstrapWorkspaceVariables): MutationRef<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
}
export const bootstrapWorkspaceRef: BootstrapWorkspaceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the bootstrapWorkspaceRef:
```typescript
const name = bootstrapWorkspaceRef.operationName;
console.log(name);
```

### Variables
The `BootstrapWorkspace` mutation requires an argument of type `BootstrapWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface BootstrapWorkspaceVariables {
  email: string;
  name: string;
  workspaceName: string;
  workspaceSlug: string;
}
```
### Return Type
Recall that executing the `BootstrapWorkspace` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `BootstrapWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface BootstrapWorkspaceData {
  user_insert: User_Key;
  workspace_insert: Workspace_Key;
  workspaceMember_insert: WorkspaceMember_Key;
}
```
### Using `BootstrapWorkspace`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, bootstrapWorkspace, BootstrapWorkspaceVariables } from '@dataconnect/generated';

// The `BootstrapWorkspace` mutation requires an argument of type `BootstrapWorkspaceVariables`:
const bootstrapWorkspaceVars: BootstrapWorkspaceVariables = {
  email: ..., 
  name: ..., 
  workspaceName: ..., 
  workspaceSlug: ..., 
};

// Call the `bootstrapWorkspace()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await bootstrapWorkspace(bootstrapWorkspaceVars);
// Variables can be defined inline as well.
const { data } = await bootstrapWorkspace({ email: ..., name: ..., workspaceName: ..., workspaceSlug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await bootstrapWorkspace(dataConnect, bootstrapWorkspaceVars);

console.log(data.user_insert);
console.log(data.workspace_insert);
console.log(data.workspaceMember_insert);

// Or, you can use the `Promise` API.
bootstrapWorkspace(bootstrapWorkspaceVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
  console.log(data.workspace_insert);
  console.log(data.workspaceMember_insert);
});
```

### Using `BootstrapWorkspace`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, bootstrapWorkspaceRef, BootstrapWorkspaceVariables } from '@dataconnect/generated';

// The `BootstrapWorkspace` mutation requires an argument of type `BootstrapWorkspaceVariables`:
const bootstrapWorkspaceVars: BootstrapWorkspaceVariables = {
  email: ..., 
  name: ..., 
  workspaceName: ..., 
  workspaceSlug: ..., 
};

// Call the `bootstrapWorkspaceRef()` function to get a reference to the mutation.
const ref = bootstrapWorkspaceRef(bootstrapWorkspaceVars);
// Variables can be defined inline as well.
const ref = bootstrapWorkspaceRef({ email: ..., name: ..., workspaceName: ..., workspaceSlug: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = bootstrapWorkspaceRef(dataConnect, bootstrapWorkspaceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);
console.log(data.workspace_insert);
console.log(data.workspaceMember_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
  console.log(data.workspace_insert);
  console.log(data.workspaceMember_insert);
});
```

## CreateSavedList
You can execute the `CreateSavedList` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSavedList(vars: CreateSavedListVariables): MutationPromise<CreateSavedListData, CreateSavedListVariables>;

interface CreateSavedListRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSavedListVariables): MutationRef<CreateSavedListData, CreateSavedListVariables>;
}
export const createSavedListRef: CreateSavedListRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSavedList(dc: DataConnect, vars: CreateSavedListVariables): MutationPromise<CreateSavedListData, CreateSavedListVariables>;

interface CreateSavedListRef {
  ...
  (dc: DataConnect, vars: CreateSavedListVariables): MutationRef<CreateSavedListData, CreateSavedListVariables>;
}
export const createSavedListRef: CreateSavedListRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSavedListRef:
```typescript
const name = createSavedListRef.operationName;
console.log(name);
```

### Variables
The `CreateSavedList` mutation requires an argument of type `CreateSavedListVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSavedListVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  name: string;
}
```
### Return Type
Recall that executing the `CreateSavedList` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSavedListData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSavedListData {
  savedList_insert: SavedList_Key;
}
```
### Using `CreateSavedList`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSavedList, CreateSavedListVariables } from '@dataconnect/generated';

// The `CreateSavedList` mutation requires an argument of type `CreateSavedListVariables`:
const createSavedListVars: CreateSavedListVariables = {
  id: ..., 
  workspaceId: ..., 
  name: ..., 
};

// Call the `createSavedList()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSavedList(createSavedListVars);
// Variables can be defined inline as well.
const { data } = await createSavedList({ id: ..., workspaceId: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSavedList(dataConnect, createSavedListVars);

console.log(data.savedList_insert);

// Or, you can use the `Promise` API.
createSavedList(createSavedListVars).then((response) => {
  const data = response.data;
  console.log(data.savedList_insert);
});
```

### Using `CreateSavedList`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSavedListRef, CreateSavedListVariables } from '@dataconnect/generated';

// The `CreateSavedList` mutation requires an argument of type `CreateSavedListVariables`:
const createSavedListVars: CreateSavedListVariables = {
  id: ..., 
  workspaceId: ..., 
  name: ..., 
};

// Call the `createSavedListRef()` function to get a reference to the mutation.
const ref = createSavedListRef(createSavedListVars);
// Variables can be defined inline as well.
const ref = createSavedListRef({ id: ..., workspaceId: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSavedListRef(dataConnect, createSavedListVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.savedList_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.savedList_insert);
});
```

## UpsertCompany
You can execute the `UpsertCompany` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCompany(vars: UpsertCompanyVariables): MutationPromise<UpsertCompanyData, UpsertCompanyVariables>;

interface UpsertCompanyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompanyVariables): MutationRef<UpsertCompanyData, UpsertCompanyVariables>;
}
export const upsertCompanyRef: UpsertCompanyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCompany(dc: DataConnect, vars: UpsertCompanyVariables): MutationPromise<UpsertCompanyData, UpsertCompanyVariables>;

interface UpsertCompanyRef {
  ...
  (dc: DataConnect, vars: UpsertCompanyVariables): MutationRef<UpsertCompanyData, UpsertCompanyVariables>;
}
export const upsertCompanyRef: UpsertCompanyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCompanyRef:
```typescript
const name = upsertCompanyRef.operationName;
console.log(name);
```

### Variables
The `UpsertCompany` mutation requires an argument of type `UpsertCompanyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertCompany` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCompanyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCompanyData {
  company_upsert: Company_Key;
}
```
### Using `UpsertCompany`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCompany, UpsertCompanyVariables } from '@dataconnect/generated';

// The `UpsertCompany` mutation requires an argument of type `UpsertCompanyVariables`:
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

// Call the `upsertCompany()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCompany(upsertCompanyVars);
// Variables can be defined inline as well.
const { data } = await upsertCompany({ id: ..., workspaceId: ..., legalName: ..., tradeName: ..., segment: ..., city: ..., region: ..., country: ..., phone: ..., website: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCompany(dataConnect, upsertCompanyVars);

console.log(data.company_upsert);

// Or, you can use the `Promise` API.
upsertCompany(upsertCompanyVars).then((response) => {
  const data = response.data;
  console.log(data.company_upsert);
});
```

### Using `UpsertCompany`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCompanyRef, UpsertCompanyVariables } from '@dataconnect/generated';

// The `UpsertCompany` mutation requires an argument of type `UpsertCompanyVariables`:
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

// Call the `upsertCompanyRef()` function to get a reference to the mutation.
const ref = upsertCompanyRef(upsertCompanyVars);
// Variables can be defined inline as well.
const ref = upsertCompanyRef({ id: ..., workspaceId: ..., legalName: ..., tradeName: ..., segment: ..., city: ..., region: ..., country: ..., phone: ..., website: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCompanyRef(dataConnect, upsertCompanyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.company_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.company_upsert);
});
```

## UpsertLead
You can execute the `UpsertLead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertLead(vars: UpsertLeadVariables): MutationPromise<UpsertLeadData, UpsertLeadVariables>;

interface UpsertLeadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertLeadVariables): MutationRef<UpsertLeadData, UpsertLeadVariables>;
}
export const upsertLeadRef: UpsertLeadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertLead(dc: DataConnect, vars: UpsertLeadVariables): MutationPromise<UpsertLeadData, UpsertLeadVariables>;

interface UpsertLeadRef {
  ...
  (dc: DataConnect, vars: UpsertLeadVariables): MutationRef<UpsertLeadData, UpsertLeadVariables>;
}
export const upsertLeadRef: UpsertLeadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertLeadRef:
```typescript
const name = upsertLeadRef.operationName;
console.log(name);
```

### Variables
The `UpsertLead` mutation requires an argument of type `UpsertLeadVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertLead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertLeadData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertLeadData {
  lead_upsert: Lead_Key;
}
```
### Using `UpsertLead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertLead, UpsertLeadVariables } from '@dataconnect/generated';

// The `UpsertLead` mutation requires an argument of type `UpsertLeadVariables`:
const upsertLeadVars: UpsertLeadVariables = {
  id: ..., 
  workspaceId: ..., 
  companyId: ..., 
  status: ..., 
  rank: ..., 
  score: ..., 
  source: ..., // optional
};

// Call the `upsertLead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertLead(upsertLeadVars);
// Variables can be defined inline as well.
const { data } = await upsertLead({ id: ..., workspaceId: ..., companyId: ..., status: ..., rank: ..., score: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertLead(dataConnect, upsertLeadVars);

console.log(data.lead_upsert);

// Or, you can use the `Promise` API.
upsertLead(upsertLeadVars).then((response) => {
  const data = response.data;
  console.log(data.lead_upsert);
});
```

### Using `UpsertLead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertLeadRef, UpsertLeadVariables } from '@dataconnect/generated';

// The `UpsertLead` mutation requires an argument of type `UpsertLeadVariables`:
const upsertLeadVars: UpsertLeadVariables = {
  id: ..., 
  workspaceId: ..., 
  companyId: ..., 
  status: ..., 
  rank: ..., 
  score: ..., 
  source: ..., // optional
};

// Call the `upsertLeadRef()` function to get a reference to the mutation.
const ref = upsertLeadRef(upsertLeadVars);
// Variables can be defined inline as well.
const ref = upsertLeadRef({ id: ..., workspaceId: ..., companyId: ..., status: ..., rank: ..., score: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertLeadRef(dataConnect, upsertLeadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lead_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lead_upsert);
});
```

## AddLeadToSavedList
You can execute the `AddLeadToSavedList` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addLeadToSavedList(vars: AddLeadToSavedListVariables): MutationPromise<AddLeadToSavedListData, AddLeadToSavedListVariables>;

interface AddLeadToSavedListRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddLeadToSavedListVariables): MutationRef<AddLeadToSavedListData, AddLeadToSavedListVariables>;
}
export const addLeadToSavedListRef: AddLeadToSavedListRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addLeadToSavedList(dc: DataConnect, vars: AddLeadToSavedListVariables): MutationPromise<AddLeadToSavedListData, AddLeadToSavedListVariables>;

interface AddLeadToSavedListRef {
  ...
  (dc: DataConnect, vars: AddLeadToSavedListVariables): MutationRef<AddLeadToSavedListData, AddLeadToSavedListVariables>;
}
export const addLeadToSavedListRef: AddLeadToSavedListRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addLeadToSavedListRef:
```typescript
const name = addLeadToSavedListRef.operationName;
console.log(name);
```

### Variables
The `AddLeadToSavedList` mutation requires an argument of type `AddLeadToSavedListVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddLeadToSavedListVariables {
  listId: UUIDString;
  leadId: UUIDString;
}
```
### Return Type
Recall that executing the `AddLeadToSavedList` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddLeadToSavedListData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddLeadToSavedListData {
  savedListItem_upsert: SavedListItem_Key;
}
```
### Using `AddLeadToSavedList`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addLeadToSavedList, AddLeadToSavedListVariables } from '@dataconnect/generated';

// The `AddLeadToSavedList` mutation requires an argument of type `AddLeadToSavedListVariables`:
const addLeadToSavedListVars: AddLeadToSavedListVariables = {
  listId: ..., 
  leadId: ..., 
};

// Call the `addLeadToSavedList()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addLeadToSavedList(addLeadToSavedListVars);
// Variables can be defined inline as well.
const { data } = await addLeadToSavedList({ listId: ..., leadId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addLeadToSavedList(dataConnect, addLeadToSavedListVars);

console.log(data.savedListItem_upsert);

// Or, you can use the `Promise` API.
addLeadToSavedList(addLeadToSavedListVars).then((response) => {
  const data = response.data;
  console.log(data.savedListItem_upsert);
});
```

### Using `AddLeadToSavedList`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addLeadToSavedListRef, AddLeadToSavedListVariables } from '@dataconnect/generated';

// The `AddLeadToSavedList` mutation requires an argument of type `AddLeadToSavedListVariables`:
const addLeadToSavedListVars: AddLeadToSavedListVariables = {
  listId: ..., 
  leadId: ..., 
};

// Call the `addLeadToSavedListRef()` function to get a reference to the mutation.
const ref = addLeadToSavedListRef(addLeadToSavedListVars);
// Variables can be defined inline as well.
const ref = addLeadToSavedListRef({ listId: ..., leadId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addLeadToSavedListRef(dataConnect, addLeadToSavedListVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.savedListItem_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.savedListItem_upsert);
});
```

## DeleteSavedList
You can execute the `DeleteSavedList` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSavedList(vars: DeleteSavedListVariables): MutationPromise<DeleteSavedListData, DeleteSavedListVariables>;

interface DeleteSavedListRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSavedListVariables): MutationRef<DeleteSavedListData, DeleteSavedListVariables>;
}
export const deleteSavedListRef: DeleteSavedListRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSavedList(dc: DataConnect, vars: DeleteSavedListVariables): MutationPromise<DeleteSavedListData, DeleteSavedListVariables>;

interface DeleteSavedListRef {
  ...
  (dc: DataConnect, vars: DeleteSavedListVariables): MutationRef<DeleteSavedListData, DeleteSavedListVariables>;
}
export const deleteSavedListRef: DeleteSavedListRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSavedListRef:
```typescript
const name = deleteSavedListRef.operationName;
console.log(name);
```

### Variables
The `DeleteSavedList` mutation requires an argument of type `DeleteSavedListVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSavedListVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSavedList` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSavedListData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSavedListData {
  savedList_delete?: SavedList_Key | null;
}
```
### Using `DeleteSavedList`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSavedList, DeleteSavedListVariables } from '@dataconnect/generated';

// The `DeleteSavedList` mutation requires an argument of type `DeleteSavedListVariables`:
const deleteSavedListVars: DeleteSavedListVariables = {
  id: ..., 
};

// Call the `deleteSavedList()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSavedList(deleteSavedListVars);
// Variables can be defined inline as well.
const { data } = await deleteSavedList({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSavedList(dataConnect, deleteSavedListVars);

console.log(data.savedList_delete);

// Or, you can use the `Promise` API.
deleteSavedList(deleteSavedListVars).then((response) => {
  const data = response.data;
  console.log(data.savedList_delete);
});
```

### Using `DeleteSavedList`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSavedListRef, DeleteSavedListVariables } from '@dataconnect/generated';

// The `DeleteSavedList` mutation requires an argument of type `DeleteSavedListVariables`:
const deleteSavedListVars: DeleteSavedListVariables = {
  id: ..., 
};

// Call the `deleteSavedListRef()` function to get a reference to the mutation.
const ref = deleteSavedListRef(deleteSavedListVars);
// Variables can be defined inline as well.
const ref = deleteSavedListRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSavedListRef(dataConnect, deleteSavedListVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.savedList_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.savedList_delete);
});
```

## UpsertPipeline
You can execute the `UpsertPipeline` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertPipeline(vars: UpsertPipelineVariables): MutationPromise<UpsertPipelineData, UpsertPipelineVariables>;

interface UpsertPipelineRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPipelineVariables): MutationRef<UpsertPipelineData, UpsertPipelineVariables>;
}
export const upsertPipelineRef: UpsertPipelineRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertPipeline(dc: DataConnect, vars: UpsertPipelineVariables): MutationPromise<UpsertPipelineData, UpsertPipelineVariables>;

interface UpsertPipelineRef {
  ...
  (dc: DataConnect, vars: UpsertPipelineVariables): MutationRef<UpsertPipelineData, UpsertPipelineVariables>;
}
export const upsertPipelineRef: UpsertPipelineRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertPipelineRef:
```typescript
const name = upsertPipelineRef.operationName;
console.log(name);
```

### Variables
The `UpsertPipeline` mutation requires an argument of type `UpsertPipelineVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertPipelineVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  name: string;
  isDefault?: boolean | null;
}
```
### Return Type
Recall that executing the `UpsertPipeline` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertPipelineData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertPipelineData {
  pipeline_upsert: Pipeline_Key;
}
```
### Using `UpsertPipeline`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertPipeline, UpsertPipelineVariables } from '@dataconnect/generated';

// The `UpsertPipeline` mutation requires an argument of type `UpsertPipelineVariables`:
const upsertPipelineVars: UpsertPipelineVariables = {
  id: ..., 
  workspaceId: ..., 
  name: ..., 
  isDefault: ..., // optional
};

// Call the `upsertPipeline()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertPipeline(upsertPipelineVars);
// Variables can be defined inline as well.
const { data } = await upsertPipeline({ id: ..., workspaceId: ..., name: ..., isDefault: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertPipeline(dataConnect, upsertPipelineVars);

console.log(data.pipeline_upsert);

// Or, you can use the `Promise` API.
upsertPipeline(upsertPipelineVars).then((response) => {
  const data = response.data;
  console.log(data.pipeline_upsert);
});
```

### Using `UpsertPipeline`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertPipelineRef, UpsertPipelineVariables } from '@dataconnect/generated';

// The `UpsertPipeline` mutation requires an argument of type `UpsertPipelineVariables`:
const upsertPipelineVars: UpsertPipelineVariables = {
  id: ..., 
  workspaceId: ..., 
  name: ..., 
  isDefault: ..., // optional
};

// Call the `upsertPipelineRef()` function to get a reference to the mutation.
const ref = upsertPipelineRef(upsertPipelineVars);
// Variables can be defined inline as well.
const ref = upsertPipelineRef({ id: ..., workspaceId: ..., name: ..., isDefault: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertPipelineRef(dataConnect, upsertPipelineVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.pipeline_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.pipeline_upsert);
});
```

## UpsertPipelineStage
You can execute the `UpsertPipelineStage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertPipelineStage(vars: UpsertPipelineStageVariables): MutationPromise<UpsertPipelineStageData, UpsertPipelineStageVariables>;

interface UpsertPipelineStageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPipelineStageVariables): MutationRef<UpsertPipelineStageData, UpsertPipelineStageVariables>;
}
export const upsertPipelineStageRef: UpsertPipelineStageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertPipelineStage(dc: DataConnect, vars: UpsertPipelineStageVariables): MutationPromise<UpsertPipelineStageData, UpsertPipelineStageVariables>;

interface UpsertPipelineStageRef {
  ...
  (dc: DataConnect, vars: UpsertPipelineStageVariables): MutationRef<UpsertPipelineStageData, UpsertPipelineStageVariables>;
}
export const upsertPipelineStageRef: UpsertPipelineStageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertPipelineStageRef:
```typescript
const name = upsertPipelineStageRef.operationName;
console.log(name);
```

### Variables
The `UpsertPipelineStage` mutation requires an argument of type `UpsertPipelineStageVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertPipelineStageVariables {
  id: UUIDString;
  pipelineId: UUIDString;
  name: string;
  sortOrder: number;
  color: string;
}
```
### Return Type
Recall that executing the `UpsertPipelineStage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertPipelineStageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertPipelineStageData {
  pipelineStage_upsert: PipelineStage_Key;
}
```
### Using `UpsertPipelineStage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertPipelineStage, UpsertPipelineStageVariables } from '@dataconnect/generated';

// The `UpsertPipelineStage` mutation requires an argument of type `UpsertPipelineStageVariables`:
const upsertPipelineStageVars: UpsertPipelineStageVariables = {
  id: ..., 
  pipelineId: ..., 
  name: ..., 
  sortOrder: ..., 
  color: ..., 
};

// Call the `upsertPipelineStage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertPipelineStage(upsertPipelineStageVars);
// Variables can be defined inline as well.
const { data } = await upsertPipelineStage({ id: ..., pipelineId: ..., name: ..., sortOrder: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertPipelineStage(dataConnect, upsertPipelineStageVars);

console.log(data.pipelineStage_upsert);

// Or, you can use the `Promise` API.
upsertPipelineStage(upsertPipelineStageVars).then((response) => {
  const data = response.data;
  console.log(data.pipelineStage_upsert);
});
```

### Using `UpsertPipelineStage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertPipelineStageRef, UpsertPipelineStageVariables } from '@dataconnect/generated';

// The `UpsertPipelineStage` mutation requires an argument of type `UpsertPipelineStageVariables`:
const upsertPipelineStageVars: UpsertPipelineStageVariables = {
  id: ..., 
  pipelineId: ..., 
  name: ..., 
  sortOrder: ..., 
  color: ..., 
};

// Call the `upsertPipelineStageRef()` function to get a reference to the mutation.
const ref = upsertPipelineStageRef(upsertPipelineStageVars);
// Variables can be defined inline as well.
const ref = upsertPipelineStageRef({ id: ..., pipelineId: ..., name: ..., sortOrder: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertPipelineStageRef(dataConnect, upsertPipelineStageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.pipelineStage_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.pipelineStage_upsert);
});
```

## UpsertDeal
You can execute the `UpsertDeal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertDeal(vars: UpsertDealVariables): MutationPromise<UpsertDealData, UpsertDealVariables>;

interface UpsertDealRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertDealVariables): MutationRef<UpsertDealData, UpsertDealVariables>;
}
export const upsertDealRef: UpsertDealRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertDeal(dc: DataConnect, vars: UpsertDealVariables): MutationPromise<UpsertDealData, UpsertDealVariables>;

interface UpsertDealRef {
  ...
  (dc: DataConnect, vars: UpsertDealVariables): MutationRef<UpsertDealData, UpsertDealVariables>;
}
export const upsertDealRef: UpsertDealRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertDealRef:
```typescript
const name = upsertDealRef.operationName;
console.log(name);
```

### Variables
The `UpsertDeal` mutation requires an argument of type `UpsertDealVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertDeal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertDealData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertDealData {
  deal_upsert: Deal_Key;
}
```
### Using `UpsertDeal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertDeal, UpsertDealVariables } from '@dataconnect/generated';

// The `UpsertDeal` mutation requires an argument of type `UpsertDealVariables`:
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

// Call the `upsertDeal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertDeal(upsertDealVars);
// Variables can be defined inline as well.
const { data } = await upsertDeal({ id: ..., workspaceId: ..., pipelineId: ..., stageId: ..., title: ..., companyId: ..., value: ..., priority: ..., nextStep: ..., notes: ..., payload: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertDeal(dataConnect, upsertDealVars);

console.log(data.deal_upsert);

// Or, you can use the `Promise` API.
upsertDeal(upsertDealVars).then((response) => {
  const data = response.data;
  console.log(data.deal_upsert);
});
```

### Using `UpsertDeal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertDealRef, UpsertDealVariables } from '@dataconnect/generated';

// The `UpsertDeal` mutation requires an argument of type `UpsertDealVariables`:
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

// Call the `upsertDealRef()` function to get a reference to the mutation.
const ref = upsertDealRef(upsertDealVars);
// Variables can be defined inline as well.
const ref = upsertDealRef({ id: ..., workspaceId: ..., pipelineId: ..., stageId: ..., title: ..., companyId: ..., value: ..., priority: ..., nextStep: ..., notes: ..., payload: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertDealRef(dataConnect, upsertDealVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.deal_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.deal_upsert);
});
```

## DeleteDeal
You can execute the `DeleteDeal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteDeal(vars: DeleteDealVariables): MutationPromise<DeleteDealData, DeleteDealVariables>;

interface DeleteDealRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDealVariables): MutationRef<DeleteDealData, DeleteDealVariables>;
}
export const deleteDealRef: DeleteDealRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteDeal(dc: DataConnect, vars: DeleteDealVariables): MutationPromise<DeleteDealData, DeleteDealVariables>;

interface DeleteDealRef {
  ...
  (dc: DataConnect, vars: DeleteDealVariables): MutationRef<DeleteDealData, DeleteDealVariables>;
}
export const deleteDealRef: DeleteDealRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteDealRef:
```typescript
const name = deleteDealRef.operationName;
console.log(name);
```

### Variables
The `DeleteDeal` mutation requires an argument of type `DeleteDealVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteDealVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteDeal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteDealData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteDealData {
  deal_delete?: Deal_Key | null;
}
```
### Using `DeleteDeal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteDeal, DeleteDealVariables } from '@dataconnect/generated';

// The `DeleteDeal` mutation requires an argument of type `DeleteDealVariables`:
const deleteDealVars: DeleteDealVariables = {
  id: ..., 
};

// Call the `deleteDeal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteDeal(deleteDealVars);
// Variables can be defined inline as well.
const { data } = await deleteDeal({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteDeal(dataConnect, deleteDealVars);

console.log(data.deal_delete);

// Or, you can use the `Promise` API.
deleteDeal(deleteDealVars).then((response) => {
  const data = response.data;
  console.log(data.deal_delete);
});
```

### Using `DeleteDeal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteDealRef, DeleteDealVariables } from '@dataconnect/generated';

// The `DeleteDeal` mutation requires an argument of type `DeleteDealVariables`:
const deleteDealVars: DeleteDealVariables = {
  id: ..., 
};

// Call the `deleteDealRef()` function to get a reference to the mutation.
const ref = deleteDealRef(deleteDealVars);
// Variables can be defined inline as well.
const ref = deleteDealRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteDealRef(dataConnect, deleteDealVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.deal_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.deal_delete);
});
```

## CreateUsageEvent
You can execute the `CreateUsageEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUsageEvent(vars: CreateUsageEventVariables): MutationPromise<CreateUsageEventData, CreateUsageEventVariables>;

interface CreateUsageEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUsageEventVariables): MutationRef<CreateUsageEventData, CreateUsageEventVariables>;
}
export const createUsageEventRef: CreateUsageEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUsageEvent(dc: DataConnect, vars: CreateUsageEventVariables): MutationPromise<CreateUsageEventData, CreateUsageEventVariables>;

interface CreateUsageEventRef {
  ...
  (dc: DataConnect, vars: CreateUsageEventVariables): MutationRef<CreateUsageEventData, CreateUsageEventVariables>;
}
export const createUsageEventRef: CreateUsageEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUsageEventRef:
```typescript
const name = createUsageEventRef.operationName;
console.log(name);
```

### Variables
The `CreateUsageEvent` mutation requires an argument of type `CreateUsageEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `CreateUsageEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUsageEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUsageEventData {
  usageEvent_insert: UsageEvent_Key;
}
```
### Using `CreateUsageEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUsageEvent, CreateUsageEventVariables } from '@dataconnect/generated';

// The `CreateUsageEvent` mutation requires an argument of type `CreateUsageEventVariables`:
const createUsageEventVars: CreateUsageEventVariables = {
  id: ..., 
  workspaceId: ..., 
  userId: ..., // optional
  eventType: ..., 
  source: ..., // optional
  quantity: ..., 
  metadata: ..., 
};

// Call the `createUsageEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUsageEvent(createUsageEventVars);
// Variables can be defined inline as well.
const { data } = await createUsageEvent({ id: ..., workspaceId: ..., userId: ..., eventType: ..., source: ..., quantity: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUsageEvent(dataConnect, createUsageEventVars);

console.log(data.usageEvent_insert);

// Or, you can use the `Promise` API.
createUsageEvent(createUsageEventVars).then((response) => {
  const data = response.data;
  console.log(data.usageEvent_insert);
});
```

### Using `CreateUsageEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUsageEventRef, CreateUsageEventVariables } from '@dataconnect/generated';

// The `CreateUsageEvent` mutation requires an argument of type `CreateUsageEventVariables`:
const createUsageEventVars: CreateUsageEventVariables = {
  id: ..., 
  workspaceId: ..., 
  userId: ..., // optional
  eventType: ..., 
  source: ..., // optional
  quantity: ..., 
  metadata: ..., 
};

// Call the `createUsageEventRef()` function to get a reference to the mutation.
const ref = createUsageEventRef(createUsageEventVars);
// Variables can be defined inline as well.
const ref = createUsageEventRef({ id: ..., workspaceId: ..., userId: ..., eventType: ..., source: ..., quantity: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUsageEventRef(dataConnect, createUsageEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usageEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usageEvent_insert);
});
```

## UpsertEnrichmentJob
You can execute the `UpsertEnrichmentJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertEnrichmentJob(vars: UpsertEnrichmentJobVariables): MutationPromise<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;

interface UpsertEnrichmentJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEnrichmentJobVariables): MutationRef<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;
}
export const upsertEnrichmentJobRef: UpsertEnrichmentJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertEnrichmentJob(dc: DataConnect, vars: UpsertEnrichmentJobVariables): MutationPromise<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;

interface UpsertEnrichmentJobRef {
  ...
  (dc: DataConnect, vars: UpsertEnrichmentJobVariables): MutationRef<UpsertEnrichmentJobData, UpsertEnrichmentJobVariables>;
}
export const upsertEnrichmentJobRef: UpsertEnrichmentJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertEnrichmentJobRef:
```typescript
const name = upsertEnrichmentJobRef.operationName;
console.log(name);
```

### Variables
The `UpsertEnrichmentJob` mutation requires an argument of type `UpsertEnrichmentJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertEnrichmentJobVariables {
  id: UUIDString;
  workspaceId: UUIDString;
  companyId?: UUIDString | null;
  jobType: string;
  payload: unknown;
}
```
### Return Type
Recall that executing the `UpsertEnrichmentJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertEnrichmentJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertEnrichmentJobData {
  enrichmentJob_upsert: EnrichmentJob_Key;
}
```
### Using `UpsertEnrichmentJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertEnrichmentJob, UpsertEnrichmentJobVariables } from '@dataconnect/generated';

// The `UpsertEnrichmentJob` mutation requires an argument of type `UpsertEnrichmentJobVariables`:
const upsertEnrichmentJobVars: UpsertEnrichmentJobVariables = {
  id: ..., 
  workspaceId: ..., 
  companyId: ..., // optional
  jobType: ..., 
  payload: ..., 
};

// Call the `upsertEnrichmentJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertEnrichmentJob(upsertEnrichmentJobVars);
// Variables can be defined inline as well.
const { data } = await upsertEnrichmentJob({ id: ..., workspaceId: ..., companyId: ..., jobType: ..., payload: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertEnrichmentJob(dataConnect, upsertEnrichmentJobVars);

console.log(data.enrichmentJob_upsert);

// Or, you can use the `Promise` API.
upsertEnrichmentJob(upsertEnrichmentJobVars).then((response) => {
  const data = response.data;
  console.log(data.enrichmentJob_upsert);
});
```

### Using `UpsertEnrichmentJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertEnrichmentJobRef, UpsertEnrichmentJobVariables } from '@dataconnect/generated';

// The `UpsertEnrichmentJob` mutation requires an argument of type `UpsertEnrichmentJobVariables`:
const upsertEnrichmentJobVars: UpsertEnrichmentJobVariables = {
  id: ..., 
  workspaceId: ..., 
  companyId: ..., // optional
  jobType: ..., 
  payload: ..., 
};

// Call the `upsertEnrichmentJobRef()` function to get a reference to the mutation.
const ref = upsertEnrichmentJobRef(upsertEnrichmentJobVars);
// Variables can be defined inline as well.
const ref = upsertEnrichmentJobRef({ id: ..., workspaceId: ..., companyId: ..., jobType: ..., payload: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertEnrichmentJobRef(dataConnect, upsertEnrichmentJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.enrichmentJob_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.enrichmentJob_upsert);
});
```

## UpdateEnrichmentJobStatus
You can execute the `UpdateEnrichmentJobStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEnrichmentJobStatus(vars: UpdateEnrichmentJobStatusVariables): MutationPromise<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;

interface UpdateEnrichmentJobStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEnrichmentJobStatusVariables): MutationRef<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;
}
export const updateEnrichmentJobStatusRef: UpdateEnrichmentJobStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEnrichmentJobStatus(dc: DataConnect, vars: UpdateEnrichmentJobStatusVariables): MutationPromise<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;

interface UpdateEnrichmentJobStatusRef {
  ...
  (dc: DataConnect, vars: UpdateEnrichmentJobStatusVariables): MutationRef<UpdateEnrichmentJobStatusData, UpdateEnrichmentJobStatusVariables>;
}
export const updateEnrichmentJobStatusRef: UpdateEnrichmentJobStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEnrichmentJobStatusRef:
```typescript
const name = updateEnrichmentJobStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateEnrichmentJobStatus` mutation requires an argument of type `UpdateEnrichmentJobStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEnrichmentJobStatusVariables {
  id: UUIDString;
  status: string;
  result: unknown;
  errorMessage?: string | null;
}
```
### Return Type
Recall that executing the `UpdateEnrichmentJobStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEnrichmentJobStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEnrichmentJobStatusData {
  enrichmentJob_update?: EnrichmentJob_Key | null;
}
```
### Using `UpdateEnrichmentJobStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEnrichmentJobStatus, UpdateEnrichmentJobStatusVariables } from '@dataconnect/generated';

// The `UpdateEnrichmentJobStatus` mutation requires an argument of type `UpdateEnrichmentJobStatusVariables`:
const updateEnrichmentJobStatusVars: UpdateEnrichmentJobStatusVariables = {
  id: ..., 
  status: ..., 
  result: ..., 
  errorMessage: ..., // optional
};

// Call the `updateEnrichmentJobStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEnrichmentJobStatus(updateEnrichmentJobStatusVars);
// Variables can be defined inline as well.
const { data } = await updateEnrichmentJobStatus({ id: ..., status: ..., result: ..., errorMessage: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEnrichmentJobStatus(dataConnect, updateEnrichmentJobStatusVars);

console.log(data.enrichmentJob_update);

// Or, you can use the `Promise` API.
updateEnrichmentJobStatus(updateEnrichmentJobStatusVars).then((response) => {
  const data = response.data;
  console.log(data.enrichmentJob_update);
});
```

### Using `UpdateEnrichmentJobStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEnrichmentJobStatusRef, UpdateEnrichmentJobStatusVariables } from '@dataconnect/generated';

// The `UpdateEnrichmentJobStatus` mutation requires an argument of type `UpdateEnrichmentJobStatusVariables`:
const updateEnrichmentJobStatusVars: UpdateEnrichmentJobStatusVariables = {
  id: ..., 
  status: ..., 
  result: ..., 
  errorMessage: ..., // optional
};

// Call the `updateEnrichmentJobStatusRef()` function to get a reference to the mutation.
const ref = updateEnrichmentJobStatusRef(updateEnrichmentJobStatusVars);
// Variables can be defined inline as well.
const ref = updateEnrichmentJobStatusRef({ id: ..., status: ..., result: ..., errorMessage: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEnrichmentJobStatusRef(dataConnect, updateEnrichmentJobStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.enrichmentJob_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.enrichmentJob_update);
});
```

