"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { AUTH_ROUTES } from "@/config/public-routes";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      didRedirect.current = false;
      return;
    }

    if (didRedirect.current) return;
    didRedirect.current = true;

    const loginUrl = pathname
      ? `${AUTH_ROUTES.login}?from=${encodeURIComponent(pathname)}`
      : AUTH_ROUTES.login;

    router.replace(loginUrl);
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-1 flex-col gap-4 p-6">
        <Skeleton className="h-8 w-48 bg-brand-secondary/50" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
