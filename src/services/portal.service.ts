import { apiGet, apiGetWithMeta, apiPost } from "@/lib/api";
import type {
  PortalCheckoutResponse,
  PortalInvoiceDetailResponse,
  PortalInvoiceListItem,
  PortalMeta,
} from "@/types/portal";

export async function getPortalMeta(token: string): Promise<PortalMeta> {
  return apiGet<PortalMeta>(`/api/v1/portal/${token}/meta`);
}

export async function listPortalInvoices(
  token: string,
  query?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
) {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  if (query?.status) params.set("status", query.status);
  if (query?.sortBy) params.set("sortBy", query.sortBy);
  if (query?.sortOrder) params.set("sortOrder", query.sortOrder);

  const qs = params.toString();
  const url = `/api/v1/portal/${token}/invoices${qs ? `?${qs}` : ""}`;

  const { data, meta } = await apiGetWithMeta<{ invoices: PortalInvoiceListItem[] }>(url);
  return { invoices: data.invoices, meta };
}

export async function getPortalInvoice(
  token: string,
  invoiceId: string,
): Promise<PortalInvoiceDetailResponse> {
  return apiGet<PortalInvoiceDetailResponse>(
    `/api/v1/portal/${token}/invoices/${invoiceId}`,
  );
}

export function getPortalInvoicePdfUrl(token: string, invoiceId: string): string {
  return `/api/v1/portal/${token}/invoices/${invoiceId}/pdf`;
}

export async function createPortalCheckout(
  token: string,
  invoiceId: string,
  amount?: number,
): Promise<PortalCheckoutResponse> {
  return apiPost<PortalCheckoutResponse>(
    `/api/v1/portal/${token}/invoices/${invoiceId}/checkout`,
    amount !== undefined ? { amount } : {},
  );
}
