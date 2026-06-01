import { formatCurrency } from "@/lib/utils";
import type { MarketingStats } from "@/types/marketing";

export function formatCount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M+`;
  if (value >= 10_000) return `${Math.floor(value / 1000)}k+`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k+`;
  return String(value);
}

export function formatCollectedValue(stats: MarketingStats): string {
  if (stats.totalCollected > 0) {
    return formatCurrency(stats.totalCollected, "USD");
  }
  if (stats.paymentsCompleted > 0) {
    return `${formatCount(stats.paymentsCompleted)} payments`;
  }
  return "0";
}
