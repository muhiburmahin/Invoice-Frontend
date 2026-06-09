"use client";

import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { toast } from "sonner";

import { PaymentStatusBadge } from "@/components/modules/payments/PaymentStatusBadge";
import { RecordPaymentForm } from "@/components/modules/payments/RecordPaymentForm";
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
  useInvoicePayments,
  usePaymentMeta,
  useStripeCheckout,
} from "@/hooks/usePayments";
import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

const METHOD_LABELS: Record<string, string> = {
  STRIPE: "Stripe",
  BANK_TRANSFER: "Bank transfer",
  CASH: "Cash",
  CHECK: "Check",
  OTHER: "Other",
};

type InvoicePaymentsSectionProps = {
  invoice: Invoice;
};

export function InvoicePaymentsSection({ invoice }: InvoicePaymentsSectionProps) {
  const { data, isLoading } = useInvoicePayments(invoice.id);
  const { data: metaData } = usePaymentMeta();
  const stripeCheckout = useStripeCheckout();
  const [showRecord, setShowRecord] = useState(false);

  const meta = metaData;
  const payable =
    meta?.payableInvoiceStatuses.includes(invoice.status) && invoice.balanceDue > 0;
  const stripeAvailable = meta?.stripeCheckoutAvailable ?? false;

  async function handleStripePay() {
    try {
      const result = await stripeCheckout.mutateAsync({
        invoiceId: invoice.id,
        amount: invoice.balanceDue,
      });
      window.location.href = result.checkoutUrl;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const payments = data?.payments ?? [];

  return (
    <Card className="border-brand-secondary/50">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Payments</CardTitle>
          <CardDescription>
            Record manual payments or collect via Stripe checkout.
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {payable && stripeAvailable ? (
            <Button
              variant="outline"
              size="sm"
              disabled={stripeCheckout.isPending}
              onClick={() => void handleStripePay()}
            >
              <CreditCard className="size-4" />
              Pay with Stripe
            </Button>
          ) : null}
          {payable ? (
            <Button
              size="sm"
              className="bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={() => setShowRecord((value) => !value)}
            >
              <Plus className="size-4" />
              {showRecord ? "Close" : "Record payment"}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showRecord ? (
          <RecordPaymentForm
            defaultInvoiceId={invoice.id}
            onSuccess={() => setShowRecord(false)}
            onCancel={() => setShowRecord(false)}
          />
        ) : null}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading payments…</p>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments recorded for this invoice.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(payment.paidAt ?? payment.createdAt)}
                  </TableCell>
                  <TableCell>{METHOD_LABELS[payment.method] ?? payment.method}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
