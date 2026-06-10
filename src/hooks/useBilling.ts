"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import { billingService } from "@/services/billing.service";
import type { OfflineUpgradeRequestInput, UpgradeablePlan } from "@/types/billing";

export const billingMetaQueryKey = ["billing", "meta"] as const;
export const billingSubscriptionQueryKey = ["billing", "subscription"] as const;
export const billingUsageQueryKey = ["billing", "usage"] as const;

export function useBillingMeta() {
  return useQuery({
    queryKey: billingMetaQueryKey,
    queryFn: () => billingService.meta(),
    staleTime: 60_000,
  });
}

export function useBillingSubscription() {
  return useQuery({
    queryKey: billingSubscriptionQueryKey,
    queryFn: () => billingService.subscription(),
    staleTime: 30_000,
  });
}

export function useBillingUsage() {
  return useQuery({
    queryKey: billingUsageQueryKey,
    queryFn: () => billingService.usage(),
    staleTime: 30_000,
  });
}

export function useBillingCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plan: UpgradeablePlan) => billingService.checkout(plan),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: billingSubscriptionQueryKey });
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
    },
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: () => billingService.portal(),
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.location.href = data.portalUrl;
      }
    },
  });
}

export function useOfflineUpgradeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: OfflineUpgradeRequestInput) =>
      billingService.offlineRequest(body),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: billingMetaQueryKey });
      void queryClient.invalidateQueries({ queryKey: billingSubscriptionQueryKey });
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
    },
  });
}
