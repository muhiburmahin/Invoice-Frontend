import type { LucideIcon } from "lucide-react";
import {
  Bell,
  FileText,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  /** Show in navbar quick-create menu */
  quickAction?: boolean;
};

export const mainNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & analytics",
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Users,
    description: "Manage customers",
    quickAction: true,
  },
  {
    href: "/invoices",
    label: "Invoices",
    icon: FileText,
    description: "Create & send invoices",
    quickAction: true,
  },
  {
    href: "/payments",
    label: "Payments",
    icon: Wallet,
    description: "Track payments",
  },
  {
    href: "/recurring",
    label: "Recurring",
    icon: RefreshCw,
    description: "Automated billing",
    badge: "PRO",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    description: "Business & account",
  },
];

export const settingsNavItems: NavItem[] = [
  { href: "/settings", label: "Overview", icon: Settings },
  { href: "/settings/business", label: "Business", icon: Settings },
  { href: "/settings/billing", label: "Billing", icon: Wallet },
  { href: "/settings/account", label: "Account", icon: Users },
  {
    href: "/settings/notifications",
    label: "Notifications",
    icon: Bell,
  },
];

/** Breadcrumb labels for dynamic navbar */
export const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/invoices": "Invoices",
  "/invoices/new": "New invoice",
  "/payments": "Payments",
  "/recurring": "Recurring",
  "/recurring/new": "New schedule",
  "/settings": "Settings",
  "/settings/business": "Business profile",
  "/settings/billing": "Billing",
  "/settings/account": "Account",
  "/settings/notifications": "Notifications",
  "/admin": "Admin",
  "/admin/users": "Users",
  "/admin/activity-logs": "Activity logs",
  "/admin/jobs": "Scheduled jobs",
};

export function getPageTitle(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname];

  if (pathname.startsWith("/invoices/") && pathname.endsWith("/edit")) {
    return "Edit invoice";
  }
  if (pathname.startsWith("/invoices/")) return "Invoice details";
  if (pathname.startsWith("/clients/")) return "Client details";
  if (pathname.startsWith("/recurring/")) return "Recurring schedule";
  if (pathname.startsWith("/admin/users/")) return "User details";

  return "Invoice";
}

export function getBreadcrumbs(pathname: string): { href: string; label: string }[] {
  const crumbs: { href: string; label: string }[] = [
    { href: "/dashboard", label: "Home" },
  ];

  if (pathname === "/dashboard") return crumbs;

  const segments = pathname.split("/").filter(Boolean);
  let path = "";

  for (const segment of segments) {
    path += `/${segment}`;
    const label = routeLabels[path];
    if (label) {
      crumbs.push({ href: path, label });
    } else if (segments.indexOf(segment) === segments.length - 1) {
      crumbs.push({ href: path, label: getPageTitle(pathname) });
    }
  }

  return crumbs;
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
