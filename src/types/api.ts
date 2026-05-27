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
