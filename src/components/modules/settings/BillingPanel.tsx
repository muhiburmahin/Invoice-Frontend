"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  CreditCard,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { OfflineUpgradeCard } from "@/components/modules/settings/OfflineUpgradeCard";
import { SettingsNav } from "@/components/modules/settings/SettingsNav";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  useBillingCheckout,
  useBillingMeta,
  useBillingPortal,
  useBillingSubscription,
  useBillingUsage,
} from "@/hooks/useBilling";
import { getApiErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { PlanLimits, SubscriptionPlan, UpgradeablePlan } from "@/types";

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  FREE: "Free",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};

const PLAN_ORDER: SubscriptionPlan[] = ["FREE", "PRO", "ENTERPRISE"];

function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const unlimited = !Number.isFinite(limit);
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {used}
          {unlimited ? "" : ` / ${limit}`}
          {unlimited ? " (unlimited)" : ""}
        </span>
      </div>
      {!unlimited ? (
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function planFeatures(limits: PlanLimits): string[] {
  const items = [
    `${Number.isFinite(limits.maxClients) ? limits.maxClients : "Unlimited"} clients`,
    `${Number.isFinite(limits.maxInvoicesPerMonth) ? limits.maxInvoicesPerMonth : "Unlimited"} invoices / month`,
    `${Number.isFinite(limits.maxRecurringSchedules) ? limits.maxRecurringSchedules : "Unlimited"} recurring schedules`,
  ];
  if (limits.customBranding) items.push("Custom branding");
  if (limits.prioritySupport) items.push("Priority support");
  return items;
}

export function BillingPanel() {
  const searchParams = useSearchParams();
  const { plan: currentPlan, workspace } = useAuth();
  const limits = workspace?.planLimits;

  const metaQuery = useBillingMeta();
  const subscriptionQuery = useBillingSubscription();
  const usageQuery = useBillingUsage();
  const checkout = useBillingCheckout();
  const portal = useBillingPortal();

  const subscription = subscriptionQuery.data?.subscription;
  const usage = usageQuery.data?.usage;
  const meta = metaQuery.data;
  const saas = meta?.saas;
  const activePlan = subscription?.plan ?? currentPlan;
  const offlineUpgrade = saas?.offlineUpgrade;
  const pendingOfflineUpgrade = saas?.pendingOfflineUpgrade ?? false;

  useEffect(() => {
    const checkoutStatus = searchParams.get("checkout");
    if (checkoutStatus === "success") {
      toast.success("Subscription updated. It may take a moment to reflect.");
    } else if (checkoutStatus === "cancelled") {
      toast.message("Checkout cancelled");
    }
  }, [searchParams]);

  const isLoading =
    metaQuery.isLoading || subscriptionQuery.isLoading || usageQuery.isLoading;

  if (isLoading && !meta) {
    return (
      <div className="space-y-6">
        <SettingsNav />
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  const handleUpgrade = async (target: UpgradeablePlan) => {
    try {
      await checkout.mutateAsync(target);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handlePortal = async () => {
    try {
      await portal.mutateAsync();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const refreshAll = () => {
    void metaQuery.refetch();
    void subscriptionQuery.refetch();
    void usageQuery.refetch();
  };

  return (
    <div className="space-y-6">
      <SettingsNav />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Current plan</h2>
          <p className="text-sm text-muted-foreground">
            Manage your subscription and monitor workspace usage.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refreshAll}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-brand" />
            {PLAN_LABELS[subscription?.plan ?? currentPlan]}
          </CardTitle>
          <CardDescription>
            Status: {subscription?.status ?? "ACTIVE"}
            {subscription?.cancelAtPeriodEnd
              ? " · Cancels at end of billing period"
              : ""}
            {subscription?.currentPeriodEnd
              ? ` · Renews ${formatDate(subscription.currentPeriodEnd)}`
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {saas?.portalAvailable && subscription?.stripeCustomerId ? (
            <Button
              variant="outline"
              onClick={() => void handlePortal()}
              disabled={portal.isPending}
            >
              {portal.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CreditCard className="size-4" />
              )}
              Manage in Stripe
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {offlineUpgrade?.enabled &&
      activePlan === "FREE" &&
      !saas?.subscriptionCheckoutAvailable ? (
        <OfflineUpgradeCard
          offline={offlineUpgrade}
          pending={pendingOfflineUpgrade}
          currentPlan={activePlan}
        />
      ) : null}

      {usage && limits ? (
        <Card>
          <CardHeader>
            <CardTitle>Usage this month</CardTitle>
            <CardDescription>
              Track consumption against your {PLAN_LABELS[usage.plan]} limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UsageMeter
              label="Clients"
              used={usage.clients}
              limit={limits.maxClients}
            />
            <UsageMeter
              label="Invoices created"
              used={usage.invoicesThisMonth}
              limit={limits.maxInvoicesPerMonth}
            />
            <UsageMeter
              label="Active recurring schedules"
              used={usage.recurringSchedules}
              limit={limits.maxRecurringSchedules}
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {PLAN_ORDER.map((planKey) => {
          const isCurrent = (subscription?.plan ?? currentPlan) === planKey;
          const upgradeable =
            saas?.upgradeablePlans.includes(planKey as UpgradeablePlan) &&
            !isCurrent &&
            saas.subscriptionCheckoutAvailable &&
            saas.pricesConfigured[planKey as UpgradeablePlan];

          const fallbackLimits: PlanLimits =
            planKey === "FREE"
              ? {
                  maxClients: 10,
                  maxInvoicesPerMonth: 5,
                  maxRecurringSchedules: 0,
                  pdfExport: true,
                  customBranding: false,
                  prioritySupport: false,
                }
              : planKey === "PRO"
                ? {
                    maxClients: 500,
                    maxInvoicesPerMonth: 200,
                    maxRecurringSchedules: 25,
                    pdfExport: true,
                    customBranding: true,
                    prioritySupport: false,
                  }
                : {
                    maxClients: Number.POSITIVE_INFINITY,
                    maxInvoicesPerMonth: Number.POSITIVE_INFINITY,
                    maxRecurringSchedules: Number.POSITIVE_INFINITY,
                    pdfExport: true,
                    customBranding: true,
                    prioritySupport: true,
                  };

          return (
            <Card
              key={planKey}
              className={isCurrent ? "border-brand ring-1 ring-brand/20" : undefined}
            >
              <CardHeader>
                <CardTitle>{PLAN_LABELS[planKey]}</CardTitle>
                {isCurrent ? (
                  <CardDescription>Your current plan</CardDescription>
                ) : (
                  <CardDescription>Upgrade option</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {planFeatures(
                    planKey === (subscription?.plan ?? currentPlan) && limits
                      ? limits
                      : fallbackLimits,
                  ).map((feature) => (
                    <li key={feature}>· {feature}</li>
                  ))}
                </ul>
                {!isCurrent && planKey !== "FREE" ? (
                  upgradeable ? (
                    <Button
                      className="w-full bg-brand text-brand-foreground"
                      onClick={() => void handleUpgrade(planKey as UpgradeablePlan)}
                      disabled={checkout.isPending}
                    >
                      {checkout.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowUpRight className="size-4" />
                      )}
                      Upgrade to {PLAN_LABELS[planKey]} with Stripe
                    </Button>
                  ) : planKey === "PRO" && offlineUpgrade?.enabled ? (
                    <p className="rounded-lg border border-brand-secondary/50 bg-brand-secondary/20 px-3 py-2.5 text-xs text-muted-foreground">
                      Use the <strong className="text-foreground">offline payment</strong> section
                      above to pay via bKash/bank and request activation.
                    </p>
                  ) : (
                    <p className="rounded-lg border border-dashed border-brand-secondary/60 bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
                      Online checkout is not configured. Contact support to upgrade.
                    </p>
                  )
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {saas &&
      !saas.subscriptionCheckoutAvailable &&
      !offlineUpgrade?.enabled &&
      activePlan === "FREE" ? (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4 text-sm text-muted-foreground">
            Online checkout is not configured. Enable offline billing in backend .env or
            contact your administrator.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
