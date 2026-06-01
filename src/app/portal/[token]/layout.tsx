import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client portal",
  description: "View and pay your invoices",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}
