"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, RefreshCw, Repeat } from "lucide-react";

import { RecurringTable } from "@/components/modules/recurring/RecurringTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRecurringSchedules, useRecurringStats } from "@/hooks/useRecurring";
import { useAuth } from "@/hooks/useAuth";

export function RecurringPage() {
  const { plan } = useAuth();
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);

  const listParams = {
    page,
    limit: 20,
    isActive: status === "all" ? undefined : status === "active",
    sortBy: "nextRunAt" as const,
    sortOrder: "asc" as const,
  };

  const { data, isLoading, isError, refetch, isFetching } =
    useRecurringSchedules(listParams);
  const { data: statsData } = useRecurringStats();

  const schedules = data?.schedules ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };
  const stats = statsData?.stats;
  const usagePercent =
    stats && stats.limit > 0
      ? Math.min(100, (stats.used / stats.limit) * 100)
      : 0;

  if (isLoading && !data) {
    return <LoadingSkeleton rows={5} />;
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">
            Could not load recurring schedules.
          </p>
          <Button onClick={() => void refetch()} className="bg-brand text-brand-foreground">
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Recurring invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Automate invoices on a weekly, monthly, or custom schedule.
          </p>
        </div>
        {plan !== "FREE" ? (
          <Button
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            render={<Link href="/recurring/new" />}
          >
            <Plus className="size-4" />
            New schedule
          </Button>
        ) : (
          <Button variant="outline" render={<Link href="/settings/billing" />}>
            Upgrade to enable
          </Button>
        )}
      </div>

      {stats ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{stats.active}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Due soon</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{stats.dueSoon}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-destructive">{stats.overdue}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Plan usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-bold">
                {stats.used}
                {Number.isFinite(stats.limit) ? ` / ${stats.limit}` : ""}
              </p>
              {Number.isFinite(stats.limit) ? (
                <Progress value={usagePercent} className="h-2" />
              ) : null}
            </CardContent>
          </Card>
        </section>
      ) : null}

      {plan === "FREE" ? (
        <Card className="border-brand/30 bg-brand-muted/10">
          <CardContent className="flex items-center gap-3 py-6">
            <Repeat className="size-8 text-brand" />
            <div>
              <p className="font-medium">Recurring billing is a Pro feature</p>
              <p className="text-sm text-muted-foreground">
                Upgrade your plan to create automated invoice schedules.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <RecurringTable
          schedules={schedules}
          meta={meta}
          status={status}
          isLoading={isFetching}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
