"use client";

import Link from "next/link";

import { useMarketingHome } from "@/components/modules/home/hooks/useMarketingHome";
import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";

export function FaqSection() {
  const { ref, inView } = useSectionInView();
  const { data, isLoading, isError } = useMarketingHome(inView);

  const faq = data?.faq ?? [];

  return (
    <HomeSection>
      <div ref={ref}>
        <AnimatedReveal>
          <SectionTitle
            eyebrow="FAQ"
            title="Common questions"
            description="Quick answers before you create an account."
          />
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && faq.length === 0}
          className="mx-auto mt-10 max-w-3xl"
          loadingFallback={
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          }
        >
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {faq.map((item, index) => (
              <AnimatedReveal key={item.q} delayMs={index * 60}>
                <details className="group rounded-xl border border-brand-secondary/50 bg-card px-5 py-4 shadow-sm open:shadow-md transition-shadow">
                  <summary className="cursor-pointer list-none font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              </AnimatedReveal>
            ))}
          </div>
        </SectionDataState>

        <AnimatedReveal delayMs={120} className="mt-8 text-center text-sm text-muted-foreground">
          More questions?{" "}
          <Link href="/faq" className="font-medium text-brand hover:underline">
            Read the full FAQ
          </Link>
        </AnimatedReveal>
      </div>
    </HomeSection>
  );
}
