"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, type ReactNode } from "react";

import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import {
  getAuthMe,
  getWorkspaceMe,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setSession, setWorkspace, setLoading, reset } = useAuthStore();

  const refresh = useCallback(async () => {
    try {
      const me = await getAuthMe();
      setSession(me);
      const ws = await getWorkspaceMe();
      setWorkspace(ws);
    } catch (error) {
      if (isUnauthorized(error)) {
        reset();
        return;
      }
      throw error;
    }
  }, [reset, setSession, setWorkspace]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refresh();
      } catch {
        if (!cancelled) reset();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh, reset, setLoading]);

  useEffect(() => {
    const store = useAuthStore.getState();
    store.login = async (input) => {
      const result = await loginApi(input);
      setSession(result);
      await refresh();
      router.push("/");
    };
    store.register = async (input) => {
      const result = await registerApi(input);
      setSession(result);
      await refresh();
      router.push("/");
    };
    store.logout = async () => {
      try {
        await logoutApi();
      } catch (e) {
        console.error(getApiErrorMessage(e));
      } finally {
        reset();
        router.push("/login");
      }
    };
    store.refresh = refresh;
  }, [refresh, reset, router, setSession]);

  return <>{children}</>;
}
