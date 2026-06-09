"use client";

import { BarChart3, PieChart, TrendingUp, Users } from "lucide-react";

import { AdminDonutChart } from "@/components/modules/admin/charts/AdminDonutChart";
import { AdminHorizontalBarChart } from "@/components/modules/admin/charts/AdminHorizontalBarChart";
import { AdminVerticalBarChart } from "@/components/modules/admin/charts/AdminVerticalBarChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { PlatformStats } from "@/types/admin";

const INVOICE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  VIEWED: "Viewed",
  PARTIALLY_PAID: "Partial",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const ROLE_LABELS: Record<string, string> = {
  USER: "Users",
  SUPPORT: "Support",
  SUPER_ADMIN: "Super Admin",
};

const PLAN_LABELS: Record<string, string> = {
  FREE: "Free",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};

type PlatformChartsProps = {
  stats: PlatformStats;
};

export function PlatformCharts({ stats }: PlatformChartsProps) {
  const charts = stats.charts ?? {
    userGrowth: [],
    revenueTrend: [],
    invoicesByStatus: {},
    usersByRole: {},
  };

  const userGrowthPct =
    stats.users.newLastMonth > 0
      ? Math.round(
          ((stats.users.newThisMonth - stats.users.newLastMonth) /
            stats.users.newLastMonth) *
            100,
        )
      : stats.users.newThisMonth > 0
        ? 100
        : 0;

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <Card className="border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-brand" />
            User signups
          </CardTitle>
          <CardDescription>
            Last 6 months
            {userGrowthPct !== 0 ? (
              <span
                className={
                  userGrowthPct > 0 ? " text-success" : " text-destructive"
                }
              >
                {" "}
                · {userGrowthPct > 0 ? "+" : ""}
                {userGrowthPct}% vs last month
              </span>
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminVerticalBarChart
            data={charts.userGrowth.map((p) => ({
              label: p.label,
              value: p.count,
            }))}
            colorIndex={0}
          />
        </CardContent>
      </Card>

      <Card className="border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-brand-accent" />
            Platform revenue
          </CardTitle>
          <CardDescription>
            Completed payments · {formatCurrency(stats.revenue.allTime)} all time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminVerticalBarChart
            data={charts.revenueTrend.map((p) => ({
              label: p.label,
              value: p.amount,
            }))}
            formatValue={(v) => formatCurrency(v)}
            colorIndex={1}
          />
        </CardContent>
      </Card>

      <Card className="border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="size-5 text-brand" />
            Subscription plans
          </CardTitle>
          <CardDescription>Active subscriptions by plan tier</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDonutChart
            data={Object.entries(stats.plans).map(([plan, count]) => ({
              label: PLAN_LABELS[plan] ?? plan,
              value: count,
            }))}
            centerValue={String(
              Object.values(stats.plans).reduce((s, c) => s + c, 0),
            )}
            centerLabel="total"
          />
        </CardContent>
      </Card>

      <Card className="border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-brand-accent" />
            Invoice status
          </CardTitle>
          <CardDescription>Platform-wide invoice breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminHorizontalBarChart
            data={Object.entries(charts.invoicesByStatus).map(([status, count]) => ({
              label: INVOICE_STATUS_LABELS[status] ?? status,
              value: count,
            }))}
          />
        </CardContent>
      </Card>

      <Card className="border-brand-secondary/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-brand" />
            Users by role
          </CardTitle>
          <CardDescription>
            {stats.users.active} active · {stats.users.deleted} deleted
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-xl">
          <AdminHorizontalBarChart
            data={Object.entries(charts.usersByRole).map(([role, count]) => ({
              label: ROLE_LABELS[role] ?? role,
              value: count,
            }))}
          />
        </CardContent>
      </Card>
    </section>
  );
}
