/** Routes that do not require authentication (no middleware; client guards only where noted). */

export const AUTH_ROUTES = {
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyEmail: "/auth/verify-email",
  resendVerification: "/auth/resend-verification",
  callback: "/auth/callback",
} as const;

/** Authenticated app home (not the public marketing `/` page). */
export const DASHBOARD_HOME = "/dashboard" as const;

export const AUTH_GUEST_ONLY_PATHS = [
  AUTH_ROUTES.login,
  AUTH_ROUTES.register,
  AUTH_ROUTES.forgotPassword,
] as const;

export const LEGACY_AUTH_REDIRECTS = {
  "/login": AUTH_ROUTES.login,
  "/register": AUTH_ROUTES.register,
  "/forgot-password": AUTH_ROUTES.forgotPassword,
} as const;

export function portalPath(token: string, suffix = ""): string {
  const base = `/portal/${token}`;
  return suffix ? `${base}${suffix.startsWith("/") ? suffix : `/${suffix}`}` : base;
}

import { isMarketingPath } from "@/config/marketing-nav";

const EXTRA_PUBLIC = ["/privacy", "/terms"] as const;

/** Paths that must never run protected auth guards or session bootstrap redirects. */
export function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (isMarketingPath(pathname)) return true;
  if (EXTRA_PUBLIC.includes(pathname as (typeof EXTRA_PUBLIC)[number])) return true;
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/portal")) return true;
  if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") {
    return true;
  }
  return false;
}

export function isProtectedRoute(pathname: string): boolean {
  return !isPublicRoute(pathname);
}
