export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  success: false;
  message: string;
  code?: string;
  requestId?: string;
};

export type SubscriptionPlan = "FREE" | "PRO" | "ENTERPRISE";
export type UserRole = "USER" | "SUPPORT" | "SUPER_ADMIN";

export type PlanLimits = {
  maxClients: number;
  maxInvoicesPerMonth: number;
  maxRecurringSchedules: number;
  pdfExport: boolean;
  customBranding: boolean;
  prioritySupport: boolean;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
};

export type AuthSessionPayload = {
  user: AuthUser;
  role: UserRole;
  plan: SubscriptionPlan;
  isVerified: boolean;
  isActive: boolean;
  message?: string;
};

export type WorkspaceMe = {
  user: AuthUser;
  subscription: {
    plan: SubscriptionPlan;
    status: string;
    currentPeriodEnd: string | null;
  } | null;
  planLimits: PlanLimits;
  unreadNotificationCount: number;
};

export type AuthConfig = {
  providers: {
    google: boolean;
    github: boolean;
    emailPassword: boolean;
  };
  passwordRequirements: { id: string; label: string }[];
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
