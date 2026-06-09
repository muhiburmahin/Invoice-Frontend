"use client";

import { FileText } from "lucide-react";

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
import type { InvoiceStats } from "@/types/dashboard";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  VIEWED: "Viewed",
  PARTIALLY_PAID: "Partial",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

type InvoiceStatusChartProps = {
  byStatus: Record<string, number>;
  monthlyCreated?: InvoiceStats["monthlyCreated"];
};

export function InvoiceStatusChart({ byStatus, monthlyCreated = [] }: InvoiceStatusChartProps) {
  const entries = Object.entries(byStatus).filter(([, count]) => count > 0);
  const total = entries.reduce((s, [, c]) => s + c, 0);

  return (
    <Card className="border-brand-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5 text-brand" />
          Invoice status
        </CardTitle>
        <CardDescription>{total} invoices across all statuses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invoice data yet.</p>
        ) : (
          <>
            <AdminDonutChart
              data={entries.map(([status, count]) => ({
                label: STATUS_LABELS[status] ?? status,
                value: count,
              }))}
              centerValue={String(total)}
              centerLabel="invoices"
            />
            <AdminHorizontalBarChart
              data={entries.map(([status, count]) => ({
                label: STATUS_LABELS[status] ?? status,
                value: count,
              }))}
            />
          </>
        )}

        {monthlyCreated.length > 0 ? (
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Invoices created · last 6 months
            </p>
            <AdminVerticalBarChart
              data={monthlyCreated.map((p) => ({ label: p.label, value: p.count }))}
              colorIndex={0}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
