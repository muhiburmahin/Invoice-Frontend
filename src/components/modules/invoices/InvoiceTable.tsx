"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { InvoiceRowActions } from "@/components/modules/invoices/InvoiceRowActions";
import { InvoiceStatusBadge } from "@/components/modules/invoices/InvoiceStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceListItem, InvoiceStatus } from "@/types/invoice";
import type { PaginatedMeta } from "@/types";

type InvoiceTableProps = {
  invoices: InvoiceListItem[];
  meta: PaginatedMeta;
  search: string;
  status: "all" | InvoiceStatus;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: InvoiceTableProps["status"]) => void;
  onPageChange: (page: number) => void;
};

const statusFilters = [
  { value: "all", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "PAID", label: "Paid" },
] as const;

export function InvoiceTable({
  invoices,
  meta,
  search,
  status,
  isLoading,
  onSearchChange,
  onStatusChange,
  onPageChange,
}: InvoiceTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search invoice # or client…"
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={status === filter.value ? "default" : "outline"}
              className={cn(
                status === filter.value && "bg-brand text-brand-foreground hover:bg-brand/90",
              )}
              onClick={() => onStatusChange(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-brand-secondary/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue date</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  Loading invoices…
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  No invoices found. Create your first invoice to get started.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-medium hover:text-brand hover:underline"
                    >
                      {invoice.number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.client.name}</p>
                      <p className="text-xs text-muted-foreground">{invoice.client.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(invoice.issueDate)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(invoice.dueDate)}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(invoice.balanceDue, invoice.currency)}
                  </TableCell>
                  <TableCell>
                    <InvoiceRowActions invoice={invoice} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta.totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} invoices
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => onPageChange(meta.page - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => onPageChange(meta.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
