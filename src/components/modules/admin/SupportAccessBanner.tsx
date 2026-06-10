"use client";

import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { isSuperAdmin } from "@/lib/roles";

type SupportAccessBannerProps = {
  context?: "overview" | "users" | "logs" | "user-detail";
};

const MESSAGES: Record<NonNullable<SupportAccessBannerProps["context"]>, string> = {
  overview:
    "You can view platform stats and charts. Scheduled jobs and account changes require a Super Admin.",
  users:
    "You can search and view accounts. Role, plan, and status changes require a Super Admin.",
  logs: "You can browse and filter the audit trail. Administrative changes require a Super Admin.",
  "user-detail":
    "You can view account details and send a password reset email. Other actions require a Super Admin.",
};

export function SupportAccessBanner({ context = "overview" }: SupportAccessBannerProps) {
  const { user } = useAuth();

  if (isSuperAdmin(user?.role)) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-brand-secondary/50 bg-brand-secondary/20 px-3 py-2.5">
      <Badge variant="outline" className="gap-1 text-[10px] uppercase tracking-wide">
        <Eye className="size-3" />
        Read-only
      </Badge>
      <p className="text-xs text-muted-foreground">{MESSAGES[context]}</p>
    </div>
  );
}
