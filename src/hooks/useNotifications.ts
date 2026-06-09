"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import {
  notificationService,
  type ListNotificationsParams,
} from "@/services/notification.service";

export const notificationsQueryKey = ["notifications"] as const;
export const unreadCountQueryKey = ["notifications", "unread-count"] as const;

export function useNotifications(params: ListNotificationsParams = {}) {
  return useQuery({
    queryKey: [...notificationsQueryKey, params],
    queryFn: () => notificationService.list(params),
    staleTime: 30_000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: unreadCountQueryKey,
    queryFn: () => notificationService.unreadCount(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

function invalidateNotificationQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
  void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
  void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}

export function useDeleteReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.deleteRead(),
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}
