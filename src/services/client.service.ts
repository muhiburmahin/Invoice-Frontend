import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { PaginatedMeta } from "@/types";

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  isActive: boolean;
  createdAt: string;
};

// TODO: Phase 3 — align with backend response shapes
export const clientService = {
  list: () => apiGet<{ items: Client[]; meta: PaginatedMeta }>("/api/v1/clients"),
  getById: (id: string) => apiGet<Client>(`/api/v1/clients/${id}`),
  create: (body: unknown) => apiPost<Client>("/api/v1/clients", body),
  update: (id: string, body: unknown) =>
    apiPatch<Client>(`/api/v1/clients/${id}`, body),
  remove: (id: string) => apiDelete<{ message: string }>(`/api/v1/clients/${id}`),
};
