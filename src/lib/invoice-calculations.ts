import type { DiscountType, InvoiceItemInput } from "@/types/invoice";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function toInputDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toApiDate(date: string): string {
  return new Date(`${date}T12:00:00`).toISOString();
}

export function addDaysToInputDate(date: string, days: number): string {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + days);
  return toInputDate(next);
}

export type ComputedInvoiceTotals = {
  subtotal: number;
  taxAmount: number;
  total: number;
  balanceDue: number;
};

export function calculateInvoiceTotals(input: {
  items: InvoiceItemInput[];
  taxRate: number;
  discount: number;
  discountType: DiscountType;
  paidAmount?: number;
}): ComputedInvoiceTotals {
  const mappedItems = input.items.map((item, index) => ({
    amount: roundMoney(item.quantity * item.rate),
    taxable: item.taxable ?? true,
    order: item.order ?? index,
  }));

  const subtotal = roundMoney(
    mappedItems.reduce((sum, item) => sum + item.amount, 0),
  );

  const taxableSubtotal = roundMoney(
    mappedItems
      .filter((item) => item.taxable)
      .reduce((sum, item) => sum + item.amount, 0),
  );

  const discountAmount =
    input.discountType === "PERCENTAGE"
      ? roundMoney(subtotal * (input.discount / 100))
      : roundMoney(input.discount);

  const cappedDiscount = Math.min(discountAmount, subtotal);
  const discountRatio = subtotal > 0 ? cappedDiscount / subtotal : 0;
  const taxableAfterDiscount = roundMoney(
    Math.max(0, taxableSubtotal * (1 - discountRatio)),
  );

  const taxAmount = roundMoney(taxableAfterDiscount * (input.taxRate / 100));
  const total = roundMoney(subtotal - cappedDiscount + taxAmount);
  const paidAmount = roundMoney(input.paidAmount ?? 0);
  const balanceDue = roundMoney(Math.max(0, total - paidAmount));

  return { subtotal, taxAmount, total, balanceDue };
}
