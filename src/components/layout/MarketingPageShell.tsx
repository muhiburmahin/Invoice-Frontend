import type { ReactNode } from "react";

type MarketingPageShellProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function MarketingPageShell({ title, description, children }: MarketingPageShellProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-16">
      <p className="text-sm font-medium text-brand">Invoice SaaS</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{description}</p>
      {children ? <div className="mt-10 space-y-6">{children}</div> : null}
    </main>
  );
}
