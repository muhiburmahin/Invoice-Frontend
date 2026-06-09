"use client";

import { Check, Minus } from "lucide-react";

import type { MarketingComparisonRow, MarketingPlan } from "@/types/marketing";
import { cn } from "@/lib/utils";

const PLAN_ORDER = ["FREE", "PRO", "ENTERPRISE"] as const;

function CellValue({ value }: { value: string }) {
  if (value === "—") {
    return <Minus className="mx-auto size-4 text-muted-foreground" aria-label="Not included" />;
  }
  if (value === "Yes") {
    return <Check className="mx-auto size-4 text-brand" aria-label="Included" />;
  }
  return <span className="text-sm font-medium tabular-nums">{value || "0"}</span>;
}

type ComparisonTableProps = {
  comparison: MarketingComparisonRow[];
  plans: MarketingPlan[];
  className?: string;
};

export function ComparisonTable({ comparison, plans, className }: ComparisonTableProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-brand-secondary/50 shadow-lg shadow-brand/5",
        className,
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-brand-secondary/50 bg-brand-muted/30">
            <th className="p-4 font-semibold text-foreground">Feature</th>
            {PLAN_ORDER.map((planId) => {
              const plan = plans.find((p) => p.id === planId);
              return (
                <th
                  key={planId}
                  className={cn(
                    "p-4 text-center font-semibold",
                    plan?.highlighted && "bg-brand/10 text-brand",
                  )}
                >
                  {plan?.name ?? planId}
                  {plan?.highlighted ? (
                    <span className="mt-1 block text-[10px] font-bold uppercase text-brand">
                      Popular
                    </span>
                  ) : null}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {comparison.map((row, i) => (
            <tr
              key={row.id}
              className={cn(
                "border-b border-brand-secondary/30 transition-colors hover:bg-brand-muted/20",
                i % 2 === 0 && "bg-card/50",
              )}
            >
              <td className="p-4 font-medium text-foreground">{row.label}</td>
              {PLAN_ORDER.map((planId) => (
                <td
                  key={planId}
                  className={cn(
                    "p-4 text-center",
                    plans.find((p) => p.id === planId)?.highlighted && "bg-brand/5",
                  )}
                >
                  <CellValue value={row.values[planId] ?? "—"} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
