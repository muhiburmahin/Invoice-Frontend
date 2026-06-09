import { AdminUserDetail } from "@/components/modules/admin/AdminUserDetail";

export const metadata = {
  title: "User Details",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User details</h1>
      </div>
      <AdminUserDetail id={id} />
    </div>
  );
}
