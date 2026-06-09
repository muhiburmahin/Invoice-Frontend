"use client";

import Link from "next/link";

import { ComparisonTable } from "@/components/modules/marketing/shared/ComparisonTable";
import { usePricingSection } from "@/components/modules/pricing/hooks/usePricingSection";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { ComparisonTableSkeleton } from "@/components/modules/features/shared/SectionSkeletons";

export function PricingComparisonSection() {
  const { ref, comparison, plans, isLoading, isError } = usePricingSection();

  return (
    <HomeSection id="compare" className="bg-card/40">
      <div ref={ref}>
        <AnimatedReveal>
          <SectionTitle
            eyebrow="Compare"
            title="Full feature comparison"
            description="Side-by-side limits for Free, Pro, and Enterprise — synced from plan configuration."
          />
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && comparison.length === 0}
          className="mt-12"
          loadingFallback={<ComparisonTableSkeleton />}
        >
          <AnimatedReveal delayMs={80} className="mt-12">
            <ComparisonTable comparison={comparison} plans={plans} />
          </AnimatedReveal>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need feature details?{" "}
            <Link href="/features" className="font-semibold text-brand hover:underline">
              Explore all features →
            </Link>
          </p>
        </SectionDataState>
      </div>
    </HomeSection>
  );
}
