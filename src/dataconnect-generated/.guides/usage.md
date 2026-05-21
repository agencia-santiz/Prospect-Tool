# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useGetCurrentUserByAuthUid, useGetWorkspaceBySlug, useListWorkspaceMembers, useListSavedLists, useListPipelineOverview, useListPipelineStages, useListContactsByWorkspace, useListLeadsByWorkspace, useListDealsByWorkspace, useBootstrapWorkspace } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useGetCurrentUserByAuthUid(getCurrentUserByAuthUidVars);

const { data, isPending, isSuccess, isError, error } = useGetWorkspaceBySlug(getWorkspaceBySlugVars);

const { data, isPending, isSuccess, isError, error } = useListWorkspaceMembers(listWorkspaceMembersVars);

const { data, isPending, isSuccess, isError, error } = useListSavedLists(listSavedListsVars);

const { data, isPending, isSuccess, isError, error } = useListPipelineOverview(listPipelineOverviewVars);

const { data, isPending, isSuccess, isError, error } = useListPipelineStages(listPipelineStagesVars);

const { data, isPending, isSuccess, isError, error } = useListContactsByWorkspace(listContactsByWorkspaceVars);

const { data, isPending, isSuccess, isError, error } = useListLeadsByWorkspace(listLeadsByWorkspaceVars);

const { data, isPending, isSuccess, isError, error } = useListDealsByWorkspace(listDealsByWorkspaceVars);

const { data, isPending, isSuccess, isError, error } = useBootstrapWorkspace(bootstrapWorkspaceVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getCurrentUserByAuthUid, getWorkspaceBySlug, listWorkspaceMembers, listSavedLists, listPipelineOverview, listPipelineStages, listContactsByWorkspace, listLeadsByWorkspace, listDealsByWorkspace, bootstrapWorkspace } from '@dataconnect/generated';


// Operation GetCurrentUserByAuthUid:  For variables, look at type GetCurrentUserByAuthUidVars in ../index.d.ts
const { data } = await GetCurrentUserByAuthUid(dataConnect, getCurrentUserByAuthUidVars);

// Operation GetWorkspaceBySlug:  For variables, look at type GetWorkspaceBySlugVars in ../index.d.ts
const { data } = await GetWorkspaceBySlug(dataConnect, getWorkspaceBySlugVars);

// Operation ListWorkspaceMembers:  For variables, look at type ListWorkspaceMembersVars in ../index.d.ts
const { data } = await ListWorkspaceMembers(dataConnect, listWorkspaceMembersVars);

// Operation ListSavedLists:  For variables, look at type ListSavedListsVars in ../index.d.ts
const { data } = await ListSavedLists(dataConnect, listSavedListsVars);

// Operation ListPipelineOverview:  For variables, look at type ListPipelineOverviewVars in ../index.d.ts
const { data } = await ListPipelineOverview(dataConnect, listPipelineOverviewVars);

// Operation ListPipelineStages:  For variables, look at type ListPipelineStagesVars in ../index.d.ts
const { data } = await ListPipelineStages(dataConnect, listPipelineStagesVars);

// Operation ListContactsByWorkspace:  For variables, look at type ListContactsByWorkspaceVars in ../index.d.ts
const { data } = await ListContactsByWorkspace(dataConnect, listContactsByWorkspaceVars);

// Operation ListLeadsByWorkspace:  For variables, look at type ListLeadsByWorkspaceVars in ../index.d.ts
const { data } = await ListLeadsByWorkspace(dataConnect, listLeadsByWorkspaceVars);

// Operation ListDealsByWorkspace:  For variables, look at type ListDealsByWorkspaceVars in ../index.d.ts
const { data } = await ListDealsByWorkspace(dataConnect, listDealsByWorkspaceVars);

// Operation BootstrapWorkspace:  For variables, look at type BootstrapWorkspaceVars in ../index.d.ts
const { data } = await BootstrapWorkspace(dataConnect, bootstrapWorkspaceVars);


```