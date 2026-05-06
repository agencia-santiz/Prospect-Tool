import { createHash, pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

const DEFAULT_AUTH_STORE_PATH = join(homedir(), '.bloom-leads', 'auth-store.json');
const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 64;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const PLAN_LIMITS = {
  free: 100,
  pro: 5000,
  enterprise: 1000000,
};
const WORKSPACE_ROLES = ['owner', 'admin', 'member', 'viewer'];
const WORKSPACE_MEMBER_STATUSES = ['active', 'invited', 'disabled'];
const ADMIN_SEED = {
  email: 'admin@admin.com',
  password: 'admin123',
  name: 'Admin',
  plan: 'enterprise',
  usageLimit: PLAN_LIMITS.enterprise,
};

const createEmptyStore = () => ({
  users: [],
  sessions: [],
  workspaces: [],
  workspaceMembers: [],
});

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const normalizeName = (value) => String(value || '').trim().replace(/\s+/g, ' ');

const normalizeRole = (value) => {
  const role = String(value || 'member').trim().toLowerCase();
  return WORKSPACE_ROLES.includes(role) ? role : 'member';
};

const normalizeMemberStatus = (value) => {
  const status = String(value || 'active').trim().toLowerCase();
  return WORKSPACE_MEMBER_STATUSES.includes(status) ? status : 'active';
};

const slugify = (value) => {
  const slug = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'workspace';
};

const deriveDisplayName = (email) => {
  const localPart = String(email || '').split('@')[0] || '';
  const cleaned = localPart.replace(/[._-]+/g, ' ').trim();

  if (!cleaned) {
    return 'Bloom User';
  }

  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const buildAvatarUrl = (name) => {
  const query = encodeURIComponent(normalizeName(name) || 'Bloom User');
  return `https://ui-avatars.com/api/?name=${query}&background=ba0c2f&color=fff`;
};

const hashPassword = (password, salt = randomBytes(16).toString('hex')) => {
  const hash = pbkdf2Sync(String(password), salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, 'sha512').toString('hex');
  return { salt, hash };
};

const verifyPassword = (password, passwordRecord = {}) => {
  if (!passwordRecord.salt || !passwordRecord.hash) {
    return false;
  }

  const computedHash = Buffer.from(
    pbkdf2Sync(String(password), passwordRecord.salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, 'sha512').toString('hex'),
    'hex'
  );
  const storedHash = Buffer.from(String(passwordRecord.hash), 'hex');

  if (computedHash.length !== storedHash.length) {
    return false;
  }

  return timingSafeEqual(computedHash, storedHash);
};

const hashSessionToken = (token) => createHash('sha256').update(String(token)).digest('hex');

const createSessionRecord = (userId) => {
  const token = randomUUID().replace(/-/g, '');
  const now = new Date().toISOString();

  return {
    tokenHash: hashSessionToken(token),
    token,
    userId,
    createdAt: now,
    updatedAt: now,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
};

const getDefaultStorePath = (env = {}) => {
  if (env.AUTH_STORE_PATH) {
    return env.AUTH_STORE_PATH;
  }

  return DEFAULT_AUTH_STORE_PATH;
};

const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatarUrl,
  plan: String(user.plan || 'free').toUpperCase(),
  usage: user.usageCount || 0,
  limit: user.usageLimit || PLAN_LIMITS.free,
});

const sanitizeUser = (user) => ({
  ...user,
  email: normalizeEmail(user.email),
  name: normalizeName(user.name) || deriveDisplayName(user.email),
  plan: String(user.plan || 'free').toLowerCase(),
  usageCount: Number.isFinite(Number(user.usageCount)) ? Number(user.usageCount) : 0,
  usageLimit: Number.isFinite(Number(user.usageLimit)) ? Number(user.usageLimit) : PLAN_LIMITS.free,
  isActive: user.isActive !== false,
  avatarUrl: user.avatarUrl || buildAvatarUrl(user.name || user.email),
});

const sanitizeSession = (session) => ({
  ...session,
  tokenHash: String(session.tokenHash || ''),
  userId: String(session.userId || ''),
  expiresAt: String(session.expiresAt || ''),
});

const sanitizeWorkspace = (workspace) => ({
  ...workspace,
  id: String(workspace.id || randomUUID()),
  ownerUserId: String(workspace.ownerUserId || ''),
  name: normalizeName(workspace.name) || 'Workspace',
  slug: slugify(workspace.slug || workspace.name),
  plan: String(workspace.plan || 'free').toLowerCase(),
  isArchived: workspace.isArchived === true,
  createdAt: String(workspace.createdAt || new Date().toISOString()),
  updatedAt: String(workspace.updatedAt || workspace.createdAt || new Date().toISOString()),
});

const sanitizeWorkspaceMember = (member) => ({
  ...member,
  workspaceId: String(member.workspaceId || ''),
  userId: String(member.userId || ''),
  role: normalizeRole(member.role),
  status: normalizeMemberStatus(member.status),
  createdAt: String(member.createdAt || new Date().toISOString()),
  updatedAt: String(member.updatedAt || member.createdAt || new Date().toISOString()),
});

const createSeedUser = ({ email, password, name, plan, usageLimit }) => {
  const now = new Date().toISOString();
  const passwordRecord = hashPassword(password);

  return sanitizeUser({
    id: randomUUID(),
    email,
    name,
    avatarUrl: buildAvatarUrl(name),
    authProvider: 'email',
    plan,
    isActive: true,
    usageLimit,
    usageCount: 0,
    passwordSalt: passwordRecord.salt,
    passwordHash: passwordRecord.hash,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  });
};

const ensureSeedUsers = (currentStore) => {
  const existingAdmin = currentStore.users.find((user) => user.email === normalizeEmail(ADMIN_SEED.email));

  if (!existingAdmin) {
    currentStore.users.push(createSeedUser(ADMIN_SEED));
    return true;
  }

  return false;
};

const createUniqueSlug = (currentStore, baseSlug) => {
  const existingSlugs = new Set(currentStore.workspaces.map((workspace) => workspace.slug));
  let slug = baseSlug || 'workspace';
  let suffix = 2;

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug || 'workspace'}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

const createWorkspaceRecord = (currentStore, { ownerUserId, name, plan }) => {
  const now = new Date().toISOString();
  const workspaceName = normalizeName(name) || 'Workspace';
  const slug = createUniqueSlug(currentStore, slugify(workspaceName));

  return {
    id: randomUUID(),
    ownerUserId,
    name: workspaceName,
    slug,
    plan: String(plan || 'free').toLowerCase(),
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };
};

const createWorkspaceMemberRecord = ({ workspaceId, userId, role = 'member', status = 'active' }) => {
  const now = new Date().toISOString();

  return {
    workspaceId,
    userId,
    role: normalizeRole(role),
    status: normalizeMemberStatus(status),
    createdAt: now,
    updatedAt: now,
  };
};

const createWorkspaceForUser = (currentStore, user, { name, role = 'owner' } = {}) => {
  const displayName = normalizeName(user.name) || deriveDisplayName(user.email);
  const workspaceName = name || (normalizeEmail(user.email) === normalizeEmail(ADMIN_SEED.email) ? 'Admin Workspace' : `Workspace de ${displayName}`);
  const workspace = createWorkspaceRecord(currentStore, {
    ownerUserId: user.id,
    name: workspaceName,
    plan: user.plan || 'free',
  });

  currentStore.workspaces.push(workspace);
  currentStore.workspaceMembers.push(createWorkspaceMemberRecord({
    workspaceId: workspace.id,
    userId: user.id,
    role,
    status: 'active',
  }));

  return workspace;
};

const buildWorkspacePayload = (workspace, currentStore) => ({
  id: workspace.id,
  ownerUserId: workspace.ownerUserId,
  name: workspace.name,
  slug: workspace.slug,
  plan: workspace.plan,
  memberCount: currentStore.workspaceMembers.filter((member) => member.workspaceId === workspace.id && member.status !== 'disabled').length,
  isArchived: workspace.isArchived,
  createdAt: workspace.createdAt,
  updatedAt: workspace.updatedAt,
});

const buildWorkspaceMemberPayload = (member, currentStore) => {
  const user = currentStore.users.find((item) => item.id === member.userId);

  return {
    workspaceId: member.workspaceId,
    userId: member.userId,
    name: user?.name || 'Unknown user',
    email: user?.email || '',
    avatar: user?.avatarUrl,
    role: member.role,
    status: member.status,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
};

const ensureWorkspaceState = (currentStore) => {
  let changed = false;

  currentStore.workspaces = Array.isArray(currentStore.workspaces) ? currentStore.workspaces.map(sanitizeWorkspace) : [];
  currentStore.workspaceMembers = Array.isArray(currentStore.workspaceMembers) ? currentStore.workspaceMembers.map(sanitizeWorkspaceMember) : [];

  for (const user of currentStore.users) {
    const activeMemberships = currentStore.workspaceMembers.filter((member) => member.userId === user.id && member.status !== 'disabled');

    if (activeMemberships.length > 0) {
      continue;
    }

    createWorkspaceForUser(currentStore, user);
    changed = true;
  }

  return changed;
};

const getPrimaryWorkspaceContext = (currentStore, userId) => {
  const memberships = currentStore.workspaceMembers
    .filter((member) => member.userId === userId && member.status !== 'disabled')
    .sort((left, right) => {
      const leftRank = WORKSPACE_ROLES.indexOf(left.role);
      const rightRank = WORKSPACE_ROLES.indexOf(right.role);
      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      return Date.parse(left.createdAt) - Date.parse(right.createdAt);
    });

  const membership = memberships[0];
  if (!membership) {
    return null;
  }

  const workspace = currentStore.workspaces.find((item) => item.id === membership.workspaceId && !item.isArchived);
  if (!workspace) {
    return null;
  }

  return {
    workspace: buildWorkspacePayload(workspace, currentStore),
    membership: {
      workspaceId: membership.workspaceId,
      userId: membership.userId,
      role: membership.role,
      status: membership.status,
    },
    members: currentStore.workspaceMembers
      .filter((item) => item.workspaceId === workspace.id && item.status !== 'disabled')
      .map((item) => buildWorkspaceMemberPayload(item, currentStore)),
  };
};

const buildAuthPayload = (currentStore, user, session) => {
  const workspaceContext = getPrimaryWorkspaceContext(currentStore, user.id);

  return {
    user: serializeUser(user),
    ...(workspaceContext || {}),
    sessionToken: session.token,
    expiresAt: session.expiresAt,
  };
};

export const createAuthService = ({ env = process.env } = {}) => {
  const storePath = getDefaultStorePath(env);
  let store = null;
  let loadPromise = null;
  let writeQueue = Promise.resolve();

  const loadStore = async () => {
    if (store) {
      return store;
    }

    if (!loadPromise) {
      loadPromise = (async () => {
        try {
          const raw = await readFile(storePath, 'utf8');
          const parsed = JSON.parse(raw);
          store = {
            users: Array.isArray(parsed.users) ? parsed.users.map(sanitizeUser) : [],
            sessions: Array.isArray(parsed.sessions) ? parsed.sessions.map(sanitizeSession) : [],
            workspaces: Array.isArray(parsed.workspaces) ? parsed.workspaces.map(sanitizeWorkspace) : [],
            workspaceMembers: Array.isArray(parsed.workspaceMembers) ? parsed.workspaceMembers.map(sanitizeWorkspaceMember) : [],
          };
          const seedChanged = ensureSeedUsers(store);
          const workspaceChanged = ensureWorkspaceState(store);
          const changed = seedChanged || workspaceChanged;
          if (changed) {
            await persistStore();
          }
        } catch (error) {
          if (error?.code === 'ENOENT') {
            store = createEmptyStore();
            ensureSeedUsers(store);
            ensureWorkspaceState(store);
            await persistStore();
            return store;
          }

          if (error instanceof SyntaxError) {
            throw new Error(`Auth store at ${storePath} contains invalid JSON`);
          }

          throw error;
        }

        return store;
      })();
    }

    return loadPromise;
  };

  const persistStore = async () => {
    writeQueue = writeQueue.catch(() => undefined).then(async () => {
      await mkdir(dirname(storePath), { recursive: true });
      await writeFile(storePath, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
    });

    return writeQueue;
  };

  const withStore = async (mutator) => {
    const currentStore = await loadStore();
    const result = await mutator(currentStore);
    await persistStore();
    return result;
  };

  const findUserByEmail = (currentStore, email) => currentStore.users.find((user) => user.email === normalizeEmail(email));

  const cleanupExpiredSessions = (currentStore) => {
    const now = Date.now();
    const activeSessions = currentStore.sessions.filter((session) => {
      const expiresAtMs = Date.parse(session.expiresAt);
      return Number.isFinite(expiresAtMs) && expiresAtMs > now;
    });

    if (activeSessions.length !== currentStore.sessions.length) {
      currentStore.sessions = activeSessions;
      return true;
    }

    return false;
  };

  const issueSession = (currentStore, userId) => {
    const session = createSessionRecord(userId);
    currentStore.sessions.push({
      tokenHash: session.tokenHash,
      userId: session.userId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      expiresAt: session.expiresAt,
    });

    return session;
  };

  const register = async ({ email, password, name }) => withStore(async (currentStore) => {
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = normalizeName(name);

    if (!normalizedEmail || !password) {
      const error = new Error('Email e senha sao obrigatorios');
      error.code = 'INVALID_AUTH_REQUEST';
      error.statusCode = 400;
      throw error;
    }

    if (findUserByEmail(currentStore, normalizedEmail)) {
      const error = new Error('Ja existe uma conta com este email');
      error.code = 'EMAIL_ALREADY_EXISTS';
      error.statusCode = 409;
      throw error;
    }

    const now = new Date().toISOString();
    const passwordRecord = hashPassword(password);
    const user = sanitizeUser({
      id: randomUUID(),
      email: normalizedEmail,
      name: normalizedName || deriveDisplayName(normalizedEmail),
      avatarUrl: buildAvatarUrl(normalizedName || deriveDisplayName(normalizedEmail)),
      authProvider: 'email',
      plan: 'free',
      isActive: true,
      usageLimit: PLAN_LIMITS.free,
      usageCount: 0,
      passwordSalt: passwordRecord.salt,
      passwordHash: passwordRecord.hash,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    });

    currentStore.users.push(user);
    const workspace = createWorkspaceForUser(currentStore, user);
    const session = issueSession(currentStore, user.id);
    return {
      ...buildAuthPayload(currentStore, user, session),
      workspace: buildWorkspacePayload(workspace, currentStore),
    };
  });

  const login = async ({ email, password }) => withStore(async (currentStore) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      const error = new Error('Email e senha sao obrigatorios');
      error.code = 'INVALID_AUTH_REQUEST';
      error.statusCode = 400;
      throw error;
    }

    cleanupExpiredSessions(currentStore);

    const user = findUserByEmail(currentStore, normalizedEmail);
    if (!user || user.isActive === false || !verifyPassword(password, { salt: user.passwordSalt, hash: user.passwordHash })) {
      const error = new Error('Credenciais invalidas');
      error.code = 'INVALID_CREDENTIALS';
      error.statusCode = 401;
      throw error;
    }

    user.updatedAt = new Date().toISOString();
    user.lastLoginAt = user.updatedAt;

    const session = issueSession(currentStore, user.id);
    return buildAuthPayload(currentStore, user, session);
  });

  const getSession = async (token) => {
    const normalizedToken = String(token || '').trim();

    if (!normalizedToken) {
      const error = new Error('Session token is required');
      error.code = 'MISSING_SESSION_TOKEN';
      error.statusCode = 401;
      throw error;
    }

    return withStore(async (currentStore) => {
      cleanupExpiredSessions(currentStore);

      const tokenHash = hashSessionToken(normalizedToken);
      const session = currentStore.sessions.find((item) => item.tokenHash === tokenHash);

      if (!session) {
        const error = new Error('Session not found');
        error.code = 'SESSION_NOT_FOUND';
        error.statusCode = 401;
        throw error;
      }

      const user = currentStore.users.find((item) => item.id === session.userId);

      if (!user || user.isActive === false) {
        const error = new Error('Session user not found');
        error.code = 'SESSION_USER_NOT_FOUND';
        error.statusCode = 401;
        throw error;
      }

      session.updatedAt = new Date().toISOString();
      return buildAuthPayload(currentStore, user, {
        token: normalizedToken,
        expiresAt: session.expiresAt,
      });
    });
  };

  const logout = async (token) => {
    const normalizedToken = String(token || '').trim();

    if (!normalizedToken) {
      const error = new Error('Session token is required');
      error.code = 'MISSING_SESSION_TOKEN';
      error.statusCode = 401;
      throw error;
    }

    return withStore(async (currentStore) => {
      const tokenHash = hashSessionToken(normalizedToken);
      const beforeCount = currentStore.sessions.length;
      currentStore.sessions = currentStore.sessions.filter((item) => item.tokenHash !== tokenHash);

      if (currentStore.sessions.length === beforeCount) {
        const error = new Error('Session not found');
        error.code = 'SESSION_NOT_FOUND';
        error.statusCode = 401;
        throw error;
      }

      return { ok: true };
    });
  };

  const resolveToken = (requestData = {}) => {
    const headers = requestData.headers || {};
    const authorization = String(headers.authorization || headers.Authorization || '').trim();

    if (authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.slice(7).trim();
    }

    const bodyToken = requestData.body?.sessionToken || requestData.body?.token;
    return String(bodyToken || '').trim();
  };

  return {
    register,
    login,
    getSession: (requestData = {}) => getSession(resolveToken(requestData)),
    getWorkspaceContext: (requestData = {}) => {
      const token = resolveToken(requestData);
      const normalizedToken = String(token || '').trim();

      if (!normalizedToken) {
        const error = new Error('Session token is required');
        error.code = 'MISSING_SESSION_TOKEN';
        error.statusCode = 401;
        throw error;
      }

      return withStore(async (currentStore) => {
        cleanupExpiredSessions(currentStore);

        const tokenHash = hashSessionToken(normalizedToken);
        const session = currentStore.sessions.find((item) => item.tokenHash === tokenHash);

        if (!session) {
          const error = new Error('Session not found');
          error.code = 'SESSION_NOT_FOUND';
          error.statusCode = 401;
          throw error;
        }

        const user = currentStore.users.find((item) => item.id === session.userId);

        if (!user || user.isActive === false) {
          const error = new Error('Session user not found');
          error.code = 'SESSION_USER_NOT_FOUND';
          error.statusCode = 401;
          throw error;
        }

        const workspaceContext = getPrimaryWorkspaceContext(currentStore, user.id);

        if (!workspaceContext) {
          const error = new Error('Workspace not found');
          error.code = 'WORKSPACE_NOT_FOUND';
          error.statusCode = 404;
          throw error;
        }

        return workspaceContext;
      });
    },
    logout: (requestData = {}) => logout(resolveToken(requestData)),
  };
};
