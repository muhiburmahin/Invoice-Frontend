"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import { businessService } from "@/services/business.service";
import type { UpdateBusinessInput } from "@/types/business";

export const businessQueryKey = ["business"] as const;

export function useBusiness() {
  return useQuery({
    queryKey: businessQueryKey,
    queryFn: () => businessService.get(),
    staleTime: 60_000,
  });
}

export function useBusinessCurrencies() {
  return useQuery({
    queryKey: ["business", "currencies"],
    queryFn: () => businessService.currencies(),
    staleTime: Infinity,
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateBusinessInput) => businessService.update(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: businessQueryKey });
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
    },
  });
}
