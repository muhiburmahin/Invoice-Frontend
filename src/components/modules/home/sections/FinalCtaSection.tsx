"use client";

import Link from "next/link";

import { useMarketingHome } from "@/components/modules/home/hooks/useMarketingHome";
import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { formatCount } from "@/components/modules/home/utils/home-stats";
import {
  marketingOutlineOnBrandClass,
  marketingPrimaryOnBrandClass,
} from "@/config/marketing-cta";
import { AUTH_ROUTES } from "@/config/public-routes";

export function FinalCtaSection() {
  const { ref, inView } = useSectionInView();
  const { data, isLoading, isError } = useMarketingHome(inView);

  const users = data?.stats.activeUsers ?? 0;

  return (
    <HomeSection className="pb-20 md:pb-28">
      <div ref={ref}>
        <AnimatedReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-accent px-6 py-14 text-center shadow-xl shadow-brand/25 md:px-12 md:py-16">
            <div
              className="home-float-orb pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl"
              aria-hidden
            />
            <h2 className="relative text-3xl font-black text-brand-foreground md:text-4xl">
              Start invoicing in minutes
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-brand-foreground/90">
              Join freelancers and teams who send invoices, track payments, and get paid faster.
            </p>
            <p className="relative mt-4 text-sm text-brand-foreground/80">
              {isLoading ? (
                "Loading platform stats…"
              ) : isError ? (
                "Data not found"
              ) : (
                <>
                  Join <strong className="font-bold">{formatCount(users)}</strong> teams already on
                  the platform
                </>
              )}
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={AUTH_ROUTES.register} className={marketingPrimaryOnBrandClass}>
                Create free account
              </Link>
              <Link href={AUTH_ROUTES.login} className={marketingOutlineOnBrandClass}>
                Sign in
              </Link>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </HomeSection>
  );
}
