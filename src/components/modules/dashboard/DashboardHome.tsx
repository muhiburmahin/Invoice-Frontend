"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  FileText,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";

import { RecentInvoices } from "@/components/modules/dashboard/RecentInvoices";
import { RevenueChart } from "@/components/modules/dashboard/RevenueChart";
import { InvoiceStatusChart } from "@/components/modules/dashboard/InvoiceStatusChart";
import { StatsCard } from "@/components/modules/dashboard/StatsCard";
import { InvoiceStatusBadge } from "@/components/modules/invoices/InvoiceStatusBadge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePlatformStats } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { isStaff } from "@/lib/roles";
import { formatCurrency } from "@/lib/utils";

export function DashboardHome() {
  const { user, plan, workspace } = useAuth();
  const { data, isLoading, isError, refetch, isFetching } = useDashboard();

  if (isLoading) {
    return <LoadingSkeleton rows={8} />;
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">
            Could not load dashboard. Check that the API is running on port 5000.
          </p>
          <Button
            onClick={() => void refetch()}
            className="bg-brand text-brand-foreground"
          >
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currency = data.business?.currency ?? "USD";
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const limits = workspace?.planLimits;

  return (
    <div className="space-y-8 pb-8">
      {data.partialLoad ? (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <p className="text-sm text-muted-foreground">
              Some dashboard data could not be loaded
              {data.failedRequests ? ` (${data.failedRequests} requests failed)` : ""}.
              Make sure the backend is running, then refresh.
            </p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Section 1: Welcome */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-secondary/50 bg-gradient-to-br from-brand-secondary/40 via-background to-brand-accent/10 p-6 md:p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-brand">Welcome back</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Hello, {firstName}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              {data.business?.name
                ? `Here's what's happening at ${data.business.name} today.`
                : "Your invoice workspace at a glance."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/invoices/new"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand/90"
            >
              <Plus className="size-4" />
              New invoice
            </Link>
            <Link
              href="/clients"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-brand-secondary px-4 text-sm font-medium hover:bg-brand-secondary/40"
            >
              <Users className="size-4" />
              Clients
            </Link>
          </div>
        </div>
        {isFetching ? (
          <p className="relative z-10 mt-2 text-xs text-muted-foreground">Refreshing…</p>
        ) : null}
      </section>

      {/* Section 2: KPI stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total revenue"
          value={formatCurrency(data.paymentStats.completedTotal, currency)}
          subtitle={`${formatCurrency(data.paymentStats.completedThisMonth, currency)} this month`}
          icon={Sparkles}
          trend="up"
        />
        <StatsCard
          title="Outstanding"
          value={formatCurrency(data.invoiceStats.outstandingBalance, currency)}
          subtitle="Awaiting payment"
          icon={AlertTriangle}
          trend={data.invoiceStats.outstandingBalance > 0 ? "down" : "neutral"}
        />
        <StatsCard
          title="Invoices"
          value={String(data.invoiceStats.total)}
          subtitle={`${data.invoiceStats.thisMonth} created this month`}
          icon={FileText}
        />
        <StatsCard
          title="Active clients"
          value={String(data.clientStats.active)}
          subtitle={`${data.clientStats.total} total clients`}
          icon={Users}
        />
      </section>

      {/* Section 3: Quick actions */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Quick actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/invoices/new", label: "Create invoice", icon: FileText },
            { href: "/clients", label: "Manage clients", icon: Users },
            { href: "/payments", label: "View payments", icon: Sparkles },
            { href: "/settings/business", label: "Business settings", icon: RefreshCw },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border border-brand-secondary/50 bg-card p-4 transition-colors hover:border-brand hover:bg-brand-secondary/30"
            >
              <action.icon className="size-5 text-brand" />
              <span className="text-sm font-medium">{action.label}</span>
              <ArrowRight className="ml-auto size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* Section 4 & 5: Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <RevenueChart stats={data.paymentStats} currency={currency} />
        <InvoiceStatusChart
          byStatus={data.invoiceStats.byStatus}
          monthlyCreated={data.invoiceStats.monthlyCreated}
        />
      </section>

      {/* Section 6: Overdue alert */}
      {data.overdueInvoices.length > 0 ? (
        <section>
          <Card className="border-warning/40 bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="size-5" />
                Overdue invoices ({data.overdueInvoices.length})
              </CardTitle>
              <CardDescription>Follow up to improve cash flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.overdueInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-brand-secondary/40 bg-background p-3"
                >
                  <div>
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="font-medium text-brand hover:underline"
                    >
                      {inv.number}
                    </Link>
                    <p className="text-xs text-muted-foreground">{inv.client.name}</p>
                  </div>
                  <div className="text-right">
                    <InvoiceStatusBadge status={inv.status} />
                    <p className="mt-1 text-sm font-semibold">
                      {formatCurrency(inv.balanceDue, inv.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      ) : null}

      {/* Section 7: Recent invoices */}
      <section>
        <RecentInvoices invoices={data.recentInvoices} />
      </section>

      {/* Section 8: Plan usage */}
      <section>
        <Card className="border-brand-secondary/50">
          <CardHeader>
            <CardTitle>Plan usage</CardTitle>
            <CardDescription>
              {plan} plan — upgrade for higher limits
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <UsageBar
              label="Clients"
              used={data.billingUsage.clients}
              limit={data.clientStats.usage.limit}
              remaining={data.clientStats.usage.remaining}
            />
            <UsageBar
              label="Invoices / month"
              used={data.billingUsage.invoicesThisMonth}
              limit={data.invoiceStats.usage.limit}
              remaining={data.invoiceStats.usage.remaining}
            />
            <UsageBar
              label="Recurring"
              used={data.billingUsage.recurringSchedules}
              limit={limits?.maxRecurringSchedules ?? 0}
              remaining={null}
            />
          </CardContent>
        </Card>
      </section>

      {/* Section 9: Notifications */}
      <section>
        <Card className="border-brand-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                {data.unreadCount > 0
                  ? `${data.unreadCount} unread`
                  : "You're all caught up"}
              </CardDescription>
            </div>
            <Link
              href="/settings/notifications"
              className="inline-flex h-8 items-center rounded-lg border border-brand-secondary px-2.5 text-sm font-medium text-brand hover:bg-brand-secondary/40"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              data.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-lg border p-3 ${
                    n.isRead
                      ? "border-brand-secondary/30 bg-muted/20"
                      : "border-brand/30 bg-brand-secondary/20"
                  }`}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {/* Section 10: Getting started / tips */}
      <section>
        <Card className="border-brand-secondary/50 bg-brand-muted/20">
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
            <CardDescription>Complete your setup for the best experience</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <ChecklistItem
                done={Boolean(data.business?.name)}
                label="Set up business profile"
                href="/settings/business"
              />
              <ChecklistItem
                done={data.clientStats.total > 0}
                label="Add your first client"
                href="/clients"
              />
              <ChecklistItem
                done={data.invoiceStats.total > 0}
                label="Create an invoice"
                href="/invoices/new"
              />
              <ChecklistItem
                done={user?.isVerified ?? false}
                label="Verify your email"
                href="/settings/account"
              />
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function UsageBar({
  label,
  used,
  limit,
  remaining,
}: {
  label: string;
  used: number;
  limit: number;
  remaining: number | null;
}) {
  const infinite = limit === Number.POSITIVE_INFINITY || limit === 0;
  const pct = infinite ? (used > 0 ? 50 : 0) : Math.min(100, (used / limit) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {used}
          {!infinite && limit > 0 ? ` / ${limit}` : infinite && limit === 0 ? " (N/A)" : ""}
        </span>
      </div>
      <Progress value={pct} className="h-2 bg-brand-secondary/50 [&>div]:bg-brand" />
      {remaining !== null ? (
        <p className="text-xs text-muted-foreground">{remaining} remaining</p>
      ) : null}
    </div>
  );
}

function ChecklistItem({
  done,
  label,
  href,
}: {
  done: boolean;
  label: string;
  href: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`flex size-5 items-center justify-center rounded-full text-xs ${
          done
            ? "bg-brand-success/20 text-brand-success"
            : "bg-brand-secondary text-muted-foreground"
        }`}
      >
        {done ? "✓" : "○"}
      </span>
      {done ? (
        <span className="text-muted-foreground line-through">{label}</span>
      ) : (
        <Link href={href} className="font-medium text-brand hover:underline">
          {label}
        </Link>
      )}
    </li>
  );
}
