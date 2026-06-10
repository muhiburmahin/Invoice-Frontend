"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { AuthPageShell } from "@/components/modules/auth/AuthPageShell";
import { LoginForm } from "@/components/modules/auth/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthConfig } from "@/services/auth.service";

export default function LoginPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["auth-config"],
    queryFn: getAuthConfig,
    staleTime: 5 * 60_000,
  });

  return (
    <AuthPageShell
      variant="login"
      title="Sign in"
      description="Business owners and platform staff use the same login — choose your account type below."
      footer={
        <span>
          New business?{" "}
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
    </AuthPageShell>
  );
}
