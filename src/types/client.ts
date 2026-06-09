import type { CurrencyCode } from "@/types/business";
import type { ClientStats } from "@/types/dashboard";
import type { PaginatedMeta } from "@/types";

export type ClientListItem = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  currency: string | null;
  tags: string[];
  portalEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Client = ClientListItem & {
  address: string | null;
  state: string | null;
  zipCode: string | null;
  taxNumber: string | null;
  notes: string | null;
  deletedAt: string | null;
};

export type ClientInvoiceStats = {
  invoices: number;
  totalInvoiced: number;
  outstandingBalance: number;
  activeRecurringSchedules: number;
  byStatus: Record<string, { count: number; total: number; balanceDue: number }>;
};

export type ClientDetailResponse = {
  client: Client;
  stats: ClientInvoiceStats;
};

export type ListClientsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "deleted";
  sortBy?: "createdAt" | "updatedAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
};

export type ListClientsResult = {
  clients: ClientListItem[];
  meta: PaginatedMeta;
};

export type CreateClientInput = {
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  taxNumber?: string | null;
  currency?: CurrencyCode | null;
  notes?: string | null;
  tags?: string[];
  portalEnabled?: boolean;
};

export type UpdateClientInput = Partial<CreateClientInput>;

export type { ClientStats };
