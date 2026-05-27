"use client";

import { useQuery } from "@tanstack/react-query";

import { businessService } from "@/services/business.service";

export function useBusiness() {
  return useQuery({
    queryKey: ["business"],
    queryFn: () => businessService.get(),
    enabled: false, // TODO: Phase 2
  });
}
