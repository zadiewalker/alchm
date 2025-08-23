// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthState = {
  user: { uid: string; email?: string | null } | null;
  loading: boolean;
};

const AuthCtx = createContext<AuthState>({ user: null, loading: true });

export function useAuth() {
  return useContext(AuthCtx);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  // Stub: replace with real Firebase Auth wiring when ready
  useEffect(() => {
    // Example: setState({ user: { uid: "dev" }, loading: false });
    setState((s) => ({ ...s, loading: false }));
  }, []);

  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>;
}
