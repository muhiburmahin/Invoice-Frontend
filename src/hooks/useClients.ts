"use client";

import { useQuery } from "@tanstack/react-query";

import { clientService } from "@/services/client.service";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => clientService.list(),
    enabled: false, // TODO: Phase 3 — set enabled: true
  });
}
