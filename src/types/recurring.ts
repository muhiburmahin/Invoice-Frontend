import type { PaginatedMeta, SubscriptionPlan } from "@/types";

export const RECURRING_FREQUENCIES = [
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
] as const;

export type RecurringFrequency = (typeof RECURRING_FREQUENCIES)[number];

export type RecurringClientSummary = {
  id: string;
  name: string;
  email: string;
  company: string | null;
};

export type RecurringSchedule = {
  id: string;
  clientId: string;
  frequency: RecurringFrequency;
  nextRunAt: string;
  lastRunAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  client: RecurringClientSummary;
  _count: { invoices: number };
  isOverdue: boolean;
  isDueSoon: boolean;
};

export type RecurringStats = {
  total: number;
  active: number;
  inactive: number;
  overdue: number;
  dueSoon: number;
  byFrequency: Record<string, number>;
  plan: SubscriptionPlan;
  limit: number;
  used: number;
};

export type RecurringMeta = {
  frequencies: RecurringFrequency[];
  dueSoonDays: number;
  sortFields: readonly ("createdAt" | "nextRunAt" | "updatedAt")[];
  requiresTemplateInvoice: boolean;
};

export type RecurringInvoiceListItem = {
  id: string;
  number: string;
  status: string;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  isRecurring: boolean;
  createdAt: string;
};

export type ListRecurringParams = {
  page?: number;
  limit?: number;
  clientId?: string;
  frequency?: RecurringFrequency;
  isActive?: boolean;
  overdue?: boolean;
  sortBy?: "createdAt" | "nextRunAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

export type ListRecurringResult = {
  schedules: RecurringSchedule[];
  meta: PaginatedMeta;
};

export type CreateRecurringInput = {
  clientId: string;
  frequency: RecurringFrequency;
  nextRunAt?: string;
  isActive?: boolean;
};

export type UpdateRecurringInput = {
  frequency?: RecurringFrequency;
  nextRunAt?: string;
};

export type RunRecurringInput = {
  issueDate?: string;
  dueDate?: string;
};

export type RecurringDetailResponse = {
  schedule: RecurringSchedule;
  invoiceCount: number;
};
