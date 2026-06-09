"use client";

import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { useMarketingFaq } from "@/components/modules/faq/hooks/useMarketingFaq";

type Options = { immediate?: boolean };

export function useFaqSection({ immediate = false }: Options = {}) {
  const { ref, inView } = useSectionInView({ threshold: immediate ? 0 : 0.12 });
  const enabled = immediate || inView;
  const { data, isLoading, isError, isSuccess } = useMarketingFaq(enabled);

  return {
    ref,
    data,
    isLoading,
    isError,
    isSuccess,
    categories: data?.categories ?? [],
    faq: data?.faq ?? [],
    providers: data?.providers,
  };
}
