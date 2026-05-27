import { apiGet, apiPatch, apiPost } from "@/lib/api";

// TODO: Phase 4 — full invoice types from API
export const invoiceService = {
  meta: () => apiGet<unknown>("/api/v1/invoices/meta"),
  list: () => apiGet<unknown>("/api/v1/invoices"),
  getById: (id: string) => apiGet<unknown>(`/api/v1/invoices/${id}`),
  create: (body: unknown) => apiPost<unknown>("/api/v1/invoices", body),
  update: (id: string, body: unknown) =>
    apiPatch<unknown>(`/api/v1/invoices/${id}`, body),
};
