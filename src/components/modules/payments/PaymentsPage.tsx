"use client";

import { useState } from "react";
import { Plus, RefreshCw, Wallet } from "lucide-react";

import { PaymentTable } from "@/components/modules/payments/PaymentTable";
import { RecordPaymentForm } from "@/components/modules/payments/RecordPaymentForm";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePaymentStats, usePayments } from "@/hooks/usePayments";
import { formatCurrency } from "@/lib/utils";
import type { PaymentMethod, PaymentStatus } from "@/types/payment";

export function PaymentsPage() {
  const [status, setStatus] = useState<"all" | PaymentStatus>("all");
  const [method, setMethod] = useState<"all" | PaymentMethod>("all");
  const [page, setPage] = useState(1);
  const [showRecord, setShowRecord] = useState(false);

  const listParams = {
    page,
    limit: 20,
    status: status === "all" ? undefined : status,
    method: method === "all" ? undefined : method,
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
  };

  const { data, isLoading, isError, refetch, isFetching } = usePayments(listParams);
  const { data: statsData } = usePaymentStats();

  const payments = data?.payments ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };
  const stats = statsData?.stats;

  if (isLoading && !data) {
    return <LoadingSkeleton rows={5} />;
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">
            Could not load payments. Check that the API is running.
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
          <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track recorded payments and Stripe checkouts across invoices.
          </p>
        </div>
        <Button
          className="bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => setShowRecord((value) => !value)}
        >
          <Plus className="size-4" />
          {showRecord ? "Close form" : "Record payment"}
        </Button>
      </div>

      {stats ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Wallet className="size-5 text-brand" />
                {formatCurrency(stats.completedTotal)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Total collected</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {formatCurrency(stats.completedThisMonth)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">This month</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
              <p className="text-sm text-muted-foreground">All payments</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {formatCurrency(stats.pendingTotal)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardHeader>
          </Card>
        </section>
      ) : null}

      {showRecord ? (
        <Card className="border-brand-secondary/50">
          <CardHeader>
            <CardTitle>Record payment</CardTitle>
            <CardDescription>
              Log bank transfer, cash, check, or other manual payments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecordPaymentForm
              onSuccess={() => setShowRecord(false)}
              onCancel={() => setShowRecord(false)}
            />
          </CardContent>
        </Card>
      ) : null}

      <PaymentTable
        payments={payments}
        meta={meta}
        status={status}
        method={method}
        isLoading={isFetching}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onMethodChange={(value) => {
          setMethod(value);
          setPage(1);
        }}
        onPageChange={setPage}
      />
    </div>
  );
}
