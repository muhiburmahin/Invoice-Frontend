import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex-1 p-4 md:p-6">
      <PageHeader
        title="Admin"
        description="Platform management — SUPER_ADMIN / SUPPORT only"
        actions={
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to app
          </Link>
        }
      />
      {children}
    </div>
  );
}
