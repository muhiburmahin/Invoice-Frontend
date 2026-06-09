"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Users } from "lucide-react";

import { ClientForm } from "@/components/modules/clients/ClientForm";
import { ClientTable } from "@/components/modules/clients/ClientTable";
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
import { useAuth } from "@/hooks/useAuth";
import { useClientStats, useClients } from "@/hooks/useClients";

export function ClientsPage() {
  const router = useRouter();
  const { workspace } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive" | "deleted">("all");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const listParams = {
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
  };

  const { data, isLoading, isError, refetch, isFetching } = useClients(listParams);
  const { data: statsData } = useClientStats();

  const clients = data?.clients ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };
  const stats = statsData?.stats;
  const usage = stats?.usage;
  const usagePercent =
    usage && usage.limit > 0 ? Math.min(100, (usage.clients / usage.limit) * 100) : 0;

  if (isLoading && !data) {
    return <LoadingSkeleton rows={5} />;
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">
            Could not load clients. Check that the API is running.
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage customers you invoice and share portal access with.
          </p>
        </div>
        <Button
          className="bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => setShowCreate((value) => !value)}
        >
          <Plus className="size-4" />
          {showCreate ? "Close form" : "Add client"}
        </Button>
      </div>

      {stats ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total clients</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="size-5 text-brand" />
                {stats.total}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-2xl">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>With portal</CardDescription>
              <CardTitle className="text-2xl">{stats.withPortal}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Plan usage</CardDescription>
              <CardTitle className="text-2xl">
                {usage?.clients ?? 0}
                {usage?.limit ? ` / ${usage.limit}` : ""}
              </CardTitle>
              {usage?.limit ? (
                <Progress value={usagePercent} className="mt-2 h-2" />
              ) : null}
            </CardHeader>
          </Card>
        </section>
      ) : null}

      {showCreate ? (
        <Card className="border-brand-secondary/50">
          <CardHeader>
            <CardTitle>New client</CardTitle>
            <CardDescription>
              Add a customer before creating invoices.
              {workspace?.planLimits
                ? ` Your ${workspace.subscription?.plan ?? "plan"} allows up to ${workspace.planLimits.maxClients} clients.`
                : null}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm
              mode="create"
              onSuccess={(client) => {
                setShowCreate(false);
                router.push(`/clients/${client.id}`);
              }}
              onCancel={() => setShowCreate(false)}
            />
          </CardContent>
        </Card>
      ) : null}

      <ClientTable
        clients={clients}
        meta={meta}
        search={search}
        status={status}
        isLoading={isFetching}
        onSearchChange={setSearch}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onPageChange={setPage}
      />
    </div>
  );
}
