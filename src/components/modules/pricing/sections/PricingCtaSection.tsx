"use client";

import Link from "next/link";

import { usePricingSection } from "@/components/modules/pricing/hooks/usePricingSection";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import {
  marketingOutlineOnBrandClass,
  marketingPrimaryOnBrandClass,
} from "@/config/marketing-cta";
import { AUTH_ROUTES } from "@/config/public-routes";

export function PricingCtaSection() {
  const { ref, isLoading, isError } = usePricingSection();

  return (
    <HomeSection className="pb-20 md:pb-28">
      <div ref={ref}>
        <AnimatedReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-accent px-6 py-14 text-center shadow-xl shadow-brand/25 md:px-12">
            <div
              className="home-float-orb pointer-events-none absolute -left-16 -bottom-16 size-48 rounded-full bg-white/10 blur-3xl"
              aria-hidden
            />
            <h2 className="relative text-3xl font-black text-brand-foreground md:text-4xl">
              Start invoicing for free today
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-brand-foreground/90">
              {isLoading
                ? "Loading plan details…"
                : isError
                  ? "Data not found"
                  : "Create your account in minutes. Upgrade only when your business grows."}
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={AUTH_ROUTES.register} className={marketingPrimaryOnBrandClass}>
                Create free account
              </Link>
              <Link href="/contact" className={marketingOutlineOnBrandClass}>
                Contact sales
              </Link>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </HomeSection>
  );
}
