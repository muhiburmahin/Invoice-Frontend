"use client";

import { Check } from "lucide-react";

import { useFeaturesSection } from "@/components/modules/features/hooks/useFeaturesSection";
import { FeatureGridSkeleton } from "@/components/modules/features/shared/SectionSkeletons";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { cn } from "@/lib/utils";

export function FeaturesCategorySection() {
  const { ref, categories, features, isLoading, isError } = useFeaturesSection();

  const hasContent =
    categories.length > 0 &&
    categories.some((c) => features.some((f) => f.category === c.id));

  return (
    <HomeSection className="marketing-gradient-shift bg-gradient-to-br from-card/60 via-background to-brand-muted/20">
      <div ref={ref}>
        <AnimatedReveal>
          <SectionTitle
            eyebrow="By category"
            title="Built for your full billing workflow"
            description="Features grouped by invoicing, clients, payments, automation, and branding."
          />
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && !hasContent}
          className="mt-12"
          loadingFallback={<FeatureGridSkeleton count={4} />}
        >
          <div className="mt-12 space-y-16">
            {categories.map((category, catIndex) => {
              const items = features.filter((f) => f.category === category.id);
              if (items.length === 0) return null;

              return (
                <AnimatedReveal key={category.id} delayMs={catIndex * 90}>
                  <div className="relative">
                    <span
                      className="absolute -left-2 top-0 hidden h-full w-1 rounded-full bg-brand md:block"
                      aria-hidden
                    />
                    <h3 className="text-2xl font-bold text-foreground">{category.label}</h3>
                    <p className="mt-1 text-muted-foreground">{category.description}</p>
                    <p className="mt-2 text-xs font-medium text-brand">
                      {items.length} feature{items.length === 1 ? "" : "s"}
                    </p>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                      {items.map((feature, i) => (
                        <li
                          key={feature.id}
                          className={cn(
                            "marketing-card-hover rounded-xl border border-brand-secondary/50 bg-card p-5 shadow-sm",
                            "transition-all duration-300",
                          )}
                        >
                          <p className="font-semibold">{feature.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                          {feature.highlights.length > 0 ? (
                            <ul className="mt-3 space-y-1">
                              {feature.highlights.slice(0, 3).map((h) => (
                                <li
                                  key={h}
                                  className="flex items-center gap-2 text-xs text-muted-foreground"
                                >
                                  <Check className="size-3.5 shrink-0 text-brand" />
                                  {h}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedReveal>
              );
            })}
          </div>
        </SectionDataState>
      </div>
    </HomeSection>
  );
}
