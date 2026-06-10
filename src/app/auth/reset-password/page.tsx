"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AuthPageShell } from "@/components/modules/auth/AuthPageShell";
import { PasswordInput } from "@/components/modules/auth/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/modules/auth/PasswordStrengthIndicator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";
import { resetPassword } from "@/services/auth.service";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const passwordValue = form.watch("newPassword");

  const onSubmit = form.handleSubmit(async (values) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await resetPassword({ token, ...values });
      setDone(true);
      toast.success(result.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  if (!token) {
    return (
      <p className="text-sm text-destructive">
        This reset link is invalid or expired.{" "}
        <Link href="/auth/forgot-password" className="underline">
          Request a new one
        </Link>
        .
      </p>
    );
  }

  if (done) {
    return (
      <p className="text-sm text-muted-foreground">
        Your password was updated.{" "}
        <Link href="/auth/login" className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <PasswordInput
          id="newPassword"
          autoComplete="new-password"
          placeholder="Create a strong password"
          error={form.formState.errors.newPassword?.message}
          {...form.register("newPassword")}
        />
        <PasswordStrengthIndicator password={passwordValue} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={form.formState.errors.confirmPassword?.message}
          {...form.register("confirmPassword")}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving…" : "Reset password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthPageShell title="Reset password" description="Choose a new secure password">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthPageShell>
  );
}
