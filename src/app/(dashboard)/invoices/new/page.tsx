import { InvoiceForm } from "@/components/modules/invoices/InvoiceForm";

export const metadata = {
  title: "New Invoice",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; recurringId?: string }>;
}) {
  const { clientId, recurringId } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {recurringId ? "Recurring template invoice" : "New invoice"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {recurringId
            ? "Define line items for this recurring schedule template."
            : "Add line items and save as a draft before sending to your client."}
        </p>
      </div>
      <InvoiceForm
        mode="create"
        defaultClientId={clientId}
        recurringId={recurringId}
      />
    </div>
  );
}
