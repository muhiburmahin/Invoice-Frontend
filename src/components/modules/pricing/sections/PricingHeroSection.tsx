"use client";

import Link from "next/link";
import { ArrowRight, Check, CreditCard } from "lucide-react";

import { usePricingSection } from "@/components/modules/pricing/hooks/usePricingSection";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { StatDisplay } from "@/components/modules/home/shared/SectionDataState";
import { buttonVariants } from "@/components/ui/button";
import { formatCount } from "@/components/modules/home/utils/home-stats";
import { AUTH_ROUTES } from "@/config/public-routes";
import { cn } from "@/lib/utils";

export function PricingHeroSection() {
  const { data, isLoading, isError, stats, highlights } = usePricingSection({ immediate: true });

  return (
    <section className="relative overflow-hidden border-b border-brand-secondary/30 bg-gradient-to-b from-brand-muted/40 to-background px-4 py-16 md:px-8 md:py-20">
      <div
        className="home-float-orb home-float-orb-a pointer-events-none absolute -left-20 top-12 size-64 rounded-full bg-brand/15 blur-3xl"
        aria-hidden
      />
      <div
        className="home-float-orb home-float-orb-b pointer-events-none absolute -right-16 top-20 size-52 rounded-full bg-brand-accent/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <AnimatedReveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-secondary/60 bg-card px-3 py-1 text-sm font-medium text-brand shadow-sm">
            <CreditCard className="size-4" aria-hidden />
            Pricing
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
            Simple plans.{" "}
            <span className="bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
              No surprises.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Start free. Upgrade when you need more clients, invoices, recurring billing, or Stripe
            checkout — limits loaded live from the server.
          </p>
        </AnimatedReveal>

        <AnimatedReveal delayMs={100} className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={AUTH_ROUTES.register}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-full bg-brand px-8 font-bold text-brand-foreground shadow-lg shadow-brand/25 transition-transform hover:scale-[1.02]",
            )}
          >
            Start free
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/features#compare"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-full px-8",
            )}
          >
            Compare features
          </Link>
        </AnimatedReveal>

        <AnimatedReveal delayMs={160} className="mt-8 flex flex-wrap justify-center gap-6">
          <div className="rounded-2xl border border-brand-secondary/40 bg-card/80 px-6 py-4">
            <StatDisplay
              isLoading={isLoading}
              isError={isError}
              value={formatCount(stats?.activeUsers ?? 0)}
            />
            <p className="mt-1 text-xs text-muted-foreground">Active users</p>
          </div>
          <div className="rounded-2xl border border-brand-secondary/40 bg-card/80 px-6 py-4">
            <StatDisplay
              isLoading={isLoading}
              isError={isError}
              value={formatCount(stats?.invoicesCreated ?? 0)}
            />
            <p className="mt-1 text-xs text-muted-foreground">Invoices on platform</p>
          </div>
        </AnimatedReveal>

        {!isError && highlights.length > 0 ? (
          <AnimatedReveal
            delayMs={220}
            className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground"
          >
            {highlights.map((text) => (
              <span key={text} className="inline-flex items-center gap-1">
                <Check className="size-4 text-brand" />
                {text}
              </span>
            ))}
          </AnimatedReveal>
        ) : null}

        {data?.providers?.stripe && !isError ? (
          <AnimatedReveal delayMs={260} className="mt-4">
            <span className="home-shimmer inline-block rounded-full border border-brand/30 bg-brand-muted/50 px-3 py-1 text-xs font-semibold text-brand">
              Stripe billing available
            </span>
          </AnimatedReveal>
        ) : null}
      </div>
    </section>
  );
}
