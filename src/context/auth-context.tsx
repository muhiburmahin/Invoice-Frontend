"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import {
  getAuthMe,
  getWorkspaceMe,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "@/services/auth.service";
import type { AuthSessionPayload } from "@/types/auth";
import type { WorkspaceMe } from "@/types/auth";

type AuthContextValue = {
  session: AuthSessionPayload | null;
  workspace: WorkspaceMe | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSessionPayload | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceMe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await getAuthMe();
      setSession(me);
      const ws = await getWorkspaceMe();
      setWorkspace(ws);
    } catch (error) {
      if (isUnauthorized(error)) {
        setSession(null);
        setWorkspace(null);
        return;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await refresh();
      } catch {
        if (!cancelled) {
          setSession(null);
          setWorkspace(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const login = useCallback(
    async (input: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const result = await loginRequest(input);
      setSession(result);
      await refresh();
      router.push("/dashboard");
    },
    [refresh, router],
  );

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      acceptTerms: boolean;
    }) => {
      const result = await registerRequest(input);
      setSession(result);
      await refresh();
      router.push("/dashboard");
    },
    [refresh, router],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error(getApiErrorMessage(error));
    } finally {
      setSession(null);
      setWorkspace(null);
      router.push("/auth/login");
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      workspace,
      isLoading,
      isAuthenticated: Boolean(session?.user),
      login,
      register,
      logout,
      refresh,
    }),
    [session, workspace, isLoading, login, register, logout, refresh],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
