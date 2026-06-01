"use client";

import type { ReactNode } from "react";

/**
 * Wraps guest auth pages (login/register/forgot).
 * Intentionally does NOT auto-redirect to "/" — that caused login ↔ home loops
 * when cookies were stale or session state flickered during bootstrap.
 */
export function GuestOnly({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
