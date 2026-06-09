"use client";

import { TrendingUp, Wallet } from "lucide-react";

import { AdminDonutChart } from "@/components/modules/admin/charts/AdminDonutChart";
import { AdminVerticalBarChart } from "@/components/modules/admin/charts/AdminVerticalBarChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { PaymentStats } from "@/types/dashboard";

const METHOD_LABELS: Record<string, string> = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank transfer",
  CHECK: "Check",
  STRIPE: "Stripe",
  OTHER: "Other",
};

type RevenueChartProps = {
  stats: PaymentStats;
  currency?: string;
};

export function RevenueChart({ stats, currency = "USD" }: RevenueChartProps) {
  const monthlyTrend = stats.monthlyTrend ?? [];
  const methods = Object.entries(stats.byMethod);

  return (
    <Card className="border-brand-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-5 text-brand-accent" />
          Revenue
        </CardTitle>
        <CardDescription>Payment collection overview · last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-brand-secondary/40 p-3">
            <p className="text-xs text-muted-foreground">Collected (all time)</p>
            <p className="text-lg font-bold text-brand">
              {formatCurrency(stats.completedTotal, currency)}
            </p>
          </div>
          <div className="rounded-lg bg-brand-accent/10 p-3">
            <p className="text-xs text-muted-foreground">This month</p>
            <p className="text-lg font-bold text-brand-accent">
              {formatCurrency(stats.completedThisMonth, currency)}
            </p>
          </div>
        </div>

        <AdminVerticalBarChart
          data={monthlyTrend.map((p) => ({ label: p.label, value: p.amount }))}
          formatValue={(v) => formatCurrency(v, currency)}
          colorIndex={1}
        />

        <div className="flex items-center gap-2 rounded-lg border border-brand-secondary/50 p-3">
          <Wallet className="size-4 text-warning" />
          <div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
            <p className="font-semibold">{formatCurrency(stats.pendingTotal, currency)}</p>
          </div>
        </div>

        {methods.length > 0 ? (
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">By payment method</p>
            <AdminDonutChart
              data={methods.map(([method, data]) => ({
                label: METHOD_LABELS[method] ?? method.replace(/_/g, " "),
                value: data.amount,
              }))}
              centerValue={formatCurrency(stats.completedTotal, currency)}
              centerLabel="collected"
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
