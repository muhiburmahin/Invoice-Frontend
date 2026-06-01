import Link from "next/link";

import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { AUTH_ROUTES } from "@/config/public-routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <MarketingPageShell
      title="Pricing"
      description="Start free. Upgrade when you need more clients, invoices, and automation."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { name: "Free", price: "$0", detail: "Core invoicing" },
          { name: "Pro", price: "$19", detail: "Growing businesses", highlight: true },
          { name: "Enterprise", price: "Custom", detail: "Teams & scale" },
        ].map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-xl border p-5",
              plan.highlight
                ? "border-brand bg-brand-muted/30 shadow-sm"
                : "border-brand-secondary/50",
            )}
          >
            <p className="font-semibold">{plan.name}</p>
            <p className="mt-1 text-2xl font-bold">{plan.price}</p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.detail}</p>
          </div>
        ))}
      </div>
      <Link
        href={AUTH_ROUTES.register}
        className={cn(buttonVariants(), "bg-brand text-brand-foreground hover:bg-brand/90")}
      >
        Start free trial
      </Link>
    </MarketingPageShell>
  );
}
