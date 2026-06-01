"use client";

import {
  Bell,
  FileText,
  Globe,
  RefreshCw,
  Shield,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useFeaturesSection } from "@/components/modules/features/hooks/useFeaturesSection";
import { FeatureCard } from "@/components/modules/features/shared/FeatureCard";
import { FeatureGridSkeleton } from "@/components/modules/features/shared/SectionSkeletons";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";

const ICON_MAP: Record<string, LucideIcon> = {
  "fast-invoicing": Zap,
  "invoice-dashboard": FileText,
  "client-management": Users,
  "client-portal": Shield,
  "stripe-checkout": Wallet,
  "payment-tracking": Wallet,
  recurring: RefreshCw,
  reminders: Bell,
  notifications: Bell,
  branding: Globe,
  "multi-currency": Globe,
  "team-scale": Shield,
};

export function FeaturesGridSection() {
  const { ref, features, isLoading, isError } = useFeaturesSection();

  return (
    <HomeSection id="all-features">
      <div ref={ref}>
        <AnimatedReveal>
          <SectionTitle
            eyebrow="Overview"
            title="All features at a glance"
            description="Every capability in the product — loaded from the server with plan badges."
          />
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && features.length === 0}
          className="mt-12"
          loadingFallback={<FeatureGridSkeleton count={6} />}
        >
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <AnimatedReveal key={feature.id} delayMs={index * 55}>
                <FeatureCard feature={feature} icon={ICON_MAP[feature.id] ?? Zap} />
              </AnimatedReveal>
            ))}
          </div>
        </SectionDataState>
      </div>
    </HomeSection>
  );
}
