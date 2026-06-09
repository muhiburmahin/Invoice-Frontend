"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Play, Users } from "lucide-react";

import { isSuperAdmin } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const items: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  superAdminOnly?: boolean;
}[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activity-logs", label: "Activity logs", icon: Activity },
  { href: "/admin/jobs", label: "Jobs", icon: Play, superAdminOnly: true },
];

export function AdminNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const superAdmin = isSuperAdmin(user?.role);

  return (
    <nav className="flex flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
      {items.map((item) => {
        if (item.superAdminOnly && !superAdmin) return null;
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
