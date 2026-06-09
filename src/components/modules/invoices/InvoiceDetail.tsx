"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Download,
  Mail,
  Pencil,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { InvoiceEmailDialog } from "@/components/modules/invoices/InvoiceEmailDialog";
import { InvoiceStatusBadge } from "@/components/modules/invoices/InvoiceStatusBadge";
import { InvoiceStatusDialog } from "@/components/modules/invoices/InvoiceStatusDialog";
import { InvoicePaymentsSection } from "@/components/modules/payments/InvoicePaymentsSection";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteInvoice,
  useDuplicateInvoice,
  useInvoice,
  useInvoiceMeta,
  useRemindInvoice,
  useSendInvoice,
  useUpdateInvoiceStatus,
} from "@/hooks/useInvoices";
import { getApiErrorMessage } from "@/lib/api";
import { invoiceService } from "@/services/invoice.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/invoice";

type InvoiceDetailProps = {
  invoiceId: string;
};

type DialogState = "send" | "remind" | null;

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useInvoice(invoiceId);
  const { data: metaData } = useInvoiceMeta();
  const sendInvoice = useSendInvoice();
  const remindInvoice = useRemindInvoice();
  const duplicateInvoice = useDuplicateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const updateStatus = useUpdateInvoiceStatus();
  const [isBusy, setIsBusy] = useState(false);
  const [emailDialog, setEmailDialog] = useState<DialogState>(null);
  const [pendingStatus, setPendingStatus] = useState<InvoiceStatus | null>(null);

  if (isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">Could not load invoice.</p>
          <div className="flex gap-2">
            <Button variant="outline" render={<Link href="/invoices" />}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              onClick={() => void refetch()}
              className="bg-brand text-brand-foreground"
            >
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { invoice, paymentTotal, allowedTransitions } = data;
  const meta = metaData;
  const currency = invoice.currency;
  const emailConfigured = meta?.emailConfigured ?? false;

  const canEdit = meta?.editableStatuses.includes(invoice.status) ?? invoice.status === "DRAFT";
  const canDelete = meta?.deletableStatuses.includes(invoice.status) ?? false;
  const canSend =
    meta?.sendableStatuses.includes(invoice.status) ||
    meta?.resendableStatuses.includes(invoice.status);
  const canRemind = meta?.remindableStatuses.includes(invoice.status);

  async function runAction(action: () => Promise<void>) {
    setIsBusy(true);
    try {
      await action();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSendEmail(values: { to?: string; message?: string }) {
    setIsBusy(true);
    try {
      const result = await sendInvoice.mutateAsync({
        id: invoice.id,
        body: values,
      });
      toast.success(result.message ?? "Invoice sent");
      setEmailDialog(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRemindEmail(values: { to?: string; message?: string }) {
    setIsBusy(true);
    try {
      const result = await remindInvoice.mutateAsync({
        id: invoice.id,
        body: values,
      });
      toast.success(result.message ?? "Reminder sent");
      setEmailDialog(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDuplicate() {
    const result = await duplicateInvoice.mutateAsync(invoice.id);
    toast.success(result.message ?? "Invoice duplicated");
    router.push(`/invoices/${result.invoice.id}`);
  }

  async function handleDelete() {
    if (!confirm(`Delete invoice ${invoice.number}?`)) return;
    await deleteInvoice.mutateAsync(invoice.id);
    toast.success("Invoice deleted");
    router.push("/invoices");
  }

  async function handleStatusConfirm(payload: {
    status: InvoiceStatus;
    paidAmount?: number;
  }) {
    setIsBusy(true);
    try {
      const result = await updateStatus.mutateAsync({
        id: invoice.id,
        body: payload,
      });
      toast.success(result.message ?? "Status updated");
      setPendingStatus(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDownloadPdf() {
    await invoiceService.downloadPdf(invoice.id, `${invoice.number}.pdf`);
    toast.success("PDF downloaded");
  }

  return (
    <>
      <div className="space-y-6">
        {!emailConfigured && (canSend || canRemind) ? (
          <Card className="border-warning/40 bg-warning/5">
            <CardContent className="py-4 text-sm text-muted-foreground">
              Email delivery is disabled until SMTP is configured on the backend. You can
              still update status, download PDFs, and duplicate invoices.
            </CardContent>
          </Card>
        ) : null}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 w-fit"
              render={<Link href="/invoices" />}
            >
              <ArrowLeft className="size-4" />
              Back to invoices
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{invoice.number}</h1>
              <InvoiceStatusBadge status={invoice.status} />
              {invoice.isRecurring ? <Badge variant="outline">Recurring</Badge> : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {invoice.client.name} · {invoice.client.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {canEdit ? (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={`/invoices/${invoice.id}/edit`} />}
              >
                <Pencil className="size-4" />
                Edit
              </Button>
            ) : null}
            {canSend ? (
              <Button
                size="sm"
                disabled={isBusy}
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={() => setEmailDialog("send")}
              >
                <Send className="size-4" />
                {invoice.status === "DRAFT" ? "Send" : "Resend"}
              </Button>
            ) : null}
            {canRemind && invoice.balanceDue > 0 ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={() => setEmailDialog("remind")}
              >
                <Mail className="size-4" />
                Remind
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={() => void runAction(handleDownloadPdf)}
            >
              <Download className="size-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={() => void runAction(handleDuplicate)}
            >
              <Copy className="size-4" />
              Duplicate
            </Button>
            {canDelete ? (
              <Button
                variant="destructive"
                size="sm"
                disabled={isBusy}
                onClick={() => void runAction(handleDelete)}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            ) : null}
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-2xl">
                {formatCurrency(invoice.total, currency)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Balance due</CardDescription>
              <CardTitle className="text-2xl">
                {formatCurrency(invoice.balanceDue, currency)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Paid</CardDescription>
              <CardTitle className="text-2xl">
                {formatCurrency(invoice.paidAmount, currency)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Payments recorded</CardDescription>
              <CardTitle className="text-2xl">
                {formatCurrency(paymentTotal, currency)}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-brand-secondary/50 lg:col-span-2">
            <CardHeader>
              <CardTitle>Line items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p>{item.description}</p>
                          {item.unit ? (
                            <p className="text-xs text-muted-foreground">{item.unit}</p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.rate, currency)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.amount, currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-brand-secondary/50">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <SummaryRow label="Subtotal" value={formatCurrency(invoice.subtotal, currency)} />
              <SummaryRow
                label="Discount"
                value={formatCurrency(
                  invoice.discountType === "PERCENTAGE"
                    ? -(invoice.subtotal * (invoice.discount / 100))
                    : -invoice.discount,
                  currency,
                )}
              />
              <SummaryRow
                label={`Tax (${invoice.taxRate}%)`}
                value={formatCurrency(invoice.taxAmount, currency)}
              />
              <SummaryRow
                label="Total"
                value={formatCurrency(invoice.total, currency)}
                emphasis
              />
              <SummaryRow
                label="Balance due"
                value={formatCurrency(invoice.balanceDue, currency)}
                emphasis
              />
            </CardContent>
          </Card>
        </div>

        <InvoicePaymentsSection invoice={invoice} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-brand-secondary/50">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Issue date" value={formatDate(invoice.issueDate)} />
              <InfoRow label="Due date" value={formatDate(invoice.dueDate)} />
              <InfoRow label="Sent" value={invoice.sentAt ? formatDate(invoice.sentAt) : "—"} />
              <InfoRow
                label="Reminder sent"
                value={invoice.reminderSentAt ? formatDate(invoice.reminderSentAt) : "—"}
              />
              {invoice.notes ? <TextBlock label="Notes" value={invoice.notes} /> : null}
              {invoice.terms ? <TextBlock label="Terms" value={invoice.terms} /> : null}
              {invoice.footer ? <TextBlock label="Footer" value={invoice.footer} /> : null}
            </CardContent>
          </Card>

          <Card className="border-brand-secondary/50">
            <CardHeader>
              <CardTitle>Status actions</CardTitle>
              <CardDescription>
                Update workflow status without sending email, or use Send for delivery.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {allowedTransitions.length > 0 ? (
                allowedTransitions.map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    size="sm"
                    disabled={isBusy}
                    onClick={() => setPendingStatus(status)}
                  >
                    Mark as {status.replace(/_/g, " ").toLowerCase()}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No manual transitions available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <InvoiceEmailDialog
        open={emailDialog === "send"}
        mode="send"
        defaultEmail={invoice.client.email}
        emailConfigured={emailConfigured}
        isSubmitting={isBusy}
        onClose={() => setEmailDialog(null)}
        onSubmit={handleSendEmail}
      />

      <InvoiceEmailDialog
        open={emailDialog === "remind"}
        mode="remind"
        defaultEmail={invoice.client.email}
        emailConfigured={emailConfigured}
        isSubmitting={isBusy}
        onClose={() => setEmailDialog(null)}
        onSubmit={handleRemindEmail}
      />

      <InvoiceStatusDialog
        open={pendingStatus !== null}
        status={pendingStatus}
        currentStatus={invoice.status}
        invoiceTotal={invoice.total}
        currency={currency}
        isSubmitting={isBusy}
        onClose={() => setPendingStatus(null)}
        onConfirm={handleStatusConfirm}
      />
    </>
  );
}

function SummaryRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={emphasis ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 whitespace-pre-wrap">{value}</p>
    </div>
  );
}
