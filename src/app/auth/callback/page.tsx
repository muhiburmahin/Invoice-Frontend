"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { DASHBOARD_HOME, isProtectedRoute } from "@/config/public-routes";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";

function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh, isAuthenticated } = useAuth();
  const [message, setMessage] = useState("Completing sign in…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const error =
        searchParams.get("error") ??
        searchParams.get("error_description") ??
        searchParams.get("message");

      if (error) {
        toast.error(decodeURIComponent(error.replace(/\+/g, " ")));
        router.replace("/auth/login");
        return;
      }

      try {
        setMessage("Setting up your workspace…");
        await refresh();
        if (cancelled) return;

        toast.success("Signed in with Google");
        const from = searchParams.get("from");
        const destination =
          from && from.startsWith("/") && !from.startsWith("//") && isProtectedRoute(from)
            ? from
            : DASHBOARD_HOME;
        router.replace(destination);
      } catch (e) {
        if (cancelled) return;
        toast.error(getApiErrorMessage(e));
        router.replace("/auth/login");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh, router, searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      const from = searchParams.get("from");
      const destination =
        from && from.startsWith("/") && isProtectedRoute(from) ? from : DASHBOARD_HOME;
      router.replace(destination);
    }
  }, [isAuthenticated, router, searchParams]);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-4">
      <div className="flex size-14 items-center justify-center rounded-full bg-brand-secondary">
        <Loader2 className="size-7 animate-spin text-brand" />
      </div>
      <p className="text-sm font-medium text-foreground">{message}</p>
      <p className="text-xs text-muted-foreground">Please wait…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-brand" />
        </div>
      }
    >
      <OAuthCallbackHandler />
    </Suspense>
  );
}
