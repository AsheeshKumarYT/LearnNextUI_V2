import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/services/api';
import { STORAGE_KEYS } from '@/config/app';
import { rolesOf } from '@/config/roles';

export const AuthContext = createContext(null);

const KEY = STORAGE_KEYS.auth;

// "Remember my choice" on the role picker — per user, on this device
const roleKey = (userId) => `ln.role.${userId}`;
function readSavedRole(userId) {
  try {
    return localStorage.getItem(roleKey(userId));
  } catch {
    return null;
  }
}
function saveRole(userId, role) {
  try {
    if (role) localStorage.setItem(roleKey(userId), role);
    else localStorage.removeItem(roleKey(userId));
  } catch {
    /* storage unavailable */
  }
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!session) return;
    const store = session.remember ? localStorage : sessionStorage;
    store.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable */
  }
}

/**
 * Mock authentication. Session = { token, user, remember }.
 * "Remember me" keeps the session in localStorage; otherwise it lives in
 * sessionStorage and ends when the browser tab closes.
 * Swap authApi.login for a real endpoint — nothing else needs to change.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const commit = useCallback((next) => {
    writeSession(next);
    setSession(next);
  }, []);

  // One account can hold several roles. One role → straight in; several → the remembered choice on this device, or
  // none yet (ProtectedRoute then sends them to /choose-role).
  const login = useCallback(
    async ({ email, password, remember = true }) => {
      const { token, user } = await authApi.login({ email, password });
      const roles = rolesOf(user);
      const saved = readSavedRole(user.id);
      const role = roles.length === 1 ? roles[0] : roles.includes(saved) ? saved : null;
      commit({ token, user, remember, role });
      return { user, role };
    },
    [commit],
  );

  /** Pick the role to continue as; `rememberIt` skips the picker next time on this device */
  const chooseRole = useCallback((role, rememberIt = false) => {
    setSession((s) => {
      if (!s) return s;
      saveRole(s.user.id, rememberIt ? role : null);
      const next = { ...s, role, switching: false };
      writeSession(next);
      return next;
    });
  }, []);

  /**
   * Back to the role picker (also forgets a remembered choice, so the picker shows). Marks the session as switching,
   * so the picker opens the new role's start page — not the page you were on, whose address can mean a different
   * record in another portal.
   */
  const switchRole = useCallback(() => {
    setSession((s) => {
      if (!s) return s;
      saveRole(s.user.id, null);
      const next = { ...s, role: null, switching: true };
      writeSession(next);
      return next;
    });
  }, []);

  const logout = useCallback(() => commit(null), [commit]);

  const updateUser = useCallback(
    (patch) => setSession((s) => {
      if (!s) return s;
      const next = { ...s, user: { ...s.user, ...patch } };
      writeSession(next);
      return next;
    }),
    [],
  );

  // Refresh the stored user from the API once per load (e.g. role/name changed since sign-in)
  const hasSession = Boolean(session?.token);
  useEffect(() => {
    if (!hasSession) return;
    authApi.me().then(updateUser).catch(() => {});
  }, [hasSession, updateUser]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      // Sessions from before roles existed have no `role` key — they were admins
      role: session ? (session.role === undefined ? 'admin' : session.role) : null,
      roles: rolesOf(session?.user),
      switching: Boolean(session?.switching),
      login,
      chooseRole,
      switchRole,
      logout,
      updateUser,
    }),
    [session, login, chooseRole, switchRole, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
