"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBusinessCurrencies } from "@/hooks/useBusiness";
import { useCreateClient, useUpdateClient } from "@/hooks/useClients";
import { getApiErrorMessage } from "@/lib/api";
import { clientFormSchema, type ClientFormInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { Client, CreateClientInput, UpdateClientInput } from "@/types/client";
import type { CurrencyCode } from "@/types/business";

const fieldClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30";

function nullable(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

function parseTags(value: string): string[] {
  return [
    ...new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function clientToFormValues(client: Client): ClientFormInput {
  return {
    name: client.name,
    email: client.email,
    company: client.company ?? "",
    phone: client.phone ?? "",
    address: client.address ?? "",
    city: client.city ?? "",
    state: client.state ?? "",
    country: client.country ?? "",
    zipCode: client.zipCode ?? "",
    taxNumber: client.taxNumber ?? "",
    currency: client.currency ?? "",
    notes: client.notes ?? "",
    tags: client.tags.join(", "),
    portalEnabled: client.portalEnabled,
  };
}

function formToCreatePayload(values: ClientFormInput): CreateClientInput {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    company: nullable(values.company),
    phone: nullable(values.phone),
    address: nullable(values.address),
    city: nullable(values.city),
    state: nullable(values.state),
    country: nullable(values.country),
    zipCode: nullable(values.zipCode),
    taxNumber: nullable(values.taxNumber),
    currency: values.currency ? (values.currency as CurrencyCode) : null,
    notes: nullable(values.notes),
    tags: parseTags(values.tags),
    portalEnabled: values.portalEnabled,
  };
}

function buildUpdatePayload(
  original: Client,
  values: ClientFormInput,
): UpdateClientInput {
  const payload: UpdateClientInput = {};
  const createPayload = formToCreatePayload(values);

  if (createPayload.name !== original.name) payload.name = createPayload.name;
  if (createPayload.email !== original.email) payload.email = createPayload.email;

  const nullableKeys = [
    "company",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "zipCode",
    "taxNumber",
    "currency",
    "notes",
  ] as const;

  for (const key of nullableKeys) {
    const next = createPayload[key];
    const prev = original[key];
    if (next !== prev) {
      if (key === "currency") {
        payload.currency = next as CurrencyCode | null;
      } else {
        payload[key] = next;
      }
    }
  }

  const nextTags = createPayload.tags ?? [];
  const tagsChanged =
    nextTags.length !== original.tags.length ||
    nextTags.some((tag, index) => tag !== original.tags[index]);
  if (tagsChanged) payload.tags = nextTags;

  if (createPayload.portalEnabled !== original.portalEnabled) {
    payload.portalEnabled = createPayload.portalEnabled;
  }

  return payload;
}

type ClientFormProps = {
  mode: "create" | "edit";
  client?: Client;
  onSuccess?: (client: Client) => void;
  onCancel?: () => void;
  className?: string;
};

export function ClientForm({
  mode,
  client,
  onSuccess,
  onCancel,
  className,
}: ClientFormProps) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const { data: currenciesData } = useBusinessCurrencies();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormInput>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      taxNumber: "",
      currency: "",
      notes: "",
      tags: "",
      portalEnabled: false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && client) {
      form.reset(clientToFormValues(client));
    }
  }, [client, form, mode]);

  const currencies = currenciesData?.currencies ?? [];

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const result = await createClient.mutateAsync(formToCreatePayload(values));
        toast.success(result.message ?? "Client created");
        form.reset();
        onSuccess?.(result.client);
      } else if (client) {
        const payload = buildUpdatePayload(client, values);
        if (Object.keys(payload).length === 0) {
          toast.message("No changes to save");
          return;
        }
        const result = await updateClient.mutateAsync({ id: client.id, body: payload });
        toast.success(result.message ?? "Client updated");
        onSuccess?.(result.client);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="client-name">Name *</Label>
          <Input id="client-name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-email">Email *</Label>
          <Input id="client-email" type="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-company">Company</Label>
          <Input id="client-company" {...form.register("company")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-phone">Phone</Label>
          <Input id="client-phone" type="tel" {...form.register("phone")} />
          {form.formState.errors.phone ? (
            <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
          ) : null}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="client-address">Address</Label>
          <Input id="client-address" {...form.register("address")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-city">City</Label>
          <Input id="client-city" {...form.register("city")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-state">State / region</Label>
          <Input id="client-state" {...form.register("state")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-country">Country</Label>
          <Input id="client-country" {...form.register("country")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-zip">Zip / postal code</Label>
          <Input id="client-zip" {...form.register("zipCode")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-currency">Currency override</Label>
          <select
            id="client-currency"
            className={fieldClassName}
            {...form.register("currency")}
          >
            <option value="">Use business default</option>
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} — {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-tax">Tax number</Label>
          <Input id="client-tax" {...form.register("taxNumber")} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="client-tags">Tags</Label>
          <Input
            id="client-tags"
            placeholder="vip, wholesale, monthly"
            {...form.register("tags")}
          />
          <p className="text-xs text-muted-foreground">Comma-separated, up to 10 tags</p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="client-notes">Notes</Label>
          <textarea
            id="client-notes"
            rows={3}
            className={cn(fieldClassName, "min-h-20 py-2")}
            {...form.register("notes")}
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox
            id="client-portal"
            checked={form.watch("portalEnabled")}
            onCheckedChange={(checked) =>
              form.setValue("portalEnabled", checked === true, { shouldDirty: true })
            }
          />
          <Label htmlFor="client-portal" className="font-normal">
            Enable client portal access
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={isSubmitting || (mode === "edit" && !form.formState.isDirty)}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Create client"
              : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
