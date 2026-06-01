"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";

import { InvoiceStatusBadge } from "@/components/modules/invoices/InvoiceStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { portalPath } from "@/config/public-routes";
import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getPortalMeta, listPortalInvoices } from "@/services/portal.service";

import { PortalInvalidLink } from "./PortalInvalidLink";
import { PortalShell } from "./PortalShell";

type PortalInvoiceListProps = {
  token: string;
};

export function PortalInvoiceList({ token }: PortalInvoiceListProps) {
  const metaQuery = useQuery({
    queryKey: ["portal-meta", token],
    queryFn: () => getPortalMeta(token),
    retry: false,
  });

  const invoicesQuery = useQuery({
    queryKey: ["portal-invoices", token],
    queryFn: () => listPortalInvoices(token, { sortBy: "issueDate", sortOrder: "desc" }),
    enabled: metaQuery.isSuccess,
    retry: false,
  });

  if (metaQuery.isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (metaQuery.isError) {
    return <PortalInvalidLink message={getApiErrorMessage(metaQuery.error)} />;
  }

  if (!metaQuery.data) {
    return null;
  }

  const meta = metaQuery.data;
  const invoices = invoicesQuery.data?.invoices ?? [];

  return (
    <PortalShell business={meta.business} clientName={meta.client.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and pay invoices shared with {meta.client.email}
          </p>
        </div>

        {invoicesQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : null}

        {invoicesQuery.isError ? (
          <p className="text-sm text-destructive">{getApiErrorMessage(invoicesQuery.error)}</p>
        ) : null}

        {!invoicesQuery.isLoading && invoices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-secondary/60 bg-card p-10 text-center">
            <FileText className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">No invoices yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When invoices are sent to you, they will appear here.
            </p>
          </div>
        ) : null}

        <ul className="space-y-3">
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <Link
                href={portalPath(token, `invoices/${invoice.id}`)}
                className="flex flex-col gap-3 rounded-xl border border-brand-secondary/50 bg-card p-4 shadow-sm transition-colors hover:border-brand/40 hover:bg-brand-muted/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{invoice.number}</span>
                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Issued {formatDate(invoice.issueDate)} · Due {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </p>
                  {invoice.balanceDue > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(invoice.balanceDue, invoice.currency)} due
                    </p>
                  ) : (
                    <p className="text-xs text-status-paid">Paid in full</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PortalShell>
  );
}
