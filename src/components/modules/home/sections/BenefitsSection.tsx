"use client";

import Link from "next/link";
import { ArrowRight, Bell, Globe, RefreshCw, Shield, Wallet, Zap } from "lucide-react";

import { useMarketingHome } from "@/components/modules/home/hooks/useMarketingHome";
import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { buttonVariants } from "@/components/ui/button";
import { HOME_BENEFITS } from "@/config/home-content";
import { cn } from "@/lib/utils";

const BENEFIT_ICONS = [Zap, Shield, Wallet, RefreshCw, Bell, Globe] as const;

export function BenefitsSection() {
  const { ref, inView } = useSectionInView();
  const { data, isError } = useMarketingHome(inView);

  return (
    <HomeSection id="benefits">
      <div ref={ref}>
        <AnimatedReveal>
          <SectionTitle
            eyebrow="Features"
            title="Everything you need to get paid"
            description="From first invoice to recurring billing — without switching tools."
          />
        </AnimatedReveal>

        {data?.providers && !isError ? (
          <AnimatedReveal delayMs={80} className="mt-6 flex flex-wrap justify-center gap-2">
            {data.providers.stripe ? (
              <span className="rounded-full border border-brand/30 bg-brand-muted/50 px-3 py-1 text-xs font-semibold text-brand">
                Stripe connected on platform
              </span>
            ) : (
              <span className="rounded-full border border-brand-secondary/50 px-3 py-1 text-xs text-muted-foreground">
                Stripe: configure in settings
              </span>
            )}
          </AnimatedReveal>
        ) : null}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_BENEFITS.map((item, i) => {
            const Icon = BENEFIT_ICONS[i] ?? Zap;
            return (
              <AnimatedReveal key={item.title} delayMs={i * 70}>
                <div className="group h-full rounded-2xl border border-brand-secondary/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-brand/10">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-secondary/70 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>

        <AnimatedReveal delayMs={200} className="mt-10 text-center">
          <Link href="/features" className={cn(buttonVariants({ variant: "outline" }))}>
            Explore all features
            <ArrowRight className="size-4" />
          </Link>
        </AnimatedReveal>
      </div>
    </HomeSection>
  );
}
