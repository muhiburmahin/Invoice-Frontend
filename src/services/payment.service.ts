import { apiDelete, apiGet, apiGetWithMeta, apiPatch, apiPost } from "@/lib/api";
import type { PaymentStats } from "@/types/dashboard";
import type {
  CreatePaymentInput,
  InvoicePaymentsResponse,
  ListPaymentsParams,
  ListPaymentsResult,
  PaymentDetailResponse,
  PaymentMeta,
  StripeCheckoutInput,
  StripeCheckoutResponse,
  UpdatePaymentStatusInput,
} from "@/types/payment";

function buildQuery(params: ListPaymentsParams = {}): string {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.invoiceId) qs.set("invoiceId", params.invoiceId);
  if (params.status) qs.set("status", params.status);
  if (params.method) qs.set("method", params.method);
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  const query = qs.toString();
  return query ? `?${query}` : "";
}

export const paymentService = {
  meta: () => apiGet<PaymentMeta>("/api/v1/payments/meta"),

  stats: () => apiGet<{ stats: PaymentStats }>("/api/v1/payments/stats"),

  list: async (params: ListPaymentsParams = {}): Promise<ListPaymentsResult> => {
    const { data, meta } = await apiGetWithMeta<{ payments: ListPaymentsResult["payments"] }>(
      `/api/v1/payments${buildQuery(params)}`,
    );
    return { payments: data.payments, meta };
  },

  getById: (id: string) => apiGet<PaymentDetailResponse>(`/api/v1/payments/${id}`),

  listForInvoice: (invoiceId: string) =>
    apiGet<InvoicePaymentsResponse>(`/api/v1/invoices/${invoiceId}/payments`),

  create: (body: CreatePaymentInput) =>
    apiPost<{
      payment: PaymentDetailResponse["payment"];
      invoice: InvoicePaymentsResponse["invoice"];
      message?: string;
    }>("/api/v1/payments", body),

  updateStatus: (id: string, body: UpdatePaymentStatusInput) =>
    apiPatch<PaymentDetailResponse & { message?: string }>(
      `/api/v1/payments/${id}/status`,
      body,
    ),

  cancel: (id: string) =>
    apiDelete<{ message: string }>(`/api/v1/payments/${id}`),

  stripeCheckout: (body: StripeCheckoutInput) =>
    apiPost<StripeCheckoutResponse>("/api/v1/payments/stripe/checkout", body),
};
