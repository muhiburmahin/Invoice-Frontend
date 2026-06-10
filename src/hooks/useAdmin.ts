"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminService } from "@/services/admin.service";
import type {
  ListActivityLogsParams,
  ListAdminUsersParams,
  RunScheduledJobsInput,
  UpdateAdminUserPlanInput,
  UpdateAdminUserRoleInput,
  UpdateAdminUserStatusInput,
} from "@/types/admin";

export const adminQueryKey = ["admin"] as const;

export function useUpgradeRequests() {
  return useQuery({
    queryKey: [...adminQueryKey, "upgrade-requests"],
    queryFn: () => adminService.listUpgradeRequests(),
    staleTime: 15_000,
  });
}

export function usePlatformStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...adminQueryKey, "stats"],
    queryFn: () => adminService.stats(),
    staleTime: 60_000,
    enabled: options?.enabled ?? true,
  });
}

export function useAdminUsers(params: ListAdminUsersParams = {}) {
  return useQuery({
    queryKey: [...adminQueryKey, "users", params],
    queryFn: () => adminService.listUsers(params),
    staleTime: 30_000,
  });
}

export function useAdminUser(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...adminQueryKey, "users", id],
    queryFn: () => adminService.getUser(id),
    enabled: options?.enabled ?? Boolean(id),
    staleTime: 30_000,
  });
}

export function useActivityLogs(params: ListActivityLogsParams = {}) {
  return useQuery({
    queryKey: [...adminQueryKey, "activity-logs", params],
    queryFn: () => adminService.listActivityLogs(params),
    staleTime: 30_000,
  });
}

function invalidateAdminUsers(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  void queryClient.invalidateQueries({ queryKey: [...adminQueryKey, "users"] });
  void queryClient.invalidateQueries({ queryKey: [...adminQueryKey, "stats"] });
  if (id) {
    void queryClient.invalidateQueries({ queryKey: [...adminQueryKey, "users", id] });
  }
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAdminUserStatusInput }) =>
      adminService.updateUserStatus(id, body),
    onSuccess: (_data, variables) => invalidateAdminUsers(queryClient, variables.id),
  });
}

export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAdminUserRoleInput }) =>
      adminService.updateUserRole(id, body),
    onSuccess: (_data, variables) => invalidateAdminUsers(queryClient, variables.id),
  });
}

export function useUpdateAdminUserPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAdminUserPlanInput }) =>
      adminService.updateUserPlan(id, body),
    onSuccess: (_data, variables) => invalidateAdminUsers(queryClient, variables.id),
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => invalidateAdminUsers(queryClient),
  });
}

export function useTriggerPasswordReset() {
  return useMutation({
    mutationFn: (id: string) => adminService.triggerPasswordReset(id),
  });
}

export function useRunAdminJobs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RunScheduledJobsInput) => adminService.runJobs(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...adminQueryKey, "activity-logs"],
      });
    },
  });
}
