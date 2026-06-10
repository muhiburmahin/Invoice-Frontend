import type { LucideIcon } from "lucide-react";
import {
  Activity,
  LayoutDashboard,
  LayoutGrid,
  Play,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  exact?: boolean;
  superAdminOnly?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Platform stats & charts",
    exact: true,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    description: "All registered accounts",
  },
  {
    href: "/admin/activity-logs",
    label: "Activity logs",
    icon: Activity,
    description: "Audit trail",
  },
  {
    href: "/admin/jobs",
    label: "Scheduled jobs",
    icon: Play,
    description: "Run background tasks",
    superAdminOnly: true,
  },
];

export function isAdminNavActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact || href === "/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
