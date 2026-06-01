import type { ReactNode } from "react";

import type { PortalBusiness } from "@/types/portal";

type PortalShellProps = {
  business: PortalBusiness | null;
  clientName: string;
  children: ReactNode;
};

export function PortalShell({ business, clientName, children }: PortalShellProps) {
  const brandName = business?.name ?? "Invoice Portal";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-b from-brand-muted/40 to-background">
      <header className="border-b border-brand-secondary/40 bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            {business?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logo}
                alt=""
                className="size-10 rounded-lg border border-brand-secondary/50 object-cover"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-brand-foreground">
                {brandName.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground">{brandName}</p>
              <p className="text-xs text-muted-foreground">Client portal · {clientName}</p>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}
