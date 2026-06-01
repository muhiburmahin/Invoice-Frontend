"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { InvoiceStatusBadge } from "@/components/modules/invoices/InvoiceStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceListItem } from "@/types/dashboard";

type RecentInvoicesProps = {
  invoices: InvoiceListItem[];
};

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <Card className="border-brand-secondary/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-brand" />
            Recent invoices
          </CardTitle>
          <CardDescription>Latest activity across your workspace</CardDescription>
        </div>
        <Link
          href="/invoices"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-brand-secondary px-2.5 text-sm font-medium text-brand hover:bg-brand-secondary/40"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No invoices yet.{" "}
            <Link href="/invoices/new" className="font-medium text-brand hover:underline">
              Create your first invoice
            </Link>
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-brand-muted/30">
                  <TableCell>
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="font-medium text-brand hover:underline"
                    >
                      {inv.number}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(inv.issueDate)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{inv.client.name}</p>
                    {inv.client.company ? (
                      <p className="text-xs text-muted-foreground">{inv.client.company}</p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(inv.total, inv.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
