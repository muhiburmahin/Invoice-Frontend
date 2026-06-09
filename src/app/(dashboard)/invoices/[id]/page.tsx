import { InvoiceDetail } from "@/components/modules/invoices/InvoiceDetail";

export const metadata = {
  title: "Invoice Details",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvoiceDetail invoiceId={id} />;
}
