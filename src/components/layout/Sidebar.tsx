"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavActive, mainNavItems } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { plan, workspace } = useAuth();

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-brand-secondary/40 bg-sidebar md:flex">
      <div className="flex h-14 items-center border-b border-brand-secondary/40 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-brand">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-sm text-brand-foreground">
            In
          </span>
          Invoice
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
        {mainNavItems.map(({ href, label, icon: Icon, badge, description }) => {
          const active = isNavActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              title={description}
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
              <span className="flex-1">{label}</span>
              {badge ? (
                <Badge
                  variant={active ? "secondary" : "outline"}
                  className={cn(
                    "text-[10px]",
                    active && "border-brand-foreground/30 bg-brand-foreground/20 text-brand-foreground",
                  )}
                >
                  {badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-brand-secondary/40 p-3">
        <div className="rounded-lg bg-brand-secondary/50 px-3 py-2 text-center">
          <p className="text-xs text-muted-foreground">Current plan</p>
          <p className="font-semibold text-brand">{plan} plan</p>
        </div>
        {workspace && !workspace.user.isVerified ? (
          <p className="text-center text-xs text-warning">
            Verify your email to unlock all features
          </p>
        ) : null}
      </div>
    </aside>
  );
}
