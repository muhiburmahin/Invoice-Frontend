"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { AuthPageShell } from "@/components/modules/auth/AuthPageShell";
import { RegisterForm } from "@/components/modules/auth/RegisterForm";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthConfig } from "@/services/auth.service";

export default function RegisterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["auth-config"],
    queryFn: getAuthConfig,
    staleTime: 5 * 60_000,
  });

  return (
    <AuthPageShell
      variant="register"
      title="Create business account"
      description="For freelancers and companies — staff accounts are assigned by an administrator."
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
    </AuthPageShell>
  );
}
