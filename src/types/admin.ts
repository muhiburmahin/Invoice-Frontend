import type {
  PaginatedMeta,
  SubscriptionPlan,
  SubscriptionStatus,
  UserRole,
} from "@/types";
import type { Subscription } from "@/types/billing";

export type AdminPaginatedMeta = PaginatedMeta & {
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

export type AdminUserListItem = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  deletedAt: string | null;
  lastLoginAt: string | null;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
  business: { name: string; logo: string | null } | null;
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
};

export type AdminUserDetail = AdminUserListItem & {
  business: Record<string, unknown> | null;
  subscription: Subscription | null;
  accounts: { providerId: string; accountId: string; createdAt: string }[];
};

export type AdminUserStats = {
  invoices: number;
  clients: number;
  paidTotal: number;
};

export type PlatformChartPoint = {
  label: string;
  key: string;
};

export type PlatformUserGrowthPoint = PlatformChartPoint & {
  count: number;
};

export type PlatformRevenuePoint = PlatformChartPoint & {
  amount: number;
};

export type PlatformStats = {
  users: {
    total: number;
    active: number;
    deleted: number;
    newThisMonth: number;
    newLastMonth: number;
  };
  invoices: {
    total: number;
    paid: number;
    overdue: number;
  };
  revenue: {
    thisMonth: number;
    allTime: number;
  };
  plans: Record<SubscriptionPlan, number>;
  charts: {
    userGrowth: PlatformUserGrowthPoint[];
    revenueTrend: PlatformRevenuePoint[];
    invoicesByStatus: Record<string, number>;
    usersByRole: Record<string, number>;
  };
};

export type ActivityLog = {
  id: string;
  userId: string | null;
  invoiceId: string | null;
  action: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: { id: string; email: string; name: string } | null;
};

export type ListAdminUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  plan?: SubscriptionPlan;
  status?: "active" | "inactive" | "deleted";
  isVerified?: boolean;
  sortBy?: "createdAt" | "lastLoginAt" | "email" | "name";
  sortOrder?: "asc" | "desc";
};

export type ListActivityLogsParams = {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
};

export type UpdateAdminUserStatusInput = {
  isActive: boolean;
  reason?: string;
};

export type UpdateAdminUserRoleInput = {
  role: UserRole;
};

export type UpdateAdminUserPlanInput = {
  plan: SubscriptionPlan;
  status?: SubscriptionStatus;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  reason?: string;
};

export type ScheduledJobName = "overdue" | "subscription_expiry" | "recurring";

export type RunScheduledJobsInput = {
  jobs?: ScheduledJobName[];
};

export type ListAdminUsersResult = {
  users: AdminUserListItem[];
  meta: AdminPaginatedMeta;
};

export type ListActivityLogsResult = {
  logs: ActivityLog[];
  meta: AdminPaginatedMeta;
};
