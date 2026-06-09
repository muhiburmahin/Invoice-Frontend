"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/config/public-routes";
import type { MarketingPlan } from "@/types/marketing";
import { cn } from "@/lib/utils";

type PlanCardsProps = {
  plans: MarketingPlan[];
  className?: string;
};

export function PlanCards({ plans, className }: PlanCardsProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-3", className)}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "marketing-card-hover home-shimmer flex h-full flex-col rounded-2xl border p-6 shadow-sm",
            plan.highlighted
              ? "border-brand bg-brand-muted/40 shadow-lg shadow-brand/10 ring-2 ring-brand/20"
              : "border-brand-secondary/50 bg-card",
          )}
        >
          {plan.highlighted ? (
            <span className="mb-3 w-fit rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-foreground">
              Most popular
            </span>
          ) : (
            <span className="mb-3 h-5" />
          )}
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <p className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-black text-brand">{plan.price}</span>
            <span className="text-sm text-muted-foreground">/ {plan.period}</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
          <ul className="mt-6 flex-1 space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={plan.id === "ENTERPRISE" ? "/contact" : AUTH_ROUTES.register}
            className={cn(
              buttonVariants({
                variant: plan.highlighted ? "default" : "outline",
                className: "mt-6 w-full",
              }),
              plan.highlighted && "bg-brand text-brand-foreground hover:bg-brand/90",
            )}
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
