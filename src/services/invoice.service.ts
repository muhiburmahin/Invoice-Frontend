import { api, apiDelete, apiGet, apiGetWithMeta, apiPatch, apiPost } from "@/lib/api";
import type { InvoiceStats } from "@/types/dashboard";
import type {
  CreateInvoiceInput,
  InvoiceDetailResponse,
  InvoiceMeta,
  ListInvoicesParams,
  ListInvoicesResult,
  SendInvoiceInput,
  UpdateInvoiceInput,
  UpdateInvoiceStatusInput,
} from "@/types/invoice";

function buildQuery(params: ListInvoicesParams = {}): string {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.search) qs.set("search", params.search);
  if (params.status) qs.set("status", params.status);
  if (params.overdue) qs.set("overdue", "true");
  if (params.clientId) qs.set("clientId", params.clientId);
  if (params.recurringId) qs.set("recurringId", params.recurringId);
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  const query = qs.toString();
  return query ? `?${query}` : "";
}

export const invoiceService = {
  meta: () => apiGet<InvoiceMeta>("/api/v1/invoices/meta"),

  stats: () => apiGet<{ stats: InvoiceStats }>("/api/v1/invoices/stats"),

  list: async (params: ListInvoicesParams = {}): Promise<ListInvoicesResult> => {
    const { data, meta } = await apiGetWithMeta<{ invoices: ListInvoicesResult["invoices"] }>(
      `/api/v1/invoices${buildQuery(params)}`,
    );
    return { invoices: data.invoices, meta };
  },

  getById: (id: string) => apiGet<InvoiceDetailResponse>(`/api/v1/invoices/${id}`),

  create: (body: CreateInvoiceInput) =>
    apiPost<InvoiceDetailResponse & { message?: string }>("/api/v1/invoices", body),

  update: (id: string, body: UpdateInvoiceInput) =>
    apiPatch<InvoiceDetailResponse & { message?: string }>(
      `/api/v1/invoices/${id}`,
      body,
    ),

  updateStatus: (id: string, body: UpdateInvoiceStatusInput) =>
    apiPatch<InvoiceDetailResponse & { message?: string }>(
      `/api/v1/invoices/${id}/status`,
      body,
    ),

  duplicate: (id: string) =>
    apiPost<InvoiceDetailResponse & { message?: string }>(
      `/api/v1/invoices/${id}/duplicate`,
    ),

  remove: (id: string) =>
    apiDelete<{ message: string }>(`/api/v1/invoices/${id}`),

  send: (id: string, body: SendInvoiceInput = {}) =>
    apiPost<InvoiceDetailResponse & { message?: string }>(
      `/api/v1/invoices/${id}/send`,
      body,
    ),

  remind: (id: string, body: SendInvoiceInput = {}) =>
    apiPost<InvoiceDetailResponse & { message?: string }>(
      `/api/v1/invoices/${id}/remind`,
      body,
    ),

  downloadPdf: async (id: string, fallbackName = "invoice.pdf") => {
    const response = await api.get(`/api/v1/invoices/${id}/pdf`, {
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"] as string | undefined;
    const match = disposition?.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? fallbackName;

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(url);
  },
};
