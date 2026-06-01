import Link from "next/link";
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Brand background */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-muted via-background to-brand-secondary/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-brand/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-0 size-72 rounded-full bg-brand-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mb-8 text-center">
        <Link
          href="/auth/login"
          className="text-2xl font-semibold tracking-tight text-brand"
        >
          Invoice
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoices, clients & payments in one place
        </p>
      </div>

      <Card className="relative w-full max-w-md border-brand-secondary/60 shadow-lg shadow-brand/5">
        <CardHeader className="border-b border-brand-secondary/40 bg-brand-muted/30">
          <CardTitle className="text-foreground">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4 pt-6">{children}</CardContent>
        {footer ? (
          <div className="border-t border-brand-secondary/40 bg-brand-muted/20 px-6 py-4 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
