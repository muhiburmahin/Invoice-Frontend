"use client";

import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";

// TODO: Phase 5 — dedicated dashboard service
export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [invoices, clients, payments] = await Promise.all([
        apiGet<unknown>("/api/v1/invoices/stats"),
        apiGet<unknown>("/api/v1/clients/stats"),
        apiGet<unknown>("/api/v1/payments/stats"),
      ]);
      return { invoices, clients, payments };
    },
    enabled: false,
  });
}
