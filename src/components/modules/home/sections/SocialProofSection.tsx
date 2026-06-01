"use client";

import { Star } from "lucide-react";

import { useMarketingHome } from "@/components/modules/home/hooks/useMarketingHome";
import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState, StatDisplay } from "@/components/modules/home/shared/SectionDataState";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatCollectedValue,
  formatCount,
} from "@/components/modules/home/utils/home-stats";

export function SocialProofSection() {
  const { ref, inView } = useSectionInView();
  const { data, isLoading, isError } = useMarketingHome(inView);

  const stats = data?.stats;
  const trustedLabels = data?.trustedLabels ?? [];
  const testimonials = data?.testimonials ?? [];

  const statItems = stats
    ? [
        { label: "Active users", value: formatCount(stats.activeUsers) },
        { label: "Invoices created", value: formatCount(stats.invoicesCreated) },
        { label: "Collected via platform", value: formatCollectedValue(stats) },
      ]
    : [];

  return (
    <HomeSection
      className="border-y border-brand-secondary/30 bg-card/40 py-12 md:py-14"
      innerClassName="scroll-mt-20"
    >
      <div ref={ref}>
        <AnimatedReveal>
          <p className="text-center text-sm font-medium text-muted-foreground">
            Built for modern teams like
          </p>
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && trustedLabels.length === 0}
          loadingFallback={
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
              ))}
            </div>
          }
          className="mt-4"
        >
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {trustedLabels.map((label) => (
              <span
                key={label}
                className="home-shimmer rounded-full border border-brand-secondary/50 bg-background px-4 py-2 text-sm font-semibold text-foreground/80"
              >
                {label}
              </span>
            ))}
          </div>
        </SectionDataState>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {statItems.length > 0
            ? statItems.map((item, index) => (
                <AnimatedReveal key={item.label} delayMs={index * 80}>
                  <div className="rounded-2xl border border-brand-secondary/40 bg-background p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                    <StatDisplay
                      isLoading={isLoading}
                      isError={isError}
                      value={item.value}
                    />
                    <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                  </div>
                </AnimatedReveal>
              ))
            : isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-2xl" />
                ))
              : (
                <p className="col-span-full text-center text-sm text-muted-foreground">
                  Data not found
                </p>
              )}
        </div>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && testimonials.length === 0}
          className="mt-10"
          loadingFallback={
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-36 rounded-2xl" />
              <Skeleton className="h-36 rounded-2xl" />
            </div>
          }
        >
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, index) => (
              <AnimatedReveal key={t.author} delayMs={index * 100}>
                <blockquote className="rounded-2xl border border-brand-secondary/50 bg-card p-6 shadow-sm transition-transform hover:-translate-y-0.5">
                  <div className="flex gap-0.5 text-brand">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-4 text-sm font-medium text-muted-foreground">
                    {t.author} · {t.role}
                  </footer>
                </blockquote>
              </AnimatedReveal>
            ))}
          </div>
        </SectionDataState>
      </div>
    </HomeSection>
  );
}
