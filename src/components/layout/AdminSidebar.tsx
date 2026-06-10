"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Shield } from "lucide-react";

import { adminNavItems, isAdminNavActive } from "@/config/admin-navigation";
import { useAuth } from "@/hooks/useAuth";
import { isSuperAdmin, roleLabel } from "@/lib/roles";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const superAdmin = isSuperAdmin(user?.role);

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-brand-secondary/40 bg-sidebar md:flex">
      <div className="flex h-14 items-center border-b border-brand-secondary/40 px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold text-brand">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-sm text-brand-foreground">
            <Shield className="size-4" />
          </span>
          <span>
            Admin
            <span className="text-muted-foreground"> Console</span>
          </span>
        </Link>
      </div>

      <div className="border-b border-brand-secondary/40 px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
            {roleLabel(user?.role)}
          </Badge>
          {!superAdmin ? (
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
              Read-only
            </Badge>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {superAdmin
            ? "Full platform management — users, logs & system stats"
            : "Support access — view users, logs & stats"}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin navigation">
        {adminNavItems.map((item) => {
          if (item.superAdminOnly && !superAdmin) return null;
          const active = isAdminNavActive(pathname, item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.description}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-brand text-brand-foreground shadow-sm shadow-brand/20"
                  : "text-sidebar-foreground hover:bg-brand-secondary/60 hover:text-brand",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  active ? "text-brand-foreground" : "text-muted-foreground group-hover:text-brand",
                )}
              />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-brand-secondary/40 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-brand-secondary/60 hover:text-brand"
        >
          <LayoutGrid className="size-4 shrink-0 text-muted-foreground" />
          My business app
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-brand-secondary/60 hover:text-brand"
        >
          <Home className="size-4 shrink-0 text-muted-foreground" />
          Website home
        </Link>
      </div>
    </aside>
  );
}
