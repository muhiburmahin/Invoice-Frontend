"use client";

import { Building2, Shield } from "lucide-react";

import { cn } from "@/lib/utils";

export type AuthAccountKind = "business" | "staff";

type AuthAccountTypeTabsProps = {
  value: AuthAccountKind;
  onChange: (value: AuthAccountKind) => void;
};

const OPTIONS: {
  value: AuthAccountKind;
  label: string;
  icon: typeof Building2;
  description: string;
}[] = [
  {
    value: "business",
    label: "Business owner",
    icon: Building2,
    description: "Manage invoices, clients and payments for your company.",
  },
  {
    value: "staff",
    label: "Staff & admin",
    icon: Shield,
    description:
      "Support and Super Admin accounts — sign in with credentials from your administrator.",
  },
];

export function AuthAccountTypeTabs({ value, onChange }: AuthAccountTypeTabsProps) {
  const active = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  return (
    <div className="space-y-3">
      <div
        className="grid grid-cols-2 gap-1 rounded-lg border border-brand-secondary/60 bg-muted/30 p-1"
        role="tablist"
        aria-label="Account type"
      >
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                selected
                  ? "bg-background text-brand shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground">{active.description}</p>
      {value === "staff" ? (
        <div className="rounded-lg border border-brand-secondary/50 bg-brand-secondary/20 px-3 py-2.5 text-xs text-muted-foreground">
          <strong className="font-medium text-foreground">Staff cannot self-register.</strong>{" "}
          Your platform administrator creates Support and Super Admin accounts and assigns roles.
          Use the same sign-in form with the email they provided.
        </div>
      ) : null}
    </div>
  );
}
