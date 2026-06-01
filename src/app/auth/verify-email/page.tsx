"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthCard } from "@/components/layout/auth-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AUTH_ROUTES } from "@/config/public-routes";
import { getApiErrorMessage } from "@/lib/api";
import { verifyEmail } from "@/services/auth.service";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const pending = searchParams.get("pending") === "1";
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    pending && !token ? "idle" : "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (pending && !token) {
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const result = await verifyEmail(token);
        if (!cancelled) {
          setStatus("ok");
          setMessage(result.message);
          toast.success("Email verified");
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(getApiErrorMessage(error));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pending, token]);

  if (pending && !token) {
    return (
      <div className="space-y-4 text-sm">
        <p className="text-foreground">
          Your account was created. We sent a verification link to your email — open it to
          activate your account.
        </p>
        <p className="text-muted-foreground">
          Did not receive it?{" "}
          <Link
            href={AUTH_ROUTES.resendVerification}
            className="font-medium text-brand hover:underline"
          >
            Resend verification email
          </Link>
        </p>
        <Link href={AUTH_ROUTES.login} className="inline-block font-medium text-brand hover:underline">
          Continue to sign in
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    return <Skeleton className="h-12 w-full" />;
  }

  return (
    <div className="space-y-3 text-sm">
      <p className={status === "ok" ? "text-foreground" : "text-destructive"}>
        {message}
      </p>
      {status === "error" ? (
        <Link
          href={AUTH_ROUTES.resendVerification}
          className="block font-medium text-brand hover:underline"
        >
          Resend verification email
        </Link>
      ) : null}
      <Link href={AUTH_ROUTES.login} className="font-medium text-brand hover:underline">
        Continue to sign in
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Verify email" description="Confirming your email address">
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <VerifyEmailContent />
      </Suspense>
    </AuthCard>
  );
}
