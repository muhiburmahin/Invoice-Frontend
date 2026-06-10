"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, type ReactNode } from "react";

import { AUTH_ROUTES, DASHBOARD_HOME, isProtectedRoute } from "@/config/public-routes";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { getDefaultHomeForRole } from "@/lib/roles";
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

  const hydrateSession = useCallback(
    async (options?: { clearOnUnauthorized?: boolean }) => {
      const clearOnUnauthorized = options?.clearOnUnauthorized ?? true;

      try {
        const me = await getAuthMe();
        setSession(me);
      } catch (error) {
        if (isUnauthorized(error)) {
          if (clearOnUnauthorized) {
            reset();
          }
          return false;
        }
        throw error;
      }

      try {
        const ws = await getWorkspaceMe();
        setWorkspace(ws);
      } catch {
        setWorkspace(null);
      }

      return true;
    },
    [reset, setSession, setWorkspace],
  );

  const refresh = useCallback(async () => {
    await hydrateSession({ clearOnUnauthorized: true });
  }, [hydrateSession]);

  useEffect(() => {
    let cancelled = false;
    const protectedRoute = isProtectedRoute(pathname);

    if (protectedRoute) {
      setLoading(true);

      (async () => {
        try {
          await hydrateSession({ clearOnUnauthorized: true });
        } catch {
          if (!cancelled && !useAuthStore.getState().session) {
            reset();
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    } else {
      setLoading(false);

      // Keep session alive on marketing/home pages — cookies may still be valid.
      void (async () => {
        try {
          await hydrateSession({ clearOnUnauthorized: false });
        } catch {
          /* network errors on public pages should not sign the user out */
        }
      })();
    }

    return () => {
      cancelled = true;
    };
  }, [hydrateSession, pathname, reset, setLoading]);

  useEffect(() => {
    const store = useAuthStore.getState();

    store.login = async (input) => {
      const result = await loginApi(input);
      setSession(result);

      if (!result.isVerified) {
        router.push(`${AUTH_ROUTES.verifyEmail}?pending=1`);
        return;
      }

      await refresh();
      const from = searchParams.get("from");
      const defaultHome = getDefaultHomeForRole(result.role);
      const destination =
        from && from.startsWith("/") && !from.startsWith("//") && isProtectedRoute(from)
          ? from
          : defaultHome;
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
        // Session may already be expired — local sign-out still succeeds.
        if (!isUnauthorized(e)) {
          console.error(getApiErrorMessage(e));
        }
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
