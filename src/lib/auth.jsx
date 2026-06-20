/**
 * Auth context — single source of truth for "who is logged in".
 *
 * On mount, attempts `GET /api/auth/me` using the stored token to revive
 * the session across page refreshes. Exposes:
 *   useAuth() → { user, ready, login, logout }
 *
 * Two helper components:
 *   <RequireAuth>  — redirect to /sign-in if not logged in.
 *   <RequireAdmin> — redirect to /sign-in if not Admin.
 */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, setToken, getToken } from './api.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // becomes true after the initial /me probe finishes

  // Hydrate from localStorage on mount.
  useEffect(() => {
    let alive = true;
    const token = getToken();
    if (!token) { setReady(true); return; }

    api.get('/auth/me')
      .then((data) => { if (alive) setUser(data.user); })
      .catch(() => {
        // Token expired / invalid → wipe and stay logged out.
        setToken(null);
        if (alive) setUser(null);
      })
      .finally(() => { if (alive) setReady(true); });

    return () => { alive = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  /**
   * Creates a new Customer account via POST /api/auth/signup and immediately
   * persists the returned JWT so the user lands on the marketplace already
   * signed-in — no "log in after signup" double-step.
   */
  const signup = useCallback(async (payload) => {
    const data = await api.post('/auth/signup', payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, signup, logout }),
    [user, ready, login, signup, logout]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth() must be called inside <AuthProvider>');
  return ctx;
}

/* ── route guards ───────────────────────────────────────────────────────── */

function FullPageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#0B1220',
      color: 'rgba(247,240,245,0.55)',
      fontFamily: 'VIP Hakm, Tajawal, sans-serif',
    }}>
      جارٍ التحقق…
    </div>
  );
}

export function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <FullPageLoader />;
  if (!user) {
    return <Navigate to="/sectors/advertising/marketplace/signin" replace state={{ from: location }} />;
  }
  return children;
}

export function RequireAdmin({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <FullPageLoader />;
  if (!user) {
    return <Navigate to="/sectors/advertising/marketplace/signin" replace state={{ from: location }} />;
  }
  if (user.role !== 'Admin') {
    // Logged in but not authorised → bounce to marketplace home (not back to sign-in).
    return <Navigate to="/sectors/advertising/marketplace" replace />;
  }
  return children;
}
