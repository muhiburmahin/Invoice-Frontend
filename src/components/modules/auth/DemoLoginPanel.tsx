"use client";

import { useState } from "react";
import { KeyRound, Shield, Building2 } from "lucide-react";
import { toast } from "sonner";

import type { AuthAccountKind } from "@/components/modules/auth/AuthAccountTypeTabs";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/config/demo-accounts";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

type DemoLoginPanelProps = {
  accountKind: AuthAccountKind;
  onAccountKindChange: (kind: AuthAccountKind) => void;
  onPrefill: (email: string, password: string) => void;
};

const KIND_ICON = {
  staff: Shield,
  business: Building2,
} as const;

export function DemoLoginPanel({
  accountKind,
  onAccountKindChange,
  onPrefill,
}: DemoLoginPanelProps) {
  const { login } = useAuth();
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  const signInAs = async (account: DemoAccount) => {
    onAccountKindChange(account.kind);
    onPrefill(account.email, account.password);
    setLoadingEmail(account.email);
    try {
      await login({
        email: account.email,
        password: account.password,
        rememberMe: true,
      });
      toast.success(
        account.kind === "staff" ? "Signed in as admin" : "Signed in as business user",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-brand-secondary/70 bg-brand-muted/30 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <KeyRound className="size-4 text-brand" aria-hidden />
        Demo accounts
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        For project review — click a button to sign in instantly, or copy the credentials below.
      </p>
      <div className="space-y-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = KIND_ICON[account.kind];
          const isLoading = loadingEmail === account.email;
          const isActiveKind = accountKind === account.kind;

          return (
            <div
              key={account.email}
              className={cn(
                "rounded-lg border bg-background/80 p-3 transition-colors",
                isActiveKind ? "border-brand/50" : "border-brand-secondary/40",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <Icon className="size-3.5 shrink-0 text-brand" aria-hidden />
                    {account.label}
                  </p>
                  <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                    {account.email}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">{account.password}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                    {account.hint}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="shrink-0 border-brand-secondary/60 hover:bg-brand-secondary/40"
                  disabled={loadingEmail !== null}
                  onClick={() => void signInAs(account)}
                >
                  {isLoading ? "Signing in…" : "Sign in"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
