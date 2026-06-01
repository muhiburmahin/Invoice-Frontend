"use client";

import Link from "next/link";
import { ArrowRight, Check, Zap } from "lucide-react";

import { useFeaturesSection } from "@/components/modules/features/hooks/useFeaturesSection";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { StatDisplay } from "@/components/modules/home/shared/SectionDataState";
import { buttonVariants } from "@/components/ui/button";
import { formatCount } from "@/components/modules/home/utils/home-stats";
import { AUTH_ROUTES } from "@/config/public-routes";
import { cn } from "@/lib/utils";

export function FeaturesHeroSection() {
  const { data, isLoading, isError, stats, features } = useFeaturesSection({ immediate: true });

  const statItems = [
    {
      label: "Active users",
      value: stats ? formatCount(stats.activeUsers) : "0",
    },
    {
      label: "Invoices created",
      value: stats ? formatCount(stats.invoicesCreated) : "0",
    },
    {
      label: "Product features",
      value: stats ? formatCount(features.length) : "0",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-brand-secondary/30 bg-gradient-to-b from-brand-muted/40 via-background to-background px-4 py-16 md:px-8 md:py-20">
      <div
        className="home-float-orb home-float-orb-a pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-brand/20 blur-3xl"
        aria-hidden
      />
      <div
        className="home-float-orb home-float-orb-b pointer-events-none absolute -right-20 top-24 size-56 rounded-full bg-brand-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="marketing-glow-pulse pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <AnimatedReveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-secondary/60 bg-card px-3 py-1 text-sm font-medium text-brand shadow-sm">
            <Zap className="size-4 animate-pulse" aria-hidden />
            Features
          </p>
          <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Everything to invoice, track &{" "}
            <span className="bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
              get paid
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            From your first PDF invoice to recurring billing and Stripe checkout — one workspace
            for freelancers, agencies, and small business.
          </p>
        </AnimatedReveal>

        <AnimatedReveal delayMs={100} className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={AUTH_ROUTES.register}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-full bg-brand px-8 font-bold text-brand-foreground shadow-lg shadow-brand/25 transition-transform hover:scale-[1.02] hover:bg-brand/90",
            )}
          >
            Create free account
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-full px-8 font-semibold transition-transform hover:scale-[1.02]",
            )}
          >
            View pricing
          </Link>
        </AnimatedReveal>

        <AnimatedReveal delayMs={160} className="mt-10 grid gap-6 sm:grid-cols-3">
          {statItems.map((item, i) => (
            <div
              key={item.label}
              className="rounded-2xl border border-brand-secondary/40 bg-card/80 p-5 shadow-sm backdrop-blur-sm"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <StatDisplay isLoading={isLoading} isError={isError} value={item.value} />
              <p className="mt-1 text-xs font-medium text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </AnimatedReveal>

        {data?.providers && !isError ? (
          <AnimatedReveal delayMs={200} className="mt-6 flex flex-wrap justify-center gap-2">
            {data.providers.stripe ? (
              <span className="home-shimmer rounded-full border border-brand/30 bg-brand-muted/50 px-3 py-1 text-xs font-semibold text-brand">
                Stripe live
              </span>
            ) : null}
            {data.providers.google ? (
              <span className="rounded-full border border-brand-secondary/50 px-3 py-1 text-xs text-muted-foreground">
                Google sign-in
              </span>
            ) : null}
            {data.providers.github ? (
              <span className="rounded-full border border-brand-secondary/50 px-3 py-1 text-xs text-muted-foreground">
                GitHub sign-in
              </span>
            ) : null}
          </AnimatedReveal>
        ) : null}

        <AnimatedReveal
          delayMs={260}
          className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground"
        >
          {["PDF export", "Client portal", "Payment tracking", "Recurring (Pro)"].map((text) => (
            <span key={text} className="inline-flex items-center gap-1">
              <Check className="size-4 text-brand" />
              {text}
            </span>
          ))}
        </AnimatedReveal>
      </div>
    </section>
  );
}
