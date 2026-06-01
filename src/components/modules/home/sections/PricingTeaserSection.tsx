"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { useMarketingHome } from "@/components/modules/home/hooks/useMarketingHome";
import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AUTH_ROUTES } from "@/config/public-routes";
import { cn } from "@/lib/utils";

export function PricingTeaserSection() {
  const { ref, inView } = useSectionInView();
  const { data, isLoading, isError } = useMarketingHome(inView);

  const plans = data?.plans ?? [];

  return (
    <HomeSection id="pricing" className="bg-card/50">
      <div ref={ref}>
        <AnimatedReveal>
          <SectionTitle
            eyebrow="Pricing"
            title="Start free. Scale when you grow."
            description="Transparent plans — upgrade only when you need more volume or automation."
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
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          }
        >
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <AnimatedReveal key={plan.id} delayMs={index * 90}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1",
                    plan.highlighted
                      ? "border-brand bg-brand-muted/40 shadow-lg shadow-brand/10 ring-2 ring-brand/20"
                      : "border-brand-secondary/50 bg-card",
                  )}
                >
                  {plan.highlighted ? (
                    <span className="mb-3 w-fit rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-foreground">
                      Most popular
                    </span>
                  ) : (
                    <span className="mb-3 h-5" />
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-brand">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="mt-6 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.id === "ENTERPRISE" ? "/contact" : AUTH_ROUTES.register}
                    className={cn(
                      buttonVariants({
                        variant: plan.highlighted ? "default" : "outline",
                        className: "mt-6 w-full",
                      }),
                      plan.highlighted &&
                        "bg-brand text-brand-foreground hover:bg-brand/90",
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </SectionDataState>

        <AnimatedReveal delayMs={200} className="mt-8 text-center">
          <Link href="/pricing" className="font-semibold text-brand hover:underline">
            See full pricing comparison →
          </Link>
        </AnimatedReveal>
      </div>
    </HomeSection>
  );
}
