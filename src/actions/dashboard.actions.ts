"use server";

import { serverApiGet } from "@/lib/server-api";
import { getDashboardOverview } from "@/services/dashboard.service";
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

/** Full dashboard payload — client hooks prefer dashboardService for browser cookies */
export async function getDashboardOverviewAction(): Promise<DashboardOverview> {
  return getDashboardOverview();
}

export async function getInvoiceStatsAction(): Promise<InvoiceStats> {
  const res = await serverApiGet<{ stats: InvoiceStats }>("/api/v1/invoices/stats");
  return res.stats;
}

export async function getClientStatsAction(): Promise<ClientStats> {
  const res = await serverApiGet<{ stats: ClientStats }>("/api/v1/clients/stats");
  return res.stats;
}

export async function getPaymentStatsAction(): Promise<PaymentStats> {
  const res = await serverApiGet<{ stats: PaymentStats }>("/api/v1/payments/stats");
  return res.stats;
}

export async function getBillingUsageAction(): Promise<BillingUsage> {
  const res = await serverApiGet<{ usage: BillingUsage }>("/api/v1/billing/usage");
  return res.usage;
}

export async function getRecentInvoicesAction(
  limit = 6,
): Promise<InvoiceListItem[]> {
  const res = await serverApiGet<{ invoices: InvoiceListItem[] }>(
    `/api/v1/invoices?limit=${limit}&sortBy=createdAt&sortOrder=desc`,
  );
  return res.invoices;
}

export async function getOverdueInvoicesAction(
  limit = 5,
): Promise<InvoiceListItem[]> {
  const res = await serverApiGet<{ invoices: InvoiceListItem[] }>(
    `/api/v1/invoices?limit=${limit}&overdue=true&sortBy=dueDate&sortOrder=asc`,
  );
  return res.invoices;
}

export async function getDashboardNotificationsAction(limit = 5): Promise<{
  notifications: NotificationItem[];
  unreadCount: number;
}> {
  const [list, unread] = await Promise.all([
    serverApiGet<{ notifications: NotificationItem[] }>(
      `/api/v1/notifications?limit=${limit}&sortBy=createdAt&sortOrder=desc`,
    ),
    serverApiGet<{ unreadCount: number }>("/api/v1/notifications/unread-count"),
  ]);
  return {
    notifications: list.notifications,
    unreadCount: unread.unreadCount,
  };
}

export async function getBusinessAction(): Promise<BusinessProfile | null> {
  try {
    const res = await serverApiGet<{ business: BusinessProfile }>("/api/v1/business");
    return res.business;
  } catch {
    return null;
  }
}
