import type { CurrencyCode } from "@/types/business";
import type { InvoiceStats } from "@/types/dashboard";
import type { PaginatedMeta } from "@/types";

export const INVOICE_STATUSES = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
  "REFUNDED",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
export type DiscountType = "FIXED" | "PERCENTAGE";

export type InvoiceItemInput = {
  description: string;
  quantity: number;
  rate: number;
  unit?: string;
  taxable?: boolean;
  order?: number;
};

export type InvoiceItem = InvoiceItemInput & {
  id: string;
  amount: number;
  unit: string | null;
  taxable: boolean;
  order: number;
};

export type InvoiceClientSummary = {
  id: string;
  name: string;
  email: string;
  company: string | null;
};

export type InvoiceListItem = {
  id: string;
  number: string;
  status: InvoiceStatus;
  clientId: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  discountType: DiscountType;
  total: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  sentAt: string | null;
  reminderSentAt: string | null;
  viewedAt: string | null;
  isRecurring: boolean;
  recurringId: string | null;
  createdAt: string;
  updatedAt: string;
  client: InvoiceClientSummary;
};

export type Invoice = InvoiceListItem & {
  notes: string | null;
  terms: string | null;
  footer: string | null;
  deletedAt?: string | null;
  items: InvoiceItem[];
  client: InvoiceClientSummary & {
    deletedAt: string | null;
    isActive: boolean;
  };
};

export type InvoiceDetailResponse = {
  invoice: Invoice;
  payments: Record<string, { count: number; amount: number }>;
  paymentTotal: number;
  allowedTransitions: InvoiceStatus[];
};

export type InvoiceMeta = {
  statuses: InvoiceStatus[];
  transitions: Record<InvoiceStatus, readonly InvoiceStatus[]>;
  editableStatuses: InvoiceStatus[];
  deletableStatuses: InvoiceStatus[];
  sendableStatuses: InvoiceStatus[];
  resendableStatuses: InvoiceStatus[];
  remindableStatuses: InvoiceStatus[];
  emailConfigured: boolean;
};

export type ListInvoicesParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: InvoiceStatus;
  overdue?: boolean;
  clientId?: string;
  recurringId?: string;
  sortBy?: "createdAt" | "issueDate" | "dueDate" | "number" | "total" | "status";
  sortOrder?: "asc" | "desc";
};

export type ListInvoicesResult = {
  invoices: InvoiceListItem[];
  meta: PaginatedMeta;
};

export type CreateInvoiceInput = {
  clientId: string;
  recurringId?: string;
  issueDate?: string;
  dueDate?: string;
  taxRate?: number;
  discount?: number;
  discountType?: DiscountType;
  currency?: CurrencyCode;
  notes?: string | null;
  terms?: string | null;
  footer?: string | null;
  items: InvoiceItemInput[];
};

export type UpdateInvoiceInput = Partial<CreateInvoiceInput>;

export type UpdateInvoiceStatusInput = {
  status: InvoiceStatus;
  paidAmount?: number;
};

export type SendInvoiceInput = {
  to?: string;
  message?: string;
};

export type { InvoiceStats };
