import { PortalInvoiceList } from "@/components/modules/portal/PortalInvoiceList";

type PortalPageProps = {
  params: Promise<{ token: string }>;
};

export default async function PortalPage({ params }: PortalPageProps) {
  const { token } = await params;
  return <PortalInvoiceList token={token} />;
}
