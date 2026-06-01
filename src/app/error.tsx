"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold text-brand">Something went wrong</h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button
        onClick={reset}
        className="bg-brand text-brand-foreground hover:bg-brand/90"
      >
        Try again
      </Button>
    </main>
  );
}
