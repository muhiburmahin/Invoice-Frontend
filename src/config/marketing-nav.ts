import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  HelpCircle,
  Mail,
  Zap,
} from "lucide-react";

export type MarketingNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

/** Public marketing site navigation (navbar + mobile drawer). */
export const marketingNavItems: MarketingNavItem[] = [
  {
    href: "/features",
    label: "Features",
    icon: Zap,
    description: "Invoicing, clients & payments",
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: CreditCard,
    description: "Free, Pro & Enterprise",
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: HelpCircle,
    description: "Common questions",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: Mail,
    description: "Talk to our team",
  },
];

export const marketingPaths = marketingNavItems.map((item) => item.href);

export function isMarketingPath(pathname: string): boolean {
  return marketingPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
