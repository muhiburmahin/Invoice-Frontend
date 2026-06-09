import { AdminDashboard } from "@/components/modules/admin/AdminDashboard";

export const metadata = {
  title: "Admin",
  description: "Platform overview and management.",
};

export default function Page() {
  return <AdminDashboard />;
}
