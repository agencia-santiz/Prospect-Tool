import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  bootstrapWorkspace,
  getCurrentUserByAuthUid,
  getWorkspaceBySlug,
  listWorkspaceMembers,
} from '@dataconnect/generated';
import { firebaseAuth, firebaseDataConnect } from '../lib/firebase';
import { User, UserPlan } from '../types';

interface AuthContextType {
  user: User | null;
  workspace: AuthWorkspace | null;
  workspaceMembers: AuthWorkspaceMember[];
  membership: AuthMembership | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  upgradePlan: () => void;
  incrementUsage: (count: number) => void;
  loading: boolean;
}

interface AuthWorkspace {
  id: string;
  ownerUserId: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  memberCount: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthWorkspaceMember {
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
  createdAt?: string;
  updatedAt?: string;
}

interface AuthMembership {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
}

interface LegacyAuthUserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: UserPlan;
  usage: number;
  limit: number;
}

interface LegacyAuthWorkspace {
  id: string;
  ownerUserId: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  memberCount: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LegacyAuthWorkspaceMember {
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
  createdAt?: string;
  updatedAt?: string;
}

interface LegacyAuthMembership {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
}

interface LegacySessionResponse {
  user: LegacyAuthUserResponse;
  workspace?: LegacyAuthWorkspace;
  members?: LegacyAuthWorkspaceMember[];
  membership?: LegacyAuthMembership;
  sessionToken: string;
  expiresAt?: string;
}

const AUTH_API_BASE_URL = 'http://127.0.0.1:8787';
const AUTH_TOKEN_STORAGE_KEY = 'bloom_auth_token';
const LEGACY_USER_STORAGE_KEY = 'nexus_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizePlan = (plan?: string | null): UserPlan => {
  switch ((plan || 'free').toLowerCase()) {
    case 'pro':
      return 'PRO';
    case 'enterprise':
      return 'ENTERPRISE';
    default:
      return 'FREE';
  }
};

const mapFirebaseUserToAppUser = (user: FirebaseUser): User => ({
  id: user.uid,
  name: user.displayName || user.email?.split('@')[0] || 'Usuário',
  email: user.email || '',
  avatar: user.photoURL || undefined,
  plan: 'FREE',
  usage: 0,
  limit: 100,
});

const mapLegacyUser = (user: LegacyAuthUserResponse): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  plan: user.plan,
  usage: user.usage,
  limit: user.limit,
});

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

const deriveWorkspaceSlug = (authUid: string, email: string) => {
  const localPart = email.split('@')[0] || 'workspace';
  const seed = authUid.replace(/-/g, '').slice(0, 8);
  return `${slugify(localPart)}-${seed}`.replace(/-+$/g, '');
};

const deriveWorkspaceName = (name: string, email: string) => {
  const base = name.trim() || email.split('@')[0] || 'Workspace';
  return `${base} Workspace`;
};

const mapDataConnectUser = (record: {
  id: string;
  authUid: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  authProvider: string;
  plan: string;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
}): User => ({
  id: record.id,
  name: record.name,
  email: record.email,
  avatar: record.avatarUrl || undefined,
  plan: normalizePlan(record.plan),
  usage: record.usageCount,
  limit: record.usageLimit,
});

const mapLegacyWorkspace = (workspace?: LegacyAuthWorkspace | null) => workspace || null;

const mapLegacyWorkspaceMember = (member: LegacyAuthWorkspaceMember): AuthWorkspaceMember => ({
  ...member,
});

const mapWorkspace = (
  workspace: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    owner: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string | null;
    };
  },
  memberCount: number,
): AuthWorkspace => ({
  id: workspace.id,
  ownerUserId: workspace.owner.id,
  name: workspace.name,
  slug: workspace.slug,
  plan: (workspace.plan.toLowerCase() as AuthWorkspace['plan']) || 'free',
  memberCount,
  isArchived: workspace.isArchived,
  createdAt: workspace.createdAt,
  updatedAt: workspace.updatedAt,
});

