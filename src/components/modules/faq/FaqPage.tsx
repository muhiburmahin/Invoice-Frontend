"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  FaqCtaSection,
  FaqHeroSection,
  FaqListSection,
} from "@/components/modules/faq/sections";

export function FaqPage() {
  return (
    <>
      <main id="main-content">
        <FaqHeroSection />
        <FaqListSection />
        <FaqCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
