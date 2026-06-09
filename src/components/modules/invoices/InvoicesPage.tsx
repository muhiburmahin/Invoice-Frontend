"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Plus, RefreshCw } from "lucide-react";

import { InvoiceTable } from "@/components/modules/invoices/InvoiceTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useInvoiceStats, useInvoices } from "@/hooks/useInvoices";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/invoice";

export function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | InvoiceStatus>("all");
  const [page, setPage] = useState(1);

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
    status: status !== "all" && status !== "OVERDUE" ? status : undefined,
    overdue: status === "OVERDUE" ? true : undefined,
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
  };

  const { data, isLoading, isError, refetch, isFetching } = useInvoices(listParams);
  const { data: statsData } = useInvoiceStats();

  const invoices = data?.invoices ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };
  const stats = statsData?.stats;
  const usage = stats?.usage;
  const usagePercent =
    usage && usage.limit > 0
      ? Math.min(100, (usage.invoicesThisMonth / usage.limit) * 100)
      : 0;

  if (isLoading && !data) {
    return <LoadingSkeleton rows={5} />;
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">
            Could not load invoices. Check that the API is running.
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
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, send, and track invoices for your clients.
          </p>
        </div>
        <Button
          className="bg-brand text-brand-foreground hover:bg-brand/90"
          render={<Link href="/invoices/new" />}
        >
          <Plus className="size-4" />
          New invoice
        </Button>
      </div>

      {stats ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="size-5 text-brand" />
                {stats.total}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Total invoices</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats.thisMonth}</CardTitle>
              <p className="text-sm text-muted-foreground">Created this month</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {formatCurrency(stats.outstandingBalance)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Outstanding balance</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {usage?.invoicesThisMonth ?? 0}
                {usage?.limit ? ` / ${usage.limit}` : ""}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Monthly usage</p>
              {usage?.limit ? <Progress value={usagePercent} className="mt-2 h-2" /> : null}
            </CardHeader>
          </Card>
        </section>
      ) : null}

      <InvoiceTable
        invoices={invoices}
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
