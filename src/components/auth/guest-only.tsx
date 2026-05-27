"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export function GuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center p-6">
        <Skeleton className="h-[420px] w-full max-w-md" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
