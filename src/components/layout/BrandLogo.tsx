import Link from "next/link";
import { Receipt } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md";
  /** Marketing navbar: solid brand bar after scroll */
  scrolled?: boolean;
};

export function BrandLogo({
  href = "/",
  className,
  showWordmark = true,
  size = "md",
  scrolled = false,
}: BrandLogoProps) {
  const iconBox = size === "sm" ? "size-9 rounded-xl" : "size-10 rounded-xl";
  const iconSize = size === "sm" ? "size-4" : "size-5";

  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg font-bold tracking-tight outline-none transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand/50",
        className,
      )}
      aria-label="Invoice home"
    >
      <span
        className={cn(
          "flex items-center justify-center shadow-lg transition-all duration-500",
          iconBox,
          scrolled
            ? "bg-white text-brand shadow-white/20"
            : "bg-gradient-to-br from-brand via-brand to-brand-accent text-brand-foreground shadow-brand/30 ring-1 ring-brand/20",
        )}
      >
        <Receipt className={cn(iconSize)} strokeWidth={2.25} aria-hidden />
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "text-xl font-black tracking-tighter transition-colors duration-500 sm:text-2xl",
            scrolled ? "text-white" : "text-foreground",
          )}
        >
          Invoice
          <span className={scrolled ? "text-brand-secondary" : "text-brand"}>.</span>
        </span>
      ) : null}
    </Link>
  );
}
