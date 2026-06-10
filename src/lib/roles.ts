import { DASHBOARD_HOME } from "@/config/public-routes";
import type { UserRole } from "@/types";

export const ADMIN_HOME = "/admin" as const;

export function isStaff(role: UserRole | undefined | null): boolean {
  return role === "SUPPORT" || role === "SUPER_ADMIN";
}

export function isSuperAdmin(role: UserRole | undefined | null): boolean {
  return role === "SUPER_ADMIN";
}

export function getDefaultHomeForRole(role: UserRole | undefined | null): string {
  return isStaff(role) ? ADMIN_HOME : DASHBOARD_HOME;
}

export function roleLabel(role: UserRole | undefined | null): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "SUPPORT":
      return "Support";
    case "USER":
      return "Business";
    default:
      return "User";
  }
}
