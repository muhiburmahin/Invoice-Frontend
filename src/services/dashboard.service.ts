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
  const [
    invoiceStats,
    clientStats,
    paymentStats,
    billingUsage,
    recentInvoices,
    overdueInvoices,
    { notifications, unreadCount },
    business,
  ] = await Promise.all([
    fetchInvoiceStats(),
    fetchClientStats(),
    fetchPaymentStats(),
    fetchBillingUsage(),
    fetchRecentInvoices(6),
    fetchOverdueInvoices(5),
    fetchNotifications(5),
    fetchBusiness(),
  ]);

  return {
    invoiceStats,
    clientStats,
    paymentStats,
    billingUsage,
    recentInvoices,
    overdueInvoices,
    notifications,
    unreadCount,
    business,
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
