import type { PlanLimits } from "@/types";

export type MarketingPlan = {
  id: "FREE" | "PRO" | "ENTERPRISE";
  name: string;
  price: string;
  period: string;
  description: string;
  highlighted: boolean;
  cta: string;
  limits: PlanLimits;
  features: string[];
};

export type MarketingTestimonial = {
  quote: string;
  author: string;
  role: string;
  rating: number;
};

export type MarketingFaqItem = {
  q: string;
  a: string;
  category?: string;
};

export type MarketingFaqCategory = {
  id: string;
  label: string;
};

export type MarketingStats = {
  activeUsers: number;
  invoicesCreated: number;
  paymentsCompleted: number;
  totalCollected: number;
};

export type MarketingProviders = {
  google: boolean;
  github: boolean;
  stripe: boolean;
};

export type MarketingHomeData = {
  stats: MarketingStats;
  plans: MarketingPlan[];
  providers: MarketingProviders;
  testimonials: MarketingTestimonial[];
  trustedLabels: string[];
  faq: MarketingFaqItem[];
};

export type MarketingFeature = {
  id: string;
  title: string;
  description: string;
  category: "invoicing" | "clients" | "payments" | "automation" | "branding";
  plans: ("FREE" | "PRO" | "ENTERPRISE")[];
  highlights: string[];
  available: boolean;
};

export type MarketingFeatureCategory = {
  id: string;
  label: string;
  description: string;
};

export type MarketingComparisonRow = {
  id: string;
  label: string;
  values: Record<"FREE" | "PRO" | "ENTERPRISE", string>;
};

export type MarketingIntegration = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

export type MarketingFeaturesData = {
  stats: MarketingStats;
  providers: MarketingProviders;
  plans: MarketingPlan[];
  categories: MarketingFeatureCategory[];
  features: MarketingFeature[];
  comparison: MarketingComparisonRow[];
  integrations: MarketingIntegration[];
  faq: MarketingFaqItem[];
};

export type MarketingPricingData = {
  stats: MarketingStats;
  providers: MarketingProviders;
  plans: MarketingPlan[];
  comparison: MarketingComparisonRow[];
  highlights: string[];
  faq: MarketingFaqItem[];
};

export type MarketingFaqPageData = {
  providers: MarketingProviders;
  categories: MarketingFaqCategory[];
  faq: MarketingFaqItem[];
};
