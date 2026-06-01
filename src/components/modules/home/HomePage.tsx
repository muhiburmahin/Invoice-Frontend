"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  BenefitsSection,
  FaqSection,
  FinalCtaSection,
  HeroSection,
  HowItWorksSection,
  PricingTeaserSection,
  ProductPreviewSection,
  SocialProofSection,
} from "@/components/modules/home/sections";

export function HomePage() {
  return (
    <>
      <main id="main-content">
        <HeroSection />
        <SocialProofSection />
        <BenefitsSection />
        <ProductPreviewSection />
        <HowItWorksSection />
        <PricingTeaserSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
