"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import { invoiceService } from "@/services/invoice.service";
import type {
  CreateInvoiceInput,
  ListInvoicesParams,
  SendInvoiceInput,
  UpdateInvoiceInput,
  UpdateInvoiceStatusInput,
} from "@/types/invoice";

export const invoicesQueryKey = ["invoices"] as const;

export function useInvoiceMeta() {
  return useQuery({
    queryKey: [...invoicesQueryKey, "meta"],
    queryFn: () => invoiceService.meta(),
    staleTime: Infinity,
  });
}

export function useInvoiceStats() {
  return useQuery({
    queryKey: [...invoicesQueryKey, "stats"],
    queryFn: () => invoiceService.stats(),
    staleTime: 60_000,
  });
}

export function useInvoices(params: ListInvoicesParams = {}) {
  return useQuery({
    queryKey: [...invoicesQueryKey, params],
    queryFn: () => invoiceService.list(params),
    staleTime: 30_000,
  });
}

export function useInvoice(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...invoicesQueryKey, id],
    queryFn: () => invoiceService.getById(id),
    enabled: options?.enabled ?? Boolean(id),
    staleTime: 30_000,
  });
}

function invalidateInvoices(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: invoicesQueryKey });
  void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInvoiceInput) => invoiceService.create(body),
    onSuccess: () => invalidateInvoices(queryClient),
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateInvoiceInput }) =>
      invoiceService.update(id, body),
    onSuccess: (_data, variables) => {
      invalidateInvoices(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...invoicesQueryKey, variables.id],
      });
    },
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateInvoiceStatusInput }) =>
      invoiceService.updateStatus(id, body),
    onSuccess: (_data, variables) => {
      invalidateInvoices(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...invoicesQueryKey, variables.id],
      });
    },
  });
}

export function useDuplicateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoiceService.duplicate(id),
    onSuccess: () => invalidateInvoices(queryClient),
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoiceService.remove(id),
    onSuccess: () => invalidateInvoices(queryClient),
  });
}

export function useSendInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body?: SendInvoiceInput }) =>
      invoiceService.send(id, body),
    onSuccess: (_data, variables) => {
      invalidateInvoices(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...invoicesQueryKey, variables.id],
      });
    },
  });
}

export function useRemindInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body?: SendInvoiceInput }) =>
      invoiceService.remind(id, body),
    onSuccess: (_data, variables) => {
      invalidateInvoices(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...invoicesQueryKey, variables.id],
      });
    },
  });
}
