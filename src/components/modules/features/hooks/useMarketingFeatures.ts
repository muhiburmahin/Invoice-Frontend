"use client";

import { useQuery } from "@tanstack/react-query";

import { getMarketingFeatures } from "@/services/marketing.service";

export const marketingFeaturesQueryKey = ["marketing-features"] as const;

export function useMarketingFeatures(enabled = true) {
  return useQuery({
    queryKey: marketingFeaturesQueryKey,
    queryFn: getMarketingFeatures,
    staleTime: 5 * 60_000,
    retry: 1,
    enabled,
  });
}
