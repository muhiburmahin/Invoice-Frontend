export const CURRENCY_CODES = [
  "USD",
  "EUR",
  "GBP",
  "BDT",
  "INR",
  "PKR",
  "AED",
  "SAR",
  "CAD",
  "AUD",
  "JPY",
  "CNY",
  "SGD",
  "MYR",
  "THB",
  "TRY",
  "BRL",
  "MXN",
  "ZAR",
  "NGN",
] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export type CurrencyOption = {
  code: CurrencyCode;
  label: string;
  symbol: string;
};

export type Business = {
  id: string;
  userId: string;
  name: string;
  logo: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  taxNumber: string | null;
  vatNumber: string | null;
  currency: CurrencyCode;
  taxRate: number;
  invoicePrefix: string;
  nextNumber: number;
  defaultDueDays: number;
  defaultNotes: string | null;
  defaultTerms: string | null;
  primaryColor: string | null;
  accentColor: string | null;
};

export type UpdateBusinessInput = {
  name?: string;
  logo?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  taxNumber?: string | null;
  vatNumber?: string | null;
  currency?: CurrencyCode;
  taxRate?: number;
  invoicePrefix?: string;
  nextNumber?: number;
  defaultDueDays?: number;
  defaultNotes?: string | null;
  defaultTerms?: string | null;
  primaryColor?: string | null;
  accentColor?: string | null;
};
