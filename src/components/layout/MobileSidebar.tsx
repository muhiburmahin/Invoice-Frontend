"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { isNavActive, mainNavItems } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { plan } = useAuth();

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
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
            aria-label="Mobile navigation"
          >
            {mainNavItems.map(({ href, label, icon: Icon, badge }) => {
              const active = isNavActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                    active
                      ? "bg-brand text-brand-foreground"
                      : "hover:bg-brand-secondary/60",
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
            <div className="mt-3 rounded-lg bg-brand-secondary/50 px-3 py-2 text-center text-sm">
              <span className="text-muted-foreground">Plan: </span>
              <span className="font-semibold text-brand">{plan}</span>
            </div>
          </nav>
        </>
      ) : null}
    </div>
  );
}
