"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { LoginForm } from "@/components/modules/auth/LoginForm";
import { AuthCard } from "@/components/layout/auth-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthConfig } from "@/services/auth.service";

export default function LoginPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["auth-config"],
    queryFn: getAuthConfig,
    staleTime: 5 * 60_000,
  });

  return (
    <AuthCard
      title="Sign in"
      description="Use Google or your email to access your workspace"
      footer={
        <span>
          New here?{" "}
          <Link href="/auth/register" className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full bg-brand-secondary/50" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <LoginForm
          oauth={{
            google: data?.providers.google ?? false,
            github: data?.providers.github ?? false,
          }}
        />
      )}
    </AuthCard>
  );
}
