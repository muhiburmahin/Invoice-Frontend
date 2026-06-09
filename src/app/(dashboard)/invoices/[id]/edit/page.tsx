import { InvoiceForm } from "@/components/modules/invoices/InvoiceForm";

export const metadata = {
  title: "Edit Invoice",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit invoice</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update draft invoice details and line items.
        </p>
      </div>
      <InvoiceForm mode="edit" invoiceId={id} />
    </div>
  );
}
