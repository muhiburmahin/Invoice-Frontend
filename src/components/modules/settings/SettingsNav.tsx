"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { settingsNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
      {settingsNavItems.map((item) => {
        const active =
          item.href === "/settings"
            ? pathname === "/settings"
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
