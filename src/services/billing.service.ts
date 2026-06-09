import { apiGet, apiPost } from "@/lib/api";
import type {
  BillingMeta,
  BillingSubscriptionResponse,
  BillingUsageResponse,
  UpgradeablePlan,
} from "@/types/billing";

function billingReturnUrl(path: string): string {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

export const billingService = {
  meta: () => apiGet<BillingMeta>("/api/v1/billing/meta"),

  subscription: () =>
    apiGet<BillingSubscriptionResponse>("/api/v1/billing/subscription"),

  usage: () => apiGet<BillingUsageResponse>("/api/v1/billing/usage"),

  checkout: (plan: UpgradeablePlan) =>
    apiPost<{ checkoutUrl: string; sessionId: string }>(
      "/api/v1/billing/checkout",
      {
        plan,
        successUrl: `${billingReturnUrl("/settings/billing")}?checkout=success`,
        cancelUrl: `${billingReturnUrl("/settings/billing")}?checkout=cancelled`,
      },
    ),

  portal: () =>
    apiPost<{ portalUrl: string }>("/api/v1/billing/portal", {
      returnUrl: billingReturnUrl("/settings/billing"),
    }),
};
