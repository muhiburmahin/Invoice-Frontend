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
