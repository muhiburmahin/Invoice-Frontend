"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  PricingComparisonSection,
  PricingCtaSection,
  PricingFaqSection,
  PricingHeroSection,
  PricingPlansSection,
} from "@/components/modules/pricing/sections";

export function PricingPage() {
  return (
    <>
      <main id="main-content">
        <PricingHeroSection />
        <PricingPlansSection />
        <PricingComparisonSection />
        <PricingFaqSection />
        <PricingCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
