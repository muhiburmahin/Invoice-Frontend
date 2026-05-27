"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/invoices", label: "Invoices" },
  { href: "/payments", label: "Payments" },
  { href: "/settings", label: "Settings" },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)}>
        <Menu className="size-5" />
      </Button>
      {open ? (
        <nav className="absolute left-0 top-14 z-50 w-full border-b bg-background p-3 shadow-md">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium",
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "bg-muted"
                  : "hover:bg-muted/60",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
