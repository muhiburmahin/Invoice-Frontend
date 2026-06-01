"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NAVBAR_OFFSET = "top-16";

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function MobileNavDrawer({
  open,
  onClose,
  title = "Menu",
  children,
  footer,
}: MobileNavDrawerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) onClose();
  }, [pathname, open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm", NAVBAR_OFFSET)}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed bottom-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-brand-secondary/40 bg-background shadow-2xl animate-in slide-in-from-right duration-200",
          NAVBAR_OFFSET,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-brand-secondary/40 px-4">
          <BrandLogo href="/" size="sm" showWordmark />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
        {footer ? (
          <div className="shrink-0 border-t border-brand-secondary/40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </aside>
    </>
  );
}
