"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, type ReactNode } from "react";

import { AUTH_ROUTES, DASHBOARD_HOME, isProtectedRoute } from "@/config/public-routes";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import {
  getAuthMe,
  getWorkspaceMe,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

function AuthProviderInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setSession, setWorkspace, setLoading, reset } = useAuthStore();

  const refresh = useCallback(async () => {
    try {
      const me = await getAuthMe();
      setSession(me);
    } catch (error) {
      if (isUnauthorized(error)) {
        try {
          await logoutApi();
        } catch {
          /* clear stale cookies if backend allows */
        }
        reset();
        return;
      }
      throw error;
    }

    try {
      const ws = await getWorkspaceMe();
      setWorkspace(ws);
    } catch {
      setWorkspace(null);
    }
  }, [reset, setSession, setWorkspace]);

  // Only validate session on protected routes — public pages stay reachable without redirects.
  useEffect(() => {
    if (!isProtectedRoute(pathname)) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        await refresh();
      } catch (error) {
        if (!cancelled && isUnauthorized(error)) {
          reset();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, refresh, reset, setLoading]);

  useEffect(() => {
    const store = useAuthStore.getState();

    store.login = async (input) => {
      const result = await loginApi(input);
      setSession(result);
      await refresh();
      const from = searchParams.get("from");
      const destination =
        from && from.startsWith("/") && !from.startsWith("//") && isProtectedRoute(from)
          ? from
          : DASHBOARD_HOME;
      router.push(destination);
    };

    store.register = async (input) => {
      const result = await registerApi(input);
      setSession(result);
      await refresh();
      router.push(`${AUTH_ROUTES.verifyEmail}?pending=1`);
    };

    store.logout = async () => {
      try {
        await logoutApi();
      } catch (e) {
        console.error(getApiErrorMessage(e));
      } finally {
        reset();
        router.push(AUTH_ROUTES.login);
      }
    };

    store.refresh = refresh;
  }, [refresh, reset, router, searchParams, setSession]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </Suspense>
  );
}
