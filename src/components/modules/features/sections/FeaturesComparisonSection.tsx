"use client";

import Link from "next/link";
import { Check, Minus } from "lucide-react";

import { useFeaturesSection } from "@/components/modules/features/hooks/useFeaturesSection";
import { ComparisonTableSkeleton } from "@/components/modules/features/shared/SectionSkeletons";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { cn } from "@/lib/utils";

const PLAN_ORDER = ["FREE", "PRO", "ENTERPRISE"] as const;

function CellValue({
  value,
  isLoading,
  isError,
}: {
  value: string;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) return <span className="text-muted-foreground">…</span>;
  if (isError) return <span className="text-xs text-muted-foreground">—</span>;
  if (value === "—") {
    return <Minus className="mx-auto size-4 text-muted-foreground" aria-label="Not included" />;
  }
  if (value === "Yes") {
    return <Check className="mx-auto size-4 text-brand" aria-label="Included" />;
  }
  return <span className="text-sm font-medium tabular-nums">{value || "0"}</span>;
}

export function FeaturesComparisonSection() {
  const { ref, comparison, plans, isLoading, isError } = useFeaturesSection();

  return (
    <HomeSection id="compare">
      <div ref={ref}>
        <AnimatedReveal>
          <SectionTitle
            eyebrow="Compare plans"
            title="Feature availability by plan"
            description="Live limits from the API — Free, Pro, and Enterprise side by side."
          />
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && comparison.length === 0}
          className="mt-12"
          loadingFallback={<ComparisonTableSkeleton />}
          errorMessage="Data not found"
          emptyMessage="Data not found"
        >
          <AnimatedReveal delayMs={80}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-brand-secondary/50 shadow-lg shadow-brand/5">
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
                          <CellValue
                            value={row.values[planId] ?? "—"}
                            isLoading={isLoading}
                            isError={isError}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedReveal>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need full pricing details?{" "}
            <Link href="/pricing" className="font-semibold text-brand hover:underline">
              See pricing page →
            </Link>
          </p>
        </SectionDataState>
      </div>
    </HomeSection>
  );
}
