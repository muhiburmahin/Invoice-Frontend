import { PortalInvoiceDetail } from "@/components/modules/portal/PortalInvoiceDetail";

type PortalInvoicePageProps = {
  params: Promise<{ token: string; invoiceId: string }>;
};

export default async function PortalInvoicePage({ params }: PortalInvoicePageProps) {
  const { token, invoiceId } = await params;
  return <PortalInvoiceDetail token={token} invoiceId={invoiceId} />;
}
