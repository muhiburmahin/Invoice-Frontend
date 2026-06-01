import { apiGet, apiPost } from "@/lib/api";
import { env } from "@/config/env";
import type { AuthConfig, AuthSessionPayload, WorkspaceMe } from "@/types";

const OAUTH_CALLBACK_PATH = "/auth/callback";

export async function getAuthConfig(): Promise<AuthConfig> {
  return apiGet<AuthConfig>("/api/v1/auth/config");
}

export async function login(input: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthSessionPayload> {
  return apiPost<AuthSessionPayload>("/api/v1/auth/login", input);
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}): Promise<AuthSessionPayload> {
  return apiPost<AuthSessionPayload>("/api/v1/auth/register", input);
}

export async function logout(): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/api/v1/auth/logout");
}

export async function getAuthMe(): Promise<AuthSessionPayload> {
  return apiGet<AuthSessionPayload>("/api/v1/auth/me");
}

export async function getWorkspaceMe(): Promise<WorkspaceMe> {
  return apiGet<WorkspaceMe>("/api/v1/me");
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/api/v1/auth/forgot-password", { email });
}

export async function resetPassword(input: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/api/v1/auth/reset-password", input);
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/api/v1/auth/verify-email", { token });
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/api/v1/auth/resend-verification", { email });
}

/** OAuth start URL — backend validates redirect against CLIENT_URL / CORS */
export function getOAuthUrl(
  provider: "google" | "github",
  options?: { returnTo?: string },
): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : env.appUrl;
  const callback = new URL(OAUTH_CALLBACK_PATH, origin);
  if (options?.returnTo) {
    callback.searchParams.set("from", options.returnTo);
  }
  const params = new URLSearchParams({
    redirect: callback.toString(),
  });
  return `${origin}/api/v1/auth/social/${provider}?${params.toString()}`;
}

export async function getOAuthUrlAsync(
  provider: "google" | "github",
  options?: { returnTo?: string },
): Promise<string> {
  const origin =
    typeof window !== "undefined" ? window.location.origin : env.appUrl;
  const callback = new URL(OAUTH_CALLBACK_PATH, origin);
  if (options?.returnTo) {
    callback.searchParams.set("from", options.returnTo);
  }
  const data = await apiGet<{ url: string; provider: string }>(
    `/api/v1/auth/social/${provider}/url?redirect=${encodeURIComponent(callback.toString())}`,
  );
  return data.url;
}
