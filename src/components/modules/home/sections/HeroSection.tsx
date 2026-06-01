"use client";

import Link from "next/link";
import { ArrowRight, Check, Zap } from "lucide-react";

import { useMarketingHome } from "@/components/modules/home/hooks/useMarketingHome";
import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { ProductMockup } from "@/components/modules/home/ProductMockup";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AUTH_ROUTES } from "@/config/public-routes";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { ref, inView } = useSectionInView({ threshold: 0.05, rootMargin: "0px" });
  const { data, isLoading, isError, isFetched } = useMarketingHome(inView);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-10"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-muted/50 via-background to-background"
        aria-hidden
      />
      <div
        className="home-float-orb home-float-orb-a pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-brand/20 blur-3xl"
        aria-hidden
      />
      <div
        className="home-float-orb home-float-orb-b pointer-events-none absolute -right-16 top-40 size-56 rounded-full bg-brand-accent/25 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <AnimatedReveal delayMs={0}>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-secondary/60 bg-card px-3 py-1 text-sm font-medium text-brand shadow-sm">
            <Zap className="size-4 animate-pulse" aria-hidden />
            For freelancers, agencies & small business
          </p>
          <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Invoices, clients &{" "}
            <span className="bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
              payments
            </span>{" "}
            in one place
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Stop chasing spreadsheets. Send professional invoices, let clients pay online, and see
            what&apos;s paid, overdue, or due — from one workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={AUTH_ROUTES.register}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full bg-brand px-8 text-base font-bold text-brand-foreground shadow-lg shadow-brand/25 transition-transform hover:scale-[1.02] hover:bg-brand/90",
              )}
            >
              Create free account
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/features"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full px-8 text-base font-semibold transition-transform hover:scale-[1.02]",
              )}
            >
              See features
            </Link>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Check className="size-4 text-brand" />
              No credit card required
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="size-4 text-brand" />
              Free plan forever
            </span>
          </p>
          {isFetched && !isError && data?.providers ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {data.providers.stripe ? (
                <span className="rounded-full bg-brand-muted px-2.5 py-1 text-xs font-medium text-brand">
                  Stripe payments live
                </span>
              ) : null}
              {data.providers.google ? (
                <span className="rounded-full border border-brand-secondary/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  Google sign-in
                </span>
              ) : null}
            </div>
          ) : null}
        </AnimatedReveal>

        <AnimatedReveal delayMs={120} className="lg:pl-4">
          {isLoading ? (
            <Skeleton className="mx-auto aspect-[4/3] w-full max-w-lg rounded-2xl" />
          ) : (
            <ProductMockup
              stats={isError ? undefined : data?.stats}
              isLoading={isLoading}
              isError={isError}
            />
          )}
        </AnimatedReveal>
      </div>
    </section>
  );
}
