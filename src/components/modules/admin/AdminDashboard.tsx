"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

import { SupportAccessBanner } from "@/components/modules/admin/SupportAccessBanner";
import { PlatformCharts } from "@/components/modules/admin/charts/PlatformCharts";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlatformStats, useUpgradeRequests } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { roleLabel } from "@/lib/roles";
import { formatCurrency, formatDate } from "@/lib/utils";

export function AdminDashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = usePlatformStats();
  const { data: upgradeData } = useUpgradeRequests();
  const pendingUpgrades = upgradeData?.requests ?? [];
  const stats = data?.stats;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  if (isLoading) return <LoadingSkeleton rows={4} />;

  if (isError || !stats) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Could not load platform stats.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-brand-secondary/50 bg-gradient-to-br from-brand-secondary/40 via-background to-brand-accent/10 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-brand">Admin console</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Hello, {firstName}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Platform overview — {roleLabel(user?.role)} access across all users and businesses.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center gap-2 self-start rounded-lg border border-brand-secondary px-4 text-sm font-medium hover:bg-brand-secondary/40"
          >
            My business app
          </Link>
        </div>
      </section>

      <SupportAccessBanner context="overview" />

      {pendingUpgrades.length > 0 ? (
        <Card className="border-brand/40 bg-brand-secondary/10">
          <CardHeader>
            <CardTitle className="text-base">Pending Pro upgrades</CardTitle>
            <CardDescription>
              Users paid offline — verify payment, then change plan to PRO on their profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingUpgrades.map((req) => (
              <div
                key={req.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand-secondary/40 bg-background p-3 text-sm"
              >
                <div>
                  <Link
                    href={`/admin/users/${req.userId}`}
                    className="font-medium text-brand hover:underline"
                  >
                    {req.userName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{req.userEmail}</p>
                  {req.paymentReference ? (
                    <p className="mt-1 text-xs">
                      TrxID: <span className="font-mono">{req.paymentReference}</span>
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Requested {formatDate(req.requestedAt)}
                  </p>
                </div>
                <Link
                  href={`/admin/users/${req.userId}`}
                  className="inline-flex h-8 items-center rounded-lg bg-brand px-3 text-xs font-medium text-brand-foreground"
                >
                  Review user
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.users.total}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.users.active}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">New this month</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.users.newThisMonth}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Revenue (month)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatCurrency(stats.revenue.thisMonth)}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Total: {stats.invoices.total}</p>
            <p>Paid: {stats.invoices.paid}</p>
            <p>Overdue: {stats.invoices.overdue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Revenue (all time)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatCurrency(stats.revenue.allTime)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Deleted users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.users.deleted}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Quick links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/admin/users" className="text-sm text-brand hover:underline">
              Manage users
            </Link>
            <Link href="/admin/activity-logs" className="text-sm text-brand hover:underline">
              View activity logs
            </Link>
          </CardContent>
        </Card>
      </section>

      <PlatformCharts stats={stats} />
    </div>
  );
}
