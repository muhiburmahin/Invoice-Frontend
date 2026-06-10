"use client";

import type { ReactNode } from "react";
import { FileText, Shield, Users, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthPageShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "login" | "register";
};

const FEATURES = [
  { icon: FileText, label: "Professional invoices & PDF export" },
  { icon: Users, label: "Client portal & contact management" },
  { icon: Wallet, label: "Payments, recurring billing & reminders" },
];

export function AuthPageShell({
  title,
  description,
  children,
  footer,
  variant = "login",
}: AuthPageShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col lg:flex-row">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-muted via-background to-brand-secondary/20"
        aria-hidden
      />

      <aside className="relative hidden w-full flex-col justify-between border-r border-brand-secondary/40 bg-brand/5 px-10 py-12 lg:flex lg:max-w-md xl:max-w-lg">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Invoice<span className="text-brand">.</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            {variant === "register"
              ? "Create your business workspace and start invoicing in minutes."
              : "Sign in to your workspace — business owners and platform staff use the same secure login."}
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3 text-sm">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/60 text-brand">
                  <Icon className="size-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-brand-secondary/50 bg-background/60 p-4 text-sm">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Shield className="size-4 text-brand" />
            Account types
          </div>
          <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
            <li>
              <strong className="text-foreground">Business owner (USER)</strong> — register here,
              manage your own invoices and clients.
            </li>
            <li>
              <strong className="text-foreground">Support / Super Admin</strong> — created by an
              administrator only; sign in with assigned credentials.
            </li>
          </ul>
        </div>
      </aside>

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <Card className="w-full max-w-md border-brand-secondary/60 shadow-lg shadow-brand/5">
          <CardHeader className="border-b border-brand-secondary/40 bg-brand-muted/30">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </CardHeader>
          <CardContent className="space-y-4 pt-6">{children}</CardContent>
          {footer ? (
            <div className="border-t border-brand-secondary/40 bg-brand-muted/20 px-6 py-4 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
