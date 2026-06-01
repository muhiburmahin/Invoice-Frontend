import { apiGet } from "@/lib/api";
import type { MarketingHomeData } from "@/types/marketing";

export async function getMarketingHome(): Promise<MarketingHomeData> {
  return apiGet<MarketingHomeData>("/api/v1/public/marketing/home");
}
