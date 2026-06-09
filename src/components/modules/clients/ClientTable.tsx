"use client";

import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { ClientListItem } from "@/types/client";
import type { PaginatedMeta } from "@/types";

type ClientTableProps = {
  clients: ClientListItem[];
  meta: PaginatedMeta;
  search: string;
  status: "all" | "active" | "inactive" | "deleted";
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ClientTableProps["status"]) => void;
  onPageChange: (page: number) => void;
};

const statusFilters = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "deleted", label: "Deleted" },
] as const;

export function ClientTable({
  clients,
  meta,
  search,
  status,
  isLoading,
  onSearchChange,
  onStatusChange,
  onPageChange,
}: ClientTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or company…"
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
              <TableHead>Client</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Loading clients…
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No clients found. Create your first client to get started.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="min-w-[180px]">
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium text-foreground hover:text-brand hover:underline"
                      >
                        {client.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{client.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{client.company ?? "—"}</TableCell>
                  <TableCell>
                    {[client.city, client.country].filter(Boolean).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        status === "deleted"
                          ? "destructive"
                          : client.isActive
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {status === "deleted"
                        ? "Deleted"
                        : client.isActive
                          ? "Active"
                          : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {client.portalEnabled ? (
                      <Badge variant="outline">Enabled</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(client.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      render={<Link href={`/clients/${client.id}`} />}
                    >
                      <ExternalLink className="size-4" />
                      <span className="sr-only">View client</span>
                    </Button>
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
            Page {meta.page} of {meta.totalPages} · {meta.total} clients
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
