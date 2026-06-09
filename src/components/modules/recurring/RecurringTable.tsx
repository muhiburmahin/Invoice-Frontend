"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Play, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteRecurringSchedule,
  useRunRecurringSchedule,
  useUpdateRecurringStatus,
} from "@/hooks/useRecurring";
import { getApiErrorMessage } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import type { PaginatedMeta } from "@/types";
import type { RecurringFrequency, RecurringSchedule } from "@/types/recurring";

const FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  WEEKLY: "Weekly",
  BIWEEKLY: "Biweekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};

type RecurringTableProps = {
  schedules: RecurringSchedule[];
  meta: PaginatedMeta;
  status: "all" | "active" | "inactive";
  isLoading?: boolean;
  onStatusChange: (value: RecurringTableProps["status"]) => void;
  onPageChange: (page: number) => void;
};

function ScheduleRowActions({ schedule }: { schedule: RecurringSchedule }) {
  const router = useRouter();
  const runSchedule = useRunRecurringSchedule();
  const updateStatus = useUpdateRecurringStatus();
  const deleteSchedule = useDeleteRecurringSchedule();

  async function handleRun() {
    try {
      const result = await runSchedule.mutateAsync({ id: schedule.id });
      toast.success(result.message ?? "Invoice generated");
      router.push(`/invoices/${result.invoice.id}`);
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message);
      if (message.toLowerCase().includes("template")) {
        router.push(
          `/invoices/new?recurringId=${schedule.id}&clientId=${schedule.clientId}`,
        );
      }
    }
  }

  async function handleToggleStatus() {
    try {
      const result = await updateStatus.mutateAsync({
        id: schedule.id,
        isActive: !schedule.isActive,
      });
      toast.success(result.message ?? "Status updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this schedule? Only possible when no invoices are linked.")) {
      return;
    }
    try {
      const result = await deleteSchedule.mutateAsync(schedule.id);
      toast.success(result.message ?? "Schedule deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="size-8" aria-label="Schedule actions">
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(`/recurring/${schedule.id}`)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => void handleRun()}
            disabled={!schedule.isActive || runSchedule.isPending}
          >
            <Play className="size-4" />
            Run now
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void handleToggleStatus()}>
            <Power className="size-4" />
            {schedule.isActive ? "Pause" : "Resume"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => void handleDelete()}
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RecurringTable({
  schedules,
  meta,
  status,
  isLoading,
  onStatusChange,
  onPageChange,
}: RecurringTableProps) {
  const statusFilters = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Paused" },
  ] as const;

  return (
    <div className="space-y-4">
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

      <div className="rounded-xl border border-brand-secondary/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Invoices</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Loading schedules…
                </TableCell>
              </TableRow>
            ) : schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No recurring schedules yet.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <Link
                      href={`/recurring/${schedule.id}`}
                      className="font-medium hover:text-brand hover:underline"
                    >
                      {schedule.client.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{schedule.client.email}</p>
                  </TableCell>
                  <TableCell>{FREQUENCY_LABELS[schedule.frequency]}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span>{formatDate(schedule.nextRunAt)}</span>
                      {schedule.isOverdue ? (
                        <Badge variant="destructive" className="text-[10px]">
                          Overdue
                        </Badge>
                      ) : schedule.isDueSoon ? (
                        <Badge className="bg-warning/15 text-[10px] text-warning-foreground">
                          Due soon
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={schedule.isActive ? "default" : "secondary"}>
                      {schedule.isActive ? "Active" : "Paused"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{schedule._count.invoices}</TableCell>
                  <TableCell>
                    <ScheduleRowActions schedule={schedule} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => onPageChange(meta.page - 1)}
            >
              Previous
            </Button>
            <Button
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
