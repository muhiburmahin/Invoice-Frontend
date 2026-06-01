"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

import { InvoiceStatusBadge } from "@/components/modules/invoices/InvoiceStatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { portalPath } from "@/config/public-routes";
import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  createPortalCheckout,
  getPortalInvoice,
  getPortalInvoicePdfUrl,
  getPortalMeta,
} from "@/services/portal.service";

import { PortalInvalidLink } from "./PortalInvalidLink";
import { PortalShell } from "./PortalShell";

type PortalInvoiceDetailProps = {
  token: string;
  invoiceId: string;
};

function PaymentBanner() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  useEffect(() => {
    if (payment === "success") {
      toast.success("Payment submitted successfully");
    } else if (payment === "cancelled") {
      toast.message("Payment cancelled");
    }
  }, [payment]);

  if (!payment) return null;

  return (
    <div
      className={
        payment === "success"
          ? "rounded-lg border border-status-paid/30 bg-status-paid/10 px-4 py-3 text-sm text-foreground"
          : "rounded-lg border border-brand-secondary/60 bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
      }
    >
      {payment === "success"
        ? "Thank you — your payment is being processed."
        : "Payment was not completed. You can try again below."}
    </div>
  );
}

export function PortalInvoiceDetail({ token, invoiceId }: PortalInvoiceDetailProps) {
  const metaQuery = useQuery({
    queryKey: ["portal-meta", token],
    queryFn: () => getPortalMeta(token),
    retry: false,
  });

  const detailQuery = useQuery({
    queryKey: ["portal-invoice", token, invoiceId],
    queryFn: () => getPortalInvoice(token, invoiceId),
    enabled: metaQuery.isSuccess,
    retry: false,
  });

  const payMutation = useMutation({
    mutationFn: () => createPortalCheckout(token, invoiceId),
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  if (metaQuery.isLoading || detailQuery.isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (metaQuery.isError) {
    return <PortalInvalidLink message={getApiErrorMessage(metaQuery.error)} />;
  }

  if (detailQuery.isError || !detailQuery.data || !metaQuery.data) {
    return (
      <PortalInvalidLink
        message={
          detailQuery.isError
            ? getApiErrorMessage(detailQuery.error)
            : "Unable to load invoice"
        }
      />
    );
  }

  const meta = metaQuery.data;
  const { invoice, business, paymentTotal } = detailQuery.data;
  const canPay =
    meta.payments.stripeCheckoutAvailable &&
    invoice.balanceDue > 0 &&
    !["PAID", "CANCELLED", "REFUNDED"].includes(invoice.status);

  return (
    <PortalShell business={business ?? meta.business} clientName={meta.client.name}>
      <div className="space-y-6">
        <Link
          href={portalPath(token)}
          className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
        >
          <ArrowLeft className="size-4" />
          All invoices
        </Link>

        <Suspense fallback={null}>
          <PaymentBanner />
        </Suspense>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-foreground">{invoice.number}</h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Issued {formatDate(invoice.issueDate)} · Due {formatDate(invoice.dueDate)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={getPortalInvoicePdfUrl(token, invoiceId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-muted"
            >
              <Download className="size-4" />
              Download PDF
            </a>
            {canPay ? (
              <Button
                size="sm"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                disabled={payMutation.isPending}
                onClick={() => payMutation.mutate()}
              >
                {payMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Pay {formatCurrency(invoice.balanceDue, invoice.currency)}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-brand-secondary/50 bg-card">
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
                    <p className="font-medium">{item.description}</p>
                    {item.unit ? (
                      <p className="text-xs text-muted-foreground">per {item.unit}</p>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.rate, invoice.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.amount, invoice.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
          </div>
          {invoice.taxAmount > 0 ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
            </div>
          ) : null}
          {invoice.discount > 0 ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>-{formatCurrency(invoice.discount, invoice.currency)}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-brand-secondary/40 pt-2 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(invoice.total, invoice.currency)}</span>
          </div>
          {paymentTotal > 0 ? (
            <div className="flex justify-between text-status-paid">
              <span>Paid</span>
              <span>{formatCurrency(paymentTotal, invoice.currency)}</span>
            </div>
          ) : null}
          <div className="flex justify-between font-medium text-foreground">
            <span>Balance due</span>
            <span>{formatCurrency(invoice.balanceDue, invoice.currency)}</span>
          </div>
        </div>

        {invoice.notes ? (
          <div className="rounded-lg bg-muted/40 p-4 text-sm">
            <p className="font-medium text-foreground">Notes</p>
            <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{invoice.notes}</p>
          </div>
        ) : null}

        {invoice.terms ? (
          <div className="rounded-lg bg-muted/40 p-4 text-sm">
            <p className="font-medium text-foreground">Terms</p>
            <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{invoice.terms}</p>
          </div>
        ) : null}
      </div>
    </PortalShell>
  );
}
