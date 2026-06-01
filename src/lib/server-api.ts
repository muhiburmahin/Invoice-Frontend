import { cookies } from "next/headers";

import type { ApiFailure, ApiSuccess } from "@/types";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

export async function serverApiGet<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = (await res.json()) as ApiSuccess<T> | ApiFailure;

  if (!res.ok || !json.success) {
    const message =
      "message" in json ? json.message : "Request failed";
    throw new Error(message);
  }

  return json.data;
}
