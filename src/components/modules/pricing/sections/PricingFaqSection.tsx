"use client";

import Link from "next/link";

import { usePricingSection } from "@/components/modules/pricing/hooks/usePricingSection";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { FaqSkeleton } from "@/components/modules/features/shared/SectionSkeletons";

export function PricingFaqSection() {
  const { ref, faq, isLoading, isError } = usePricingSection();

  return (
    <HomeSection>
      <div ref={ref}>
        <AnimatedReveal>
          <SectionTitle
            eyebrow="FAQ"
            title="Pricing questions"
            description="Quick answers about plans and billing."
          />
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && faq.length === 0}
          className="mx-auto mt-10 max-w-3xl"
          loadingFallback={<FaqSkeleton count={4} />}
        >
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {faq.map((item, index) => (
              <AnimatedReveal key={item.q} delayMs={index * 50}>
                <details className="group rounded-xl border border-brand-secondary/50 bg-card px-5 py-4 shadow-sm open:shadow-md">
                  <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              </AnimatedReveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            More questions?{" "}
            <Link href="/faq" className="font-medium text-brand hover:underline">
              Full FAQ
            </Link>
          </p>
        </SectionDataState>
      </div>
    </HomeSection>
  );
}
