"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Play,
  Power,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { SimpleModal } from "@/components/shared/SimpleModal";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useRecurringInvoices,
  useRecurringSchedule,
  useRunRecurringSchedule,
  useUpdateRecurringSchedule,
  useUpdateRecurringStatus,
} from "@/hooks/useRecurring";
import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { RecurringFrequency } from "@/types/recurring";

const FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  WEEKLY: "Weekly",
  BIWEEKLY: "Biweekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};

type RecurringDetailProps = {
  id: string;
};

export function RecurringDetail({ id }: RecurringDetailProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useRecurringSchedule(id);
  const { data: invoicesData } = useRecurringInvoices(id);
  const runSchedule = useRunRecurringSchedule();
  const updateStatus = useUpdateRecurringStatus();
  const updateSchedule = useUpdateRecurringSchedule();
  const deleteSchedule = useDeleteRecurringSchedule();

  const [editOpen, setEditOpen] = useState(false);
  const [frequency, setFrequency] = useState<RecurringFrequency>("MONTHLY");
  const [nextRunAt, setNextRunAt] = useState("");

  const schedule = data?.schedule;
  const invoices = invoicesData?.invoices ?? [];
  const hasTemplate = (data?.invoiceCount ?? 0) > 0;

  async function handleRun() {
    if (!schedule) return;
    try {
      const result = await runSchedule.mutateAsync({ id: schedule.id });
      toast.success(result.message ?? "Invoice generated");
      router.push(`/invoices/${result.invoice.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleToggleStatus() {
    if (!schedule) return;
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
    if (!schedule) return;
    if (!window.confirm("Delete this schedule?")) return;
    try {
      const result = await deleteSchedule.mutateAsync(schedule.id);
      toast.success(result.message ?? "Schedule deleted");
      router.push("/recurring");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleSaveEdit() {
    if (!schedule) return;
    try {
      const result = await updateSchedule.mutateAsync({
        id: schedule.id,
        body: {
          frequency,
          nextRunAt: new Date(`${nextRunAt}T09:00:00`).toISOString(),
        },
      });
      toast.success(result.message ?? "Schedule updated");
      setEditOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  if (isLoading) return <LoadingSkeleton rows={6} />;

  if (isError || !schedule) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">Schedule not found.</p>
          <Button variant="outline" render={<Link href="/recurring" />}>
            <ArrowLeft className="size-4" />
            Back to list
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" render={<Link href="/recurring" />}>
          <ArrowLeft className="size-4" />
          All schedules
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFrequency(schedule.frequency);
              setNextRunAt(schedule.nextRunAt.slice(0, 10));
              setEditOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => void handleToggleStatus()}>
            <Power className="size-4" />
            {schedule.isActive ? "Pause" : "Resume"}
          </Button>
          <Button
            className="bg-brand text-brand-foreground"
            size="sm"
            onClick={() => void handleRun()}
            disabled={!schedule.isActive || runSchedule.isPending}
          >
            {runSchedule.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            Run now
          </Button>
          <Button variant="destructive" size="sm" onClick={() => void handleDelete()}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{schedule.client.name}</CardTitle>
          <CardDescription>
            {FREQUENCY_LABELS[schedule.frequency]} · Next run {formatDate(schedule.nextRunAt)}
            {schedule.lastRunAt ? ` · Last run ${formatDate(schedule.lastRunAt)}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant={schedule.isActive ? "default" : "secondary"}>
            {schedule.isActive ? "Active" : "Paused"}
          </Badge>
          {schedule.isOverdue ? <Badge variant="destructive">Overdue</Badge> : null}
          {schedule.isDueSoon ? <Badge className="bg-warning/15">Due soon</Badge> : null}
        </CardContent>
      </Card>

      {!hasTemplate ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <CardTitle>Template invoice required</CardTitle>
            <CardDescription>
              Create a draft invoice linked to this schedule before it can run.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="bg-brand text-brand-foreground"
              render={
                <Link
                  href={`/invoices/new?recurringId=${schedule.id}&clientId=${schedule.clientId}`}
                />
              }
            >
              Create template invoice
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Generated invoices</CardTitle>
          <CardDescription>{invoices.length} invoice(s) from this schedule</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices generated yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="font-medium hover:text-brand hover:underline"
                      >
                        {invoice.number}
                      </Link>
                    </TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SimpleModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit schedule"
        description="Update frequency or next run date."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-brand text-brand-foreground"
              disabled={updateSchedule.isPending}
              onClick={() => void handleSaveEdit()}
            >
              Save changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-frequency">Frequency</Label>
            <select
              id="edit-frequency"
              className="h-8 w-full rounded-lg border border-input px-2.5 text-sm"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
            >
              {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-nextRunAt">Next run</Label>
            <Input
              id="edit-nextRunAt"
              type="date"
              value={nextRunAt}
              onChange={(e) => setNextRunAt(e.target.value)}
            />
          </div>
        </div>
      </SimpleModal>
    </div>
  );
}
