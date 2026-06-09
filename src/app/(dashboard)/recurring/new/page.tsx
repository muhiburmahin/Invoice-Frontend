import { RecurringForm } from "@/components/modules/recurring/RecurringForm";

export const metadata = {
  title: "New Recurring Schedule",
  description: "Create an automated invoice schedule.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New recurring schedule</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a client and frequency, then add a template invoice.
        </p>
      </div>
      <RecurringForm defaultClientId={clientId} />
    </div>
  );
}
