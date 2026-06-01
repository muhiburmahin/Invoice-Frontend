"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { brandChartColors } from "@/config/brand";
import { cn } from "@/lib/utils";

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
};

export function InvoiceStatusChart({ byStatus }: InvoiceStatusChartProps) {
  const entries = Object.entries(byStatus).filter(([, count]) => count > 0);
  const max = Math.max(...entries.map(([, c]) => c), 1);
  const total = entries.reduce((s, [, c]) => s + c, 0);

  return (
    <Card className="border-brand-secondary/50">
      <CardHeader>
        <CardTitle>Invoice status</CardTitle>
        <CardDescription>{total} invoices across all statuses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invoice data yet.</p>
        ) : (
          entries.map(([status, count], i) => (
            <div key={status} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{STATUS_LABELS[status] ?? status}</span>
                <span className="font-medium text-muted-foreground">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-brand-secondary/60">
                <div
                  className={cn("h-full rounded-full transition-all")}
                  style={{
                    width: `${(count / max) * 100}%`,
                    backgroundColor:
                      brandChartColors[i % brandChartColors.length] ?? brandChartColors[0],
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
