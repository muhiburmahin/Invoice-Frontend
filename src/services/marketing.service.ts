import { apiGet } from "@/lib/api";
import type {
  MarketingFaqPageData,
  MarketingFeaturesData,
  MarketingHomeData,
  MarketingPricingData,
} from "@/types/marketing";

export async function getMarketingHome(): Promise<MarketingHomeData> {
  return apiGet<MarketingHomeData>("/api/v1/public/marketing/home");
}

export async function getMarketingFeatures(): Promise<MarketingFeaturesData> {
  return apiGet<MarketingFeaturesData>("/api/v1/public/marketing/features");
}

export async function getMarketingPricing(): Promise<MarketingPricingData> {
  return apiGet<MarketingPricingData>("/api/v1/public/marketing/pricing");
}

export async function getMarketingFaq(): Promise<MarketingFaqPageData> {
  return apiGet<MarketingFaqPageData>("/api/v1/public/marketing/faq");
}
