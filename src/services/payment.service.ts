import { apiGet, apiPost } from "@/lib/api";

// TODO: Phase 6
export const paymentService = {
  meta: () => apiGet<unknown>("/api/v1/payments/meta"),
  list: () => apiGet<unknown>("/api/v1/payments"),
  create: (body: unknown) => apiPost<unknown>("/api/v1/payments", body),
};
