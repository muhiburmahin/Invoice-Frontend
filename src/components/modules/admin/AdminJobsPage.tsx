"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DASHBOARD_HOME } from "@/config/public-routes";
import { useRunAdminJobs } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { isSuperAdmin } from "@/lib/roles";
import type { ScheduledJobName } from "@/types/admin";

const JOBS: { id: ScheduledJobName; label: string; description: string }[] = [
  {
    id: "overdue",
    label: "Overdue invoices",
    description: "Mark past-due invoices as overdue and send notifications.",
  },
  {
    id: "subscription_expiry",
    label: "Subscription expiry",
    description: "Warn users whose subscriptions are ending soon.",
  },
  {
    id: "recurring",
    label: "Recurring schedules",
    description: "Generate invoices for due recurring schedules.",
  },
];

export function AdminJobsPage() {
  const { user } = useAuth();
  const runJobs = useRunAdminJobs();
  const [selected, setSelected] = useState<ScheduledJobName[]>([
    "overdue",
    "subscription_expiry",
    "recurring",
  ]);

  if (!isSuperAdmin(user?.role)) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Only super admins can run scheduled jobs.
          </p>
          <Button variant="outline" render={<Link href={DASHBOARD_HOME} />}>
            Back to dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  function toggleJob(job: ScheduledJobName) {
    setSelected((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job],
    );
  }

  async function handleRun() {
    try {
      const result = await runJobs.mutateAsync({ jobs: selected });
      const message =
        typeof result.message === "string"
          ? result.message
          : "Jobs completed";
      toast.success(message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Run scheduled jobs</CardTitle>
          <CardDescription>
            Manually trigger background jobs. Use with care in production.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {JOBS.map((job) => (
            <label
              key={job.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg border p-3"
            >
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={selected.includes(job.id)}
                onChange={() => toggleJob(job.id)}
              />
              <div>
                <p className="font-medium">{job.label}</p>
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>
            </label>
          ))}

          <Button
            className="bg-brand text-brand-foreground"
            disabled={selected.length === 0 || runJobs.isPending}
            onClick={() => void handleRun()}
          >
            {runJobs.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            Run selected jobs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
