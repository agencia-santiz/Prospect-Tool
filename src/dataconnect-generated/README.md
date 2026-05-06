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
  - [*ListDealsByWorkspace*](#listdealsbyworkspace)
- [**Mutations**](#mutations)
  - [*BootstrapWorkspace*](#bootstrapworkspace)

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
getCurrentUserByAuthUid(vars: GetCurrentUserByAuthUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;

interface GetCurrentUserByAuthUidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCurrentUserByAuthUidVariables): QueryRef<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;
}
export const getCurrentUserByAuthUidRef: GetCurrentUserByAuthUidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUserByAuthUid(dc: DataConnect, vars: GetCurrentUserByAuthUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserByAuthUidData, GetCurrentUserByAuthUidVariables>;

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
getWorkspaceBySlug(vars: GetWorkspaceBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;

interface GetWorkspaceBySlugRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkspaceBySlugVariables): QueryRef<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;
}
export const getWorkspaceBySlugRef: GetWorkspaceBySlugRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWorkspaceBySlug(dc: DataConnect, vars: GetWorkspaceBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorkspaceBySlugData, GetWorkspaceBySlugVariables>;

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
listWorkspaceMembers(vars: ListWorkspaceMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;

interface ListWorkspaceMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListWorkspaceMembersVariables): QueryRef<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;
}
export const listWorkspaceMembersRef: ListWorkspaceMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listWorkspaceMembers(dc: DataConnect, vars: ListWorkspaceMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListWorkspaceMembersData, ListWorkspaceMembersVariables>;

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
listSavedLists(vars: ListSavedListsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSavedListsData, ListSavedListsVariables>;

interface ListSavedListsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSavedListsVariables): QueryRef<ListSavedListsData, ListSavedListsVariables>;
}
export const listSavedListsRef: ListSavedListsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSavedLists(dc: DataConnect, vars: ListSavedListsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSavedListsData, ListSavedListsVariables>;

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
listPipelineOverview(vars: ListPipelineOverviewVariables, options?: ExecuteQueryOptions): QueryPromise<ListPipelineOverviewData, ListPipelineOverviewVariables>;

interface ListPipelineOverviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPipelineOverviewVariables): QueryRef<ListPipelineOverviewData, ListPipelineOverviewVariables>;
}
export const listPipelineOverviewRef: ListPipelineOverviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPipelineOverview(dc: DataConnect, vars: ListPipelineOverviewVariables, options?: ExecuteQueryOptions): QueryPromise<ListPipelineOverviewData, ListPipelineOverviewVariables>;

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
listPipelineStages(vars: ListPipelineStagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListPipelineStagesData, ListPipelineStagesVariables>;

interface ListPipelineStagesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPipelineStagesVariables): QueryRef<ListPipelineStagesData, ListPipelineStagesVariables>;
}
export const listPipelineStagesRef: ListPipelineStagesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPipelineStages(dc: DataConnect, vars: ListPipelineStagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListPipelineStagesData, ListPipelineStagesVariables>;

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
listContactsByWorkspace(vars: ListContactsByWorkspaceVariables, options?: ExecuteQueryOptions): QueryPromise<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;

interface ListContactsByWorkspaceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListContactsByWorkspaceVariables): QueryRef<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;
}
export const listContactsByWorkspaceRef: ListContactsByWorkspaceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listContactsByWorkspace(dc: DataConnect, vars: ListContactsByWorkspaceVariables, options?: ExecuteQueryOptions): QueryPromise<ListContactsByWorkspaceData, ListContactsByWorkspaceVariables>;

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

## ListDealsByWorkspace
You can execute the `ListDealsByWorkspace` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listDealsByWorkspace(vars: ListDealsByWorkspaceVariables, options?: ExecuteQueryOptions): QueryPromise<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;

interface ListDealsByWorkspaceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDealsByWorkspaceVariables): QueryRef<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;
}
export const listDealsByWorkspaceRef: ListDealsByWorkspaceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDealsByWorkspace(dc: DataConnect, vars: ListDealsByWorkspaceVariables, options?: ExecuteQueryOptions): QueryPromise<ListDealsByWorkspaceData, ListDealsByWorkspaceVariables>;

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

