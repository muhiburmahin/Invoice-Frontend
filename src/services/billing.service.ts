import { apiGet, apiPost } from "@/lib/api";

// TODO: Phase 7
export const billingService = {
  meta: () => apiGet<unknown>("/api/v1/billing/meta"),
  subscription: () => apiGet<unknown>("/api/v1/billing/subscription"),
  usage: () => apiGet<unknown>("/api/v1/billing/usage"),
  checkout: (plan: "PRO" | "ENTERPRISE") =>
    apiPost<{ url: string }>("/api/v1/billing/checkout", { plan }),
  portal: () => apiPost<{ url: string }>("/api/v1/billing/portal"),
};
