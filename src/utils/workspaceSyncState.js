export const WORKSPACE_ORIGINS = ['remote', 'local', 'legacy'];

export const resolveWorkspaceSyncState = ({
  workspaceOrigin = 'legacy',
  isOnline = true,
  pendingMutationCount = 0,
  isAuthenticated = false,
  workspaceId = null,
  workspaceSlug = null,
} = {}) => {
  const origin = WORKSPACE_ORIGINS.includes(workspaceOrigin) ? workspaceOrigin : 'legacy';

  if (!isAuthenticated) {
    return {
      status: 'idle',
      variant: 'neutral',
      label: 'Sessão ausente',
      detail: 'Faça login para carregar o workspace',
      origin,
      workspaceId,
      workspaceSlug,
    };
  }

  if (!isOnline) {
    return {
      status: 'offline',
      variant: 'warning',
      label: origin === 'remote' ? 'Offline com workspace remoto' : 'Offline local',
      detail: origin === 'remote' ? 'A sessão está amarrada ao workspace remoto, mas a rede caiu' : 'Os dados ficam no armazenamento local',
      origin,
      workspaceId,
      workspaceSlug,
    };
  }

  if (pendingMutationCount > 0) {
    return {
      status: 'pending',
      variant: 'info',
      label: `${pendingMutationCount} pendente${pendingMutationCount === 1 ? '' : 's'}`,
      detail: origin === 'remote'
        ? 'Existem mutações locais aguardando sincronização'
        : 'O estado local ainda não foi enviado para um backend remoto',
      origin,
      workspaceId,
      workspaceSlug,
    };
  }

  if (origin === 'remote') {
    return {
      status: 'synced',
      variant: 'success',
      label: 'Sincronizado',
      detail: 'Sessão conectada ao workspace remoto',
      origin,
      workspaceId,
      workspaceSlug,
    };
  }

  if (origin === 'local') {
    return {
      status: 'local',
      variant: 'neutral',
      label: 'Local',
      detail: 'Sessão amarrada ao workspace local do desktop',
      origin,
      workspaceId,
      workspaceSlug,
    };
  }

  return {
    status: 'legacy',
    variant: 'warning',
    label: 'Legado',
    detail: 'Sessão herdada do fluxo anterior',
    origin,
    workspaceId,
    workspaceSlug,
  };
};
