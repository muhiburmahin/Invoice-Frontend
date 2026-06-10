"use client";

import Link from "next/link";

import { ForgotPasswordForm } from "@/components/modules/auth/ForgotPasswordForm";
import { AuthPageShell } from "@/components/modules/auth/AuthPageShell";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Forgot password"
      description="Enter your email — we'll send a reset link if an account exists."
      footer={
        <Link href="/auth/login" className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
