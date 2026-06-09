"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

import { AdminNav } from "@/components/modules/admin/AdminNav";
import { PlatformCharts } from "@/components/modules/admin/charts/PlatformCharts";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlatformStats } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export function AdminDashboard() {
  const { data, isLoading, isError, refetch } = usePlatformStats();
  const stats = data?.stats;

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
      <AdminNav />

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
