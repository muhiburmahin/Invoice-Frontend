import { RequireStaff } from "@/components/modules/auth/require-staff";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireStaff>
      <div className="flex min-h-0 flex-1">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main id="main-content" className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </RequireStaff>
  );
}
