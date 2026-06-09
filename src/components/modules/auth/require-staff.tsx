"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { RequireAuth } from "@/components/modules/auth/require-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_HOME } from "@/config/public-routes";
import { useAuth } from "@/hooks/useAuth";
import { isStaff } from "@/lib/roles";

export function RequireStaff({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <StaffGate>{children}</StaffGate>
    </RequireAuth>
  );
}

function StaffGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (isLoading || isStaff(user?.role)) {
      didRedirect.current = false;
      return;
    }
    if (didRedirect.current) return;
    didRedirect.current = true;
    router.replace(DASHBOARD_HOME);
  }, [isLoading, router, user?.role]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!isStaff(user?.role)) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          You do not have permission to access the admin console.
        </p>
        <Button render={<Link href={DASHBOARD_HOME} />}>Back to dashboard</Button>
      </div>
    );
  }

  return <>{children}</>;
}
