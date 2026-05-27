"use client";

import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiGet<unknown>("/api/v1/notifications"),
    enabled: false, // TODO: Phase 7
  });
}
