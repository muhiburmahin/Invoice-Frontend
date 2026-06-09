import { apiDelete, apiGet, apiGetWithMeta, apiPatch, apiPost } from "@/lib/api";
import type { InvoiceDetailResponse } from "@/types/invoice";
import type {
  CreateRecurringInput,
  ListRecurringParams,
  ListRecurringResult,
  RecurringDetailResponse,
  RecurringInvoiceListItem,
  RecurringMeta,
  RecurringStats,
  RunRecurringInput,
  UpdateRecurringInput,
} from "@/types/recurring";

function buildQuery(params: ListRecurringParams = {}): string {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.clientId) qs.set("clientId", params.clientId);
  if (params.frequency) qs.set("frequency", params.frequency);
  if (params.isActive !== undefined) qs.set("isActive", String(params.isActive));
  if (params.overdue !== undefined) qs.set("overdue", String(params.overdue));
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  const query = qs.toString();
  return query ? `?${query}` : "";
}

export const recurringService = {
  meta: () => apiGet<RecurringMeta>("/api/v1/recurring-schedules/meta"),

  stats: () =>
    apiGet<{ stats: RecurringStats }>("/api/v1/recurring-schedules/stats"),

  list: async (params: ListRecurringParams = {}): Promise<ListRecurringResult> => {
    const { data, meta } = await apiGetWithMeta<{
      schedules: ListRecurringResult["schedules"];
    }>(`/api/v1/recurring-schedules${buildQuery(params)}`);
    return { schedules: data.schedules, meta };
  },

  getById: (id: string) =>
    apiGet<RecurringDetailResponse>(`/api/v1/recurring-schedules/${id}`),

  listInvoices: (id: string) =>
    apiGet<{ invoices: RecurringInvoiceListItem[] }>(
      `/api/v1/recurring-schedules/${id}/invoices`,
    ),

  create: (body: CreateRecurringInput) =>
    apiPost<{ schedule: RecurringDetailResponse["schedule"]; message?: string }>(
      "/api/v1/recurring-schedules",
      body,
    ),

  update: (id: string, body: UpdateRecurringInput) =>
    apiPatch<{ schedule: RecurringDetailResponse["schedule"]; message?: string }>(
      `/api/v1/recurring-schedules/${id}`,
      body,
    ),

  updateStatus: (id: string, isActive: boolean) =>
    apiPatch<{ schedule: RecurringDetailResponse["schedule"]; message?: string }>(
      `/api/v1/recurring-schedules/${id}/status`,
      { isActive },
    ),

  run: (id: string, body: RunRecurringInput = {}) =>
    apiPost<{
      invoice: InvoiceDetailResponse["invoice"];
      schedule: RecurringDetailResponse["schedule"];
      templateInvoiceId: string;
      message?: string;
    }>(`/api/v1/recurring-schedules/${id}/run`, body),

  remove: (id: string) =>
    apiDelete<{ message: string }>(`/api/v1/recurring-schedules/${id}`),
};
