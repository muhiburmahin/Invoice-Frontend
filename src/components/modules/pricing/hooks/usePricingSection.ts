"use client";

import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { useMarketingPricing } from "@/components/modules/pricing/hooks/useMarketingPricing";

type Options = { immediate?: boolean };

export function usePricingSection({ immediate = false }: Options = {}) {
  const { ref, inView } = useSectionInView({ threshold: immediate ? 0 : 0.12 });
  const enabled = immediate || inView;
  const { data, isLoading, isError, isSuccess } = useMarketingPricing(enabled);

  return {
    ref,
    data,
    isLoading,
    isError,
    isSuccess,
    stats: data?.stats,
    plans: data?.plans ?? [],
    comparison: data?.comparison ?? [],
    highlights: data?.highlights ?? [],
    faq: data?.faq ?? [],
    providers: data?.providers,
  };
}
