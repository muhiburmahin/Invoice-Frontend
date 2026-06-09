import type { BillingUsage, SubscriptionPlan } from "@/types";

export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIALING"
  | "CANCELLED"
  | "PAST_DUE"
  | "PAUSED";

export type Subscription = {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BillingMeta = {
  invoicePayments: {
    configured: boolean;
    billingEnabled: boolean;
    checkoutAvailable: boolean;
  };
  saas: {
    upgradeablePlans: ("PRO" | "ENTERPRISE")[];
    pricesConfigured: { PRO: boolean; ENTERPRISE: boolean };
    subscriptionCheckoutAvailable: boolean;
    portalAvailable: boolean;
  };
};

export type UpgradeablePlan = "PRO" | "ENTERPRISE";

export type BillingUsageResponse = {
  usage: BillingUsage;
};

export type BillingSubscriptionResponse = {
  subscription: Subscription | null;
};
