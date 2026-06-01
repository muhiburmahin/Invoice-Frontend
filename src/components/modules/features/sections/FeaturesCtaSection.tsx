"use client";

import Link from "next/link";

import { useFeaturesSection } from "@/components/modules/features/hooks/useFeaturesSection";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { buttonVariants } from "@/components/ui/button";
import { formatCount } from "@/components/modules/home/utils/home-stats";
import { AUTH_ROUTES } from "@/config/public-routes";
import { cn } from "@/lib/utils";

export function FeaturesCtaSection() {
  const { ref, stats, features, isLoading, isError } = useFeaturesSection();

  return (
    <HomeSection className="pb-20 md:pb-28">
      <div ref={ref}>
        <AnimatedReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-accent px-6 py-14 text-center shadow-xl shadow-brand/25 md:px-12">
            <div
              className="home-float-orb pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl"
              aria-hidden
            />
            <h2 className="relative text-3xl font-black text-brand-foreground md:text-4xl">
              Ready to try every feature?
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-brand-foreground/90">
              Start on the free plan — upgrade when you need recurring invoices, Stripe, or
              branding.
            </p>
            <p className="relative mt-4 text-sm text-brand-foreground/80">
              {isLoading ? (
                "Loading…"
              ) : isError ? (
                "Data not found"
              ) : (
                <>
                  Join teams using{" "}
                  <strong className="font-bold">{formatCount(stats?.activeUsers ?? 0)}</strong>{" "}
                  accounts · <strong className="font-bold">{formatCount(features.length)}</strong>{" "}
                  features included
                </>
              )}
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={AUTH_ROUTES.register}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full bg-white px-8 font-bold text-brand transition-transform hover:scale-[1.02] hover:bg-brand-secondary",
                )}
              >
                Create free account
              </Link>
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full border-white/40 text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Compare plans
              </Link>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </HomeSection>
  );
}
