import { AdminUsersPage } from "@/components/modules/admin/AdminUsersPage";

export const metadata = {
  title: "Admin Users",
  description: "Search and manage platform users.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search, filter, and manage user accounts.
        </p>
      </div>
      <AdminUsersPage />
    </div>
  );
}
