import { FileText, TrendingUp, Users } from "lucide-react";

import { formatCollectedValue, formatCount } from "@/components/modules/home/utils/home-stats";
import { cn } from "@/lib/utils";
import type { MarketingStats } from "@/types/marketing";

type ProductMockupProps = {
  className?: string;
  stats?: MarketingStats;
  isLoading?: boolean;
  isError?: boolean;
};

function cellValue(
  isLoading: boolean | undefined,
  isError: boolean | undefined,
  value: string,
): string {
  if (isLoading) return "…";
  if (isError) return "—";
  return value;
}

export function ProductMockup({ className, stats, isLoading, isError }: ProductMockupProps) {
  const metrics = [
    {
      label: "Collected",
      value: stats ? formatCollectedValue(stats) : "0",
      icon: TrendingUp,
    },
    {
      label: "Invoices",
      value: stats ? formatCount(stats.invoicesCreated) : "0",
      icon: FileText,
    },
    {
      label: "Users",
      value: stats ? formatCount(stats.activeUsers) : "0",
      icon: Users,
    },
  ];

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-lg rounded-2xl border border-brand-secondary/60 bg-card p-1 shadow-2xl shadow-brand/15 ring-1 ring-brand/10",
        className,
      )}
    >
      <div className="rounded-xl bg-gradient-to-br from-brand-muted/80 via-background to-brand-secondary/30 p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 border-b border-brand-secondary/40 pb-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Dashboard</p>
            <p className="text-sm font-bold text-foreground">Good morning, Alex</p>
          </div>
          <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-foreground">
            Pro
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {metrics.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-lg border border-brand-secondary/40 bg-card/90 p-2.5 shadow-sm"
            >
              <Icon className="size-3.5 text-brand" />
              <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
              <p className="text-sm font-bold tabular-nums">
                {cellValue(isLoading, isError, value)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 rounded-lg border border-brand-secondary/40 bg-card/95 p-3">
          <p className="text-xs font-semibold text-foreground">Recent invoices</p>
          {isError ? (
            <p className="py-4 text-center text-xs text-muted-foreground">Data not found</p>
          ) : (
            [
              { num: "INV-1042", client: "Acme Co.", amount: "$1,200", status: "Paid" },
              { num: "INV-1041", client: "North Studio", amount: "$850", status: "Sent" },
              { num: "INV-1040", client: "Bright LLC", amount: "$2,400", status: "Overdue" },
            ].map((row) => (
              <div
                key={row.num}
                className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-2 py-1.5 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{row.num}</p>
                  <p className="truncate text-muted-foreground">{row.client}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold tabular-nums">{row.amount}</p>
                  <p
                    className={cn(
                      "text-[10px] font-medium",
                      row.status === "Paid"
                        ? "text-status-paid"
                        : row.status === "Overdue"
                          ? "text-destructive"
                          : "text-muted-foreground",
                    )}
                  >
                    {row.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-brand/20 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-brand-accent/15 blur-3xl"
        aria-hidden
      />
    </div>
  );
}
