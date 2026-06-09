import type { PaginatedMeta, SubscriptionPlan } from "@/types";

export type ChartMonthPoint = {
  label: string;
  key: string;
};

export type InvoiceStats = {
  total: number;
  thisMonth: number;
  outstandingBalance: number;
  byStatus: Record<string, number>;
  monthlyCreated?: (ChartMonthPoint & { count: number })[];
  plan: SubscriptionPlan;
  usage: {
    invoicesThisMonth: number;
    limit: number;
    remaining: number | null;
  };
};

export type ClientStats = {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
  withPortal: number;
  plan: SubscriptionPlan;
  usage: {
    clients: number;
    limit: number;
    remaining: number | null;
  };
};

export type PaymentStats = {
  total: number;
  thisMonth: number;
  completedTotal: number;
  completedThisMonth: number;
  pendingTotal: number;
  byMethod: Record<string, { count: number; amount: number }>;
  monthlyTrend?: (ChartMonthPoint & { amount: number })[];
};

export type BillingUsage = {
  plan: SubscriptionPlan;
  clients: number;
  invoicesThisMonth: number;
  recurringSchedules: number;
};

export type InvoiceListItem = {
  id: string;
  number: string;
  status: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  total: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  client: {
    id: string;
    name: string;
    email: string;
    company: string | null;
  };
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type BusinessProfile = {
  id: string;
  name: string;
  logo: string | null;
  currency: string;
  invoicePrefix: string;
};

export type DashboardOverview = {
  invoiceStats: InvoiceStats;
  clientStats: ClientStats;
  paymentStats: PaymentStats;
  billingUsage: BillingUsage;
  recentInvoices: InvoiceListItem[];
  overdueInvoices: InvoiceListItem[];
  notifications: NotificationItem[];
  unreadCount: number;
  business: BusinessProfile | null;
  /** True when one or more dashboard API calls failed (degraded data). */
  partialLoad?: boolean;
  failedRequests?: number;
};
