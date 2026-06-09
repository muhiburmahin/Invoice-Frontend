"use client";

import { useEffect, useState } from "react";

import { ModalCancelButton, SimpleModal } from "@/components/shared/SimpleModal";
import { InvoiceStatusBadge } from "@/components/modules/invoices/InvoiceStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/invoice";

function formatStatusLabel(status: InvoiceStatus): string {
  return status.replace(/_/g, " ").toLowerCase();
}

type InvoiceStatusDialogProps = {
  open: boolean;
  status: InvoiceStatus | null;
  currentStatus: InvoiceStatus;
  invoiceTotal: number;
  currency: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: { status: InvoiceStatus; paidAmount?: number }) => Promise<void>;
};

export function InvoiceStatusDialog({
  open,
  status,
  currentStatus,
  invoiceTotal,
  currency,
  isSubmitting,
  onClose,
  onConfirm,
}: InvoiceStatusDialogProps) {
  const [paidAmount, setPaidAmount] = useState("");

  useEffect(() => {
    if (open && status === "PARTIALLY_PAID") {
      setPaidAmount(String(Math.round(invoiceTotal * 50) / 100));
    } else {
      setPaidAmount("");
    }
  }, [invoiceTotal, open, status]);

  if (!status) return null;

  const needsPaidAmount = status === "PARTIALLY_PAID";
  const parsedPaid = Number(paidAmount);
  const paidAmountValid =
    !needsPaidAmount ||
    (parsedPaid > 0 && parsedPaid < invoiceTotal && Number.isFinite(parsedPaid));

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Update invoice status"
      description="Confirm the status change for this invoice."
      footer={
        <>
          <ModalCancelButton onClick={onClose} disabled={isSubmitting} />
          <Button
            type="button"
            disabled={isSubmitting || !paidAmountValid}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() =>
              void onConfirm({
                status,
                paidAmount: needsPaidAmount ? parsedPaid : undefined,
              })
            }
          >
            {isSubmitting ? "Updating…" : "Confirm"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <InvoiceStatusBadge status={currentStatus} />
          <span className="text-muted-foreground">→</span>
          <InvoiceStatusBadge status={status} />
        </div>

        <p className="text-sm text-muted-foreground">
          This will mark the invoice as <strong>{formatStatusLabel(status)}</strong>.
          {status === "SENT"
            ? " Use Send invoice if you also want to email the PDF."
            : null}
        </p>

        {needsPaidAmount ? (
          <div className="space-y-2">
            <Label htmlFor="paid-amount">Amount received</Label>
            <Input
              id="paid-amount"
              type="number"
              step="0.01"
              min={0.01}
              max={invoiceTotal - 0.01}
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Must be greater than 0 and less than {formatCurrency(invoiceTotal, currency)}.
            </p>
          </div>
        ) : null}

        {status === "PAID" ? (
          <p className="rounded-lg border border-brand-secondary/50 bg-muted/40 px-3 py-2 text-sm">
            Full payment of {formatCurrency(invoiceTotal, currency)} will be recorded.
          </p>
        ) : null}

        {status === "CANCELLED" ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            Cancelled invoices can be reopened as draft later if needed.
          </p>
        ) : null}
      </div>
    </SimpleModal>
  );
}
