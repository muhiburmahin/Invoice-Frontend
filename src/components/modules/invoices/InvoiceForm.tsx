"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";

import { LineItemsEditor } from "@/components/modules/invoices/LineItemsEditor";
import { InvoicePreview } from "@/components/modules/invoices/InvoicePreview";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBusiness, useBusinessCurrencies } from "@/hooks/useBusiness";
import { useClients } from "@/hooks/useClients";
import { useCreateInvoice, useInvoice, useUpdateInvoice } from "@/hooks/useInvoices";
import { getApiErrorMessage } from "@/lib/api";
import {
  addDaysToInputDate,
  toApiDate,
  toInputDate,
} from "@/lib/invoice-calculations";
import { invoiceFormSchema, type InvoiceFormInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { CreateInvoiceInput, Invoice } from "@/types/invoice";
import type { CurrencyCode } from "@/types/business";

const fieldClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30";

function nullable(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

function invoiceToFormValues(invoice: Invoice): InvoiceFormInput {
  return {
    clientId: invoice.clientId,
    issueDate: toInputDate(invoice.issueDate),
    dueDate: toInputDate(invoice.dueDate),
    taxRate: invoice.taxRate,
    discount: invoice.discount,
    discountType: invoice.discountType,
    currency: invoice.currency,
    notes: invoice.notes ?? "",
    terms: invoice.terms ?? "",
    footer: invoice.footer ?? "",
    items: invoice.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      unit: item.unit ?? "",
      taxable: item.taxable,
    })),
  };
}

function formToPayload(values: InvoiceFormInput): CreateInvoiceInput {
  return {
    clientId: values.clientId,
    issueDate: toApiDate(values.issueDate),
    dueDate: toApiDate(values.dueDate),
    taxRate: values.taxRate,
    discount: values.discount,
    discountType: values.discountType,
    currency: values.currency as CurrencyCode,
    notes: nullable(values.notes),
    terms: nullable(values.terms),
    footer: nullable(values.footer),
    items: values.items.map((item, index) => ({
      description: item.description.trim(),
      quantity: item.quantity,
      rate: item.rate,
      unit: item.unit?.trim() || undefined,
      taxable: item.taxable ?? true,
      order: index,
    })),
  };
}

type InvoiceFormProps = {
  mode: "create" | "edit";
  invoiceId?: string;
  defaultClientId?: string;
  recurringId?: string;
};

