"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInvoices } from "@/hooks/useInvoices";
import { usePaymentMeta, useRecordPayment } from "@/hooks/usePayments";
import { getApiErrorMessage } from "@/lib/api";
import { toApiDate, toInputDate } from "@/lib/invoice-calculations";
import { recordPaymentSchema, type RecordPaymentInput } from "@/lib/validations";
import { cn, formatCurrency } from "@/lib/utils";

const fieldClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30";

const METHOD_LABELS: Record<RecordPaymentInput["method"], string> = {
  BANK_TRANSFER: "Bank transfer",
  CASH: "Cash",
  CHECK: "Check",
  OTHER: "Other",
};

type RecordPaymentFormProps = {
  defaultInvoiceId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
};

export function RecordPaymentForm({
  defaultInvoiceId,
  onSuccess,
  onCancel,
  className,
}: RecordPaymentFormProps) {
  const { data: metaData } = usePaymentMeta();
  const { data: invoicesData } = useInvoices({ limit: 100, sortOrder: "desc" });
  const recordPayment = useRecordPayment();

  const payableInvoices = useMemo(() => {
    const statuses = metaData?.payableInvoiceStatuses ?? [];
    return (invoicesData?.invoices ?? []).filter(
      (invoice) => statuses.includes(invoice.status) && invoice.balanceDue > 0,
    );
  }, [invoicesData?.invoices, metaData?.payableInvoiceStatuses]);

  const form = useForm<RecordPaymentInput>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      invoiceId: defaultInvoiceId ?? "",
      amount: 0,
      method: "BANK_TRANSFER",
      note: "",
      paidAt: toInputDate(new Date()),
    },
  });

  const selectedInvoiceId = form.watch("invoiceId");
  const selectedInvoice = payableInvoices.find((inv) => inv.id === selectedInvoiceId);

  useEffect(() => {
    if (defaultInvoiceId) {
      form.setValue("invoiceId", defaultInvoiceId);
    }
  }, [defaultInvoiceId, form]);

  useEffect(() => {
    if (selectedInvoice) {
      form.setValue("amount", selectedInvoice.balanceDue, { shouldDirty: true });
    }
  }, [form, selectedInvoice]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await recordPayment.mutateAsync({
        invoiceId: values.invoiceId,
        amount: values.amount,
        method: values.method,
        note: values.note.trim() || null,
        paidAt: values.paidAt ? toApiDate(values.paidAt) : undefined,
      });
      toast.success(result.message ?? "Payment recorded");
      form.reset({
        invoiceId: defaultInvoiceId ?? "",
        amount: 0,
        method: "BANK_TRANSFER",
        note: "",
        paidAt: toInputDate(new Date()),
      });
      onSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="payment-invoice">Invoice *</Label>
          <select
            id="payment-invoice"
            className={fieldClassName}
            {...form.register("invoiceId")}
          >
            <option value="">Select an invoice</option>
            {payableInvoices.map((invoice) => (
              <option key={invoice.id} value={invoice.id}>
                {invoice.number} — {invoice.client.name} (
                {formatCurrency(invoice.balanceDue, invoice.currency)} due)
              </option>
            ))}
          </select>
          {form.formState.errors.invoiceId ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.invoiceId.message}
            </p>
          ) : null}
          {payableInvoices.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No payable invoices found. Send an invoice first.
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-amount">Amount *</Label>
          <Input
            id="payment-amount"
            type="number"
            step="0.01"
            min={0.01}
            max={selectedInvoice?.balanceDue}
            {...form.register("amount", { valueAsNumber: true })}
          />
          {selectedInvoice ? (
            <p className="text-xs text-muted-foreground">
              Max {formatCurrency(selectedInvoice.balanceDue, selectedInvoice.currency)}
            </p>
          ) : null}
          {form.formState.errors.amount ? (
            <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-method">Method *</Label>
          <select id="payment-method" className={fieldClassName} {...form.register("method")}>
            {Object.entries(METHOD_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-date">Paid on</Label>
          <Input id="payment-date" type="date" {...form.register("paidAt")} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="payment-note">Note</Label>
          <Input id="payment-note" placeholder="Reference or memo" {...form.register("note")} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={recordPayment.isPending}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {recordPayment.isPending ? "Recording…" : "Record payment"}
        </Button>
      </div>
    </form>
  );
}
