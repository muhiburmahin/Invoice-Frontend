import { apiDelete, apiGet, apiGetWithMeta, apiPatch } from "@/lib/api";
import type { NotificationItem, PaginatedMeta } from "@/types";

export type ListNotificationsParams = {
  page?: number;
  limit?: number;
  isRead?: boolean;
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
};

export const notificationService = {
  list: async (params: ListNotificationsParams = {}) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.isRead !== undefined) {
      search.set("isRead", String(params.isRead));
    }
    if (params.sortBy) search.set("sortBy", params.sortBy);
    if (params.sortOrder) search.set("sortOrder", params.sortOrder);

    const qs = search.toString();
    const url = `/api/v1/notifications${qs ? `?${qs}` : ""}`;

    const { data, meta } = await apiGetWithMeta<{ notifications: NotificationItem[] }>(
      url,
    );
    return { notifications: data.notifications, meta };
  },

  unreadCount: () =>
    apiGet<{ unreadCount: number }>("/api/v1/notifications/unread-count"),

  markRead: (id: string) =>
    apiPatch<{ notification: NotificationItem; message: string }>(
      `/api/v1/notifications/${id}/read`,
    ),

  markAllRead: () =>
    apiPatch<{ updated: number; message: string }>(
      "/api/v1/notifications/read-all",
    ),

  delete: (id: string) =>
    apiDelete<{ message: string }>(`/api/v1/notifications/${id}`),

  deleteRead: () =>
    apiDelete<{ deleted: number; message: string }>(
      "/api/v1/notifications/read",
    ),
};
