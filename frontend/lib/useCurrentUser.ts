"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type CurrentUser = {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
};

type UseCurrentUserResult = {
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useCurrentUser(): UseCurrentUserResult {
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
    let isMounted = true;
    void (async () => {
      if (!isMounted) {
        return;
      }
      await fetchUser();
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchUser]);

  return { user, isLoading, error, refresh: fetchUser };
}
