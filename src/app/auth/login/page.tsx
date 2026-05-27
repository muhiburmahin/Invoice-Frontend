"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { LoginForm } from "@/components/auth/login-form";
import { AuthCard } from "@/components/layout/auth-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthConfig } from "@/services/auth.service";

export default function LoginPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["auth-config"],
    queryFn: getAuthConfig,
  });

  return (
    <AuthCard
      title="Sign in"
      description="Use your email or a connected provider"
      footer={
        <span>
          New here?{" "}
          <Link href="/auth/register" className="font-medium text-foreground hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
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
