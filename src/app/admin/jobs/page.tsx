import { AdminJobsPage } from "@/components/modules/admin/AdminJobsPage";

export const metadata = {
  title: "Scheduled Jobs",
  description: "Manually run background jobs.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Scheduled jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trigger overdue, subscription, and recurring jobs manually.
        </p>
      </div>
      <AdminJobsPage />
    </div>
  );
}
