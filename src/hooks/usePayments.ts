"use client";

import { useQuery } from "@tanstack/react-query";

import { paymentService } from "@/services/payment.service";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentService.list(),
    enabled: false, // TODO: Phase 6
  });
}
