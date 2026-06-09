"use client";

import { useQuery } from "@tanstack/react-query";

import { getMarketingFaq } from "@/services/marketing.service";

export const marketingFaqQueryKey = ["marketing-faq"] as const;

export function useMarketingFaq(enabled = true) {
  return useQuery({
    queryKey: marketingFaqQueryKey,
    queryFn: getMarketingFaq,
    staleTime: 5 * 60_000,
    retry: 1,
    enabled,
  });
}
