import { SettingsOverview } from "@/components/modules/settings/SettingsOverview";

export const metadata = {
  title: "Settings",
  description: "Business, billing, account, and notification preferences.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace, subscription, and account.
        </p>
      </div>
      <SettingsOverview />
    </div>
  );
}
