"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/payments", label: "Payments", icon: Wallet },
  { href: "/recurring", label: "Recurring", icon: RefreshCw, badge: "PRO" },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { plan } = useAuth();

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="font-semibold">
          Invoice
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60",
              )}
            >
              <Icon className="size-4" />
              {label}
              {badge ? (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Badge variant="outline" className="w-full justify-center">
          {plan} plan
        </Badge>
      </div>
    </aside>
  );
}
