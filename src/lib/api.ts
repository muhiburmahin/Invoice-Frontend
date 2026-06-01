import axios, { type AxiosError } from "axios";

import { env } from "@/config/env";
import type { ApiFailure, ApiSuccess, PaginatedMeta } from "@/types";

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiFailure | undefined;
    if (data?.details?.errors?.length) {
      return data.details.errors.join(". ");
    }
    if (data?.details?.fieldErrors) {
      const messages = Object.values(data.details.fieldErrors).flat();
      if (messages.length) return messages.join(". ");
    }
    if (data?.message) return data.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export async function apiGet<T>(url: string): Promise<T> {
  const { data } = await api.get<ApiSuccess<T>>(url);
  return data.data;
}

export async function apiGetWithMeta<T>(url: string): Promise<{ data: T; meta: PaginatedMeta }> {
  const { data: body } = await api.get<ApiSuccess<T>>(url);
  const meta = body.meta as PaginatedMeta | undefined;
  return {
    data: body.data,
    meta: meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 },
  };
}

export async function apiPost<T, B = unknown>(url: string, body?: B): Promise<T> {
  const { data } = await api.post<ApiSuccess<T>>(url, body);
  return data.data;
}

export async function apiPatch<T, B = unknown>(url: string, body?: B): Promise<T> {
  const { data } = await api.patch<ApiSuccess<T>>(url, body);
  return data.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const { data } = await api.delete<ApiSuccess<T>>(url);
  return data.data;
}

export function isUnauthorized(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
