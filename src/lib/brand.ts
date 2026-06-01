import { brand, brandChartColors } from "@/config/brand";

export { brand, brandChartColors };

/** Read CSS brand variable at runtime (client only) */
export function getBrandCssVar(
  name:
    | "brand-primary"
    | "brand-secondary"
    | "brand-accent"
    | "success"
    | "warning"
    | "danger"
    | "info",
): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
}
