import { RequireAuth } from "@/components/modules/auth/require-auth";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <RequireAuth>
          <main id="main-content" className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </RequireAuth>
      </div>
      {modal}
    </div>
  );
}
