"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import {
  changePassword,
  deleteAccount,
  listSessions,
  revokeOtherSessions,
  revokeSession,
  updateProfile,
} from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export const sessionsQueryKey = ["auth", "sessions"] as const;

export function useSessions() {
  return useQuery({
    queryKey: sessionsQueryKey,
    queryFn: () => listSessions(),
    staleTime: 30_000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  const session = useAuthStore((s) => s.session);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (session) {
        setSession({
          ...session,
          user: data.user,
          role: data.role,
          isVerified: data.isVerified,
          isActive: data.isActive,
        });
      }
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
    },
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
    },
  });
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
  });
}
