import { apiGet, apiPost } from "@/lib/api";
import type { AuthConfig, AuthSessionPayload, WorkspaceMe } from "@/types";

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

export function getOAuthUrl(provider: "google" | "github"): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/api/v1/auth/social/${provider}`;
}
