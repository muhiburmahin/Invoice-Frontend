import { apiGet } from "@/lib/api";
import type {
  BillingUsage,
  BusinessProfile,
  ClientStats,
  DashboardOverview,
  InvoiceListItem,
  InvoiceStats,
  NotificationItem,
  PaymentStats,
} from "@/types/dashboard";

const EMPTY_INVOICE_STATS: InvoiceStats = {
  total: 0,
  thisMonth: 0,
  outstandingBalance: 0,
  byStatus: {},
  monthlyCreated: [],
  plan: "FREE",
  usage: { invoicesThisMonth: 0, limit: 5, remaining: 5 },
};

const EMPTY_CLIENT_STATS: ClientStats = {
  total: 0,
  active: 0,
  inactive: 0,
  deleted: 0,
  withPortal: 0,
  plan: "FREE",
  usage: { clients: 0, limit: 10, remaining: 10 },
};

const EMPTY_PAYMENT_STATS: PaymentStats = {
  total: 0,
  thisMonth: 0,
  completedTotal: 0,
  completedThisMonth: 0,
  pendingTotal: 0,
  byMethod: {},
  monthlyTrend: [],
};

const EMPTY_BILLING_USAGE: BillingUsage = {
  plan: "FREE",
  clients: 0,
  invoicesThisMonth: 0,
  recurringSchedules: 0,
};

export async function fetchInvoiceStats(): Promise<InvoiceStats> {
  const res = await apiGet<{ stats: InvoiceStats }>("/api/v1/invoices/stats");
  return res.stats;
}

export async function fetchClientStats(): Promise<ClientStats> {
  const res = await apiGet<{ stats: ClientStats }>("/api/v1/clients/stats");
  return res.stats;
}

export async function fetchPaymentStats(): Promise<PaymentStats> {
  const res = await apiGet<{ stats: PaymentStats }>("/api/v1/payments/stats");
  return res.stats;
}

export async function fetchBillingUsage(): Promise<BillingUsage> {
  const res = await apiGet<{ usage: BillingUsage }>("/api/v1/billing/usage");
  return res.usage;
}

export async function fetchRecentInvoices(limit = 6): Promise<InvoiceListItem[]> {
  const res = await apiGet<{ invoices: InvoiceListItem[] }>(
    `/api/v1/invoices?limit=${limit}&sortBy=createdAt&sortOrder=desc`,
  );
  return res.invoices;
}

export async function fetchOverdueInvoices(limit = 5): Promise<InvoiceListItem[]> {
  const res = await apiGet<{ invoices: InvoiceListItem[] }>(
    `/api/v1/invoices?limit=${limit}&overdue=true&sortBy=dueDate&sortOrder=asc`,
  );
  return res.invoices;
}

export async function fetchNotifications(limit = 5): Promise<{
  notifications: NotificationItem[];
  unreadCount: number;
}> {
  try {
    const [list, unread] = await Promise.all([
      apiGet<{ notifications: NotificationItem[] }>(
        `/api/v1/notifications?limit=${limit}&sortBy=createdAt&sortOrder=desc`,
      ),
      apiGet<{ unreadCount: number }>("/api/v1/notifications/unread-count"),
    ]);
    return {
      notifications: list.notifications,
      unreadCount: unread.unreadCount,
    };
  } catch {
    return { notifications: [], unreadCount: 0 };
  }
}

export async function fetchBusiness(): Promise<BusinessProfile | null> {
  try {
    const res = await apiGet<{ business: BusinessProfile }>("/api/v1/business");
    return res.business;
  } catch {
    return null;
  }
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const settled = await Promise.allSettled([
    fetchInvoiceStats(),
    fetchClientStats(),
    fetchPaymentStats(),
    fetchBillingUsage(),
    fetchRecentInvoices(6),
    fetchOverdueInvoices(5),
    fetchNotifications(5),
    fetchBusiness(),
  ]);

  const failedCount = settled.filter((r) => r.status === "rejected").length;

  const notificationsResult =
    settled[6]?.status === "fulfilled"
      ? settled[6].value
      : { notifications: [] as NotificationItem[], unreadCount: 0 };

  return {
    invoiceStats:
      settled[0]?.status === "fulfilled" ? settled[0].value : EMPTY_INVOICE_STATS,
    clientStats:
      settled[1]?.status === "fulfilled" ? settled[1].value : EMPTY_CLIENT_STATS,
    paymentStats:
      settled[2]?.status === "fulfilled" ? settled[2].value : EMPTY_PAYMENT_STATS,
    billingUsage:
      settled[3]?.status === "fulfilled" ? settled[3].value : EMPTY_BILLING_USAGE,
    recentInvoices:
      settled[4]?.status === "fulfilled" ? settled[4].value : [],
    overdueInvoices:
      settled[5]?.status === "fulfilled" ? settled[5].value : [],
    notifications: notificationsResult.notifications,
    unreadCount: notificationsResult.unreadCount,
    business:
      settled[7]?.status === "fulfilled" ? settled[7].value : null,
    partialLoad: failedCount > 0,
    failedRequests: failedCount,
  };
}

export const dashboardService = {
  getOverview: getDashboardOverview,
  fetchInvoiceStats,
  fetchClientStats,
  fetchPaymentStats,
  fetchBillingUsage,
  fetchRecentInvoices,
  fetchOverdueInvoices,
  fetchNotifications,
  fetchBusiness,
};
