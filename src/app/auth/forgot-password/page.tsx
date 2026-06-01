"use client";

import Link from "next/link";

import { ForgotPasswordForm } from "@/components/modules/auth/ForgotPasswordForm";
import { AuthCard } from "@/components/layout/auth-card";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot password"
      description="We'll email you a reset link if the account exists"
      footer={
        <Link href="/auth/login" className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
