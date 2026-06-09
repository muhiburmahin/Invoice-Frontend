import { AdminActivityLogsPage } from "@/components/modules/admin/AdminActivityLogsPage";

export const metadata = {
  title: "Activity Logs",
  description: "Platform audit trail.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Audit trail for admin and auth actions.
        </p>
      </div>
      <AdminActivityLogsPage />
    </div>
  );
}
