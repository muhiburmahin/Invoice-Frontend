"use client";

import { TrendingUp, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { PaymentStats } from "@/types/dashboard";

type RevenueChartProps = {
  stats: PaymentStats;
  currency?: string;
};

export function RevenueChart({ stats, currency = "USD" }: RevenueChartProps) {
  const methods = Object.entries(stats.byMethod);

  return (
    <Card className="border-brand-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-5 text-brand-accent" />
          Revenue
        </CardTitle>
        <CardDescription>Payment collection overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="flex items-center gap-2 rounded-lg border border-brand-secondary/50 p-3">
          <Wallet className="size-4 text-warning" />
          <div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
            <p className="font-semibold">{formatCurrency(stats.pendingTotal, currency)}</p>
          </div>
        </div>

        {methods.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">By method</p>
            {methods.map(([method, data]) => (
              <div
                key={method}
                className="flex items-center justify-between text-sm"
              >
                <span className="capitalize">{method.toLowerCase().replace("_", " ")}</span>
                <span className="font-medium">
                  {formatCurrency(data.amount, currency)} ({data.count})
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
