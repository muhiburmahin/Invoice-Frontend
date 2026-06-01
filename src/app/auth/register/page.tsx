"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { RegisterForm } from "@/components/modules/auth/RegisterForm";
import { AuthCard } from "@/components/layout/auth-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthConfig } from "@/services/auth.service";

export default function RegisterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["auth-config"],
    queryFn: getAuthConfig,
    staleTime: 5 * 60_000,
  });

  return (
    <AuthCard
      title="Create account"
      description="Start invoicing in minutes — Google or email"
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-brand hover:underline">
            Sign in
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
        <RegisterForm
          passwordHints={data?.passwordRequirements}
          oauth={{
            google: data?.providers.google ?? false,
            github: data?.providers.github ?? false,
          }}
        />
      )}
    </AuthCard>
  );
}