const mapMember = (member: {
  workspace: { id: string };
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}): AuthWorkspaceMember => ({
  workspaceId: member.workspace.id,
  userId: member.user.id,
  name: member.user.name,
  email: member.user.email,
  avatar: member.user.avatarUrl || undefined,
  role: member.role as AuthWorkspaceMember['role'],
  status: member.status as AuthWorkspaceMember['status'],
  createdAt: member.createdAt,
  updatedAt: member.updatedAt,
});

const getWorkspaceProfile = async (firebaseUser: FirebaseUser) => {
  if (!firebaseDataConnect || !firebaseUser.email) {
    return null;
  }

  const authUid = firebaseUser.uid;
  const name = firebaseUser.displayName || firebaseUser.email.split('@')[0] || 'Usuário';
  const workspaceSlug = deriveWorkspaceSlug(authUid, firebaseUser.email);
  const workspaceName = deriveWorkspaceName(name, firebaseUser.email);

  const currentUserResult = await getCurrentUserByAuthUid(firebaseDataConnect, { authUid });
  if (currentUserResult.data.users.length === 0) {
    await bootstrapWorkspace(firebaseDataConnect, {
      email: firebaseUser.email,
      name,
      workspaceName,
      workspaceSlug,
    });
  }

  const userResult = await getCurrentUserByAuthUid(firebaseDataConnect, { authUid });
  const userRecord = userResult.data.users[0];
  if (!userRecord) {
    return null;
  }

  const workspaceResult = await getWorkspaceBySlug(firebaseDataConnect, { slug: workspaceSlug });
  const workspaceRecord = workspaceResult.data.workspaces[0] || null;
  if (!workspaceRecord) {
    return {
      user: mapDataConnectUser(userRecord),
      workspace: null,
      workspaceMembers: [],
      membership: null,
    };
  }

  const membersResult = await listWorkspaceMembers(firebaseDataConnect, { workspaceId: workspaceRecord.id });
  const workspaceMembers = membersResult.data.workspaceMembers.map(mapMember);
  const membership = workspaceMembers.find((member) => member.userId === userRecord.id) || null;

  return {
    user: mapDataConnectUser(userRecord),
    workspace: mapWorkspace(workspaceRecord, workspaceMembers.length),
    workspaceMembers,
    membership,
  };
};

const requestLegacyAuth = async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${AUTH_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof payload?.message === 'string' ? payload.message : 'Nao foi possivel autenticar.';
    const error = new Error(message);
    (error as Error & { code?: string; statusCode?: number }).code = payload?.error;
    (error as Error & { code?: string; statusCode?: number }).statusCode = response.status;
    throw error;
  }

  return payload as T;
};

const shouldFallbackToLegacyAuth = (error: unknown) => {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: unknown }).code || '') : '';
  const message = typeof error === 'object' && error && 'message' in error ? String((error as { message?: unknown }).message || '') : '';
  return (
    code.includes('operation-not-allowed') ||
    code.includes('configuration-not-found') ||
    code.includes('invalid-api-key') ||
    message.includes('CONFIGURATION_NOT_FOUND') ||
    message.includes('operation-not-allowed')
  );
};

