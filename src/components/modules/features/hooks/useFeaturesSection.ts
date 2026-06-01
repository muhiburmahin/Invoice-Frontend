"use client";

import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { useMarketingFeatures } from "@/components/modules/features/hooks/useMarketingFeatures";
import type { MarketingFeaturesData } from "@/types/marketing";

type Options = {
  /** Fetch as soon as the page loads (hero). */
  immediate?: boolean;
};

export function useFeaturesSection({ immediate = false }: Options = {}) {
  const { ref, inView } = useSectionInView({ threshold: immediate ? 0 : 0.12 });
  const enabled = immediate || inView;
  const { data, isLoading, isError, isFetched, isSuccess } = useMarketingFeatures(enabled);

  return {
    ref,
    inView,
    data,
    isLoading,
    isError,
    isFetched,
    isSuccess,
    isEmpty: isSuccess && !data,
    stats: data?.stats,
    features: data?.features ?? [],
    categories: data?.categories ?? [],
    plans: data?.plans ?? [],
    comparison: data?.comparison ?? [],
    integrations: data?.integrations ?? [],
    providers: data?.providers,
    faq: data?.faq ?? [],
  };
}

export type FeaturesSectionData = MarketingFeaturesData;
