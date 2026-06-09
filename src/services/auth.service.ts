import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { env } from "@/config/env";
import type { AuthConfig, AuthSessionPayload, WorkspaceMe } from "@/types";
import type { UpdateProfileResponse, UserSession } from "@/types/account";

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

export async function updateProfile(input: {
  name?: string;
  avatar?: string;
}): Promise<UpdateProfileResponse> {
  return apiPatch<UpdateProfileResponse>("/api/v1/auth/profile", input);
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  revokeOtherSessions?: boolean;
}): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/api/v1/auth/change-password", input);
}

export async function deleteAccount(input: {
  password?: string;
  confirm: "DELETE";
}): Promise<{ message: string }> {
  return apiDelete<{ message: string }>("/api/v1/auth/account", input);
}

export async function listSessions(): Promise<{ sessions: UserSession[] }> {
  return apiGet<{ sessions: UserSession[] }>("/api/v1/auth/sessions");
}

export async function revokeSession(id: string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/api/v1/auth/sessions/${id}`);
}

export async function revokeOtherSessions(): Promise<{
  revoked: number;
  message: string;
}> {
  return apiDelete<{ revoked: number; message: string }>(
    "/api/v1/auth/sessions/others",
  );
}

function buildOAuthCallbackUrl(returnTo?: string): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : env.appUrl;
  const callback = new URL(OAUTH_CALLBACK_PATH, origin);
  if (returnTo) {
    callback.searchParams.set("from", returnTo);
  }
  return callback.toString();
}

function apiAuthBase(): string {
  const base = env.apiBaseUrl?.replace(/\/$/, "");
  if (base) return base;
  return typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : "http://localhost:5000";
}

/** OAuth start URL — hits the Express API (not the Next.js origin). */
export function getOAuthUrl(
  provider: "google" | "github",
  options?: { returnTo?: string },
): string {
  const params = new URLSearchParams({
    redirect: buildOAuthCallbackUrl(options?.returnTo),
  });
  const base = apiAuthBase();
  const path =
    provider === "google"
      ? `${base}/api/v1/auth/google`
      : `${base}/api/v1/auth/social/${provider}`;
  return `${path}?${params.toString()}`;
}

export async function getOAuthUrlAsync(
  provider: "google" | "github",
  options?: { returnTo?: string },
): Promise<string> {
  const redirect = encodeURIComponent(buildOAuthCallbackUrl(options?.returnTo));
  const path =
    provider === "google"
      ? `/api/v1/auth/google?redirect=${redirect}`
      : `/api/v1/auth/social/${provider}/url?redirect=${redirect}`;
  if (provider === "google") {
    return `${apiAuthBase()}${path}`;
  }
  const data = await apiGet<{ url: string; provider: string }>(path);
  return data.url;
}
