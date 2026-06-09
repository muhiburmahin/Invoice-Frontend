import { apiDelete, apiGet, apiGetWithMeta, apiPatch, apiPost } from "@/lib/api";
import type {
  ActivityLog,
  AdminUserDetail,
  AdminUserStats,
  ListActivityLogsParams,
  ListActivityLogsResult,
  ListAdminUsersParams,
  ListAdminUsersResult,
  PlatformStats,
  RunScheduledJobsInput,
  UpdateAdminUserPlanInput,
  UpdateAdminUserRoleInput,
  UpdateAdminUserStatusInput,
} from "@/types/admin";
import type { Subscription } from "@/types/billing";

function buildUsersQuery(params: ListAdminUsersParams = {}): string {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.search) qs.set("search", params.search);
  if (params.role) qs.set("role", params.role);
  if (params.plan) qs.set("plan", params.plan);
  if (params.status) qs.set("status", params.status);
  if (params.isVerified !== undefined) {
    qs.set("isVerified", String(params.isVerified));
  }
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  const query = qs.toString();
  return query ? `?${query}` : "";
}

function buildLogsQuery(params: ListActivityLogsParams = {}): string {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.userId) qs.set("userId", params.userId);
  if (params.action) qs.set("action", params.action);
  const query = qs.toString();
  return query ? `?${query}` : "";
}

export const adminService = {
  stats: () => apiGet<{ stats: PlatformStats }>("/api/v1/admin/stats"),

  listUsers: async (
    params: ListAdminUsersParams = {},
  ): Promise<ListAdminUsersResult> => {
    const { data, meta } = await apiGetWithMeta<{
      users: ListAdminUsersResult["users"];
    }>(`/api/v1/admin/users${buildUsersQuery(params)}`);
    return { users: data.users, meta };
  },

  getUser: (id: string) =>
    apiGet<{ user: AdminUserDetail; stats: AdminUserStats }>(
      `/api/v1/admin/users/${id}`,
    ),

  updateUserStatus: (id: string, body: UpdateAdminUserStatusInput) =>
    apiPatch<{ user: { id: string; email: string; isActive: boolean; role: string }; message: string }>(
      `/api/v1/admin/users/${id}/status`,
      body,
    ),

  updateUserRole: (id: string, body: UpdateAdminUserRoleInput) =>
    apiPatch<{ user: { id: string; email: string; role: string }; message: string }>(
      `/api/v1/admin/users/${id}/role`,
      body,
    ),

  updateUserPlan: (id: string, body: UpdateAdminUserPlanInput) =>
    apiPatch<{ subscription: Subscription; message: string }>(
      `/api/v1/admin/users/${id}/plan`,
      body,
    ),

  deleteUser: (id: string) =>
    apiDelete<{ message: string }>(`/api/v1/admin/users/${id}`),

  triggerPasswordReset: (id: string) =>
    apiPost<{ message: string }>(`/api/v1/admin/users/${id}/reset-password`),

  listActivityLogs: async (
    params: ListActivityLogsParams = {},
  ): Promise<ListActivityLogsResult> => {
    const { data, meta } = await apiGetWithMeta<{ logs: ActivityLog[] }>(
      `/api/v1/admin/activity-logs${buildLogsQuery(params)}`,
    );
    return { logs: data.logs, meta };
  },

  runJobs: (body: RunScheduledJobsInput = {}) =>
    apiPost<Record<string, unknown>>("/api/v1/admin/jobs/run", body),
};
