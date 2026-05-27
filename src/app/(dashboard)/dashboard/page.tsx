"use client";

import { FileText, Users, Wallet } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { session, workspace } = useAuth();
  const limits = workspace?.planLimits;
  const plan = workspace?.subscription?.plan ?? session?.plan ?? "FREE";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user.name?.split(" ")[0] ?? "there"}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{plan} plan</Badge>
        {workspace?.unreadNotificationCount ? (
          <Badge>
            {workspace.unreadNotificationCount} unread notification
            {workspace.unreadNotificationCount === 1 ? "" : "s"}
          </Badge>
        ) : null}
        {!session?.isVerified ? (
          <Badge variant="destructive">Email not verified</Badge>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {limits?.maxClients === Number.POSITIVE_INFINITY
                ? "∞"
                : limits?.maxClients ?? "—"}
            </p>
            <CardDescription className="mt-1">Plan limit (max)</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Invoices / month</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {limits?.maxInvoicesPerMonth === Number.POSITIVE_INFINITY
                ? "∞"
                : limits?.maxInvoicesPerMonth ?? "—"}
            </p>
            <CardDescription className="mt-1">Plan limit (max)</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recurring</CardTitle>
            <Wallet className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {limits?.maxRecurringSchedules ?? 0}
            </p>
            <CardDescription className="mt-1">Schedules allowed</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>
            Modules marked &quot;Soon&quot; in the sidebar will be added next.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ol className="list-inside list-decimal space-y-1">
            <li>Complete business settings (logo, currency, invoice prefix)</li>
            <li>Add your first client</li>
            <li>Create and send an invoice</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
