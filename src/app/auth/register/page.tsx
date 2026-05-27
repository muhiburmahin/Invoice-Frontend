"use client";

import { useQuery } from "@tanstack/react-query";

import { RegisterForm } from "@/components/auth/register-form";
import { AuthCard } from "@/components/layout/auth-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthConfig } from "@/services/auth.service";

export default function RegisterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["auth-config"],
    queryFn: getAuthConfig,
  });

  return (
    <AuthCard
      title="Create account"
      description="Start invoicing in minutes"
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <RegisterForm passwordHints={data?.passwordRequirements} />
      )}
    </AuthCard>
  );
}
