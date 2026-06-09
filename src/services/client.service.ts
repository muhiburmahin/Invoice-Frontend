import { apiDelete, apiGet, apiGetWithMeta, apiPatch, apiPost } from "@/lib/api";
import type { ClientStats } from "@/types/dashboard";
import type {
  Client,
  ClientDetailResponse,
  CreateClientInput,
  ListClientsParams,
  ListClientsResult,
  UpdateClientInput,
} from "@/types/client";

function buildQuery(params: ListClientsParams = {}): string {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.search) qs.set("search", params.search);
  if (params.status) qs.set("status", params.status);
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  const query = qs.toString();
  return query ? `?${query}` : "";
}

export const clientService = {
  list: async (params: ListClientsParams = {}): Promise<ListClientsResult> => {
    const { data, meta } = await apiGetWithMeta<{ clients: ListClientsResult["clients"] }>(
      `/api/v1/clients${buildQuery(params)}`,
    );
    return { clients: data.clients, meta };
  },

  stats: () => apiGet<{ stats: ClientStats }>("/api/v1/clients/stats"),

  getById: (id: string) => apiGet<ClientDetailResponse>(`/api/v1/clients/${id}`),

  create: (body: CreateClientInput) =>
    apiPost<{ client: Client; restored?: boolean; message?: string }>(
      "/api/v1/clients",
      body,
    ),

  update: (id: string, body: UpdateClientInput) =>
    apiPatch<{ client: Client; message?: string }>(`/api/v1/clients/${id}`, body),

  updateStatus: (id: string, isActive: boolean) =>
    apiPatch<{ client: Client; message?: string }>(`/api/v1/clients/${id}/status`, {
      isActive,
    }),

  remove: (id: string) =>
    apiDelete<{ message: string }>(`/api/v1/clients/${id}`),

  restore: (id: string) =>
    apiPatch<{ client: Client; message?: string }>(`/api/v1/clients/${id}/restore`),

  regeneratePortalToken: (id: string) =>
    apiPost<{ portalToken: string; message?: string }>(
      `/api/v1/clients/${id}/portal-token/regenerate`,
    ),
};
