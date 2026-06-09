import Link from "next/link";

import { RequireStaff } from "@/components/modules/auth/require-staff";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireStaff>
      <div className="min-h-full flex-1 p-4 md:p-6">
        <PageHeader
          title="Admin"
          description="Platform management — SUPPORT and SUPER_ADMIN only"
          actions={
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Back to app
            </Link>
          }
        />
        {children}
      </div>
    </RequireStaff>
  );
}
