import { ClientDetail } from "@/components/modules/clients/ClientDetail";

export const metadata = {
  title: "Client Details",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientDetail clientId={id} />;
}
