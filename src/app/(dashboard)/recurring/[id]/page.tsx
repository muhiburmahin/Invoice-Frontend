import { RecurringDetail } from "@/components/modules/recurring/RecurringDetail";

export const metadata = {
  title: "Recurring Schedule",
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
        <h1 className="text-2xl font-semibold tracking-tight">Recurring schedule</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage schedule, template, and generated invoices.
        </p>
      </div>
      <RecurringDetail id={id} />
    </div>
  );
}