export function InvoiceForm({
  mode,
  invoiceId,
  defaultClientId,
  recurringId,
}: InvoiceFormProps) {
  const { data: businessData } = useBusiness();
  const { data: currenciesData } = useBusinessCurrencies();
  const { data: clientsData } = useClients({ limit: 100, status: "active" });
  const { data: invoiceData, isLoading: invoiceLoading } = useInvoice(invoiceId ?? "", {
    enabled: mode === "edit" && Boolean(invoiceId),
  });
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const business = businessData?.business;

  const form = useForm<InvoiceFormInput>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientId: defaultClientId ?? "",
      issueDate: toInputDate(new Date()),
      dueDate: addDaysToInputDate(
        toInputDate(new Date()),
        business?.defaultDueDays ?? 30,
      ),
      taxRate: business?.taxRate ?? 0,
      discount: 0,
      discountType: "FIXED",
      currency: business?.currency ?? "USD",
      notes: business?.defaultNotes ?? "",
      terms: business?.defaultTerms ?? "",
      footer: "",
      items: [{ description: "", quantity: 1, rate: 0, unit: "", taxable: true }],
    },
  });

  useEffect(() => {
    if (mode === "edit" && invoiceData?.invoice) {
      form.reset(invoiceToFormValues(invoiceData.invoice));
    }
  }, [form, invoiceData, mode]);

  useEffect(() => {
    if (mode === "create" && business && !form.formState.isDirty) {
      const issueDate = toInputDate(new Date());
      form.reset({
        ...form.getValues(),
        issueDate,
        dueDate: addDaysToInputDate(issueDate, business.defaultDueDays),
        taxRate: business.taxRate,
        currency: business.currency,
        notes: business.defaultNotes ?? "",
        terms: business.defaultTerms ?? "",
        clientId: defaultClientId ?? form.getValues("clientId"),
      });
    }
  }, [business, defaultClientId, form, mode]);

  const watched = useWatch({ control: form.control });
  const currencies = currenciesData?.currencies ?? [];
  const clients = clientsData?.clients ?? [];

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const payload = formToPayload(values);
      if (recurringId && mode === "create") {
        payload.recurringId = recurringId;
      }
      if (mode === "create") {
        const result = await createInvoice.mutateAsync(payload);
        toast.success(result.message ?? "Invoice created");
        window.location.href = recurringId
          ? `/recurring/${recurringId}`
          : `/invoices/${result.invoice.id}`;
      } else if (invoiceId) {
        const result = await updateInvoice.mutateAsync({ id: invoiceId, body: payload });
        toast.success(result.message ?? "Invoice updated");
        window.location.href = `/invoices/${invoiceId}`;
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  if (mode === "edit" && invoiceLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  if (mode === "edit" && invoiceData && invoiceData.invoice.status !== "DRAFT") {
    return (
      <div className="rounded-xl border border-warning/40 bg-warning/5 p-6 text-sm">
        Only draft invoices can be edited.{" "}
        <Link href={`/invoices/${invoiceId}`} className="font-medium text-brand hover:underline">
          View invoice
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        {recurringId && mode === "create" ? (
          <div className="rounded-xl border border-brand/30 bg-brand-muted/10 p-4 text-sm">
            This invoice will be saved as the <strong>template</strong> for a recurring
            schedule. Add your line items, then return to the schedule to run it.
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="clientId">Client *</Label>
            <select
              id="clientId"
              className={fieldClassName}
              {...form.register("clientId")}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
            {form.formState.errors.clientId ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.clientId.message}
              </p>
            ) : null}
            {clients.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No active clients yet.{" "}
                <Link href="/clients" className="text-brand hover:underline">
                  Add a client first
                </Link>
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue date</Label>
            <Input id="issueDate" type="date" {...form.register("issueDate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due date</Label>
            <Input id="dueDate" type="date" {...form.register("dueDate")} />
            {form.formState.errors.dueDate ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.dueDate.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <select id="currency" className={fieldClassName} {...form.register("currency")}>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              {...form.register("taxRate", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              type="number"
              step="0.01"
              min={0}
              {...form.register("discount", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountType">Discount type</Label>
            <select
              id="discountType"
              className={fieldClassName}
              {...form.register("discountType")}
            >
              <option value="FIXED">Fixed amount</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>
        </div>

        <LineItemsEditor
          control={form.control}
          register={form.register}
          errors={form.formState.errors}
          currency={watched.currency ?? "USD"}
        />

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              rows={3}
              className={cn(fieldClassName, "min-h-20 py-2")}
              {...form.register("notes")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="terms">Terms</Label>
            <textarea
              id="terms"
              rows={3}
              className={cn(fieldClassName, "min-h-20 py-2")}
              {...form.register("terms")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footer">Footer</Label>
            <textarea
              id="footer"
              rows={2}
              className={cn(fieldClassName, "min-h-16 py-2")}
              {...form.register("footer")}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" render={<Link href="/invoices" />}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {isSubmitting
              ? "Saving…"
              : mode === "create"
                ? "Create invoice"
                : "Save invoice"}
          </Button>
        </div>
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <InvoicePreview
          items={(watched.items ?? []).map((item) => ({
            description: item.description ?? "",
            quantity: item.quantity ?? 0,
            rate: item.rate ?? 0,
            unit: item.unit,
            taxable: item.taxable,
          }))}
          taxRate={watched.taxRate ?? 0}
          discount={watched.discount ?? 0}
          discountType={watched.discountType ?? "FIXED"}
          currency={watched.currency ?? "USD"}
        />
      </div>
    </form>
  );
}
