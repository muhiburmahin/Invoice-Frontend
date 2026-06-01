"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  FeaturesCategorySection,
  FeaturesComparisonSection,
  FeaturesCtaSection,
  FeaturesFaqSection,
  FeaturesGridSection,
  FeaturesHeroSection,
  FeaturesIntegrationsSection,
} from "@/components/modules/features/sections";

export function FeaturesPage() {
  return (
    <>
      <main id="main-content">
        <FeaturesHeroSection />
        <FeaturesGridSection />
        <FeaturesCategorySection />
        <FeaturesComparisonSection />
        <FeaturesIntegrationsSection />
        <FeaturesFaqSection />
        <FeaturesCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
