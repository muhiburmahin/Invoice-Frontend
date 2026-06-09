"use client";

import { useQuery } from "@tanstack/react-query";

import { getMarketingPricing } from "@/services/marketing.service";

export const marketingPricingQueryKey = ["marketing-pricing"] as const;

export function useMarketingPricing(enabled = true) {
  return useQuery({
    queryKey: marketingPricingQueryKey,
    queryFn: getMarketingPricing,
    staleTime: 5 * 60_000,
    retry: 1,
    enabled,
  });
}
