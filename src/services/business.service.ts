import { apiGet, apiPatch } from "@/lib/api";

// TODO: Phase 2
export const businessService = {
  get: () => apiGet<unknown>("/api/v1/business"),
  update: (body: unknown) => apiPatch<unknown>("/api/v1/business", body),
  currencies: () => apiGet<unknown>("/api/v1/business/currencies"),
};
