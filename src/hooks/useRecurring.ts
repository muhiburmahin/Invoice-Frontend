"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import { invoicesQueryKey } from "@/hooks/useInvoices";
import { recurringService } from "@/services/recurring.service";
import type {
  CreateRecurringInput,
  ListRecurringParams,
  RunRecurringInput,
  UpdateRecurringInput,
} from "@/types/recurring";

export const recurringQueryKey = ["recurring"] as const;

export function useRecurringMeta() {
  return useQuery({
    queryKey: [...recurringQueryKey, "meta"],
    queryFn: () => recurringService.meta(),
    staleTime: Infinity,
  });
}

export function useRecurringStats() {
  return useQuery({
    queryKey: [...recurringQueryKey, "stats"],
    queryFn: () => recurringService.stats(),
    staleTime: 60_000,
  });
}

export function useRecurringSchedules(params: ListRecurringParams = {}) {
  return useQuery({
    queryKey: [...recurringQueryKey, params],
    queryFn: () => recurringService.list(params),
    staleTime: 30_000,
  });
}

export function useRecurringSchedule(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...recurringQueryKey, id],
    queryFn: () => recurringService.getById(id),
    enabled: options?.enabled ?? Boolean(id),
    staleTime: 30_000,
  });
}

export function useRecurringInvoices(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...recurringQueryKey, id, "invoices"],
    queryFn: () => recurringService.listInvoices(id),
    enabled: options?.enabled ?? Boolean(id),
    staleTime: 30_000,
  });
}

function invalidateRecurring(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: recurringQueryKey });
  void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
}

export function useCreateRecurringSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRecurringInput) => recurringService.create(body),
    onSuccess: () => invalidateRecurring(queryClient),
  });
}

export function useUpdateRecurringSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateRecurringInput }) =>
      recurringService.update(id, body),
    onSuccess: (_data, variables) => {
      invalidateRecurring(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...recurringQueryKey, variables.id],
      });
    },
  });
}

export function useUpdateRecurringStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      recurringService.updateStatus(id, isActive),
    onSuccess: (_data, variables) => {
      invalidateRecurring(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...recurringQueryKey, variables.id],
      });
    },
  });
}

export function useRunRecurringSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body?: RunRecurringInput }) =>
      recurringService.run(id, body),
    onSuccess: (_data, variables) => {
      invalidateRecurring(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...recurringQueryKey, variables.id],
      });
      void queryClient.invalidateQueries({
        queryKey: [...recurringQueryKey, variables.id, "invoices"],
      });
      void queryClient.invalidateQueries({ queryKey: invoicesQueryKey });
    },
  });
}

export function useDeleteRecurringSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recurringService.remove(id),
    onSuccess: () => invalidateRecurring(queryClient),
  });
}
