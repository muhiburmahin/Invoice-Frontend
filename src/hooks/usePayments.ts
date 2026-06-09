"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import { invoicesQueryKey } from "@/hooks/useInvoices";
import { paymentService } from "@/services/payment.service";
import type {
  CreatePaymentInput,
  ListPaymentsParams,
  StripeCheckoutInput,
  UpdatePaymentStatusInput,
} from "@/types/payment";

export const paymentsQueryKey = ["payments"] as const;

export function usePaymentMeta() {
  return useQuery({
    queryKey: [...paymentsQueryKey, "meta"],
    queryFn: () => paymentService.meta(),
    staleTime: Infinity,
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: [...paymentsQueryKey, "stats"],
    queryFn: () => paymentService.stats(),
    staleTime: 60_000,
  });
}

export function usePayments(params: ListPaymentsParams = {}) {
  return useQuery({
    queryKey: [...paymentsQueryKey, params],
    queryFn: () => paymentService.list(params),
    staleTime: 30_000,
  });
}

export function useInvoicePayments(invoiceId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...paymentsQueryKey, "invoice", invoiceId],
    queryFn: () => paymentService.listForInvoice(invoiceId),
    enabled: options?.enabled ?? Boolean(invoiceId),
    staleTime: 30_000,
  });
}

function invalidatePayments(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
  void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
  void queryClient.invalidateQueries({ queryKey: invoicesQueryKey });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePaymentInput) => paymentService.create(body),
    onSuccess: (_data, variables) => {
      invalidatePayments(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...invoicesQueryKey, variables.invoiceId],
      });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdatePaymentStatusInput }) =>
      paymentService.updateStatus(id, body),
    onSuccess: () => invalidatePayments(queryClient),
  });
}

export function useCancelPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentService.cancel(id),
    onSuccess: () => invalidatePayments(queryClient),
  });
}

export function useStripeCheckout() {
  return useMutation({
    mutationFn: (body: StripeCheckoutInput) => paymentService.stripeCheckout(body),
  });
}
