import type { PaymentStats } from "@/types/dashboard";
import type { PaginatedMeta } from "@/types";

export const PAYMENT_METHODS = [
  "STRIPE",
  "BANK_TRANSFER",
  "CASH",
  "CHECK",
  "OTHER",
] as const;

export const PAYMENT_STATUSES = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
  "DISPUTED",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type PaymentInvoiceSummary = {
  id: string;
  number: string;
  total: number;
  balanceDue: number;
  status: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
};

export type PaymentListItem = {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  note: string | null;
  paidAt: string | null;
  createdAt: string;
  invoice: PaymentInvoiceSummary;
};

export type Payment = PaymentListItem;

export type PaymentDetailResponse = {
  payment: Payment;
  allowedTransitions: PaymentStatus[];
};

export type PaymentMeta = {
  methods: PaymentMethod[];
  statuses: PaymentStatus[];
  transitions: Record<PaymentStatus, readonly PaymentStatus[]>;
  manualMethods: PaymentMethod[];
  payableInvoiceStatuses: string[];
  stripeConfigured: boolean;
  stripeCheckoutAvailable: boolean;
};

export type ListPaymentsParams = {
  page?: number;
  limit?: number;
  invoiceId?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  sortBy?: "createdAt" | "paidAt" | "amount";
  sortOrder?: "asc" | "desc";
};

export type ListPaymentsResult = {
  payments: PaymentListItem[];
  meta: PaginatedMeta;
};

export type CreatePaymentInput = {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  currency?: string;
  note?: string | null;
  paidAt?: string;
};

export type UpdatePaymentStatusInput = {
  status: PaymentStatus;
  note?: string | null;
};

export type StripeCheckoutInput = {
  invoiceId: string;
  amount?: number;
};

export type StripeCheckoutResponse = {
  checkoutUrl: string;
  sessionId: string;
  paymentId: string;
  amount: number;
};

export type InvoicePaymentsResponse = {
  invoice: {
    id: string;
    number: string;
    status: string;
    total: number;
    paidAmount: number;
    balanceDue: number;
    currency: string;
  };
  payments: PaymentListItem[];
  summary: Record<string, { count: number; amount: number }>;
};

export type { PaymentStats };
