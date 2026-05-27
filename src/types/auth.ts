import type { PlanLimits, SubscriptionPlan, UserRole } from "@/types/api";

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
