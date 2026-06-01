/**
 * Invoice SaaS — single source of truth for brand colors.
 * Use in TS/JS (charts, PDF preview, emails). UI uses CSS vars from globals.css.
 */
export const brand = {
  name: "Invoice",
  palette: {
    /** Main brand — buttons, links, sidebar active, focus ring */
    primary: {
      DEFAULT: "#0F766E",
      light: "#14B8A6",
      dark: "#115E59",
      foreground: "#F0FDFA",
    },
    /** Surfaces, secondary buttons, tags */
    secondary: {
      DEFAULT: "#CCFBF1",
      foreground: "#134E4A",
      muted: "#F0FDFA",
    },
    /** Highlights — revenue, badges, chart accent */
    accent: {
      DEFAULT: "#0891B2",
      foreground: "#ECFEFF",
    },
    /** Invoice / payment semantics */
    success: { DEFAULT: "#059669", foreground: "#ECFDF5" },
    warning: { DEFAULT: "#D97706", foreground: "#FFFBEB" },
    danger: { DEFAULT: "#DC2626", foreground: "#FEF2F2" },
    info: { DEFAULT: "#0284C7", foreground: "#F0F9FF" },
    /** Neutrals */
    neutral: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      500: "#64748B",
      700: "#334155",
      900: "#0F172A",
    },
  },
} as const;

export type BrandPalette = typeof brand.palette;

/** Chart series — pass to Recharts / Chart.js */
export const brandChartColors = [
  brand.palette.primary.DEFAULT,
  brand.palette.accent.DEFAULT,
  brand.palette.primary.light,
  brand.palette.success.DEFAULT,
  brand.palette.warning.DEFAULT,
] as const;
