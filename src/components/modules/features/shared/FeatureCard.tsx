"use client";

import type { LucideIcon } from "lucide-react";

import type { MarketingFeature } from "@/types/marketing";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  feature: MarketingFeature;
  icon: LucideIcon;
  className?: string;
};

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className="rounded bg-brand-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand">
      {plan}
    </span>
  );
}

export function FeatureCard({ feature, icon: Icon, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "marketing-card-hover home-shimmer group flex h-full flex-col rounded-2xl border border-brand-secondary/50 bg-card p-6 shadow-sm",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-secondary/70 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground">
        <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
      {feature.highlights.length > 0 ? (
        <ul className="mt-4 space-y-1 border-t border-brand-secondary/40 pt-4">
          {feature.highlights.map((h) => (
            <li key={h} className="text-xs text-muted-foreground">
              · {h}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-1">
        {feature.plans.map((p) => (
          <PlanBadge key={p} plan={p} />
        ))}
      </div>
    </div>
  );
}
