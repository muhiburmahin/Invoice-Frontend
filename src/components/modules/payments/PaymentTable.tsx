"use client";

import Link from "next/link";
import { toast } from "sonner";

import { PaymentStatusBadge } from "@/components/modules/payments/PaymentStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCancelPayment, useUpdatePaymentStatus } from "@/hooks/usePayments";
import { getApiErrorMessage } from "@/lib/api";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { PaginatedMeta } from "@/types";
import type { PaymentListItem, PaymentMethod, PaymentStatus } from "@/types/payment";

const METHOD_LABELS: Record<PaymentMethod, string> = {
  STRIPE: "Stripe",
  BANK_TRANSFER: "Bank transfer",
  CASH: "Cash",
  CHECK: "Check",
  OTHER: "Other",
};

type PaymentTableProps = {
  payments: PaymentListItem[];
  meta: PaginatedMeta;
  status: "all" | PaymentStatus;
  method: "all" | PaymentMethod;
  isLoading?: boolean;
  onStatusChange: (value: PaymentTableProps["status"]) => void;
  onMethodChange: (value: PaymentTableProps["method"]) => void;
  onPageChange: (page: number) => void;
};

const statusFilters = [
  { value: "all", label: "All" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
] as const;

const methodFilters = [
  { value: "all", label: "All methods" },
  { value: "STRIPE", label: "Stripe" },
  { value: "BANK_TRANSFER", label: "Bank" },
  { value: "CASH", label: "Cash" },
] as const;

export function PaymentTable({
  payments,
  meta,
  status,
  method,
  isLoading,
  onStatusChange,
  onMethodChange,
  onPageChange,
}: PaymentTableProps) {
  const updateStatus = useUpdatePaymentStatus();
  const cancelPayment = useCancelPayment();

  async function handleMarkCompleted(paymentId: string) {
    try {
      const result = await updateStatus.mutateAsync({
        id: paymentId,
        body: { status: "COMPLETED" },
      });
      toast.success(result.message ?? "Payment completed");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleCancel(paymentId: string) {
    if (!confirm("Cancel this pending payment?")) return;
    try {
      const result = await cancelPayment.mutateAsync(paymentId);
      toast.success(result.message ?? "Payment cancelled");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={status === filter.value ? "default" : "outline"}
              className={cn(
                status === filter.value && "bg-brand text-brand-foreground hover:bg-brand/90",
              )}
              onClick={() => onStatusChange(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {methodFilters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={method === filter.value ? "default" : "outline"}
              onClick={() => onMethodChange(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-brand-secondary/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Loading payments…
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No payments recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(payment.paidAt ?? payment.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/invoices/${payment.invoiceId}`}
                      className="font-medium hover:text-brand hover:underline"
                    >
                      {payment.invoice.number}
                    </Link>
                  </TableCell>
                  <TableCell>{payment.invoice.client.name}</TableCell>
                  <TableCell>{METHOD_LABELS[payment.method]}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell>
                    {payment.status === "PENDING" ? (
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={() => void handleMarkCompleted(payment.id)}
                        >
                          Complete
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => void handleCancel(payment.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta.totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} payments
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => onPageChange(meta.page - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => onPageChange(meta.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
