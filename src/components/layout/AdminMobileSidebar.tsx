"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Menu, X } from "lucide-react";
import { useState } from "react";

import { adminNavItems, isAdminNavActive } from "@/config/admin-navigation";
import { useAuth } from "@/hooks/useAuth";
import { isSuperAdmin } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminMobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const superAdmin = isSuperAdmin(user?.role);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close admin menu" : "Open admin menu"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>
      {open ? (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-brand-secondary/40 bg-background/98 p-3 shadow-xl backdrop-blur-md"
            aria-label="Admin mobile navigation"
          >
            {adminNavItems.map((item) => {
              if (item.superAdminOnly && !superAdmin) return null;
              const active = isAdminNavActive(pathname, item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                    active ? "bg-brand text-brand-foreground" : "hover:bg-brand-secondary/60",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-brand-secondary/60"
            >
              <LayoutGrid className="size-4" />
              My business app
            </Link>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-brand-secondary/60"
            >
              <Home className="size-4" />
              Website home
            </Link>
          </nav>
        </>
      ) : null}
    </div>
  );
}
