"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { useClients } from "@/hooks/useClients";
import { useCreateRecurringSchedule, useRecurringMeta } from "@/hooks/useRecurring";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { recurringFormSchema, type RecurringFormInput } from "@/lib/validations";
import type { RecurringFrequency } from "@/types/recurring";

const fieldClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30";

const FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  WEEKLY: "Weekly",
  BIWEEKLY: "Biweekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};

type RecurringFormProps = {
  defaultClientId?: string;
};

export function RecurringForm({ defaultClientId }: RecurringFormProps) {
  const router = useRouter();
  const { plan } = useAuth();
  const { data: metaData } = useRecurringMeta();
  const { data: clientsData } = useClients({ limit: 100, status: "active" });
  const createSchedule = useCreateRecurringSchedule();

  const form = useForm<RecurringFormInput>({
    resolver: zodResolver(recurringFormSchema),
    defaultValues: {
      clientId: defaultClientId ?? "",
      frequency: "MONTHLY",
      nextRunAt: new Date().toISOString().slice(0, 10),
      isActive: true,
    },
  });

  const frequencies = metaData?.frequencies ?? ["MONTHLY"];
  const clients = clientsData?.clients ?? [];

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const nextRunAt = new Date(`${values.nextRunAt}T09:00:00`).toISOString();
      const result = await createSchedule.mutateAsync({
        clientId: values.clientId,
        frequency: values.frequency,
        nextRunAt,
        isActive: values.isActive,
      });
      toast.success(result.message ?? "Schedule created");
      router.push(
        `/invoices/new?recurringId=${result.schedule.id}&clientId=${result.schedule.clientId}`,
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  if (plan === "FREE") {
    return (
      <Card className="border-brand/30">
        <CardHeader>
          <CardTitle>Recurring invoices require a paid plan</CardTitle>
          <CardDescription>
            Upgrade to Pro or Enterprise to automate recurring billing for your clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-brand text-brand-foreground" render={<Link href="/settings/billing" />}>
            View billing
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule details</CardTitle>
          <CardDescription>
            After creating the schedule, you will add a template invoice with line items.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="clientId">Client *</Label>
            <select id="clientId" className={fieldClassName} {...form.register("clientId")}>
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
            {form.formState.errors.clientId ? (
              <p className="text-xs text-destructive">{form.formState.errors.clientId.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="frequency">Frequency *</Label>
            <select id="frequency" className={fieldClassName} {...form.register("frequency")}>
              {frequencies.map((freq) => (
                <option key={freq} value={freq}>
                  {FREQUENCY_LABELS[freq]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nextRunAt">Next run date *</Label>
            <Input id="nextRunAt" type="date" className={fieldClassName} {...form.register("nextRunAt")} />
            {form.formState.errors.nextRunAt ? (
              <p className="text-xs text-destructive">{form.formState.errors.nextRunAt.message}</p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 rounded border-input" {...form.register("isActive")} />
            Start active (runs on schedule)
          </label>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="bg-brand text-brand-foreground"
          disabled={createSchedule.isPending}
        >
          {createSchedule.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Create schedule
        </Button>
        <Button type="button" variant="outline" render={<Link href="/recurring" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
