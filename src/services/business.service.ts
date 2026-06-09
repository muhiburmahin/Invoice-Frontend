import { apiGet, apiPatch } from "@/lib/api";
import type { Business, CurrencyOption, UpdateBusinessInput } from "@/types/business";

export const businessService = {
  get: () => apiGet<{ business: Business }>("/api/v1/business"),
  update: (body: UpdateBusinessInput) =>
    apiPatch<{ business: Business; message?: string }>("/api/v1/business", body),
  currencies: () => apiGet<{ currencies: CurrencyOption[] }>("/api/v1/business/currencies"),
};
