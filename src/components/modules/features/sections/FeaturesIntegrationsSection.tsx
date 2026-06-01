"use client";

import { useFeaturesSection } from "@/components/modules/features/hooks/useFeaturesSection";
import { IntegrationsSkeleton } from "@/components/modules/features/shared/SectionSkeletons";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { cn } from "@/lib/utils";

export function FeaturesIntegrationsSection() {
  const { ref, integrations, isLoading, isError } = useFeaturesSection();

  const enabledCount = integrations.filter((i) => i.enabled).length;

  return (
    <HomeSection className="relative overflow-hidden bg-gradient-to-br from-brand-muted/30 via-background to-brand-secondary/20">
      <div
        className="home-float-orb pointer-events-none absolute bottom-0 left-1/4 size-48 rounded-full bg-brand-accent/15 blur-3xl"
        aria-hidden
      />
      <div ref={ref} className="relative">
        <AnimatedReveal>
          <SectionTitle
            eyebrow="Integrations"
            title="Connect the tools you already use"
            description={
              isLoading
                ? "Loading integration status…"
                : isError
                  ? "Could not load integration status."
                  : `${enabledCount} of ${integrations.length} integrations enabled on this environment.`
            }
          />
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && integrations.length === 0}
          className="mt-12"
          loadingFallback={<IntegrationsSkeleton />}
        >
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {integrations.map((item, index) => (
              <AnimatedReveal key={item.id} delayMs={index * 80}>
                <div
                  className={cn(
                    "marketing-card-hover home-shimmer rounded-2xl border p-6 text-center shadow-sm",
                    item.enabled
                      ? "border-brand/40 bg-card ring-1 ring-brand/20"
                      : "border-brand-secondary/40 bg-card/60",
                  )}
                >
                  <p className="text-lg font-bold">{item.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  <span
                    className={cn(
                      "mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                      item.enabled
                        ? "bg-brand text-brand-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.enabled ? "Enabled" : "Not configured"}
                  </span>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </SectionDataState>
      </div>
    </HomeSection>
  );
}
