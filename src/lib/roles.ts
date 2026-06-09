import type { UserRole } from "@/types";

export function isStaff(role: UserRole | undefined | null): boolean {
  return role === "SUPPORT" || role === "SUPER_ADMIN";
}

export function isSuperAdmin(role: UserRole | undefined | null): boolean {
  return role === "SUPER_ADMIN";
}
