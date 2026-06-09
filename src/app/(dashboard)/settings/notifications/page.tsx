import { NotificationsPanel } from "@/components/modules/settings/NotificationsPanel";

export const metadata = {
  title: "Notifications",
  description: "In-app alerts for invoices, payments, and billing.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage alerts from your workspace.
        </p>
      </div>
      <NotificationsPanel />
    </div>
  );
}
