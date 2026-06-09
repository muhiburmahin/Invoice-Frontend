"use client";

import { usePricingSection } from "@/components/modules/pricing/hooks/usePricingSection";
import { PlanCards } from "@/components/modules/marketing/shared/PlanCards";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";

export function PricingPlansSection() {
  const { ref, plans, isLoading, isError } = usePricingSection();

  return (
    <HomeSection id="plans">
      <div ref={ref}>
        <AnimatedReveal>
          <SectionTitle
            eyebrow="Plans"
            title="Choose the right plan"
            description="Every tier includes core invoicing. Paid plans unlock volume, automation, and branding."
          />
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && plans.length === 0}
          className="mt-12"
          loadingFallback={
            <div className="grid gap-6 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          }
        >
          <AnimatedReveal delayMs={80} className="mt-12">
            <PlanCards plans={plans} />
          </AnimatedReveal>
        </SectionDataState>
      </div>
    </HomeSection>
  );
}
