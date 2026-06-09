"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboard.service";

export const dashboardQueryKey = ["dashboard", "overview"] as const;

export function useDashboard(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: () => dashboardService.getOverview(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: options?.enabled ?? true,
  });
}
