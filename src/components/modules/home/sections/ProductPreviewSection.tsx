"use client";

import { Check } from "lucide-react";

import { useMarketingHome } from "@/components/modules/home/hooks/useMarketingHome";
import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { ProductMockup } from "@/components/modules/home/ProductMockup";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { StatDisplay } from "@/components/modules/home/shared/SectionDataState";
import { formatCount } from "@/components/modules/home/utils/home-stats";

export function ProductPreviewSection() {
  const { ref, inView } = useSectionInView();
  const { data, isLoading, isError } = useMarketingHome(inView);

  const userCount = data?.stats.activeUsers ?? 0;

  return (
    <HomeSection className="bg-gradient-to-br from-brand-muted/40 via-background to-brand-secondary/20">
      <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2">
        <AnimatedReveal className="order-2 lg:order-1">
          <ProductMockup
            className="home-mockup-float"
            stats={isError ? undefined : data?.stats}
            isLoading={isLoading}
            isError={isError}
          />
        </AnimatedReveal>
        <div className="order-1 lg:order-2">
          <AnimatedReveal>
            <SectionTitle
              eyebrow="Product"
              title="A dashboard your clients will trust"
              description="Real-time stats, invoice status, and notifications — the same app you use after sign in."
              align="left"
            />
          </AnimatedReveal>
          <ul className="mt-8 space-y-3">
            {["Live payment status", "Client portal links", "PDF export & branding"].map(
              (text, i) => (
                <AnimatedReveal key={text} delayMs={80 + i * 60}>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <Check className="size-5 shrink-0 text-brand" />
                    {text}
                  </li>
                </AnimatedReveal>
              ),
            )}
          </ul>
          <AnimatedReveal delayMs={280} className="mt-8 rounded-2xl border border-brand-secondary/40 bg-card/80 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Platform activity
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <StatDisplay
                isLoading={isLoading}
                isError={isError}
                value={formatCount(userCount)}
                className="!text-2xl md:!text-3xl"
              />
              <span className="text-sm text-muted-foreground">active users on the platform</span>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </HomeSection>
  );
}
