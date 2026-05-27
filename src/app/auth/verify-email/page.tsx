"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthCard } from "@/components/layout/auth-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api";
import { verifyEmail } from "@/services/auth.service";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
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
  }, [token]);

  if (status === "loading") {
    return <Skeleton className="h-12 w-full" />;
  }

  return (
    <div className="space-y-3 text-sm">
      <p className={status === "ok" ? "text-foreground" : "text-destructive"}>
        {message}
      </p>
      <Link href="/auth/login" className="font-medium text-foreground hover:underline">
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
