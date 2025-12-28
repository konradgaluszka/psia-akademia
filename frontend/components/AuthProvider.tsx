"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CurrentUser = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export type UseCurrentUserResult = {
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<UseCurrentUserResult | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    []
  );
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/me`, {
        credentials: "include"
      });

      if (!response.ok) {
        const detail =
          response.status === 401 ? "Not authenticated" : "Failed to load user";
        setUser(null);
        setError(detail);
        return;
      }

      const data = (await response.json()) as CurrentUser;
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch current user", err);
      setError("Failed to load user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, refresh: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): UseCurrentUserResult {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
