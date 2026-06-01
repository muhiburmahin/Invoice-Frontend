"use client";

import { usePathname } from "next/navigation";

import { AUTH_GUEST_ONLY_PATHS } from "@/config/public-routes";

import { GuestOnly } from "./guest-only";

export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuestOnly = AUTH_GUEST_ONLY_PATHS.includes(
    pathname as (typeof AUTH_GUEST_ONLY_PATHS)[number],
  );

  if (isGuestOnly) {
    return <GuestOnly>{children}</GuestOnly>;
  }

  return <>{children}</>;
}
