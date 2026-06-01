export type PortalBusiness = {
  name: string;
  logo: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  currency: string;
};

export type PortalMeta = {
  client: {
    name: string;
    email: string;
    company: string | null;
  };
  business: PortalBusiness | null;
  visibleStatuses: string[];
  payments: {
    stripeCheckoutAvailable: boolean;
  };
};

export type PortalInvoiceListItem = {
  id: string;
  number: string;
  status: string;
  issueDate: string;
  dueDate: string;
  total: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  viewedAt: string | null;
  sentAt: string | null;
  createdAt: string;
};

export type PortalInvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  unit: string | null;
  taxable: boolean;
  order: number;
};

export type PortalInvoiceDetail = {
  id: string;
  number: string;
  status: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  discountType: string;
  total: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  notes: string | null;
  terms: string | null;
  footer: string | null;
  items: PortalInvoiceItem[];
};

export type PortalInvoiceDetailResponse = {
  invoice: PortalInvoiceDetail;
  payments: Record<string, { count: number; amount: number }>;
  paymentTotal: number;
  business: PortalBusiness | null;
};

export type PortalCheckoutResponse = {
  checkoutUrl: string;
  sessionId: string;
  paymentId: string;
  amount: number;
};
