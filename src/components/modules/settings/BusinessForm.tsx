"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Palette, RefreshCw, Receipt } from "lucide-react";
import { toast } from "sonner";

import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
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
  useBusiness,
  useBusinessCurrencies,
  useUpdateBusiness,
} from "@/hooks/useBusiness";
import { getApiErrorMessage } from "@/lib/api";
import { businessFormSchema, type BusinessFormInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { Business, UpdateBusinessInput } from "@/types/business";

const fieldClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30";

function nullable(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

function businessToFormValues(business: Business): BusinessFormInput {
  return {
    name: business.name,
    logo: business.logo ?? "",
    email: business.email ?? "",
    phone: business.phone ?? "",
    website: business.website ?? "",
    address: business.address ?? "",
    city: business.city ?? "",
    state: business.state ?? "",
    country: business.country ?? "",
    zipCode: business.zipCode ?? "",
    taxNumber: business.taxNumber ?? "",
    vatNumber: business.vatNumber ?? "",
    currency: business.currency,
    taxRate: business.taxRate,
    invoicePrefix: business.invoicePrefix,
    nextNumber: business.nextNumber,
    defaultDueDays: business.defaultDueDays,
    defaultNotes: business.defaultNotes ?? "",
    defaultTerms: business.defaultTerms ?? "",
    primaryColor: business.primaryColor ?? "",
    accentColor: business.accentColor ?? "",
  };
}

function buildUpdatePayload(
  original: Business,
  values: BusinessFormInput,
): UpdateBusinessInput {
  const payload: UpdateBusinessInput = {};

  if (values.name !== original.name) payload.name = values.name;

  const nullableFields = [
    "logo",
    "email",
    "phone",
    "website",
    "address",
    "city",
    "state",
    "country",
    "zipCode",
    "taxNumber",
    "vatNumber",
    "defaultNotes",
    "defaultTerms",
    "primaryColor",
    "accentColor",
  ] as const;

  for (const key of nullableFields) {
    const next = nullable(values[key]);
    const prev = original[key];
    if (next !== prev) payload[key] = next;
  }

  if (values.currency !== original.currency) {
    payload.currency = values.currency as Business["currency"];
  }
  if (values.taxRate !== original.taxRate) payload.taxRate = values.taxRate;
  if (values.invoicePrefix.toUpperCase() !== original.invoicePrefix) {
    payload.invoicePrefix = values.invoicePrefix.toUpperCase();
  }
  if (values.nextNumber !== original.nextNumber) payload.nextNumber = values.nextNumber;
  if (values.defaultDueDays !== original.defaultDueDays) {
    payload.defaultDueDays = values.defaultDueDays;
  }

  return payload;
}

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Building2;
  children: ReactNode;
}) {
  return (
    <Card className="border-brand-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="size-5 text-brand" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function BusinessForm() {
  const { data, isLoading, isError, refetch } = useBusiness();
  const { data: currenciesData } = useBusinessCurrencies();
  const updateBusiness = useUpdateBusiness();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const business = data?.business;

  const form = useForm<BusinessFormInput>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      logo: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      taxNumber: "",
      vatNumber: "",
      currency: "USD",
      taxRate: 0,
      invoicePrefix: "INV",
      nextNumber: 1,
      defaultDueDays: 30,
      defaultNotes: "",
      defaultTerms: "",
      primaryColor: "",
      accentColor: "",
    },
  });

  useEffect(() => {
    if (business) {
      form.reset(businessToFormValues(business));
    }
  }, [business, form]);

  const currencies = currenciesData?.currencies ?? [];
  const watched = form.watch();

  const preview = useMemo(
    () => ({
      name: watched.name || "Your business",
      prefix: watched.invoicePrefix || "INV",
      nextNumber: watched.nextNumber || 1,
      primary: watched.primaryColor || "#4f46e5",
      accent: watched.accentColor || "#f59e0b",
      logo: watched.logo,
    }),
    [watched],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    if (!business) return;

    const payload = buildUpdatePayload(business, values);
    if (Object.keys(payload).length === 0) {
      toast.message("No changes to save");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateBusiness.mutateAsync(payload);
      form.reset(businessToFormValues(result.business));
      toast.success(result.message ?? "Business profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isLoading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (isError || !business) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">
            Could not load business profile. Check that the API is running.
          </p>
          <Button
            onClick={() => void refetch()}
            className="bg-brand text-brand-foreground"
          >
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <FormSection
        title="Business identity"
        description="How your company appears on invoices and the client portal."
        icon={Building2}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Business name</Label>
            <Input id="name" {...form.register("name")} />
            <FieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" type="url" placeholder="https://..." {...form.register("logo")} />
            <FieldError message={form.formState.errors.logo?.message} />
            {preview.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.logo}
                alt="Logo preview"
                className="mt-2 h-12 w-auto rounded border border-border object-contain p-1"
              />
            ) : null}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Contact & address"
        description="Shown on invoices and used for client communication."
        icon={Building2}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Business email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...form.register("phone")} />
            <FieldError message={form.formState.errors.phone?.message} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" placeholder="https://..." {...form.register("website")} />
            <FieldError message={form.formState.errors.website?.message} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Street address</Label>
            <Input id="address" {...form.register("address")} />
            <FieldError message={form.formState.errors.address?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...form.register("city")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State / region</Label>
            <Input id="state" {...form.register("state")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...form.register("country")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip / postal code</Label>
            <Input id="zipCode" {...form.register("zipCode")} />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Invoice defaults"
        description="Currency, numbering, and payment terms for new invoices."
        icon={Receipt}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              className={fieldClassName}
              {...form.register("currency")}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code} — {c.label}
                </option>
              ))}
            </select>
            <FieldError message={form.formState.errors.currency?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxRate">Default tax rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              min={0}
              max={100}
              {...form.register("taxRate", { valueAsNumber: true })}
            />
            <FieldError message={form.formState.errors.taxRate?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoicePrefix">Invoice prefix</Label>
            <Input
              id="invoicePrefix"
              className="uppercase"
              {...form.register("invoicePrefix")}
            />
            <FieldError message={form.formState.errors.invoicePrefix?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nextNumber">Next invoice number</Label>
            <Input
              id="nextNumber"
              type="number"
              min={business.nextNumber}
              {...form.register("nextNumber", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Cannot be lower than {business.nextNumber}
            </p>
            <FieldError message={form.formState.errors.nextNumber?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultDueDays">Default due days</Label>
            <Input
              id="defaultDueDays"
              type="number"
              min={0}
              max={365}
              {...form.register("defaultDueDays", { valueAsNumber: true })}
            />
            <FieldError message={form.formState.errors.defaultDueDays?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxNumber">Tax number</Label>
            <Input id="taxNumber" {...form.register("taxNumber")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vatNumber">VAT number</Label>
            <Input id="vatNumber" {...form.register("vatNumber")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="defaultNotes">Default invoice notes</Label>
            <textarea
              id="defaultNotes"
              rows={3}
              className={cn(fieldClassName, "min-h-20 py-2")}
              {...form.register("defaultNotes")}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="defaultTerms">Default payment terms</Label>
            <textarea
              id="defaultTerms"
              rows={3}
              className={cn(fieldClassName, "min-h-20 py-2")}
              {...form.register("defaultTerms")}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Next invoice:{" "}
          <span className="font-medium text-foreground">
            {preview.prefix}-{String(preview.nextNumber).padStart(4, "0")}
          </span>
        </p>
      </FormSection>

      <FormSection
        title="Branding"
        description="Colors used on PDFs and the client portal."
        icon={Palette}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                placeholder="#4f46e5"
                {...form.register("primaryColor")}
              />
              <input
                type="color"
                aria-label="Pick primary color"
                className="size-8 shrink-0 cursor-pointer rounded border border-input"
                value={
                  /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(preview.primary)
                    ? preview.primary
                    : "#4f46e5"
                }
                onChange={(e) =>
                  form.setValue("primaryColor", e.target.value, { shouldDirty: true })
                }
              />
            </div>
            <FieldError message={form.formState.errors.primaryColor?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent color</Label>
            <div className="flex gap-2">
              <Input
                id="accentColor"
                placeholder="#f59e0b"
                {...form.register("accentColor")}
              />
              <input
                type="color"
                aria-label="Pick accent color"
                className="size-8 shrink-0 cursor-pointer rounded border border-input"
                value={
                  /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(preview.accent)
                    ? preview.accent
                    : "#f59e0b"
                }
                onChange={(e) =>
                  form.setValue("accentColor", e.target.value, { shouldDirty: true })
                }
              />
            </div>
            <FieldError message={form.formState.errors.accentColor?.message} />
          </div>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: `${preview.primary}33`,
            background: `linear-gradient(135deg, ${preview.primary}14, ${preview.accent}14)`,
          }}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preview
          </p>
          <p className="mt-2 text-lg font-semibold" style={{ color: preview.primary }}>
            {preview.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Invoice {preview.prefix}-{String(preview.nextNumber).padStart(4, "0")}
          </p>
          <div className="mt-3 flex gap-2">
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: preview.primary }}
            >
              Primary
            </span>
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: preview.accent }}
            >
              Accent
            </span>
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end gap-3 pb-8">
        <Button
          type="button"
          variant="outline"
          disabled={!form.formState.isDirty || isSubmitting}
          onClick={() => form.reset(businessToFormValues(business))}
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={!form.formState.isDirty || isSubmitting}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
