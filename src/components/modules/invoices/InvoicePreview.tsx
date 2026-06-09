"use client";

import { calculateInvoiceTotals } from "@/lib/invoice-calculations";
import { formatCurrency } from "@/lib/utils";
import type { DiscountType, InvoiceItemInput } from "@/types/invoice";

type InvoicePreviewProps = {
  items: InvoiceItemInput[];
  taxRate: number;
  discount: number;
  discountType: DiscountType;
  currency: string;
  paidAmount?: number;
};

export function InvoicePreview({
  items,
  taxRate,
  discount,
  discountType,
  currency,
  paidAmount = 0,
}: InvoicePreviewProps) {
  const totals = calculateInvoiceTotals({
    items,
    taxRate,
    discount,
    discountType,
    paidAmount,
  });

  const rows = [
    { label: "Subtotal", value: totals.subtotal },
    {
      label: discountType === "PERCENTAGE" ? `Discount (${discount}%)` : "Discount",
      value: -(
        discountType === "PERCENTAGE"
          ? Math.round(totals.subtotal * (discount / 100) * 100) / 100
          : discount
      ),
    },
    { label: `Tax (${taxRate}%)`, value: totals.taxAmount },
    { label: "Total", value: totals.total, emphasis: true },
    { label: "Balance due", value: totals.balanceDue, emphasis: true },
  ];

  return (
    <div className="rounded-xl border border-brand-secondary/50 bg-card p-4">
      <p className="text-sm font-semibold">Summary</p>
      <dl className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className={row.emphasis ? "font-semibold text-foreground" : ""}>
              {formatCurrency(row.value, currency)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