const hydrateLegacySession = async () => {
  const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_STORAGE_KEY);

  if (!storedToken) {
    return null;
  }

  try {
    const session = await requestLegacyAuth<LegacySessionResponse>('/auth/session', {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    return {
      user: mapLegacyUser(session.user),
      workspace: mapLegacyWorkspace(session.workspace),
      workspaceMembers: Array.isArray(session.members) ? session.members.map(mapLegacyWorkspaceMember) : [],
      membership: session.membership || null,
    };
  } catch {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<AuthWorkspace | null>(null);
  const [workspaceMembers, setWorkspaceMembers] = useState<AuthWorkspaceMember[]>([]);
  const [membership, setMembership] = useState<AuthMembership | null>(null);
  const [loading, setLoading] = useState(true);
  const syncTokenRef = useRef(0);

  useEffect(() => {
    let mounted = true;

    const initializePersistence = async () => {
      if (!firebaseAuth) {
        setLoading(false);
        return;
      }

      try {
        await setPersistence(firebaseAuth, browserLocalPersistence);
      } catch {
        // Persistence is best effort. The auth state listener still works without it.
      }
    };

    void initializePersistence();

    const unsubscribe = firebaseAuth
      ? onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
          if (!mounted) {
            return;
          }

          syncTokenRef.current += 1;
          const currentSync = syncTokenRef.current;

          if (!firebaseUser) {
            const legacySession = await hydrateLegacySession();

            if (!mounted || syncTokenRef.current !== currentSync) {
              return;
            }

            if (legacySession) {
              setUser(legacySession.user);
              setWorkspace(legacySession.workspace);
              setWorkspaceMembers(legacySession.workspaceMembers);
              setMembership(legacySession.membership);
              setLoading(false);
              return;
            }

            setUser(null);
            setWorkspace(null);
            setWorkspaceMembers([]);
            setMembership(null);
            localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
            localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
            setLoading(false);
            return;
          }

          setUser(mapFirebaseUserToAppUser(firebaseUser));
          localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
          localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
          setLoading(false);

          try {
            const profile = await getWorkspaceProfile(firebaseUser);
            if (!mounted || syncTokenRef.current !== currentSync || !profile) {
              return;
            }

            setUser(profile.user);
            setWorkspace(profile.workspace);
            setWorkspaceMembers(profile.workspaceMembers);
            setMembership(profile.membership);
          } catch {
            if (mounted && syncTokenRef.current === currentSync) {
              setWorkspace(null);
              setWorkspaceMembers([]);
              setMembership(null);
            }
          }
        })
      : undefined;

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!firebaseAuth) {
      const session = await requestLegacyAuth<LegacySessionResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.sessionToken);
      localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
      setUser(mapLegacyUser(session.user));
      setWorkspace(mapLegacyWorkspace(session.workspace));
      setWorkspaceMembers(Array.isArray(session.members) ? session.members.map(mapLegacyWorkspaceMember) : []);
      setMembership(session.membership || null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      if (shouldFallbackToLegacyAuth(error)) {
        const session = await requestLegacyAuth<LegacySessionResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
        });

        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.sessionToken);
        localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
        setUser(mapLegacyUser(session.user));
        setWorkspace(mapLegacyWorkspace(session.workspace));
        setWorkspaceMembers(Array.isArray(session.members) ? session.members.map(mapLegacyWorkspaceMember) : []);
        setMembership(session.membership || null);
        return;
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (!firebaseAuth) {
      const session = await requestLegacyAuth<LegacySessionResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.sessionToken);
      localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
      setUser(mapLegacyUser(session.user));
      setWorkspace(mapLegacyWorkspace(session.workspace));
      setWorkspaceMembers(Array.isArray(session.members) ? session.members.map(mapLegacyWorkspaceMember) : []);
      setMembership(session.membership || null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(credential.user, { displayName: name });
    } catch (error) {
      if (shouldFallbackToLegacyAuth(error)) {
        const session = await requestLegacyAuth<LegacySessionResponse>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.sessionToken);
        localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
        setUser(mapLegacyUser(session.user));
        setWorkspace(mapLegacyWorkspace(session.workspace));
        setWorkspaceMembers(Array.isArray(session.members) ? session.members.map(mapLegacyWorkspaceMember) : []);
        setMembership(session.membership || null);
        return;
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (firebaseAuth && firebaseAuth.currentUser) {
        await signOut(firebaseAuth);
      }

      const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
      if (token) {
        await requestLegacyAuth('/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } finally {
      setUser(null);
      setWorkspace(null);
      setWorkspaceMembers([]);
      setMembership(null);
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
    }
  };

  const upgradePlan = () => {
    // Billing is not wired yet.
  };

  const incrementUsage = (count: number) => {
    if (!user || !Number.isFinite(count) || count <= 0) {
      return;
    }

    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      return {
        ...currentUser,
        usage: currentUser.usage + count,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        workspaceMembers,
        membership,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        upgradePlan,
        incrementUsage,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
