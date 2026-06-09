"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import { clientService } from "@/services/client.service";
import type {
  CreateClientInput,
  ListClientsParams,
  UpdateClientInput,
} from "@/types/client";

export const clientsQueryKey = ["clients"] as const;

export function useClients(params: ListClientsParams = {}) {
  return useQuery({
    queryKey: [...clientsQueryKey, params],
    queryFn: () => clientService.list(params),
    staleTime: 30_000,
  });
}

export function useClientStats() {
  return useQuery({
    queryKey: [...clientsQueryKey, "stats"],
    queryFn: () => clientService.stats(),
    staleTime: 60_000,
  });
}

export function useClient(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...clientsQueryKey, id],
    queryFn: () => clientService.getById(id),
    enabled: options?.enabled ?? Boolean(id),
    staleTime: 30_000,
  });
}

function invalidateClients(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: clientsQueryKey });
  void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateClientInput) => clientService.create(body),
    onSuccess: () => invalidateClients(queryClient),
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateClientInput }) =>
      clientService.update(id, body),
    onSuccess: (_data, variables) => {
      invalidateClients(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...clientsQueryKey, variables.id],
      });
    },
  });
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      clientService.updateStatus(id, isActive),
    onSuccess: (_data, variables) => {
      invalidateClients(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [...clientsQueryKey, variables.id],
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientService.remove(id),
    onSuccess: () => invalidateClients(queryClient),
  });
}

export function useRestoreClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientService.restore(id),
    onSuccess: (_data, id) => {
      invalidateClients(queryClient);
      void queryClient.invalidateQueries({ queryKey: [...clientsQueryKey, id] });
    },
  });
}

export function useRegeneratePortalToken() {
  return useMutation({
    mutationFn: (id: string) => clientService.regeneratePortalToken(id),
  });
}
