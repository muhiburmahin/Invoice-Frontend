"use client";

import { useQuery } from "@tanstack/react-query";

import { getMarketingHome } from "@/services/marketing.service";

export const marketingHomeQueryKey = ["marketing-home"] as const;

export function useMarketingHome(enabled = true) {
  return useQuery({
    queryKey: marketingHomeQueryKey,
    queryFn: getMarketingHome,
    staleTime: 5 * 60_000,
    retry: 1,
    enabled,
  });
}

export type MarketingHomeQuery = ReturnType<typeof useMarketingHome>;
