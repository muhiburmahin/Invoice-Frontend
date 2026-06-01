import { apiGet } from "@/lib/api";
import type { MarketingFeaturesData, MarketingHomeData } from "@/types/marketing";

export async function getMarketingHome(): Promise<MarketingHomeData> {
  return apiGet<MarketingHomeData>("/api/v1/public/marketing/home");
}

export async function getMarketingFeatures(): Promise<MarketingFeaturesData> {
  return apiGet<MarketingFeaturesData>("/api/v1/public/marketing/features");
}
