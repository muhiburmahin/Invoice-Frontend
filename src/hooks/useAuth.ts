"use client";

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const workspace = useAuthStore((s) => s.workspace);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const refresh = useAuthStore((s) => s.refresh);

  return {
    session,
    workspace,
    isLoading,
    isAuthenticated: Boolean(session?.user),
    login,
    register,
    logout,
    refresh,
    user: session?.user ?? null,
    plan: workspace?.subscription?.plan ?? session?.plan ?? "FREE",
  };
}
