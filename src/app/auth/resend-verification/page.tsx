"use client";

import Link from "next/link";

import { ResendVerificationForm } from "@/components/modules/auth/ResendVerificationForm";
import { AuthCard } from "@/components/layout/auth-card";
import { AUTH_ROUTES } from "@/config/public-routes";

export default function ResendVerificationPage() {
  return (
    <AuthCard
      title="Resend verification"
      description="Request a new email confirmation link"
      footer={
        <Link href={AUTH_ROUTES.login} className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      <ResendVerificationForm />
    </AuthCard>
  );
}
